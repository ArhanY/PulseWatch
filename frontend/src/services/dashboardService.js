import api from './api';

async function getDashboard() {
  const res = await api.get('/dashboard');
  return res.data.data;
}

export default { getDashboard };
