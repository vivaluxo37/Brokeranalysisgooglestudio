import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Standardized Input component following the design system.
 * 
 * Features:
 * - Consistent styling across the app
 * - Dark mode support
 * - Focus states with blue ring
 * - Error states
 * - Optional icons
 * - Helper text support
 * 
 * @example
 * <StandardInput 
 *   label="Email" 
 *   type="email" 
 *   placeholder="Enter your email"
 *   error="Invalid email address"
 * />
 */
export const StandardInput = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-base transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  const widthStyle = fullWidth ? 'w-full' : '';
  const paddingWithIcon = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
  
  const combinedClassName = `${baseStyles} ${errorStyles} ${widthStyle} ${paddingWithIcon} ${className}`;
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={combinedClassName}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

StandardInput.displayName = 'StandardInput';

export default StandardInput;