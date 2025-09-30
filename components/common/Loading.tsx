import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  transparent?: boolean;
  spinnerSize?: 'small' | 'medium' | 'large';
  className?: string;
  children?: React.ReactNode;
}

interface LoadingButtonProps {
  loading: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loadingText?: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

interface LoadingCardProps {
  showImage?: boolean;
  showTitle?: boolean;
  showText?: boolean;
  lines?: number;
  className?: string;
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

// Basic loading spinner
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  return (
    <ArrowPathIcon 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};

// Loading overlay
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  message = 'Loading...',
  transparent = false,
  spinnerSize = 'medium',
  className = '',
  children
}) => {
  if (!show && !children) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      {show && (
        <div className={`absolute inset-0 flex items-center justify-center z-50 ${
          transparent ? 'bg-white/60' : 'bg-white'
        }`}>
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size={spinnerSize} />
            {message && (
              <p className="text-sm text-gray-600 font-medium">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Loading button
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  loadingText = 'Loading...',
  className = '',
  onClick,
  children
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const spinnerSizes = {
    small: 'small' as const,
    medium: 'small' as const,
    large: 'medium' as const
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <>
          <LoadingSpinner 
            size={spinnerSizes[size]} 
            color="white" 
            className="mr-2" 
          />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Skeleton loader
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  lines = 1,
  animation = 'pulse',
  className = ''
}) => {
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could implement wave animation if needed
    none: ''
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      case 'rectangular':
        return 'rounded-none';
      default:
        return 'rounded';
    }
  };

  const getHeight = () => {
    if (height) return height;
    switch (variant) {
      case 'text':
        return '1rem';
      case 'circular':
        return width;
      default:
        return '2rem';
    }
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`bg-gray-200 ${getVariantClasses()} ${animationClasses[animation]}`}
            style={{
              width: index === lines - 1 ? '75%' : width,
              height: getHeight()
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-200 ${getVariantClasses()} ${animationClasses[animation]} ${className}`}
      style={{ width, height: getHeight() }}
    />
  );
};

// Loading card skeleton
export const LoadingCard: React.FC<LoadingCardProps> = ({
  showImage = true,
  showTitle = true,
  showText = true,
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {showImage && (
        <Skeleton variant="rectangular" height="12rem" />
      )}
      <div className="p-4 space-y-3">
        {showTitle && (
          <Skeleton variant="text" height="1.5rem" width="75%" />
        )}
        {showText && (
          <Skeleton variant="text" lines={lines} />
        )}
      </div>
    </div>
  );
};

// Loading table skeleton
export const LoadingTable: React.FC<LoadingTableProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = ''
}) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {showHeader && (
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <Skeleton height="1rem" width="80%" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton height="1rem" width="90%" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Loading dots animation
export const LoadingDots: React.FC<{
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'gray';
  className?: string;
}> = ({
  size = 'medium',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    small: 'h-1 w-1',
    medium: 'h-1.5 w-1.5',
    large: 'h-2 w-2'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    gray: 'bg-gray-400'
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

// Loading bar/progress
export const LoadingBar: React.FC<{
  progress?: number;
  indeterminate?: boolean;
  height?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  backgroundColor?: string;
  className?: string;
}> = ({
  progress = 0,
  indeterminate = false,
  height = '0.5rem',
  color = 'primary',
  backgroundColor = 'bg-gray-200',
  className = ''
}) => {
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  return (
    <div 
      className={`${backgroundColor} rounded-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <div
        className={`${colorClasses[color]} rounded-full transition-all duration-300 ease-out ${
          indeterminate ? 'animate-pulse' : ''
        }`}
        style={{
          width: indeterminate ? '100%' : `${Math.max(0, Math.min(100, progress))}%`,
          height: '100%'
        }}
      />
    </div>
  );
};

// Shimmer effect wrapper
export const ShimmerWrapper: React.FC<{
  children: React.ReactNode;
  loading: boolean;
  lines?: number;
  className?: string;
}> = ({
  children,
  loading,
  lines = 3,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={className}>
        <Skeleton variant="text" lines={lines} />
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

// Loading states for specific components
export const LoadingBrokerCard = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-6 space-y-4">
      <div className="flex items-start space-x-4">
        <Skeleton variant="circular" width="4rem" height="4rem" />
        <div className="flex-1 space-y-2">
          <Skeleton height="1.5rem" width="60%" />
          <Skeleton height="1rem" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={2} />
      <div className="flex space-x-2">
        <Skeleton height="2rem" width="5rem" />
        <Skeleton height="2rem" width="5rem" />
      </div>
    </div>
  </div>
);

export const LoadingBrokerList = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <LoadingBrokerCard key={index} />
    ))}
  </div>
);

export default LoadingSpinner;