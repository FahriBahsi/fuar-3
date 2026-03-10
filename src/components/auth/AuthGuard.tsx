'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard component that protects routes requiring authentication
 * Shows fallback content while loading or redirects to login if not authenticated
 */
export default function AuthGuard({ 
  children, 
  fallback = <div className="auth-loading">Loading...</div>,
  redirectTo = '/auth/login'
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  if (status === 'loading') {
    return <>{fallback}</>;
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect via useEffect
  }

  if (session) {
    return <>{children}</>;
  }

  return null;
}
