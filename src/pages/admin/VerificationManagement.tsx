import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface VerificationRecord {
  id: string;
  broker_id: string;
  country_id: string;
  is_available: boolean;
  confidence: number;
  evidence: string[];
  last_verified: string;
  checked_by: string;
  broker: {
    name: string;
    logo_url?: string;
  };
  country: {
    name: string;
    flag: string;
    slug: string;
  };
}

const VerificationManagement: React.FC = () => {
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadVerificationRecords();
  }, [filter]);

  const loadVerificationRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('broker_country_availability')
        .select(`
          id,
          broker_id,
          country_id,
          is_available,
          confidence,
          evidence,
          last_verified,
          checked_by,
          brokers!inner (
            name,
            logo_url
          ),
          countries!inner (
            name,
            flag,
            slug
          )
        `)
        .order('last_verified', { ascending: false });

      // Apply filters
      if (filter === 'pending') {
        query = query.lt('confidence', 0.8);
      } else if (filter === 'verified') {
        query = query.eq('is_available', true).gte('confidence', 0.8);
      } else if (filter === 'rejected') {
        query = query.eq('is_available', false);
      }

      const { data, error } = await query.limit(100);

      if (error) {
        throw new Error(error.message);
      }

      setRecords(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verification records');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVerification = async (
    recordId: string,
    updates: { is_available?: boolean; confidence?: number }
  ) => {
    try {
      const { error } = await supabase
        .from('broker_country_availability')
        .update({
          ...updates,
          last_verified: new Date().toISOString(),
          checked_by: 'admin'
        })
        .eq('id', recordId);

      if (error) {
        throw new Error(error.message);
      }

      // Reload records
      await loadVerificationRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update verification');
    }
  };

  const handleBulkRecheck = async () => {
    if (selectedRecords.size === 0) return;

    try {
      setLoading(true);
      
      // Call verification API for each selected record
      const promises = Array.from(selectedRecords).map(async (recordId) => {
        const record = records.find(r => r.id === recordId);
        if (!record) return;

        const response = await fetch('/api/verify-country', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            broker_id: record.broker_id,
            country_id: record.country_id,
            force_recheck: true
          })
        });

        return response.json();
      });

      await Promise.all(promises);
      
      // Reload records
      await loadVerificationRecords();
      setSelectedRecords(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to recheck verifications');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      record.broker.name.toLowerCase().includes(searchLower) ||
      record.country.name.toLowerCase().includes(searchLower)
    );
  });

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusBadge = (isAvailable: boolean, confidence: number) => {
    if (isAvailable && confidence >= 0.8) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>;
    } else if (!isAvailable) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

  if (loading && records.length === 0) {
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
                        Verification Management
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                Broker Country Verification
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex space-x-4 mb-4 sm:mb-0">
                <div className="flex rounded-md shadow-sm">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'verified', label: 'Verified' },
                    { key: 'rejected', label: 'Rejected' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key as any)}
                      className={`px-4 py-2 text-sm font-medium border ${
                        filter === key
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      } ${key === 'all' ? 'rounded-l-md' : key === 'rejected' ? 'rounded-r-md border-l-0' : 'border-l-0'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search broker or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {selectedRecords.size > 0 && (
                  <button
                    onClick={handleBulkRecheck}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Recheck Selected ({selectedRecords.size})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedRecords.size === filteredRecords.length && filteredRecords.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRecords(new Set(filteredRecords.map(r => r.id)));
                        } else {
                          setSelectedRecords(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Broker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Checked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedRecords.has(record.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedRecords);
                          if (e.target.checked) {
                            newSelected.add(record.id);
                          } else {
                            newSelected.delete(record.id);
                          }
                          setSelectedRecords(newSelected);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {record.broker.logo_url && (
                          <img 
                            className="h-8 w-8 rounded-full mr-3" 
                            src={record.broker.logo_url} 
                            alt={`${record.broker.name} logo`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {record.broker.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{record.country.flag}</span>
                        <div className="text-sm text-gray-900">
                          {record.country.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.is_available, record.confidence)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(record.confidence)}`}>
                        {(record.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.last_verified).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateVerification(record.id, { 
                            is_available: true, 
                            confidence: 0.9 
                          })}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as verified"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleUpdateVerification(record.id, { 
                            is_available: false, 
                            confidence: 0.9 
                          })}
                          className="text-red-600 hover:text-red-900"
                          title="Mark as rejected"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && !loading && (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">No verification records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationManagement;