'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ComponentType } from 'react';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !token) {
        router.push('/login');
      }
    }, [token, isLoading, router]);

    if (isLoading || !token) {
      // You can render a loading spinner here
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
