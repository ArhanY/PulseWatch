const cron = require('node-cron');
const Api = require('../models/Api');
const env = require('../config/env');
const logger = require('../utils/logger');
const { runPool } = require('../workers/workerPool');
const { monitorApi } = require('../workers/monitorWorker');

let task = null;

async function tick() {
  const now = new Date();

  const dueApis = await Api.find({
    enabled: true,
    $or: [{ nextCheckAt: null }, { nextCheckAt: { $lte: now } }],
  });

  if (dueApis.length === 0) return;

  logger.monitoring.info('Scheduler tick: dispatching due APIs', { count: dueApis.length });

  await runPool(dueApis, env.MONITORING.WORKER_POOL_SIZE, monitorApi);
}

function start() {
  if (task) {
    logger.monitoring.info('Scheduler already running, ignoring duplicate start() call');
    return task;
  }

  const tickSeconds = Math.max(1, Math.round(env.MONITORING.SCHEDULER_TICK_MS / 1000));
  const cronExpression = `*/${tickSeconds} * * * * *`;

  task = cron.schedule(cronExpression, () => {
    tick().catch((err) => {
      logger.error.error('Scheduler tick failed', { message: err.message });
    });
  });

  logger.monitoring.info('Monitoring scheduler started', { tickSeconds });
  return task;
}

function stop() {
  if (task) {
    task.stop();
    task = null;
    logger.monitoring.info('Monitoring scheduler stopped');
  }
}

module.exports = { start, stop, tick };
