const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const initSocket = require('./socket');
const scheduler = require('./schedulers/monitorScheduler');

async function start() {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    logger.app.info(`PulseWatch backend listening on port ${env.PORT}`, {
      env: env.NODE_ENV,
    });

    scheduler.start();
  });

  process.on('unhandledRejection', (err) => {
    logger.error.error('Unhandled promise rejection', { message: err.message });
    httpServer.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    logger.error.error('Uncaught exception', { message: err.message });
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    logger.app.info('SIGTERM received, shutting down gracefully');
    scheduler.stop();
    httpServer.close(() => process.exit(0));
  });

  return httpServer;
}

start();
