import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  BuildingStorefrontIcon,
  TagIcon,
  FlagIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalBrokers: number;
  activeBrokers: number;
  totalCategories: number;
  totalCountries: number;
  totalUsers: number;
  recentActivity: number;
}

interface RecentActivity {
  id: string;
  type: 'broker_added' | 'broker_updated' | 'category_created' | 'user_registered';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
}

const AdminDashboard: React.FC = () => {
  const [stats] = useState<DashboardStats>({
    totalBrokers: 156,
    activeBrokers: 142,
    totalCategories: 12,
    totalCountries: 45,
    totalUsers: 1249,
    recentActivity: 23
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'broker_added',
      title: 'New broker added',
      description: 'XTrade Markets was added to the directory',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      user: 'Admin'
    },
    {
      id: '2',
      type: 'broker_updated',
      title: 'Broker updated',
      description: 'IG Group information was updated',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      user: 'Editor'
    },
    {
      id: '3',
      type: 'category_created',
      title: 'Category created',
      description: 'New category "Crypto-focused" was created',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      user: 'Admin'
    },
    {
      id: '4',
      type: 'user_registered',
      title: 'New user registered',
      description: 'john.doe@example.com registered',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      user: 'System'
    }
  ]);

  const getActivityIcon = (type: RecentActivity['type']) => {
    const className = "h-5 w-5";
    switch (type) {
      case 'broker_added':
        return <PlusIcon className={`${className} text-green-600`} />;
      case 'broker_updated':
        return <PencilIcon className={`${className} text-blue-600`} />;
      case 'category_created':
        return <TagIcon className={`${className} text-purple-600`} />;
      case 'user_registered':
        return <UserGroupIcon className={`${className} text-gray-600`} />;
      default:
        return <ChartBarIcon className={`${className} text-gray-600`} />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - Broker Analysis</title>
        <meta name="description" content="Admin dashboard for managing brokers and content" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage brokers, categories, and content
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <CogIcon className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Site
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Brokers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBrokers}</p>
                  <p className="text-sm text-green-600">{stats.activeBrokers} active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TagIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FlagIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Countries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCountries}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-8 w-8 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      href="/admin/brokers"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <BuildingStorefrontIcon className="h-8 w-8 text-blue-600 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Manage Brokers</h3>
                        <p className="text-sm text-gray-500">Add, edit, and manage broker listings</p>
                      </div>
                    </Link>

                    <Link
                      href="/admin/categories"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <TagIcon className="h-8 w-8 text-purple-600 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Manage Categories</h3>
                        <p className="text-sm text-gray-500">Organize broker categories</p>
                      </div>
                    </Link>

                    <Link
                      href="/admin/countries"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FlagIcon className="h-8 w-8 text-green-600 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Manage Countries</h3>
                        <p className="text-sm text-gray-500">Update country information</p>
                      </div>
                    </Link>

                    <Link
                      href="/admin/analytics"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ChartBarIcon className="h-8 w-8 text-orange-600 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">Analytics</h3>
                        <p className="text-sm text-gray-500">View site statistics and reports</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <span>{activity.user}</span>
                            <span className="mx-1">•</span>
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/admin/activity"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all activity →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">System Status</h3>
                <p className="mt-1 text-sm text-blue-700">
                  All systems are operational. Database last updated 2 minutes ago.
                  {' '}<Link href="/admin/system" className="font-medium underline">View details</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;