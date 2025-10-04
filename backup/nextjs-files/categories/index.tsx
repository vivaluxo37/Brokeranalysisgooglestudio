import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  TagIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../../../components/common/Loading';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  brokerCount: number;
  status: 'active' | 'inactive';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Forex Brokers',
        slug: 'forex-brokers',
        description: 'Brokers specializing in foreign exchange trading',
        brokerCount: 45,
        status: 'active',
        featured: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'CFD Trading',
        slug: 'cfd-trading',
        description: 'Contract for Difference trading platforms',
        brokerCount: 32,
        status: 'active',
        featured: true,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Digital currency trading platforms',
        brokerCount: 28,
        status: 'active',
        featured: false,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        name: 'Stock Trading',
        slug: 'stock-trading',
        description: 'Equity and stock trading brokers',
        brokerCount: 38,
        status: 'active',
        featured: true,
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        name: 'Options Trading',
        slug: 'options-trading',
        description: 'Options and derivatives trading platforms',
        brokerCount: 15,
        status: 'inactive',
        featured: false,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusBadge = (status: Category['status']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
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

  const handleToggleFeatured = (categoryId: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, featured: !category.featured }
          : category
      )
    );
  };

  const handleToggleStatus = (categoryId: string) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, status: category.status === 'active' ? 'inactive' : 'active' }
          : category
      )
    );
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      setCategories(prev => prev.filter(category => category.id !== categoryId));
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || category.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Head>
        <title>Manage Categories - Admin Dashboard</title>
        <meta name="description" content="Manage broker categories and organization" />
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
                      <span className="text-gray-900 font-medium">Categories</span>
                    </li>
                  </ol>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">Manage Categories</h1>
              </div>
              <Link
                href="/admin/categories/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Category
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex items-center justify-end">
                <span className="text-sm text-gray-500">
                  {filteredCategories.length} of {categories.length} categories
                </span>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <LoadingSpinner size="large" />
              <p className="mt-2 text-gray-500">Loading categories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <TagIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {category.brokerCount} brokers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={getStatusBadge(category.status)}>
                          {category.status}
                        </span>
                        {category.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Created: {formatDate(category.createdAt)}</span>
                      <span>Updated: {formatDate(category.updatedAt)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleStatus(category.id)}
                          className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                            category.status === 'active'
                              ? 'text-red-700 bg-red-100 hover:bg-red-200'
                              : 'text-green-700 bg-green-100 hover:bg-green-200'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          {category.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(category.id)}
                          className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                            category.featured
                              ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                              : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                          {category.featured ? 'Unfeature' : 'Feature'}
                        </button>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/categories/${category.slug}`}
                          className="text-gray-400 hover:text-gray-500"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredCategories.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first category.'
                }
              </p>
              {!searchTerm && !statusFilter && (
                <Link
                  href="/admin/categories/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Category
                </Link>
              )}
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-500">Total Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {categories.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500">Active Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {categories.filter(c => c.featured).length}
                </div>
                <div className="text-sm text-gray-500">Featured Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {categories.reduce((sum, c) => sum + c.brokerCount, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Broker Assignments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCategories;