const incidentQueryService = require('../services/incidentQueryService');
const asyncHandler = require('../middleware/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const incidents = await incidentQueryService.listIncidents(req.user._id, {
    status: req.query.status,
  });
  res.status(200).json({ success: true, data: incidents });
});

const getOne = asyncHandler(async (req, res) => {
  const incident = await incidentQueryService.getIncidentById(req.user._id, req.params.id);
  res.status(200).json({ success: true, data: incident });
});

module.exports = { list, getOne };
