const express = require('express');
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  registerValidation,
  loginValidation,
} = require('../middleware/validators/authValidators');

const router = express.Router();

router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.get('/profile', protect, authController.getProfile);

module.exports = router;
