const Api = require('../models/Api');
const Metric = require('../models/Metric');
const AppError = require('../utils/AppError');

const DEFAULT_RECENT_LIMIT = 100;
const MAX_LIMIT = 1000;
const DEFAULT_FEED_LIMIT = 50;

async function assertApiOwnership(ownerId, apiId) {
  const api = await Api.findOne({ _id: apiId, owner: ownerId });
  if (!api) {
    throw new AppError('API not found', 404);
  }
  return api;
}

async function getMetricsForApi(ownerId, apiId, { from, to, limit } = {}) {
  await assertApiOwnership(ownerId, apiId);

  const query = { apiId };
  if (from || to) {
    query.timestamp = {};
    if (from) query.timestamp.$gte = new Date(from);
    if (to) query.timestamp.$lte = new Date(to);
  }

  const effectiveLimit = Math.min(parseInt(limit, 10) || DEFAULT_RECENT_LIMIT, MAX_LIMIT);

  return Metric.find(query).sort({ timestamp: -1 }).limit(effectiveLimit);
}

async function getRecentMetricsForOwner(ownerId, { limit } = {}) {
  const apis = await Api.find({ owner: ownerId }).select('_id');
  const apiIds = apis.map((a) => a._id);

  if (apiIds.length === 0) return [];

  const effectiveLimit = Math.min(parseInt(limit, 10) || DEFAULT_FEED_LIMIT, MAX_LIMIT);

  return Metric.find({ apiId: { $in: apiIds } })
    .sort({ timestamp: -1 })
    .limit(effectiveLimit);
}

module.exports = { getMetricsForApi, getRecentMetricsForOwner };
