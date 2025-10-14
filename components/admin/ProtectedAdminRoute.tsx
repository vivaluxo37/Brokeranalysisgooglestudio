import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const location = useLocation();

  // DEV BYPASS: Allow admin access with localStorage token when VITE_DEV_ADMIN_BYPASS is enabled
  const devAdminBypass = import.meta.env.VITE_DEV_ADMIN_BYPASS === 'true';
  const hasDevAdminToken = typeof window !== 'undefined' && localStorage.getItem('admin_token') === 'mock-admin-token';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Check for dev bypass first
  if (devAdminBypass && hasDevAdminToken) {
    return <>{children}</>;
  }

  if (!user) {
    // Redirect to login with return URL
    return <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin) {
    // User is logged in but not an admin
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Go Back
            </button>
            <p className="text-sm text-gray-500">
              Contact your administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;