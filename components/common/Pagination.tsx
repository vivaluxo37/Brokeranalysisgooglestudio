import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showNumbers?: boolean;
  maxNumbers?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact' | 'simple';
  className?: string;
}

interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

interface PageSizeSelectProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  options?: number[];
  disabled?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showNumbers = true,
  maxNumbers = 7,
  size = 'medium',
  variant = 'default',
  className = ''
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      button: 'px-2 py-1 text-xs',
      gap: 'space-x-1'
    },
    medium: {
      button: 'px-3 py-2 text-sm',
      gap: 'space-x-1'
    },
    large: {
      button: 'px-4 py-3 text-base',
      gap: 'space-x-2'
    }
  };

  const config = sizeConfig[size];

  // Generate page numbers to display
  const generatePageNumbers = () => {
    if (totalPages <= maxNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxNumbers / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxNumbers - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxNumbers) {
      start = Math.max(1, end - maxNumbers + 1);
    }

    const pages = [];
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis-start');
      }
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageButton = (page: number | string, key: string | number) => {
    if (typeof page === 'string') {
      return (
        <span
          key={key}
          className={`${config.button} border border-gray-300 bg-white text-gray-500`}
        >
          ...
        </span>
      );
    }

    const isActive = page === currentPage;
    return (
      <button
        key={key}
        onClick={() => handlePageChange(page)}
        className={`${config.button} border font-medium transition-colors ${
          isActive
            ? 'border-blue-500 bg-blue-50 text-blue-600'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        {page}
      </button>
    );
  };

  const renderNavigationButton = (
    onClick: () => void,
    disabled: boolean,
    children: React.ReactNode,
    label: string
  ) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`${config.button} border border-gray-300 bg-white font-medium transition-colors ${
        disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );

  if (totalPages <= 1) {
    return null;
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center ${config.gap} ${className}`}>
        {renderNavigationButton(
          () => handlePageChange(currentPage - 1),
          currentPage === 1,
          <ChevronLeftIcon className="h-4 w-4" />,
          'Previous page'
        )}
        
        <span className={`${config.button} border border-gray-300 bg-gray-50 text-gray-700 font-medium`}>
          {currentPage} of {totalPages}
        </span>
        
        {renderNavigationButton(
          () => handlePageChange(currentPage + 1),
          currentPage === totalPages,
          <ChevronRightIcon className="h-4 w-4" />,
          'Next page'
        )}
      </div>
    );
  }

  // Simple variant
  if (variant === 'simple') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div>
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`${config.button} border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors`}
            >
              Previous
            </button>
          )}
        </div>
        
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        
        <div>
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`${config.button} border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  const pageNumbers = showNumbers ? generatePageNumbers() : [];

  return (
    <div className={`flex items-center ${config.gap} ${className}`}>
      {/* First page button */}
      {showFirstLast && currentPage > 2 && (
        renderNavigationButton(
          () => handlePageChange(1),
          false,
          <ChevronDoubleLeftIcon className="h-4 w-4" />,
          'First page'
        )
      )}

      {/* Previous page button */}
      {showPrevNext && (
        renderNavigationButton(
          () => handlePageChange(currentPage - 1),
          currentPage === 1,
          <ChevronLeftIcon className="h-4 w-4" />,
          'Previous page'
        )
      )}

      {/* Page numbers */}
      {showNumbers && pageNumbers.map((page, index) => renderPageButton(page, index))}

      {/* Next page button */}
      {showPrevNext && (
        renderNavigationButton(
          () => handlePageChange(currentPage + 1),
          currentPage === totalPages,
          <ChevronRightIcon className="h-4 w-4" />,
          'Next page'
        )
      )}

      {/* Last page button */}
      {showFirstLast && currentPage < totalPages - 1 && (
        renderNavigationButton(
          () => handlePageChange(totalPages),
          false,
          <ChevronDoubleRightIcon className="h-4 w-4" />,
          'Last page'
        )
      )}
    </div>
  );
};

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className = ''
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`text-sm text-gray-700 ${className}`}>
      <span>
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </span>
    </div>
  );
};

export const PageSizeSelect: React.FC<PageSizeSelectProps> = ({
  pageSize,
  onPageSizeChange,
  options = [10, 25, 50, 100],
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="page-size" className="text-sm text-gray-700 whitespace-nowrap">
        Show:
      </label>
      <select
        id="page-size"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        disabled={disabled}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-700 whitespace-nowrap">per page</span>
    </div>
  );
};

// Combined pagination component with info and page size selector
export const FullPagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  showInfo?: boolean;
  showPageSize?: boolean;
  paginationProps?: Partial<PaginationProps>;
  className?: string;
}> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showInfo = true,
  showPageSize = true,
  paginationProps = {},
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Left side - Info and page size */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {showInfo && (
          <PaginationInfo
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        )}
        
        {showPageSize && (
          <PageSizeSelect
            pageSize={itemsPerPage}
            onPageSizeChange={onPageSizeChange}
            options={pageSizeOptions}
          />
        )}
      </div>

      {/* Right side - Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          {...paginationProps}
        />
      )}
    </div>
  );
};

// Hook for pagination logic
export const usePagination = (
  totalItems: number,
  initialPageSize: number = 10
) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const getPageData = React.useCallback(<T,>(items: T[]) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  // Reset to first page if current page is out of bounds
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return {
    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    getPageData
  };
};

export default Pagination;