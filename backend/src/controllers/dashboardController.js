const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../middleware/asyncHandler');

const get = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getDashboard(req.user._id);
  res.status(200).json({ success: true, data: dashboard });
});

module.exports = { get };
