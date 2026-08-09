const logger = require('../utils/logger');
const retryService = require('../services/retryService');
const circuitBreakerService = require('../services/circuitBreakerService');
const metricService = require('../services/metricService');
const incidentService = require('../services/incidentService');
const eventBus = require('../socket/eventBus');

async function monitorApi(api) {
  const allowed = circuitBreakerService.shouldAllowRequest(api);

  if (!allowed) {
    logger.worker.info('Skipping check, circuit breaker OPEN', { apiId: String(api._id), name: api.name });
    return { skipped: true };
  }

  const result = await retryService.executeWithRetry(api);

  await metricService.recordMetric({
    apiId: api._id,
    statusCode: result.statusCode,
    latency: result.latency,
    responseSize: result.responseSize,
    success: result.success,
    errorMessage: result.errorMessage,
  });

  eventBus.emit('metrics:update', {
    apiId: String(api._id),
    statusCode: result.statusCode,
    latency: result.latency,
    success: result.success,
    timestamp: new Date().toISOString(),
  });

  const previousState = api.circuitBreaker.state;

  if (result.success) {
    circuitBreakerService.recordSuccess(api);
  } else {
    circuitBreakerService.recordFailure(api);
  }

  api.lastCheckedAt = new Date();
  api.nextCheckAt = new Date(Date.now() + api.interval);
  await api.save();

  if (previousState !== api.circuitBreaker.state) {
    eventBus.emit('api:statusChanged', {
      apiId: String(api._id),
      name: api.name,
      previousState,
      newState: api.circuitBreaker.state,
    });
  }

  if (result.success) {
    const { wasResolved, incident } = await incidentService.resolveIncidentIfNeeded(api._id);
    if (wasResolved) {
      logger.incident.info('Incident resolved', { apiId: String(api._id), incidentId: String(incident._id) });
      eventBus.emit('incident:resolved', {
        apiId: String(api._id),
        incidentId: String(incident._id),
        duration: incident.duration,
      });
    }
  } else {
    const reason = result.errorMessage || `HTTP ${result.statusCode}`;
    const { wasNew, incident } = await incidentService.openIncidentIfNeeded(api._id, reason);
    if (wasNew) {
      logger.incident.info('Incident opened', { apiId: String(api._id), incidentId: String(incident._id), reason });
      eventBus.emit('incident:new', {
        apiId: String(api._id),
        incidentId: String(incident._id),
        reason,
      });
    }
  }

  eventBus.emit('dashboard:update', {});

  return { skipped: false, result };
}

module.exports = { monitorApi };
