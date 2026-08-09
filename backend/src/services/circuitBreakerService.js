const env = require('../config/env');

function shouldAllowRequest(api) {
  const cb = api.circuitBreaker;

  if (cb.state === 'CLOSED') {
    return true;
  }

  if (cb.state === 'OPEN') {
    const cooldownElapsed = Date.now() - new Date(cb.openedAt).getTime() >= env.CIRCUIT_BREAKER.COOLDOWN_MS;
    if (cooldownElapsed) {
      cb.state = 'HALF_OPEN';
      return true;
    }
    return false;
  }

  return true;
}

function recordSuccess(api) {
  const cb = api.circuitBreaker;
  cb.state = 'CLOSED';
  cb.consecutiveFailures = 0;
  cb.openedAt = null;
}

function recordFailure(api) {
  const cb = api.circuitBreaker;

  if (cb.state === 'HALF_OPEN') {
    cb.state = 'OPEN';
    cb.openedAt = new Date();
    return;
  }

  cb.consecutiveFailures += 1;

  if (cb.consecutiveFailures >= env.CIRCUIT_BREAKER.FAILURE_THRESHOLD) {
    cb.state = 'OPEN';
    cb.openedAt = new Date();
  }
}

module.exports = { shouldAllowRequest, recordSuccess, recordFailure };
