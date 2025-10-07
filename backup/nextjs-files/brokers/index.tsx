import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../../../components/common/Loading';
import Pagination, { usePagination } from '../../../components/common/Pagination';

interface Broker {
  id: string;
  name: string;
  slug: string;
  logo: string;
  status: 'active' | 'inactive' | 'pending';
  regulation: string[];
  founded: number;
  headquarters: string;
  minDeposit: number;
  maxLeverage: string;
  rating: number;
  reviewCount: number;
  lastUpdated: Date;
}

interface BrokerFilters {
  search: string;
  status: string;
  regulation: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const AdminBrokers: React.FC = () => {
  const router = useRouter();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([]);
  const [filters, setFilters] = useState<BrokerFilters>({
    search: '',
    status: '',
    regulation: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    getPageData
  } = usePagination(brokers.length, 20);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockBrokers: Broker[] = [
      {
        id: '1',
        name: 'IG Group',
        slug: 'ig-group',
        logo: '/images/brokers/ig-group.png',
        status: 'active',
        regulation: ['FCA', 'ASIC'],
        founded: 1974,
        headquarters: 'London, UK',
        minDeposit: 250,
        maxLeverage: '1:200',
        rating: 4.5,
        reviewCount: 1234,
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Plus500',
        slug: 'plus500',
        logo: '/images/brokers/plus500.png',
        status: 'active',
        regulation: ['FCA', 'CySEC'],
        founded: 2008,
        headquarters: 'London, UK',
        minDeposit: 100,
        maxLeverage: '1:300',
        rating: 4.2,
        reviewCount: 856,
        lastUpdated: new Date(Date.now() - 48 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'XM Global',
        slug: 'xm-global',
        logo: '/images/brokers/xm-global.png',
        status: 'pending',
        regulation: ['CySEC', 'IFSC'],
        founded: 2009,
        headquarters: 'Cyprus',
        minDeposit: 5,
        maxLeverage: '1:888',
        rating: 4.0,
        reviewCount: 672,
        lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setBrokers(mockBrokers);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: Broker['status']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleSelectBroker = (brokerId: string) => {
    setSelectedBrokers(prev => 
      prev.includes(brokerId) 
        ? prev.filter(id => id !== brokerId)
        : [...prev, brokerId]
    );
  };

  const handleSelectAll = () => {
    const visibleBrokerIds = getPageData(brokers).map(broker => broker.id);
    setSelectedBrokers(prev => 
      prev.length === visibleBrokerIds.length 
        ? []
        : visibleBrokerIds
    );
  };

  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDeleteSelected = async () => {
    if (selectedBrokers.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedBrokers.length} broker(s)?`)) {
      // In real app, make API call here
      setBrokers(prev => prev.filter(broker => !selectedBrokers.includes(broker.id)));
      setSelectedBrokers([]);
    }
  };

  const filteredBrokers = brokers.filter(broker => {
    const matchesSearch = broker.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         broker.headquarters.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || broker.status === filters.status;
    const matchesRegulation = !filters.regulation || 
                             broker.regulation.some(reg => reg.includes(filters.regulation));
    
    return matchesSearch && matchesStatus && matchesRegulation;
  }).sort((a, b) => {
    const modifier = filters.sortOrder === 'asc' ? 1 : -1;
    
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name) * modifier;
      case 'rating':
        return (a.rating - b.rating) * modifier;
      case 'founded':
        return (a.founded - b.founded) * modifier;
      case 'lastUpdated':
        return (a.lastUpdated.getTime() - b.lastUpdated.getTime()) * modifier;
      default:
        return 0;
    }
  });

  const paginatedBrokers = getPageData(filteredBrokers);

  const SortIcon = ({ field }: { field: string }) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' 
      ? <ArrowUpIcon className="h-4 w-4 ml-1" />
      : <ArrowDownIcon className="h-4 w-4 ml-1" />;
  };

  return (
    <>
      <Head>
        <title>Manage Brokers - Admin Dashboard</title>
        <meta name="description" content="Manage broker listings and information" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-4">
                    <li>
                      <Link href="/admin" className="text-gray-400 hover:text-gray-500">
                        Admin
                      </Link>
                    </li>
                    <li className="flex items-center">
                      <span className="text-gray-400 mx-4">/</span>
                      <span className="text-gray-900 font-medium">Brokers</span>
                    </li>
                  </ol>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">Manage Brokers</h1>
              </div>
              <Link
                href="/admin/brokers/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Broker
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search brokers..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={filters.regulation}
                  onChange={(e) => setFilters(prev => ({ ...prev, regulation: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Regulations</option>
                  <option value="FCA">FCA</option>
                  <option value="CySEC">CySEC</option>
                  <option value="ASIC">ASIC</option>
                  <option value="IFSC">IFSC</option>
                </select>

                <div className="flex items-center space-x-2">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {filteredBrokers.length} broker(s)
                  </span>
                </div>
              </div>
            </div>

            {selectedBrokers.length > 0 && (
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedBrokers.length} broker(s) selected
                  </span>
                  <button
                    onClick={handleDeleteSelected}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <LoadingSpinner size="large" />
                <p className="mt-2 text-gray-500">Loading brokers...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedBrokers.length === paginatedBrokers.length && paginatedBrokers.length > 0}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            Broker
                            <SortIcon field="name" />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Regulation
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('rating')}
                        >
                          <div className="flex items-center">
                            Rating
                            <SortIcon field="rating" />
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('lastUpdated')}
                        >
                          <div className="flex items-center">
                            Last Updated
                            <SortIcon field="lastUpdated" />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedBrokers.map((broker) => (
                        <tr key={broker.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedBrokers.includes(broker.id)}
                              onChange={() => handleSelectBroker(broker.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">
                                    {broker.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {broker.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {broker.headquarters} • Founded {broker.founded}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusBadge(broker.status)}>
                              {broker.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {broker.regulation.join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1 text-sm text-gray-900">
                                  {broker.rating}
                                </span>
                              </div>
                              <span className="ml-2 text-sm text-gray-500">
                                ({broker.reviewCount})
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(broker.lastUpdated)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                href={`/brokers/${broker.slug}`}
                                className="text-gray-400 hover:text-gray-500"
                                title="View"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/admin/brokers/${broker.id}/edit`}
                                className="text-blue-600 hover:text-blue-700"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete ${broker.name}?`)) {
                                    setBrokers(prev => prev.filter(b => b.id !== broker.id));
                                  }
                                }}
                                className="text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBrokers;