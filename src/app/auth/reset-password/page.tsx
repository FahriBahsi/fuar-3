'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { assetUrl, apiUrl } from '@/lib/utils';

function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      setIsValidToken(true);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setError(data.error || 'Password reset failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <section className="auth-wrapper section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8">
              <div className="auth-card">
                <div className="auth-logo text-center mb-4">
                  <Link href="/">
                    <img
                      src={assetUrl('/images/Logo.png')}
                      alt="Direo"
                      style={{ width: '150px', height: 'auto' }}
                    />
                  </Link>
                </div>
                <div className="text-center">
                  <h4 className="text-danger mb-3">Invalid Reset Link</h4>
                  <p className="text-muted mb-4">
                    The password reset link is invalid or has expired. Please request a new one.
                  </p>
                  <Link href="/auth/login" className="btn btn-primary">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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

              {/* Header */}
              <div className="text-center mb-4">
                <h4>Reset Your Password</h4>
                <p className="text-muted">
                  Enter your new password for <strong>{email}</strong>
                </p>
              </div>

              {/* Form */}
              <div className="auth-form">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-block btn-lg btn-gradient btn-gradient-two"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <Link href="/auth/login" className="text-muted">
                    <i className="la la-arrow-left"></i> Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <section className="auth-wrapper section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-8">
              <div className="auth-card">
                <div className="auth-logo text-center mb-4">
                  <Link href="/">
                    <img
                      src={assetUrl('/images/Logo.png')}
                      alt="Direo"
                      style={{ width: '150px', height: 'auto' }}
                    />
                  </Link>
                </div>
                <div className="text-center">
                  <p className="text-muted">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
