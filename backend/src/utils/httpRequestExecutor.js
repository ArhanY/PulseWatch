const axios = require('axios');

async function executeRequest(api) {
  const startTime = process.hrtime.bigint();

  const headers = api.headers instanceof Map ? Object.fromEntries(api.headers) : api.headers || {};

  try {
    const response = await axios({
      method: api.method || 'GET',
      url: api.url,
      headers,
      data: api.body || undefined,
      timeout: api.timeout || 10000,
      validateStatus: () => true,
    });

    const latency = msSince(startTime);
    const responseSize = getResponseSize(response);

    return {
      success: response.status >= 200 && response.status < 400,
      statusCode: response.status,
      latency,
      responseSize,
      errorMessage: null,
    };
  } catch (err) {
    const latency = msSince(startTime);
    return {
      success: false,
      statusCode: null,
      latency,
      responseSize: 0,
      errorMessage: classifyNetworkError(err),
    };
  }
}

function msSince(startTimeBigint) {
  const diffNs = process.hrtime.bigint() - startTimeBigint;
  return Number(diffNs / 1000000n);
}

function getResponseSize(response) {
  const contentLength = response.headers && response.headers['content-length'];
  if (contentLength) return parseInt(contentLength, 10);
  try {
    return Buffer.byteLength(
      typeof response.data === 'string' ? response.data : JSON.stringify(response.data || '')
    );
  } catch {
    return 0;
  }
}

function classifyNetworkError(err) {
  if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
    return 'Request timed out';
  }
  if (err.code === 'ENOTFOUND') {
    return 'DNS lookup failed';
  }
  if (err.code === 'ECONNREFUSED') {
    return 'Connection refused';
  }
  return err.message || 'Unknown network error';
}

module.exports = { executeRequest };
