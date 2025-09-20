import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-4xl font-bold">Welcome, {user?.name}!</h1>
      <p className="text-lg text-gray-400 mt-2">This is your personal dashboard.</p>
      
      <div className="mt-8 p-6 bg-card rounded-lg border border-input">
        <h2 className="text-2xl font-semibold">Dashboard Content</h2>
        <p className="mt-4 text-gray-300">
          This area is under construction. Future features will include:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-400">
          <li>Saved favorite brokers</li>
          <li>Past Broker Matcher results</li>
          <li>Account settings management</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;