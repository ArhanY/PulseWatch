/**
 * MongoDB connection handler.
 * Called once from server.js before the HTTP server starts listening,
 * so the app never accepts traffic before the database is reachable.
 */

const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

async function connectDB() {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.MONGO_URI, {
      // Fail fast instead of mongoose's 30s default — a monitoring platform
      // should surface a broken DB connection immediately, not hang.
      serverSelectionTimeoutMS: 5000,
    });
    logger.app.info('MongoDB connected', { uri: maskUri(env.MONGO_URI) });
  } catch (err) {
    logger.error.error('MongoDB connection failed', { message: err.message });
    // Fail fast: an API server with no database is not a valid running state.
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    logger.error.error('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.app.info('MongoDB reconnected');
  });
}

// Avoid ever logging credentials if a connection string contains them.
function maskUri(uri) {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
}

module.exports = connectDB;
