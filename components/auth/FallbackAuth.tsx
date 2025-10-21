import React from 'react'

import { useAuth } from './AuthContext'

interface FallbackAuthProps {
  children: React.ReactNode;
}

/**
 * Fallback authentication component used when Clerk is not available
 * Provides basic authentication state management without external dependencies
 */
const FallbackAuth: React.FC<FallbackAuthProps> = ({ children }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return <>{children}</>
}

export default FallbackAuth
