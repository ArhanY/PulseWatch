const logger = require('../utils/logger');

async function runPool(items, poolSize, handler) {
  const results = [];
  let cursor = 0;

  async function worker(workerId) {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      const item = items[currentIndex];

      try {
        const result = await handler(item);
        results[currentIndex] = { status: 'fulfilled', value: result };
      } catch (err) {
        logger.worker.error('Worker task failed', { workerId, message: err.message });
        results[currentIndex] = { status: 'rejected', reason: err.message };
      }
    }
  }

  const workerCount = Math.min(poolSize, items.length) || 0;
  const workers = Array.from({ length: workerCount }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  return results;
}

module.exports = { runPool };
