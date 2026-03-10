import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Simple in-memory rate limiter
 * For production, use Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per interval
}

export function rateLimit(config: RateLimitConfig = { interval: 60000, maxRequests: 100 }) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
    const now = Date.now();
    const key = `${ip}:${req.nextUrl.pathname}`;

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + config.interval,
      };
      return null; // Allow request
    }

    store[key].count++;

    if (store[key].count > config.maxRequests) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'You have exceeded the rate limit. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((store[key].resetTime - now) / 1000)),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(store[key].resetTime),
          },
        }
      );
    }

    return null; // Allow request
  };
}

/**
 * API-specific rate limiter
 */
export const apiRateLimit = rateLimit({
  interval: 60000, // 1 minute
  maxRequests: 100,
});

/**
 * Auth-specific rate limiter (stricter)
 */
export const authRateLimit = rateLimit({
  interval: 900000, // 15 minutes
  maxRequests: 5, // Only 5 login attempts per 15 minutes
});

/**
 * Search rate limiter
 */
export const searchRateLimit = rateLimit({
  interval: 60000, // 1 minute
  maxRequests: 30,
});

