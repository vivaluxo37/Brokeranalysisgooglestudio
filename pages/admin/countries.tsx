import React from 'react'

import { countries } from '../../data/countries'
import SEOHead from '../../components/seo/SEOHead'

const AdminCountriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Manage Countries | Admin"
        description="Manage supported countries and localized broker experiences for the platform"
      />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Countries</h1>
              <p className="mt-1 text-sm text-gray-500">
                Review supported regions, toggle availability, and configure localization settings.
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Supported Countries</h2>
              <p className="text-sm text-gray-500">Currently listing {countries.length} countries.</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {countries.map((country) => (
                  <div
                    key={country}
                    className="border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:shadow transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{country}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Active</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Localized experience enabled
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCountriesPage
