import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UsersIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../../components/seo/SEOHead';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const stats = [
    {
      name: 'Total Brokers',
      value: '25',
      icon: BuildingOfficeIcon,
      change: '+2',
      changeType: 'increase'
    },
    {
      name: 'Active Users',
      value: '1,234',
      icon: UsersIcon,
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Page Views',
      value: '89.4K',
      icon: ChartBarIcon,
      change: '+5.2%',
      changeType: 'increase'
    },
    {
      name: 'Published Articles',
      value: '156',
      icon: DocumentTextIcon,
      change: '+3',
      changeType: 'increase'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'New broker review published',
      broker: 'IG Markets',
      time: '2 hours ago'
    },
    {
      id: 2,
      action: 'User feedback received',
      broker: 'XM Group',
      time: '4 hours ago'
    },
    {
      id: 3,
      action: 'Broker rating updated',
      broker: 'Plus500',
      time: '6 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Admin Dashboard | BrokerAnalysis"
        description="Administrative dashboard for BrokerAnalysis"
      />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h3>
                <div className="mt-6 flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivity.length - 1 ? (
                            <span
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <DocumentTextIcon className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-900">
                                    {activity.action}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {activity.broker} • {activity.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quick Actions
                </h3>
                <div className="mt-6 space-y-4">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Add New Broker
                  </button>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Publish Article
                  </button>
                  <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    Update Rankings
                  </button>
                  <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                    Manage Reviews
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional sections can be added here */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  System Overview
                </h3>
                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">99.9%</div>
                      <div className="text-sm text-gray-500">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">2.3s</div>
                      <div className="text-sm text-gray-500">Avg Load Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">A+</div>
                      <div className="text-sm text-gray-500">Security Grade</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;