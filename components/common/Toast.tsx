import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
  defaultDuration?: number;
}

interface ToastComponentProps {
  toast: Toast;
  onRemove: (id: string) => void;
  position: string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast component
const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onRemove, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.persistent) return;

    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      handleRemove();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.persistent, toast.duration]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Match the exit animation duration
  };

  const getIcon = () => {
    const iconClass = "h-5 w-5";
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircleIcon className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-500`} />;
      case 'info':
        return <InformationCircleIcon className={`${iconClass} text-blue-500`} />;
      default:
        return <InformationCircleIcon className={`${iconClass} text-gray-500`} />;
    }
  };

  const getColorClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-out';
    const isRightSide = position.includes('right');
    const isLeftSide = position.includes('left');
    
    if (isLeaving) {
      if (isRightSide) {
        return `${baseClasses} transform translate-x-full opacity-0`;
      } else if (isLeftSide) {
        return `${baseClasses} transform -translate-x-full opacity-0`;
      } else {
        return `${baseClasses} transform translate-y-2 opacity-0`;
      }
    }
    
    if (isVisible) {
      return `${baseClasses} transform translate-x-0 translate-y-0 opacity-100`;
    }
    
    // Initial state
    if (isRightSide) {
      return `${baseClasses} transform translate-x-full opacity-0`;
    } else if (isLeftSide) {
      return `${baseClasses} transform -translate-x-full opacity-0`;
    } else {
      return `${baseClasses} transform translate-y-2 opacity-0`;
    }
  };

  return (
    <div
      className={`
        w-full max-w-sm overflow-hidden rounded-lg border shadow-lg
        ${getColorClasses()}
        ${getAnimationClasses()}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {toast.title}
            </p>
            {toast.message && (
              <p className="mt-1 text-sm text-gray-700">
                {toast.message}
              </p>
            )}
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleRemove}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast container
const ToastContainer: React.FC<{
  toasts: Toast[];
  onRemove: (id: string) => void;
  position: string;
}> = ({ toasts, onRemove, position }) => {
  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50 pointer-events-none';
    switch (position) {
      case 'top-right':
        return `${baseClasses} top-4 right-4`;
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'top-center':
        return `${baseClasses} top-4 left-1/2 transform -translate-x-1/2`;
      case 'bottom-center':
        return `${baseClasses} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  const isBottomPosition = position.includes('bottom');

  return (
    <div className={getPositionClasses()}>
      <div className={`space-y-2 ${isBottomPosition ? 'flex flex-col-reverse' : ''}`}>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent
              toast={toast}
              onRemove={onRemove}
              position={position}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Toast provider
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 6,
  defaultDuration = 5000
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toastData: Omit<Toast, 'id'>): string => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      duration: defaultDuration,
      ...toastData
    };

    setToasts((prevToasts) => {
      const newToasts = [toast, ...prevToasts];
      // Limit the number of toasts
      return newToasts.slice(0, maxToasts);
    });

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearToasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
        position={position}
      />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Convenience hook with pre-configured toast methods
export const useToastHelpers = () => {
  const { addToast, removeToast, clearToasts } = useToast();

  const toast = {
    success: (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({
        type: 'success',
        title,
        message,
        ...options
      });
    },
    error: (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({
        type: 'error',
        title,
        message,
        ...options
      });
    },
    warning: (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({
        type: 'warning',
        title,
        message,
        ...options
      });
    },
    info: (title: string, message?: string, options?: Partial<Toast>) => {
      return addToast({
        type: 'info',
        title,
        message,
        ...options
      });
    },
    custom: (data: Omit<Toast, 'id'>) => {
      return addToast(data);
    },
    remove: removeToast,
    clear: clearToasts
  };

  return toast;
};

// Simple toast component for one-off usage (without provider)
export const SimpleToast: React.FC<{
  show: boolean;
  type: Toast['type'];
  title: string;
  message?: string;
  onClose: () => void;
  className?: string;
}> = ({ show, type, title, message, onClose, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  const getIcon = () => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircleIcon className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-500`} />;
      case 'info':
        return <InformationCircleIcon className={`${iconClass} text-blue-500`} />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
    }
  };

  if (!show && !isVisible) {
    return null;
  }

  return (
    <div
      className={`
        w-full max-w-sm overflow-hidden rounded-lg border shadow-lg
        transition-all duration-300 ease-out
        ${getColorClasses()}
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${className}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {title}
            </p>
            {message && (
              <p className="mt-1 text-sm text-gray-700">
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast notification functions for imperative usage
let toastCounter = 0;
const createToastId = () => `toast-${++toastCounter}`;

export const showToast = (toast: Omit<Toast, 'id'>) => {
  // This is a placeholder for imperative usage
  // In a real implementation, this would need to interact with a global toast manager
  console.warn('showToast requires ToastProvider to be set up in your app tree');
  return createToastId();
};

// Export Toast type for external usage
export type { Toast as ToastType };

export default ToastProvider;