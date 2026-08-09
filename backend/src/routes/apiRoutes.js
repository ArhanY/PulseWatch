const express = require('express');
const apiController = require('../controllers/apiController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  createApiValidation,
  updateApiValidation,
} = require('../middleware/validators/apiValidators');

const router = express.Router();

router.use(protect);

router.get('/', apiController.list);
router.post('/', createApiValidation, validateRequest, apiController.create);
router.get('/:id', apiController.getOne);
router.put('/:id', updateApiValidation, validateRequest, apiController.update);
router.delete('/:id', apiController.remove);
router.patch('/:id/toggle', apiController.toggle);

module.exports = router;
