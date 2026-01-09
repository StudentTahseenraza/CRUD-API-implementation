const { body, param, query, validationResult } = require('express-validator');

class ValidationMiddleware {
  // Simple validate function that always returns a middleware
  static validate(validations) {
    return async (req, res, next) => {
      // Ensure validations is an array
      if (!Array.isArray(validations)) {
        return res.status(500).json({
          success: false,
          error: 'Validation configuration error'
        });
      }

      // Run all validations
      for (const validation of validations) {
        await validation.run(req);
      }

      // Check for errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      next();
    };
  }

  // Register validation
  static registerValidation() {
    return [
      body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
      body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
      body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
  }

  // Login validation
  static loginValidation() {
    return [
      body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
      body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
    ];
  }

  // Task validation
  static taskValidation() {
    return [
      body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
      body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
      body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
      body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
    ];
  }

  // ID parameter validation
  static idParamValidation() {
    return [
      param('id')
        .isMongoId().withMessage('Invalid ID format')
    ];
  }
}

module.exports = ValidationMiddleware;