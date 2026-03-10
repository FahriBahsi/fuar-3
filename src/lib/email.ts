import nodemailer from 'nodemailer';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
  connectionTimeout?: number;
  greetingTimeout?: number;
  socketTimeout?: number;
  pool?: boolean;
  maxConnections?: number;
  maxMessages?: number;
  rateDelta?: number;
  rateLimit?: number;
}

// Email template interface
interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create email transporter
export function createEmailTransporter() {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '',
    },
    // Add additional options for better deliverability
    tls: {
      rejectUnauthorized: false, // For development/testing
    },
    // Connection timeout
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000, // 60 seconds
    // Pool connections for better performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 20000, // 20 seconds
    rateLimit: 5, // 5 emails per rateDelta
  };

  return nodemailer.createTransport(config);
}

// Send email function
export async function sendEmail(template: EmailTemplate) {
  try {
    // Check if email configuration is available
    if (!process.env.SMTP_USER || (!process.env.SMTP_PASS && !process.env.SMTP_PASSWORD)) {
      console.warn('Email configuration missing. Email not sent:', template.subject);
      return {
        success: false,
        error: 'Email service not configured. Please configure SMTP settings in environment variables.'
      };
    }

    const transporter = createEmailTransporter();

    const mailOptions = {
      from: {
        name: 'Direo Directory',
        address: process.env.SMTP_FROM || process.env.SMTP_USER
      },
      to: template.to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      // Add proper headers to prevent spam
      headers: {
        'X-Mailer': 'Direo Directory System',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
        'X-Report-Abuse': 'Please report abuse to ' + (process.env.CONTACT_EMAIL || process.env.SMTP_FROM || 'noreply@example.com'),
        'List-Unsubscribe': '<mailto:' + (process.env.CONTACT_EMAIL || process.env.SMTP_FROM || 'noreply@example.com') + '?subject=unsubscribe>',
        'Return-Path': process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@example.com',
        'Reply-To': process.env.CONTACT_EMAIL || process.env.SMTP_FROM || 'noreply@example.com',
      },
      // Add message ID for tracking
      messageId: `<${Date.now()}.${Math.random().toString(36).substr(2, 9)}@${process.env.SMTP_HOST || 'smtp.gmail.com'}>`,
      // Set proper date
      date: new Date(),
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Email templates
export const emailTemplates = {
  // Password reset email
  passwordReset: (email: string, resetLink: string) => ({
    to: email,
    subject: 'Reset Your Direo Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .button:hover { background: #5a6fd8; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>We received a request to reset your password for your Direo account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p><a href="${resetLink}">${resetLink}</a></p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 Direo. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Reset your Direo password by clicking this link: ${resetLink}. This link expires in 1 hour.`
  }),

  // Welcome email
  welcome: (email: string, name: string) => ({
    to: email,
    subject: 'Welcome to Direo!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Direo</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .button:hover { background: #5a6fd8; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Direo!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Welcome to Direo, your premier directory listing platform!</p>
              <p>Your account has been successfully created. You can now:</p>
              <ul>
                <li>Create and manage your listings</li>
                <li>Search and discover local businesses</li>
                <li>Connect with other users</li>
                <li>Write reviews and ratings</li>
              </ul>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
              <p>If you have any questions, feel free to contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2024 Direo. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to Direo! Your account has been created successfully. Visit your dashboard at ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
  }),

  // Contact form email
  contact: (formData: { name: string; email: string; subject: string; message: string }) => ({
    to: process.env.CONTACT_EMAIL || process.env.SMTP_USER || '',
    subject: `Contact Form: ${formData.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #333; }
            .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${formData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${formData.email}</div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${formData.subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `New contact form submission:\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`
  }),

  // Listing notification email
  listingNotification: (email: string, listingTitle: string, listingUrl: string) => ({
    to: email,
    subject: 'Your listing has been published!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Listing Published</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .button:hover { background: #218838; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Your Listing is Live!</h1>
            </div>
            <div class="content">
              <h2>Great news!</h2>
              <p>Your listing <strong>"${listingTitle}"</strong> has been successfully published and is now live on Direo.</p>
              <p>You can now:</p>
              <ul>
                <li>Share your listing with potential customers</li>
                <li>Manage your listing from your dashboard</li>
                <li>Respond to inquiries and reviews</li>
                <li>Update your listing information anytime</li>
              </ul>
              <a href="${listingUrl}" class="button">View Your Listing</a>
              <p>Thank you for using Direo to showcase your business!</p>
            </div>
            <div class="footer">
              <p>© 2024 Direo. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Your listing "${listingTitle}" has been published! View it here: ${listingUrl}`
  })
};

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid email configuration' 
    };
  }
}
