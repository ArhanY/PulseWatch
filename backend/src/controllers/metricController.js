const metricQueryService = require('../services/metricQueryService');
const asyncHandler = require('../middleware/asyncHandler');

const listRecent = asyncHandler(async (req, res) => {
  const metrics = await metricQueryService.getRecentMetricsForOwner(req.user._id, {
    limit: req.query.limit,
  });
  res.status(200).json({ success: true, data: metrics });
});

const listForApi = asyncHandler(async (req, res) => {
  const metrics = await metricQueryService.getMetricsForApi(req.user._id, req.params.apiId, {
    from: req.query.from,
    to: req.query.to,
    limit: req.query.limit,
  });
  res.status(200).json({ success: true, data: metrics });
});

module.exports = { listRecent, listForApi };
