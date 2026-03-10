'use client';

import { useState } from 'react';
import Link from 'next/link';
import { assetUrl, apiUrl } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        // Handle error - you might want to show an error message
        console.error('Password reset error:', data.error);
        alert(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <section className="auth-wrapper section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="auth-card">
              {/* Logo */}
              <div className="auth-logo text-center mb-4">
                <Link href="/">
                  <img
                    src={assetUrl('/images/Logo.png')}
                    alt="Direo"
                    style={{ width: '150px', height: 'auto' }}
                  />
                </Link>
              </div>

              {!isSubmitted ? (
                <>
                  {/* Header */}
                  <div className="auth-header text-center mb-4">
                    <div className="auth-icon mb-3">
                      <i className="la la-lock auth-icon-large"></i>
                    </div>
                    <h2>Forgot Password?</h2>
                    <p className="text-muted">
                      No worries! Enter your email and we'll send you reset instructions
                    </p>
                  </div>

                  {/* Reset Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <div className="input-with-icon">
                        <i className="la la-envelope"></i>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <small className="form-text text-muted">
                        We'll send a password reset link to this email
                      </small>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block btn-lg">
                      <i className="la la-paper-plane"></i> Send Reset Link
                    </button>
                  </form>

                  {/* Back to Login */}
                  <div className="auth-footer text-center mt-4">
                    <Link href="/auth/login" className="text-primary">
                      <i className="la la-arrow-left"></i> Back to Login
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* Success Message */}
                  <div className="auth-success text-center">
                    <div className="success-icon mb-4">
                      <i className="la la-check-circle auth-icon-success"></i>
                    </div>
                    <h3 className="mb-3">Check Your Email</h3>
                    <p className="text-muted mb-4">
                      We've sent password reset instructions to:
                      <br />
                      <strong>{email}</strong>
                    </p>
                    <div className="alert alert-info">
                      <i className="la la-info-circle"></i> Didn't receive the email? Check your spam
                      folder or{' '}
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="btn-link text-primary"
                      >
                        try again
                      </button>
                    </div>

                    <Link href="/auth/login" className="btn btn-primary mt-3">
                      <i className="la la-arrow-left"></i> Back to Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

