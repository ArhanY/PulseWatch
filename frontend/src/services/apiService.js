import api from './api';

async function listApis() {
  const res = await api.get('/apis');
  return res.data.data;
}

async function getApi(id) {
  const res = await api.get(`/apis/${id}`);
  return res.data.data;
}

async function createApi(payload) {
  const res = await api.post('/apis', payload);
  return res.data.data;
}

async function updateApi(id, payload) {
  const res = await api.put(`/apis/${id}`, payload);
  return res.data.data;
}

async function deleteApi(id) {
  await api.delete(`/apis/${id}`);
}

async function toggleApi(id) {
  const res = await api.patch(`/apis/${id}/toggle`);
  return res.data.data;
}

export default { listApis, getApi, createApi, updateApi, deleteApi, toggleApi };
