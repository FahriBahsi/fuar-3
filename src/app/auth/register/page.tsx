'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';

export default function RegisterPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (session) {
      router.push('/dashboard-listings');
    }
  }, [session, status, router]);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    router.push('/');
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="auth-page-loading">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="auth-container">
              <div className="text-center mb-4">
                <h2>Create Account</h2>
                <p className="text-muted">Join our community today</p>
              </div>
              
              <div className="auth-buttons">
                <button 
                  className="btn btn-primary btn-lg w-100 mb-3"
                  onClick={() => setShowRegister(true)}
                >
                  <i className="la la-user-plus"></i> Sign Up
                </button>
                
                <div className="text-center">
                  <p className="text-muted">Already have an account?</p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setShowLogin(true)}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={handleCloseLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />
      
      <RegisterModal
        isOpen={showRegister}
        onClose={handleCloseRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}
