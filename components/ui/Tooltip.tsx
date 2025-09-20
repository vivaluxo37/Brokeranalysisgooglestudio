import React from 'react';

interface TooltipProps {
  children: React.ReactElement;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top', className = '' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  
  const arrowClasses = {
    top: 'left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-700 dark:border-t-slate-800',
    bottom: 'left-1/2 -translate-x-1/2 top-[-4px] w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-slate-700 dark:border-b-slate-800',
    left: 'right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-slate-700 dark:border-l-slate-800',
    right: 'left-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-slate-700 dark:border-r-slate-800',
  };

  return (
    <div className={`relative inline-flex group ${className}`}>
      {children}
      <div 
        role="tooltip"
        className={`absolute z-20 px-3 py-2 text-sm font-medium text-white bg-slate-700 dark:bg-slate-800 rounded-lg shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${positionClasses[position]}`}
      >
        {content}
        <div className={`absolute ${arrowClasses[position]}`}></div>
      </div>
    </div>
  );
};

export default Tooltip;
