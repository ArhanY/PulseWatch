const express = require('express');
const metricController = require('../controllers/metricController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { metricsQueryValidation } = require('../middleware/validators/queryValidators');

const router = express.Router();

router.use(protect);

router.get('/', metricsQueryValidation, validateRequest, metricController.listRecent);
router.get('/:apiId', metricsQueryValidation, validateRequest, metricController.listForApi);

module.exports = router;
