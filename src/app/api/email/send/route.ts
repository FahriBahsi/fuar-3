import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates, verifyEmailConfig } from '@/lib/email';
import { z } from 'zod';

// Email sending schemas
const sendEmailSchema = z.object({
  type: z.enum(['password-reset', 'welcome', 'contact', 'listing-notification']),
  to: z.string().email(),
  data: z.record(z.string(), z.any()).optional(),
});

const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

// Rate limiting (simple in-memory store for demo)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const key = `email_${ip}`;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many email requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { type, to, data } = sendEmailSchema.parse(body);

    let emailTemplate;

    switch (type) {
      case 'password-reset':
        if (!data?.resetLink) {
          return NextResponse.json(
            { success: false, error: 'Reset link is required for password reset emails' },
            { status: 400 }
          );
        }
        emailTemplate = emailTemplates.passwordReset(to, data.resetLink);
        break;

      case 'welcome':
        if (!data?.name) {
          return NextResponse.json(
            { success: false, error: 'Name is required for welcome emails' },
            { status: 400 }
          );
        }
        emailTemplate = emailTemplates.welcome(to, data.name);
        break;

      case 'contact':
        const contactData = contactFormSchema.parse(data);
        emailTemplate = emailTemplates.contact(contactData);
        break;

      case 'listing-notification':
        if (!data?.listingTitle || !data?.listingUrl) {
          return NextResponse.json(
            { success: false, error: 'Listing title and URL are required for listing notifications' },
            { status: 400 }
          );
        }
        emailTemplate = emailTemplates.listingNotification(to, data.listingTitle, data.listingUrl);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid email type' },
          { status: 400 }
        );
    }

    const result = await sendEmail(emailTemplate);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Verify email configuration endpoint
export async function GET() {
  try {
    const result = await verifyEmailConfig();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify email configuration' },
      { status: 500 }
    );
  }
}
