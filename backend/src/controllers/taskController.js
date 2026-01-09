const Task = require('../models/Task');
const User = require('../models/User');
const { ErrorHandler } = require('../middlewares/errorHandler');

class TaskController {
    // @desc    Create a new task
    // @route   POST /api/v1/tasks
    // @access  Private
    static async createTask(req, res, next) {
        try {
            const taskData = {
                ...req.body,
                createdBy: req.user._id
            };

            const task = await Task.create(taskData);

            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    // // @desc    Get all tasks (with filters)
    // @route   GET /api/v1/tasks
    // @access  Private
    static async getTasks(req, res, next) {
        try {
            // console.log('=== GET TASK REQUEST ===');
            // console.log('User ID:', req.user._id);
            // console.log('User Role:', req.user.role);

            const {
                status,
                priority,
                search,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                page = 1,
                limit = 10
            } = req.query;

            // Build filter
            const filter = {};

            // For non-admin users, only show their own tasks
            if (req.user.role !== 'admin') {
                filter.createdBy = req.user._id;
                // console.log('Filtering by user ID:', req.user._id);
            }

            // Status filter
            if (status) {
                filter.status = status;
            }

            // Priority filter
            if (priority) {
                filter.priority = priority;
            }

            // Search filter
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { tags: { $regex: search, $options: 'i' } }
                ];
            }

            // Build sort
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            // Pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // console.log('Final filter:', JSON.stringify(filter, null, 2));
            // console.log('Sort:', sort);
            // console.log('Skip:', skip, 'Limit:', limit);

            // Execute query
            const tasks = await Task.find(filter)
                .populate('createdBy', 'name email')
                .populate('assignedTo', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit));

            // console.log('Found tasks:', tasks.length);

            // Count total documents
            const total = await Task.countDocuments(filter);

            const response = {
                success: true,
                count: tasks.length,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                data: tasks
            };

            // console.log('Response:', JSON.stringify(response, null, 2));

            res.status(200).json(response);
        } catch (error) {
            console.error('Get tasks error:', error);
            next(error);
        }
    }

    // @desc    Get single task
    // @route   GET /api/v1/tasks/:id
    // @access  Private
    static async getTask(req, res, next) {
        try {
            const taskId = req.params.id;

            // Check if ID is valid MongoDB ObjectId
            if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid task ID format'
                });
            }

            const task = await Task.findById(taskId)
                .populate('createdBy', 'name email')
                .populate('assignedTo', 'name email');

            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: 'Task not found'
                });
            }

            // Check ownership (admin can access any)
            if (req.user.role !== 'admin' && task.createdBy._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied'
                });
            }

            res.status(200).json({
                success: true,
                data: task
            });
        } catch (error) {
            console.error('Get task error:', error);
            res.status(500).json({
                success: false,
                error: 'Server error'
            });
        }
    }

    // @desc    Update task
    // @route   PUT /api/v1/tasks/:id
    // @access  Private
    static async updateTask(req, res, next) {
        try {
            // Filter updates
            const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'tags', 'assignedTo'];
            const updates = {};

            Object.keys(req.body).forEach(key => {
                if (allowedUpdates.includes(key)) {
                    updates[key] = req.body[key];
                }
            });

            // Admin can update any field, users only specific fields
            if (req.user.role !== 'admin') {
                delete updates.assignedTo;
            }

            const task = await Task.findByIdAndUpdate(
                req.params.id,
                updates,
                { new: true, runValidators: true }
            );

            if (!task) {
                throw new ErrorHandler('Task not found', 404);
            }

            res.status(200).json({
                success: true,
                message: 'Task updated successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    // @desc    Delete task
    // @route   DELETE /api/v1/tasks/:id
    // @access  Private (Admin or Owner)
    static async deleteTask(req, res, next) {
        try {
            const task = await Task.findById(req.params.id);

            if (!task) {
                throw new ErrorHandler('Task not found', 404);
            }

            await task.deleteOne();

            res.status(200).json({
                success: true,
                message: 'Task deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    // @desc    Get task statistics
    // @route   GET /api/v1/tasks/stats
    // @access  Private
    static async getTaskStats(req, res, next) {
        try {
            const filter = {};

            if (req.user.role !== 'admin') {
                filter.createdBy = req.user._id;
            }

            const stats = await Task.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TaskController;