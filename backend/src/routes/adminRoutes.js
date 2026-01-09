const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const AuthMiddleware = require('../middlewares/auth');
const ValidationMiddleware = require('../middlewares/validation');

// All admin routes require admin role
router.use(AuthMiddleware.authenticate, AuthMiddleware.authorize('admin'));

// User management
router.get('/users', AdminController.getAllUsers);
router.get('/users/:id', 
  ValidationMiddleware.validate(ValidationMiddleware.idParamValidation()),
  AdminController.getUserById
);
router.put('/users/:id',
  ValidationMiddleware.validate(ValidationMiddleware.idParamValidation()),
  AdminController.updateUser
);
router.delete('/users/:id',
  ValidationMiddleware.validate(ValidationMiddleware.idParamValidation()),
  AdminController.deleteUser
);

// Task management
router.get('/tasks', AdminController.getAllTasks);

// System stats
router.get('/stats', AdminController.getSystemStats);

module.exports = router;