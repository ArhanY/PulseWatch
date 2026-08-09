require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/pulsewatch',

  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  MONITORING: {
    DEFAULT_INTERVAL_MS: parseInt(process.env.DEFAULT_MONITOR_INTERVAL_MS, 10) || 60000,
    DEFAULT_TIMEOUT_MS: parseInt(process.env.DEFAULT_REQUEST_TIMEOUT_MS, 10) || 10000,
    WORKER_POOL_SIZE: parseInt(process.env.WORKER_POOL_SIZE, 10) || 4,
    SCHEDULER_TICK_MS: parseInt(process.env.SCHEDULER_TICK_MS, 10) || 5000,
  },

  RETRY: {
    MAX_ATTEMPTS: parseInt(process.env.RETRY_MAX_ATTEMPTS, 10) || 3,
    BASE_DELAY_MS: parseInt(process.env.RETRY_BASE_DELAY_MS, 10) || 1000,
  },

  CIRCUIT_BREAKER: {
    FAILURE_THRESHOLD: parseInt(process.env.CIRCUIT_FAILURE_THRESHOLD, 10) || 5,
    COOLDOWN_MS: parseInt(process.env.CIRCUIT_COOLDOWN_MS, 10) || 30000,
  },

  METRICS: {
    RETENTION_DAYS: parseInt(process.env.METRICS_RETENTION_DAYS, 10) || 30,
  },
};

module.exports = env;
