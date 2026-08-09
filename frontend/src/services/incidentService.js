import api from './api';

async function listIncidents(status) {
  const res = await api.get('/incidents', { params: status ? { status } : {} });
  return res.data.data;
}

async function getIncident(id) {
  const res = await api.get(`/incidents/${id}`);
  return res.data.data;
}

export default { listIncidents, getIncident };
