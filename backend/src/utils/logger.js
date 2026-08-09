const CHANNELS = ['app', 'http', 'monitoring', 'worker', 'incident', 'error'];

function timestamp() {
  return new Date().toISOString();
}

function format(channel, level, message, meta) {
  const base = `[${timestamp()}] [${channel.toUpperCase()}] [${level.toUpperCase()}] ${message}`;
  if (meta && Object.keys(meta).length > 0) {
    return `${base} ${JSON.stringify(meta)}`;
  }
  return base;
}

function log(channel, level, message, meta = {}) {
  const line = format(channel, level, message, meta);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

const logger = {};

CHANNELS.forEach((channel) => {
  logger[channel] = {
    info: (message, meta) => log(channel, 'info', message, meta),
    warn: (message, meta) => log(channel, 'warn', message, meta),
    error: (message, meta) => log(channel, 'error', message, meta),
  };
});

module.exports = logger;
