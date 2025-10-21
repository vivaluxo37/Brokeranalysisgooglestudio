import React from 'react'

import AnalyticsDashboard from '../../components/analytics/AnalyticsDashboard'
import SEOHead from '../../components/seo/SEOHead'

const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Analytics | Admin"
        description="Comprehensive analytics and performance monitoring for the admin dashboard"
      />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor platform performance, engagement trends, and operational metrics.
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <AnalyticsDashboard audience="operational" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalyticsPage
