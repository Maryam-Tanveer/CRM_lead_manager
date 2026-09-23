const express = require('express');
const {
  register,
  login,
  refresh,
  logout,
  getMe
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validations/authValidation');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

module.exports = router;
