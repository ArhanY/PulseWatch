const express = require('express');
const incidentController = require('../controllers/incidentController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { incidentsQueryValidation } = require('../middleware/validators/queryValidators');

const router = express.Router();

router.use(protect);

router.get('/', incidentsQueryValidation, validateRequest, incidentController.list);
router.get('/:id', incidentController.getOne);

module.exports = router;
