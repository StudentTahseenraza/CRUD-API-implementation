const JWTService = require('../utils/jwt');
const User = require('../models/User');

class AuthMiddleware {

  // 🔐 AUTHENTICATION MIDDLEWARE
  static authenticate = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Authentication token missing'
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = JWTService.verifyToken(token);

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User no longer exists'
        });
      }

      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  };

  // 🛡️ ROLE AUTHORIZATION
  static authorize = (...roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to perform this action'
        });
      }
      next();
    };
  };

  // 🔎 OWNERSHIP CHECK (YOUR EXISTING CODE – KEPT)
  static checkOwnership(model, paramName = 'id') {
    return async (req, res, next) => {
      try {
        const resourceId = req.params[paramName];

        if (!resourceId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid ID format'
          });
        }

        const resource = await model.findById(resourceId);

        if (!resource) {
          return res.status(404).json({
            success: false,
            error: 'Resource not found'
          });
        }

        if (req.user.role === 'admin') {
          req.resource = resource;
          return next();
        }

        const ownerField = model.modelName === 'Task' ? 'createdBy' : '_id';

        if (resource[ownerField].toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            error: 'Access denied'
          });
        }

        req.resource = resource;
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Server error'
        });
      }
    };
  }
}

module.exports = AuthMiddleware;
