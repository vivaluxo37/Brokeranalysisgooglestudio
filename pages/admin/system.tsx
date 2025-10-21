import React from 'react'

import PerformanceMonitor from '../../components/seo/PerformanceMonitor'
import SEOHead from '../../components/seo/SEOHead'

const SystemStatusPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="System Status | Admin"
        description="Monitor platform health, performance metrics, and system status for the admin dashboard"
      />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
              <p className="mt-1 text-sm text-gray-500">
                Real-time monitoring of platform performance, uptime, and health checks.
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <PerformanceMonitor enableRealTime />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatusPage
