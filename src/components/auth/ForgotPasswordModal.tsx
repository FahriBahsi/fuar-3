'use client';

import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/utils';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordModal({ 
  isOpen, 
  onClose, 
  onSwitchToLogin 
}: ForgotPasswordModalProps) {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
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

    try {
      const response = await fetch(apiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password reset link sent to your email!');
        setTimeout(() => {
          onClose();
          onSwitchToLogin();
        }, 3000);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className={`modal-backdrop ${isAnimating ? 'show' : ''}`}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className={`modal ${isAnimating ? 'show' : ''}`} tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <span className="la la-key"></span> Forgot Password
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

            {/* Modal Body */}
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

              <div className="text-center mb-4">
                <p className="text-muted">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} id="forgot-password-form" className={isLoading ? 'form-loading' : ''}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-block btn-lg btn-gradient btn-gradient-two"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Sending Reset Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="form-excerpts">
                <p>
                  Remember your password?{' '}
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      onSwitchToLogin();
                    }}
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .modal-backdrop.show {
          opacity: 1;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1050;
          display: none;
          overflow: hidden;
          outline: 0;
        }

        .modal.show {
          display: block !important;
        }

        .modal-dialog {
          position: relative;
          width: auto;
          margin: 0.5rem;
          pointer-events: none;
          transform: translateY(-50px);
          transition: transform 0.3s ease-out;
        }

        .modal.show .modal-dialog {
          transform: translateY(0);
        }

        .modal-content {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          pointer-events: auto;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 0.3rem;
          outline: 0;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1rem 1rem;
          border-bottom: 1px solid #dee2e6;
          border-top-left-radius: calc(0.3rem - 1px);
          border-top-right-radius: calc(0.3rem - 1px);
        }

        .modal-title {
          margin-bottom: 0;
          line-height: 1.5;
          font-size: 1.25rem;
          font-weight: 500;
        }

        .close {
          padding: 1rem 1rem;
          margin: -1rem -1rem -1rem auto;
          background: transparent;
          border: 0;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
          color: #000;
          text-shadow: 0 1px 0 #fff;
          opacity: 0.5;
          cursor: pointer;
        }

        .close:hover {
          opacity: 0.75;
        }

        .modal-body {
          position: relative;
          flex: 1 1 auto;
          padding: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-control {
          display: block;
          width: 100%;
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #495057;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #ced4da;
          border-radius: 0.25rem;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .form-control:focus {
          color: #495057;
          background-color: #fff;
          border-color: #80bdff;
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0.5rem 1rem !important;
          font-size: 1rem !important;
          line-height: 1.5 !important;
          border-radius: 0.25rem !important;
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
        }

        .btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-block {
          display: block;
          width: 100%;
        }

        .btn-lg {
          padding: 0.5rem 1rem;
          font-size: 1.25rem;
          line-height: 1.5;
          border-radius: 0.3rem;
        }

        

        .spinner-border {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          vertical-align: text-bottom;
          border: 0.125em solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border 0.75s linear infinite;
        }

        .spinner-border-sm {
          width: 0.875rem;
          height: 0.875rem;
          border-width: 0.1em;
        }

        @keyframes spinner-border {
          to {
            transform: rotate(360deg);
          }
        }

        .mr-2 {
          margin-right: 0.5rem !important;
        }

        .form-loading {
          opacity: 0.7;
          pointer-events: none;
        }

        .form-loading .form-control {
          background-color: #f8f9fa;
        }

        .alert {
          position: relative;
          padding: 0.75rem 1.25rem;
          margin-bottom: 1rem;
          border: 1px solid transparent;
          border-radius: 0.25rem;
        }

        .alert-danger {
          color: #721c24;
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }

        .alert-success {
          color: #155724;
          background-color: #d4edda;
          border-color: #c3e6cb;
        }

        .form-excerpts {
          margin-top: 1rem;
          text-align: center;
        }

        .form-excerpts p {
          margin-bottom: 0;
          color: #6c757d;
        }

        .form-excerpts a {
          color: #007bff;
          text-decoration: none;
        }

        .form-excerpts a:hover {
          text-decoration: underline;
        }

        @media (min-width: 576px) {
          .modal-dialog {
            max-width: 500px;
            margin: 1.75rem auto;
          }
        }
      `}</style>
    </>
  );
}