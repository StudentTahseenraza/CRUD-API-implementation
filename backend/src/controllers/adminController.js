const User = require('../models/User');
const Task = require('../models/Task');
const { ErrorHandler } = require('../middlewares/errorHandler');

class AdminController {
  // @desc    Get all users (Admin only)
  // @route   GET /api/v1/admin/users
  // @access  Private/Admin
  static async getAllUsers(req, res, next) {
    try {
      const { role, isActive, search, page = 1, limit = 20 } = req.query;

      const filter = {};

      if (role) {
        filter.role = role;
      }

      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const users = await User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await User.countDocuments(filter);

      res.status(200).json({
        success: true,
        count: users.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get user by ID (Admin only)
  // @route   GET /api/v1/admin/users/:id
  // @access  Private/Admin
  static async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id).select('-password');

      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }

      // Get user's tasks
      const tasks = await Task.find({ createdBy: user._id });

      res.status(200).json({
        success: true,
        data: {
          user,
          tasksCount: tasks.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update user (Admin only)
  // @route   PUT /api/v1/admin/users/:id
  // @access  Private/Admin
  static async updateUser(req, res, next) {
    try {
      const allowedUpdates = ['name', 'role', 'isActive'];
      const updates = {};

      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      // Prevent admin from demoting themselves
      if (req.params.id === req.user._id.toString() && updates.role === 'user') {
        throw new ErrorHandler('Cannot demote yourself from admin role', 400);
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete user (Admin only)
  // @route   DELETE /api/v1/admin/users/:id
  // @access  Private/Admin
  static async deleteUser(req, res, next) {
    try {
      // Prevent self-deletion
      if (req.params.id === req.user._id.toString()) {
        throw new ErrorHandler('Cannot delete your own account', 400);
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }

      // Delete user's tasks
      await Task.deleteMany({ createdBy: user._id });

      // Delete user
      await user.deleteOne();

      res.status(200).json({
        success: true,
        message: 'User and associated tasks deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get system statistics (Admin only)
  // @route   GET /api/v1/admin/stats
  // @access  Private/Admin
  static async getSystemStats(req, res, next) {
    try {
      const [totalUsers, totalTasks, usersByRole, tasksByStatus] = await Promise.all([
        User.countDocuments(),
        Task.countDocuments(),
        User.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } }
        ]),
        Task.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalTasks,
          usersByRole,
          tasksByStatus
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get all tasks (Admin view)
  // @route   GET /api/v1/admin/tasks
  // @access  Private/Admin
  static async getAllTasks(req, res, next) {
    try {
      const { page = 1, limit = 50 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const tasks = await Task.find()
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Task.countDocuments();

      res.status(200).json({
        success: true,
        count: tasks.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;