import { z } from 'zod';

/**
 * Listing validation schemas using Zod
 */

export const createListingSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  
  category: z.string()
    .min(1, 'Category is required'),
  
  price: z.number()
    .min(0, 'Price must be positive')
    .max(1000000, 'Price is too high'),
  
  priceType: z.enum(['hourly', 'daily', 'monthly', 'yearly']),
  
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  
  contact: z.object({
    phone: z.string()
      .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number')
      .optional(),
    email: z.string()
      .email('Invalid email address')
      .optional(),
    website: z.string()
      .url('Invalid website URL')
      .optional(),
  }).optional(),
  
  amenities: z.array(z.string()).max(20, 'Too many amenities'),
  
  hours: z.record(z.string(),
    z.union([
      z.object({
        open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
        close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      }),
      z.literal('closed'),
    ])
  ).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const searchListingSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query is too long')
    .trim(),
  category: z.string().optional(),
  location: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  page: z.number().int().positive().default(1),
  perPage: z.number().int().min(1).max(100).default(12),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type SearchListingInput = z.infer<typeof searchListingSchema>;

