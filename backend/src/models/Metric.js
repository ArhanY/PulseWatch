const mongoose = require('mongoose');
const env = require('../config/env');

const metricSchema = new mongoose.Schema({
  apiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Api',
    required: true,
    index: true,
  },
  statusCode: {
    type: Number,
    default: null,
  },
  latency: {
    type: Number,
    required: true,
  },
  responseSize: {
    type: Number,
    default: 0,
  },
  success: {
    type: Boolean,
    required: true,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

metricSchema.index({ apiId: 1, timestamp: -1 });

metricSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: env.METRICS.RETENTION_DAYS * 24 * 60 * 60 }
);

module.exports = mongoose.model('Metric', metricSchema);
