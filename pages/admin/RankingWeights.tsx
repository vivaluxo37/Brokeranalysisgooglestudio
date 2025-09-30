import React from 'react';
import SEOHead from '../../components/seo/SEOHead';

const RankingWeights: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Ranking Weights | Admin"
        description="Manage ranking weights and scoring algorithms"
      />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Ranking Weights</h1>
          
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600">
              This page will contain tools to manage ranking weights and scoring algorithms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingWeights;