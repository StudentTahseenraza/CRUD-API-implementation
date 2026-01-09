const User = require('../models/User');
const JWTService = require('../utils/jwt');
const { ErrorHandler } = require('../middlewares/errorHandler');

class AuthController {
    // @desc    Register user
    // @route   POST /api/v1/auth/register
    // @access  Public
    static async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new ErrorHandler('User already exists with this email', 400);
            }

            // Create user (password will be hashed by middleware)
            const user = await User.create({
                name,
                email,
                password,
                role: role || 'user'
            });

            // Generate token
            const token = JWTService.generateToken(user._id, user.role);

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // @desc    Login user
    // @route   POST /api/v1/auth/login
    // @access  Public
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            console.log('Login attempt for email:', email);

            // Find user with password field
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                console.log('User not found');
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                console.log('User inactive');
                return res.status(401).json({
                    success: false,
                    error: 'Account is deactivated'
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                console.log('Invalid password');
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }

            // Generate token
            const token = JWTService.generateToken(user._id, user.role);

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Remove password from response
            user.password = undefined;

            console.log('Login successful for user:', user.email);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Server error during login'
            });
        }
    }

    // @desc    Get current user profile
    // @route   GET /api/v1/auth/me
    // @access  Private
    static async getProfile(req, res, next) {
        try {
            const user = await User.findById(req.user._id);

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    // @desc    Update user profile
    // @route   PUT /api/v1/auth/update-profile
    // @access  Private
    static async updateProfile(req, res, next) {
        try {
            const updates = {};
            const allowedUpdates = ['name'];

            // Filter allowed updates
            Object.keys(req.body).forEach(key => {
                if (allowedUpdates.includes(key)) {
                    updates[key] = req.body[key];
                }
            });

            // Update user
            const user = await User.findByIdAndUpdate(
                req.user._id,
                updates,
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    // @desc    Change password
    // @route   PUT /api/v1/auth/change-password
    // @access  Private
    static async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Get user with password
            const user = await User.findById(req.user._id).select('+password');

            // Check current password
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                throw new ErrorHandler('Current password is incorrect', 400);
            }

            // Update password
            user.password = newPassword;
            await user.save();

            // Generate new token
            const token = JWTService.generateToken(user._id, user.role);

            res.status(200).json({
                success: true,
                message: 'Password changed successfully',
                data: { token }
            });
        } catch (error) {
            next(error);
        }
    }

    // @desc    Logout user (client-side token removal)
    // @route   POST /api/v1/auth/logout
    // @access  Private
    static async logout(req, res, next) {
        try {
            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;