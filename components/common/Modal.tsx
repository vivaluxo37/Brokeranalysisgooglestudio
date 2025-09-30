import React, { useEffect, useRef, useState, Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'extra-large' | 'full';
  closable?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  centered?: boolean;
  scrollable?: boolean;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'zoom' | 'none';
}

interface ModalHeaderProps {
  title?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

// Modal Header Component
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  onClose,
  showCloseButton = true,
  className = '',
  children
}) => (
  <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${className}`}>
    <div className="flex-1">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      )}
      {children}
    </div>
    {showCloseButton && onClose && (
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md transition-colors"
        aria-label="Close modal"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    )}
  </div>
);

// Modal Body Component
export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className = '',
  scrollable = false
}) => (
  <div className={`p-6 ${scrollable ? 'overflow-y-auto max-h-96' : ''} ${className}`}>
    {children}
  </div>
);

// Modal Footer Component
export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = ''
}) => (
  <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
    {children}
  </div>
);

// Main Modal Component
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closable = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  centered = true,
  scrollable = false,
  animation = 'fade'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Size configurations
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-2xl',
    'extra-large': 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Animation configurations
  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-out';
    
    if (!isVisible) {
      switch (animation) {
        case 'slide-up':
          return `${baseClasses} transform translate-y-full opacity-0`;
        case 'slide-down':
          return `${baseClasses} transform -translate-y-full opacity-0`;
        case 'zoom':
          return `${baseClasses} transform scale-95 opacity-0`;
        case 'none':
          return 'opacity-0';
        default:
          return `${baseClasses} opacity-0`;
      }
    }

    return `${baseClasses} transform translate-y-0 scale-100 opacity-100`;
  };

  // Handle modal opening/closing
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Trigger animation
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      
      // Restore body scroll after animation
      const timer = setTimeout(() => {
        document.body.style.overflow = '';
        setIsAnimating(false);
        
        // Restore focus to the previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, closable, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && isVisible && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen, isVisible]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick && closable) {
      onClose();
    }
  };

  const handleClose = () => {
    if (closable) {
      onClose();
    }
  };

  if (!isOpen && !isAnimating) {
    return null;
  }

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
        } ${overlayClassName}`}
        onClick={handleOverlayClick}
      />

      {/* Modal positioning container */}
      <div className={`
        flex min-h-full items-end justify-center p-4 text-center
        ${centered ? 'sm:items-center' : 'sm:items-start'}
        sm:p-0
      `}>
        {/* Modal content */}
        <div
          ref={modalRef}
          className={`
            relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl
            ${sizeClasses[size]}
            ${getAnimationClasses()}
            ${contentClassName}
            w-full
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <ModalHeader
              title={title}
              onClose={closable ? handleClose : undefined}
              showCloseButton={showCloseButton && closable}
              className={headerClassName}
            />
          )}

          {/* Body */}
          <div className={`${title || showCloseButton ? '' : 'pt-6'}`}>
            <ModalBody
              scrollable={scrollable}
              className={bodyClassName}
            >
              {children}
            </ModalBody>
          </div>

          {/* Footer */}
          {footer && (
            <ModalFooter className={footerClassName}>
              {footer}
            </ModalFooter>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal in a portal
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

// Confirmation Modal
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  loading = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          icon: '⚠️'
        };
      case 'warning':
        return {
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          icon: '⚠️'
        };
      default:
        return {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          icon: 'ℹ️'
        };
    }
  };

  const variantConfig = getVariantClasses();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      closable={!loading}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
          <span className="text-lg">{variantConfig.icon}</span>
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          disabled={loading}
          onClick={handleConfirm}
          className={`
            inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm
            sm:ml-3 sm:w-auto
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${variantConfig.confirmButton}
          `}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            confirmText
          )}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
};

// Hook for modal state management
export const useModal = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};

// Hook for confirmation modal
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Partial<ConfirmModalProps>>({});

  const confirm = (options: Partial<ConfirmModalProps> = {}) => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        ...options,
        onConfirm: () => {
          setIsOpen(false);
          resolve(true);
        },
        onClose: () => {
          setIsOpen(false);
          resolve(false);
        }
      });
      setIsOpen(true);
    });
  };

  const ConfirmModalComponent = () => (
    <ConfirmModal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        config.onClose?.();
      }}
      onConfirm={() => {
        setIsOpen(false);
        config.onConfirm?.();
      }}
      {...config}
    />
  );

  return {
    confirm,
    ConfirmModal: ConfirmModalComponent
  };
};

export default Modal;