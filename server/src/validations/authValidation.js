const { z } = require('zod');
const { ROLES } = require('../constants/roles');

const registerSchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  role: z
    .enum(Object.values(ROLES), {
      errorMap: () => ({ message: 'Invalid role selection' })
    })
    .optional()
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema
};
