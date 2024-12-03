import React from 'react';
import { useUserStore } from '../store/useUserStore';
import { LoginPrompt } from './LoginPrompt';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const userId = useUserStore((state) => state.id);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LoginPrompt />
      </div>
    );
  }

  return <>{children}</>;
}