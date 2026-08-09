const { body } = require('express-validator');

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const createApiValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('API name is required')
    .isLength({ max: 150 })
    .withMessage('API name must be 150 characters or fewer'),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL({ require_protocol: true })
    .withMessage('URL must be a valid absolute URL (e.g. https://example.com/api)'),
  body('method')
    .optional()
    .isIn(HTTP_METHODS)
    .withMessage(`Method must be one of: ${HTTP_METHODS.join(', ')}`),
  body('headers').optional().isObject().withMessage('Headers must be an object'),
  body('timeout')
    .optional()
    .isInt({ min: 1000, max: 60000 })
    .withMessage('Timeout must be between 1000 and 60000 ms'),
  body('interval')
    .optional()
    .isInt({ min: 5000 })
    .withMessage('Interval must be at least 5000 ms'),
  body('enabled').optional().isBoolean().withMessage('enabled must be true or false'),
];

const updateApiValidation = [
  body('name').optional().trim().isLength({ min: 1, max: 150 }).withMessage('API name must be 1-150 characters'),
  body('url')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('URL must be a valid absolute URL'),
  body('method')
    .optional()
    .isIn(HTTP_METHODS)
    .withMessage(`Method must be one of: ${HTTP_METHODS.join(', ')}`),
  body('headers').optional().isObject().withMessage('Headers must be an object'),
  body('timeout')
    .optional()
    .isInt({ min: 1000, max: 60000 })
    .withMessage('Timeout must be between 1000 and 60000 ms'),
  body('interval')
    .optional()
    .isInt({ min: 5000 })
    .withMessage('Interval must be at least 5000 ms'),
  body('enabled').optional().isBoolean().withMessage('enabled must be true or false'),
];

module.exports = { createApiValidation, updateApiValidation };
