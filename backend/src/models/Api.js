const mongoose = require('mongoose');

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const apiSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'API name is required'],
      trim: true,
      maxlength: 150,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    method: {
      type: String,
      enum: HTTP_METHODS,
      default: 'GET',
    },
    headers: {
      type: Map,
      of: String,
      default: {},
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    timeout: {
      type: Number,
      default: 10000,
      min: 1000,
      max: 60000,
    },
    interval: {
      type: Number,
      default: 60000,
      min: 5000,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    circuitBreaker: {
      state: {
        type: String,
        enum: ['CLOSED', 'OPEN', 'HALF_OPEN'],
        default: 'CLOSED',
      },
      consecutiveFailures: {
        type: Number,
        default: 0,
      },
      openedAt: {
        type: Date,
        default: null,
      },
    },
    lastCheckedAt: {
      type: Date,
      default: null,
    },
    nextCheckAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

apiSchema.index({ owner: 1, enabled: 1 });

module.exports = mongoose.model('Api', apiSchema);
