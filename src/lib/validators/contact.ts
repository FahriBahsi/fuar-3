import { z } from 'zod';

/**
 * Contact and messaging validation schemas
 */

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .trim(),
  
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(100, 'Subject is too long')
    .trim(),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long')
    .trim(),
  
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number')
    .optional(),
});

export const reviewSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  
  rating: z.number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  
  title: z.string()
    .min(3, 'Review title must be at least 3 characters')
    .max(100, 'Review title is too long')
    .trim(),
  
  comment: z.string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review is too long')
    .trim(),
});

export const messageSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  
  subject: z.string()
    .min(1, 'Subject is required')
    .max(100, 'Subject is too long')
    .trim(),
  
  message: z.string()
    .min(1, 'Message is required')
    .max(2000, 'Message is too long')
    .trim(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type MessageInput = z.infer<typeof messageSchema>;

