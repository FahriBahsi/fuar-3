'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Next.js Error Boundary for App Router
 * This catches errors at the route level
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="error-page-container">
      <div className="error-page-content">
        <div className="error-page-icon">😵</div>
        
        <h1 className="error-page-title">
          Something Went Wrong
        </h1>
        
        <p className="error-page-message">
          {error.message || 'An unexpected error occurred'}
        </p>
        
        {error.digest && (
          <p className="error-page-digest">
            Error ID: {error.digest}
          </p>
        )}

        <div className="error-page-actions">
          <button
            onClick={reset}
            className="error-page-button"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="error-page-button error-page-button-secondary"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

