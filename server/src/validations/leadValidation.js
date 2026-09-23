const { z } = require('zod');
const { VALID_STATUSES, LEAD_STATUS } = require('../constants/leadStatus');

const createLeadSchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name cannot exceed 120 characters'),
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please enter a valid email address'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(5, 'Phone number must be at least 5 digits')
    .max(30, 'Phone number is too long'),
  status: z
    .enum(VALID_STATUSES, {
      errorMap: () => ({
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`
      })
    })
    .default(LEAD_STATUS.NEW),
  assignedTo: z
    .string()
    .trim()
    .default('Unassigned')
});

const updateLeadStatusSchema = z.object({
  status: z.enum(VALID_STATUSES, {
    errorMap: () => ({
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}`
    })
  })
});

const updateLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name cannot exceed 120 characters')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional(),
  phone: z
    .string()
    .trim()
    .min(5, 'Phone number must be at least 5 digits')
    .max(30, 'Phone number is too long')
    .optional(),
  status: z
    .enum(VALID_STATUSES, {
      errorMap: () => ({
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`
      })
    })
    .optional(),
  assignedTo: z.string().trim().optional()
});

module.exports = {
  createLeadSchema,
  updateLeadStatusSchema,
  updateLeadSchema
};
