'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { getAuthCallbackUrl, apiUrl } from '@/lib/utils';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSwitchToForgotPassword?: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, onSwitchToForgotPassword }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Start animation after a small delay
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

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
      const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Account created successfully! Signing you in...');
        
        // Auto-login the user after successful registration
        try {
          const signInResult = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false,
          });

          if (signInResult?.error) {
            // If auto-login fails, show message and switch to login modal
            setSuccess('Account created successfully! Please sign in.');
            setTimeout(() => {
              onClose();
              onSwitchToLogin();
            }, 2000);
          } else {
            // Auto-login successful - redirect to dashboard-listings
            setSuccess('Account created successfully! Redirecting to dashboard...');
            setTimeout(() => {
              onClose();
              router.push('/dashboard-listings');
            }, 1500);
          }
        } catch (autoLoginError) {
          // If auto-login fails, show message and switch to login modal
          setSuccess('Account created successfully! Please sign in.');
          setTimeout(() => {
            onClose();
            onSwitchToLogin();
          }, 2000);
        }
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300); // Wait for animation to finish
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: getAuthCallbackUrl('/dashboard-listings') });
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('facebook', { callbackUrl: getAuthCallbackUrl('/dashboard-listings') });
    } catch (error) {
      setError('Facebook sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className={`modal-backdrop fade ${isAnimating ? 'show' : ''}`}
        onClick={handleClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className={`modal fade ${isAnimating ? 'show' : ''}`}
        id="signup_modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="signup_modal_label"
        style={{ display: 'block', zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="signup_modal_label">
                <i className="la la-lock"></i> Sign Up
              </h5>
              <button
                type="button"
                className="close"
                onClick={handleClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
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
              <form onSubmit={handleSubmit} id="signup-form">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
                <button
                  type="submit"
                  className="btn btn-block btn-lg btn-gradient btn-gradient-two"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <div className="form-excerpts">
                <ul className="list-unstyled">
                  <li>
                    Already a member?{' '}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onSwitchToLogin();
                      }}
                    >
                      Sign In
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onSwitchToForgotPassword) {
                          handleClose();
                          setTimeout(() => onSwitchToForgotPassword(), 300);
                        }
                      }}
                    >
                      Recover Password
                    </a>
                  </li>
                </ul>
                <div className="social-login">
                  <span>Or Signup with</span>
                  <p>
                    <a href="#" className="btn btn-outline-secondary" onClick={(e) => { e.preventDefault(); handleFacebookSignIn(); }}>
                      <i className="fab fa-facebook-f"></i> Facebook
                    </a>
                    <a href="#" className="btn btn-outline-danger" onClick={(e) => { e.preventDefault(); handleGoogleSignIn(); }}>
                      <i className="fab fa-google-plus-g"></i> Google
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

