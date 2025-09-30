import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const PageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header skeleton */}
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>

    {/* Content skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-128 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <Skeleton className="h-12 w-12 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const BrokerCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center mb-4">
      <Skeleton className="w-12 h-12 rounded-lg mr-3" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    
    <div className="flex items-center justify-between mb-3">
      <div className="flex space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-4" />
        ))}
      </div>
      <Skeleton className="h-6 w-12" />
    </div>
    
    <div className="space-y-2 mb-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    
    <div className="flex space-x-2">
      <Skeleton className="flex-1 h-10" />
      <Skeleton className="flex-1 h-10" />
    </div>
  </div>
);

export const CategoryGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
          <Skeleton className="w-10 h-10 rounded mr-3" />
          <div className="flex-1">
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <Skeleton className="h-6 w-48" />
    </div>
    
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-6 py-3">
              <Skeleton className="h-4 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const AdminDashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 border-2 border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton className="w-8 h-8 mb-2" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <Skeleton className="h-6 w-48 mb-6" />
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
    <div className="flex justify-end space-x-3 mt-6">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-6 w-32" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
    
    {/* Chart area */}
    <div className="relative h-64 mb-4">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-right pr-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
      
      {/* Chart bars */}
      <div className="ml-12 h-full flex items-end justify-between space-x-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className={`w-8 bg-gradient-to-t from-gray-200 to-gray-100`} style={{ height: `${Math.random() * 80 + 20}%` }} />
        ))}
      </div>
    </div>
    
    {/* X-axis labels */}
    <div className="ml-12 flex justify-between">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-8" />
      ))}
    </div>
  </div>
);

// Loading states for specific components
export const CountryPageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Breadcrumbs */}
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 py-4 text-sm">
          <Skeleton className="h-4 w-12" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-20" />
          <span className="text-gray-400">/</span>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </nav>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Country Hero */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center mb-6">
          <Skeleton className="text-6xl mr-4 w-16 h-16" />
          <div className="text-left">
            <Skeleton className="h-12 w-96 mb-2" />
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        
        <Skeleton className="h-6 w-4/5 mx-auto mb-8" />

        {/* Verification Stats */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <TableSkeleton rows={10} columns={7} />

      {/* Broker Cards */}
      <div className="grid gap-6 lg:gap-8 mt-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <BrokerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;