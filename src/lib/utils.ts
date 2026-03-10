import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge className strings
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format price with currency
 */
export function formatPrice(price: number | string, currency: string = 'USD'): string {
  // If price is already a formatted string (like "$55.00"), return as is
  if (typeof price === 'string') {
    return price;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Build asset URL with basePath support
 */
export function assetUrl(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return basePath + cleanPath;
}

/**
 * Get auth callback URL with basePath support
 * Used for NextAuth signIn/signOut callbackUrl
 */
export function getAuthCallbackUrl(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return basePath + path;
}

/**
 * Build API URL with basePath support
 * Used for fetch calls to API routes
 */
export function apiUrl(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return basePath + path;
}

/**
 * Build user image URL with basePath support
 * Used for user profile images from database
 */
export function userImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  // If already a full URL (http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If starts with /uploads or /images, add basePath
  if (url.startsWith('/uploads/') || url.startsWith('/images/')) {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    return basePath + url;
  }
  return url;
}

