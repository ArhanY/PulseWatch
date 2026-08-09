const apiService = require('../services/apiService');
const asyncHandler = require('../middleware/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const api = await apiService.createApi(req.user._id, req.body);
  res.status(201).json({
    success: true,
    message: 'API created successfully',
    data: api,
  });
});

const list = asyncHandler(async (req, res) => {
  const apis = await apiService.listApis(req.user._id);
  res.status(200).json({
    success: true,
    data: apis,
  });
});

const getOne = asyncHandler(async (req, res) => {
  const api = await apiService.getApiById(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    data: api,
  });
});

const update = asyncHandler(async (req, res) => {
  const api = await apiService.updateApi(req.user._id, req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'API updated successfully',
    data: api,
  });
});

const remove = asyncHandler(async (req, res) => {
  await apiService.deleteApi(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: 'API deleted successfully',
  });
});

const toggle = asyncHandler(async (req, res) => {
  const api = await apiService.toggleApi(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: `Monitoring ${api.enabled ? 'enabled' : 'disabled'} for this API`,
    data: api,
  });
});

module.exports = { create, list, getOne, update, remove, toggle };
