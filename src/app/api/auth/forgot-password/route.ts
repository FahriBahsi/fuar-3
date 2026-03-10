import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store the reset token
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: email,
          token: resetToken,
        },
      },
      update: {
        token: resetToken,
        expires: expires,
      },
      create: {
        identifier: email,
        token: resetToken,
        expires: expires,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Send reset email
    const emailResult = await sendEmail({
      to: email,
      subject: 'Password Reset Request - Direo Directory',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Direo Directory</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Direo Directory</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Password Reset Request</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Hello ${user.name || 'Valued User'},</h2>
              
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We received a request to reset your password for your Direo Directory account. If you made this request, please click the button below to set a new password.
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetUrl}" 
                   style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                          color: white; 
                          padding: 15px 35px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          display: inline-block; 
                          font-size: 16px; 
                          font-weight: 600;
                          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
                          transition: all 0.3s ease;">
                  Reset My Password
                </a>
              </div>
              
              <!-- Alternative Link -->
              <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 25px 0;">
                <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Alternative Method:</p>
                <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">If the button above doesn't work, copy and paste this link into your browser:</p>
                <a href="${resetUrl}" style="color: #007bff; font-size: 14px; word-break: break-all;">${resetUrl}</a>
              </div>
              
              <!-- Security Notice -->
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; margin: 25px 0;">
                <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">🔒 Security Information</h3>
                <ul style="color: #856404; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li>This password reset link will expire in <strong>24 hours</strong></li>
                  <li>The link can only be used <strong>once</strong></li>
                  <li>If you didn't request this reset, please ignore this email</li>
                </ul>
              </div>
              
              <!-- Footer -->
              <div style="border-top: 1px solid #e9ecef; padding-top: 25px; margin-top: 30px;">
                <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                  If you're having trouble with the button above, copy and paste the URL below into your web browser:
                </p>
                <p style="color: #6c757d; font-size: 12px; margin: 0; word-break: break-all;">
                  ${resetUrl}
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; font-size: 12px; margin: 0 0 10px 0;">
                This email was sent from Direo Directory System
              </p>
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                If you didn't request this password reset, please contact our support team.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - Direo Directory
        
        Hello ${user.name || 'Valued User'},
        
        We received a request to reset your password for your Direo Directory account.
        
        To reset your password, please visit the following link:
        ${resetUrl}
        
        This link will expire in 24 hours for security reasons.
        
        If you didn't request this password reset, please ignore this email. Your password will not be changed.
        
        Security Information:
        - This password reset link will expire in 24 hours
        - The link can only be used once
        - If you didn't request this reset, please ignore this email
        
        If you're having trouble with the link above, copy and paste the URL into your web browser:
        ${resetUrl}
        
        ---
        This email was sent from Direo Directory System
        If you didn't request this password reset, please contact our support team.
      `,
    });

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}