import { z } from 'zod';

// Auth validation schemas
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  name: z
    .string()
    .max(255, 'Name must be less than 255 characters')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

// Task validation schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  completed: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

// Filter schemas
export const taskFiltersSchema = z.object({
  status: z.enum(['all', 'pending', 'completed']).default('all'),
  sort: z.enum(['created', 'title', 'updated']).default('created'),
  search: z.string().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Type exports
export type SignInForm = z.infer<typeof signInSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;
export type CreateTaskForm = z.infer<typeof createTaskSchema>;
export type UpdateTaskForm = z.infer<typeof updateTaskSchema>;
export type TaskFilters = z.infer<typeof taskFiltersSchema>;
export type Pagination = z.infer<typeof paginationSchema>;

// Validation helper
export const validateForm = <T>(schema: z.ZodSchema, data: unknown): { data: T | null; errors: Record<string, string> } => {
  try {
    const result = schema.parse(data);
    return { data: result as T, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { data: null, errors };
    }
    return { data: null, errors: { form: 'Validation failed' } };
  }
};

// Custom error handler
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Validation error';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
