import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'elevated';
  children: React.ReactNode;
}

/**
 * Standardized Card component following the design system.
 * 
 * Variants:
 * - default: Basic card with border and shadow
 * - interactive: Card with hover effects for clickable items
 * - elevated: Card with more prominent shadow
 * 
 * @example
 * <StandardCard variant="interactive">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </StandardCard>
 */
export const StandardCard: React.FC<CardProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 transition-all duration-200';
  
  const variantStyles = {
    default: 'shadow-sm',
    interactive: 'shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer',
    elevated: 'shadow-md hover:shadow-lg'
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  as: Component = 'h3', 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <Component className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`} {...props}>
      {children}
    </Component>
  );
};

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`text-base text-gray-600 dark:text-gray-300 ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default StandardCard;