const { Server } = require('socket.io');
const env = require('../config/env');
const logger = require('../utils/logger');
const eventBus = require('./eventBus');

const SOCKET_EVENTS = [
  'metrics:update',
  'dashboard:update',
  'incident:new',
  'incident:resolved',
  'api:statusChanged',
];

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.app.info('Socket client connected', { socketId: socket.id });

    socket.on('disconnect', () => {
      logger.app.info('Socket client disconnected', { socketId: socket.id });
    });
  });

  SOCKET_EVENTS.forEach((eventName) => {
    eventBus.on(eventName, (payload) => {
      io.emit(eventName, payload);
    });
  });

  logger.app.info('Socket.IO initialized', { events: SOCKET_EVENTS });

  return io;
}

module.exports = initSocket;
