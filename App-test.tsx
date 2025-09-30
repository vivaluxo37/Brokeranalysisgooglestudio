import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Simple test components
function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          BrokerAnalysis Test Page
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          If you're seeing this, the React Router and basic layout are working correctly.
        </p>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Test Features</h2>
          <ul className="space-y-2">
            <li>✅ React is working</li>
            <li>✅ React Router is working</li>
            <li>✅ Tailwind CSS is working</li>
            <li>✅ Basic component rendering is working</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600">Page not found</p>
      </div>
    </div>
  );
}

const TestApp: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SimpleHomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default TestApp;