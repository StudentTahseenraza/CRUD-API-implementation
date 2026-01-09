const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middlewares/auth');
const ValidationMiddleware = require('../middlewares/validation');

// Public routes
router.post('/register', 
  ValidationMiddleware.validate(ValidationMiddleware.registerValidation()),
  AuthController.register
);

router.post('/login',
  ValidationMiddleware.validate(ValidationMiddleware.loginValidation()),
  AuthController.login
);

// Protected routes - require authentication
router.use(AuthMiddleware.authenticate);

router.get('/me', AuthController.getProfile);
router.put('/update-profile', AuthController.updateProfile);
router.put('/change-password', AuthController.changePassword);
router.post('/logout', AuthController.logout);

module.exports = router;