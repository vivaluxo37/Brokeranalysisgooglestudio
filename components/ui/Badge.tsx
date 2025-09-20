import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  Icon?: React.ElementType;
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'primary', Icon }) => {
  const variantClasses = {
    primary: 'bg-primary-900/60 text-primary-300',
    success: 'bg-green-900/60 text-green-300',
    warning: 'bg-yellow-900/60 text-yellow-300',
    danger: 'bg-red-900/60 text-red-300',
  };

  const classes = `inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${variantClasses[variant]} ${className}`;
  
  return (
    <span className={classes}>
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
};

export default Badge;
