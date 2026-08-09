const env = require('../config/env');
const { executeRequest } = require('../utils/httpRequestExecutor');

const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);
const NON_RETRYABLE_STATUS_CODES = new Set([400, 401, 403, 404]);

function isRetryable(result) {
  if (result.statusCode === null) return true;
  if (RETRYABLE_STATUS_CODES.has(result.statusCode)) return true;
  if (NON_RETRYABLE_STATUS_CODES.has(result.statusCode)) return false;
  return result.statusCode >= 500;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executeWithRetry(api) {
  let lastResult;

  for (let attempt = 1; attempt <= env.RETRY.MAX_ATTEMPTS; attempt += 1) {
    lastResult = await executeRequest(api);

    if (lastResult.success) {
      return { ...lastResult, attempts: attempt };
    }

    const isLastAttempt = attempt === env.RETRY.MAX_ATTEMPTS;
    if (isLastAttempt || !isRetryable(lastResult)) {
      return { ...lastResult, attempts: attempt };
    }

    const backoffMs = env.RETRY.BASE_DELAY_MS * 2 ** (attempt - 1);
    await delay(backoffMs);
  }

  return { ...lastResult, attempts: env.RETRY.MAX_ATTEMPTS };
}

module.exports = { executeWithRetry, isRetryable };
