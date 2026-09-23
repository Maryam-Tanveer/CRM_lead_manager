import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name cannot exceed 120 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(5, 'Phone number must be at least 5 digits')
    .max(30, 'Phone number is too long'),
  status: z
    .enum(['new', 'contacted', 'converted'])
    .default('new'),
  assignedTo: z
    .string()
    .trim()
    .optional()
});
