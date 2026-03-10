'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getAuthCallbackUrl } from '@/lib/utils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onSwitchToForgotPassword }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepSignedIn: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Success - close modal and redirect to dashboard-listings
        onClose();
        router.push('/dashboard-listings');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: getAuthCallbackUrl('/') });
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('facebook', { callbackUrl: getAuthCallbackUrl('/') });
    } catch (error) {
      setError('Facebook sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300); // Wait for animation to finish
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
        id="login_modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="login_modal_label"
        style={{ display: 'block', zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="login_modal_label">
                <i className="la la-lock"></i> Sign In
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
              <form onSubmit={handleSubmit} id="login-form">
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
                <div className="keep_signed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="keep_signed_in"
                    value="1"
                    id="keep_signed_in"
                    checked={formData.keepSignedIn}
                    onChange={(e) =>
                      setFormData({ ...formData, keepSignedIn: e.target.checked })
                    }
                  />
                  <label
                    htmlFor="keep_signed_in"
                    className="not_empty custom-control-label"
                  >
                    Keep me signed in
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-block btn-lg btn-gradient btn-gradient-two"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="form-excerpts">
                <ul className="list-unstyled">
                  <li>
                    Not a member?{' '}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onSwitchToRegister();
                      }}
                    >
                      Sign up
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
                  <span>Or connect with</span>
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

