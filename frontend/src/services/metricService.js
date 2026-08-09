import api from './api';

async function getRecentMetrics(limit = 50) {
  const res = await api.get('/metrics', { params: { limit } });
  return res.data.data;
}

async function getMetricsForApi(apiId, { from, to, limit } = {}) {
  const res = await api.get(`/metrics/${apiId}`, { params: { from, to, limit } });
  return res.data.data;
}

export default { getRecentMetrics, getMetricsForApi };
