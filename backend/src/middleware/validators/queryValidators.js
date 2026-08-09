const { query } = require('express-validator');

const metricsQueryValidation = [
  query('from').optional().isISO8601().withMessage('from must be a valid ISO 8601 date'),
  query('to').optional().isISO8601().withMessage('to must be a valid ISO 8601 date'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('limit must be between 1 and 1000'),
];

const incidentsQueryValidation = [
  query('status')
    .optional()
    .isIn(['active', 'resolved'])
    .withMessage('status must be either "active" or "resolved"'),
];

module.exports = { metricsQueryValidation, incidentsQueryValidation };
