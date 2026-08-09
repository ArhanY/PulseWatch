const Incident = require('../models/Incident');

async function openIncidentIfNeeded(apiId, reason) {
  const existing = await Incident.findOne({ apiId, status: 'active' });
  if (existing) {
    return { incident: existing, wasNew: false };
  }

  const incident = await Incident.create({
    apiId,
    startedAt: new Date(),
    reason,
  });
  return { incident, wasNew: true };
}

async function resolveIncidentIfNeeded(apiId) {
  const active = await Incident.findOne({ apiId, status: 'active' });
  if (!active) {
    return { incident: null, wasResolved: false };
  }

  active.resolvedAt = new Date();
  await active.save();

  return { incident: active, wasResolved: true };
}

module.exports = { openIncidentIfNeeded, resolveIncidentIfNeeded };
