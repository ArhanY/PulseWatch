const Api = require('../models/Api');
const Incident = require('../models/Incident');
const AppError = require('../utils/AppError');

async function ownedApiIds(ownerId) {
  const apis = await Api.find({ owner: ownerId }).select('_id');
  return apis.map((a) => a._id);
}

async function listIncidents(ownerId, { status } = {}) {
  const apiIds = await ownedApiIds(ownerId);
  if (apiIds.length === 0) return [];

  const query = { apiId: { $in: apiIds } };
  if (status) query.status = status;

  return Incident.find(query).sort({ startedAt: -1 });
}

async function getIncidentById(ownerId, incidentId) {
  const apiIds = await ownedApiIds(ownerId);
  const incident = await Incident.findOne({ _id: incidentId, apiId: { $in: apiIds } });
  if (!incident) {
    throw new AppError('Incident not found', 404);
  }
  return incident;
}

module.exports = { listIncidents, getIncidentById };
