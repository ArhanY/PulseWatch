const Metric = require('../models/Metric');

async function recordMetric({ apiId, statusCode, latency, responseSize, success, errorMessage }) {
  return Metric.create({
    apiId,
    statusCode,
    latency,
    responseSize,
    success,
    errorMessage,
    timestamp: new Date(),
  });
}

module.exports = { recordMetric };
