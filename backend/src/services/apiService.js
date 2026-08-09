const Api = require('../models/Api');
const AppError = require('../utils/AppError');

const ALLOWED_FIELDS = ['name', 'url', 'method', 'headers', 'body', 'timeout', 'interval', 'enabled'];

function pickAllowedFields(source) {
  const result = {};
  for (const field of ALLOWED_FIELDS) {
    if (source[field] !== undefined) {
      result[field] = source[field];
    }
  }
  return result;
}

async function createApi(ownerId, payload) {
  const data = pickAllowedFields(payload);
  const api = await Api.create({ ...data, owner: ownerId });
  return api;
}

async function listApis(ownerId) {
  return Api.find({ owner: ownerId }).sort({ createdAt: -1 });
}

async function getOwnedApiOrThrow(ownerId, apiId) {
  const api = await Api.findOne({ _id: apiId, owner: ownerId });
  if (!api) {
    throw new AppError('API not found', 404);
  }
  return api;
}

async function getApiById(ownerId, apiId) {
  return getOwnedApiOrThrow(ownerId, apiId);
}

async function updateApi(ownerId, apiId, payload) {
  const api = await getOwnedApiOrThrow(ownerId, apiId);
  const data = pickAllowedFields(payload);
  Object.assign(api, data);
  await api.save();
  return api;
}

async function deleteApi(ownerId, apiId) {
  const api = await getOwnedApiOrThrow(ownerId, apiId);
  await api.deleteOne();
  return { id: apiId };
}

async function toggleApi(ownerId, apiId) {
  const api = await getOwnedApiOrThrow(ownerId, apiId);
  api.enabled = !api.enabled;
  await api.save();
  return api;
}

module.exports = {
  createApi,
  listApis,
  getApiById,
  updateApi,
  deleteApi,
  toggleApi,
};
