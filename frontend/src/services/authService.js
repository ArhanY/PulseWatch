import api from './api';

async function register({ name, email, password }) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data.data;
}

async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data;
}

async function getProfile() {
  const res = await api.get('/auth/profile');
  return res.data.data;
}

export default { register, login, getProfile };
