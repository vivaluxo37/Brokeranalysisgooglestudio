import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'info' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

/**
 * Standardized Badge component following the design system.
 * 
 * Variants:
 * - success: Green badge for positive states
 * - info: Blue badge for informational content
 * - warning: Yellow badge for warnings
 * - error: Red badge for errors
 * - neutral: Gray badge for neutral content
 * 
 * @example
 * <StandardBadge variant="success">Verified</StandardBadge>
 * <StandardBadge variant="warning" size="sm">Beta</StandardBadge>
 */
export const StandardBadge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center rounded-full font-medium transition-colors';
  
  const variantStyles = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs'
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <span className={combinedClassName} {...props}>
      {children}
    </span>
  );
};

export default StandardBadge;