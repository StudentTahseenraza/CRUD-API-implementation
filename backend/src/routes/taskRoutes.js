const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const AuthMiddleware = require('../middlewares/auth');

// All task routes require authentication
router.use(AuthMiddleware.authenticate);

// Create task - POST /api/v1/tasks
router.post('/', TaskController.createTask);

// Get all tasks - GET /api/v1/tasks
router.get('/', TaskController.getTasks);

// Get task statistics - GET /api/v1/tasks/stats
router.get('/stats', TaskController.getTaskStats);

// Get single task - GET /api/v1/tasks/:id
router.get('/:id', TaskController.getTask);

// Update task - PUT /api/v1/tasks/:id
router.put('/:id', TaskController.updateTask);

// Delete task (admin only) - DELETE /api/v1/tasks/:id
router.delete('/:id', 
  AuthMiddleware.authorize('admin'),
  TaskController.deleteTask
);

// Make sure there's no /create route - remove if it exists
// router.get('/create', ...) // REMOVE THIS IF EXISTS

module.exports = router;