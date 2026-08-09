const Api = require('../models/Api');
const Incident = require('../models/Incident');
const Metric = require('../models/Metric');

const AGGREGATION_WINDOW_MS = 24 * 60 * 60 * 1000;

async function getDashboard(ownerId) {
  const apis = await Api.find({ owner: ownerId });
  const apiIds = apis.map((a) => a._id);

  const totalApis = apis.length;
  const healthyApis = apis.filter((a) => a.enabled && a.circuitBreaker.state !== 'OPEN').length;
  const failedApis = apis.filter((a) => a.circuitBreaker.state === 'OPEN').length;

  let activeIncidents = 0;
  let averageLatency = 0;
  let averageUptime = 100;

  if (apiIds.length > 0) {
    activeIncidents = await Incident.countDocuments({ apiId: { $in: apiIds }, status: 'active' });

    const since = new Date(Date.now() - AGGREGATION_WINDOW_MS);
    const [agg] = await Metric.aggregate([
      { $match: { apiId: { $in: apiIds }, timestamp: { $gte: since } } },
      {
        $group: {
          _id: null,
          avgLatency: { $avg: '$latency' },
          total: { $sum: 1 },
          successCount: { $sum: { $cond: ['$success', 1, 0] } },
        },
      },
    ]);

    if (agg && agg.total > 0) {
      averageLatency = Math.round(agg.avgLatency);
      averageUptime = Math.round((agg.successCount / agg.total) * 10000) / 100;
    }
  }

  return {
    totalApis,
    healthyApis,
    failedApis,
    activeIncidents,
    averageLatency,
    averageUptime,
  };
}

module.exports = { getDashboard };
