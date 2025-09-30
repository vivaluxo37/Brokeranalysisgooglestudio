import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  user_id: string;
  created_at: string;
  user_email?: string;
}

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'verification' | 'ranking' | 'admin'>('all');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('week');

  useEffect(() => {
    loadActivityLogs();
  }, [filter, timeRange]);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, create mock data since we haven't implemented the verification_logs table yet
      // In a real implementation, this would query the verification_logs table
      const mockLogs: ActivityLog[] = [
        {
          id: '1',
          action: 'verification_updated',
          entity_type: 'broker_country_availability',
          entity_id: 'bca-1',
          details: {
            broker_name: 'IC Markets',
            country_name: 'Germany',
            old_status: false,
            new_status: true,
            confidence: 0.85
          },
          user_id: 'system',
          user_email: 'system@brokeranalysis.com',
          created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          action: 'ranking_weight_changed',
          entity_type: 'ranking_weights',
          entity_id: 'rw-1',
          details: {
            factor: 'regulation',
            old_weight: 0.20,
            new_weight: 0.25
          },
          user_id: 'admin-1',
          user_email: 'admin@brokeranalysis.com',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          action: 'bulk_verification',
          entity_type: 'broker_country_availability',
          entity_id: 'bulk-uk',
          details: {
            country_name: 'United Kingdom',
            verified_count: 15,
            total_count: 20,
            success_rate: 75
          },
          user_id: 'system',
          user_email: 'system@brokeranalysis.com',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          action: 'cache_cleared',
          entity_type: 'cache',
          entity_id: 'category-ecn-brokers',
          details: {
            cache_type: 'category_page',
            category_slug: 'ecn-brokers',
            reason: 'manual_clear'
          },
          user_id: 'admin-1',
          user_email: 'admin@brokeranalysis.com',
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          action: 'content_generated',
          entity_type: 'seo_pages_cache',
          entity_id: 'country-germany-2025',
          details: {
            page_type: 'country_page',
            country_slug: 'germany-2025',
            broker_count: 18,
            generation_time: '0.42s'
          },
          user_id: 'system',
          user_email: 'system@brokeranalysis.com',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Filter logs based on current filters
      let filteredLogs = mockLogs;

      if (filter !== 'all') {
        filteredLogs = mockLogs.filter(log => {
          switch (filter) {
            case 'verification':
              return log.action.includes('verification') || log.entity_type === 'broker_country_availability';
            case 'ranking':
              return log.action.includes('ranking') || log.entity_type === 'ranking_weights';
            case 'admin':
              return log.user_id !== 'system';
            default:
              return true;
          }
        });
      }

      // Filter by time range
      if (timeRange !== 'all') {
        const now = new Date();
        const cutoffTime = new Date();
        
        switch (timeRange) {
          case 'today':
            cutoffTime.setHours(0, 0, 0, 0);
            break;
          case 'week':
            cutoffTime.setDate(now.getDate() - 7);
            break;
          case 'month':
            cutoffTime.setDate(now.getDate() - 30);
            break;
        }

        filteredLogs = filteredLogs.filter(log => 
          new Date(log.created_at) >= cutoffTime
        );
      }

      setLogs(filteredLogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('verification')) {
      return (
        <div className="bg-blue-100 rounded-full p-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    } else if (action.includes('ranking')) {
      return (
        <div className="bg-green-100 rounded-full p-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" />
          </svg>
        </div>
      );
    } else if (action.includes('cache')) {
      return (
        <div className="bg-orange-100 rounded-full p-2">
          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="bg-purple-100 rounded-full p-2">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }
  };

  const formatActionText = (log: ActivityLog) => {
    switch (log.action) {
      case 'verification_updated':
        return `${log.details.broker_name} availability in ${log.details.country_name} updated to ${log.details.new_status ? 'available' : 'unavailable'}`;
      case 'ranking_weight_changed':
        return `${log.details.factor} ranking weight changed from ${(log.details.old_weight * 100).toFixed(0)}% to ${(log.details.new_weight * 100).toFixed(0)}%`;
      case 'bulk_verification':
        return `Bulk verification completed for ${log.details.country_name}: ${log.details.verified_count}/${log.details.total_count} brokers verified`;
      case 'cache_cleared':
        return `Cache cleared for ${log.details.cache_type}: ${log.details.category_slug || log.entity_id}`;
      case 'content_generated':
        return `Content generated for ${log.details.page_type}: ${log.details.country_slug} (${log.details.broker_count} brokers, ${log.details.generation_time})`;
      default:
        return `${log.action.replace('_', ' ')} - ${log.entity_type}`;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link to="/admin" className="text-gray-500 hover:text-gray-700">
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        Activity Logs
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                System Activity Logs
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Type
                  </label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Activities</option>
                    <option value="verification">Verification</option>
                    <option value="ranking">Ranking</option>
                    <option value="admin">Admin Actions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Range
                  </label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="today">Today</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {logs.length} {logs.length === 1 ? 'activity' : 'activities'}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-lg shadow">
          {error && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500">No activity logs found for the selected filters</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    {getActionIcon(log.action)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-900">
                          {formatActionText(log)}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(log.created_at)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">
                          by {log.user_email || log.user_id}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {log.entity_type.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {/* Show additional details for some actions */}
                      {(log.action === 'verification_updated' || log.action === 'ranking_weight_changed') && (
                        <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
                          {JSON.stringify(log.details, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;