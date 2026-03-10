import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import { contactFormSchema } from '@/lib/validators/contact';

// Rate limiting for contact form
const contactRateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkContactRateLimit(ip: string, limit: number = 3, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const key = `contact_${ip}`;
  const current = contactRateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    contactRateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
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
    if (!checkContactRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many contact form submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const formData = contactFormSchema.parse(body);

    // Send contact form email
    const emailTemplate = emailTemplates.contact(formData);
    const result = await sendEmail(emailTemplate);

    if (result.success) {
      // Optional: Send confirmation email to the user
      const confirmationTemplate = {
        to: formData.email,
        subject: 'Thank you for contacting Direo',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Thank You for Contacting Us</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You!</h1>
                </div>
                <div class="content">
                  <h2>Hello ${formData.name}!</h2>
                  <p>Thank you for contacting Direo. We have received your message and will get back to you as soon as possible.</p>
                  <p><strong>Your message:</strong></p>
                  <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea;">
                    ${formData.message.replace(/\n/g, '<br>')}
                  </p>
                  <p>We typically respond within 24 hours. If you have any urgent questions, please don't hesitate to reach out.</p>
                  <p>Best regards,<br>The Direo Team</p>
                </div>
                <div class="footer">
                  <p>© 2024 Direo. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `Thank you for contacting Direo! We have received your message: "${formData.message}" and will respond within 24 hours.`
      };

      // Send confirmation email (don't wait for it)
      sendEmail(confirmationTemplate).catch(console.error);

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully! We will get back to you soon.',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid form data. Please check your inputs.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
