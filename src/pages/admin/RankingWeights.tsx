import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { updateRankingWeights } from '../../../lib/brokerRanking';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface RankingWeight {
  id: string;
  factor: string;
  weight: number;
  description: string;
  updated_at: string;
  updated_by?: string;
}

const RankingWeights: React.FC = () => {
  const [weights, setWeights] = useState<RankingWeight[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<{[key: string]: number}>({});

  const defaultWeights = [
    {
      factor: 'regulation',
      description: 'Regulatory authority strength and reputation (FCA, ASIC, etc.)',
      defaultWeight: 0.25
    },
    {
      factor: 'execution',
      description: 'Trade execution speed and reliability',
      defaultWeight: 0.20
    },
    {
      factor: 'costs',
      description: 'Spreads, commissions, and trading fees',
      defaultWeight: 0.20
    },
    {
      factor: 'platform',
      description: 'Trading platform features and usability',
      defaultWeight: 0.15
    },
    {
      factor: 'country_availability',
      description: 'Verified availability in different countries',
      defaultWeight: 0.10
    },
    {
      factor: 'user_reviews',
      description: 'Community ratings and user feedback',
      defaultWeight: 0.10
    }
  ];

  useEffect(() => {
    loadRankingWeights();
  }, []);

  const loadRankingWeights = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ranking_weights')
        .select('*')
        .order('factor');

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        // Initialize with default weights if none exist
        await initializeDefaultWeights();
        return;
      }

      setWeights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ranking weights');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultWeights = async () => {
    try {
      const defaultData = defaultWeights.map(w => ({
        factor: w.factor,
        weight: w.defaultWeight,
        description: w.description,
        updated_at: new Date().toISOString(),
        updated_by: 'system'
      }));

      const { data, error } = await supabase
        .from('ranking_weights')
        .insert(defaultData)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      setWeights(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize default weights');
    }
  };

  const handleSaveWeight = async (id: string) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const newWeight = tempValues[id];
      if (newWeight === undefined || newWeight < 0 || newWeight > 1) {
        throw new Error('Weight must be between 0 and 1');
      }

      // Validate total doesn't exceed 1
      const otherWeightsSum = weights
        .filter(w => w.id !== id)
        .reduce((sum, w) => sum + w.weight, 0);
      
      if (otherWeightsSum + newWeight > 1.01) { // Small tolerance for floating point
        throw new Error('Total weights cannot exceed 1.0');
      }

      const { error } = await supabase
        .from('ranking_weights')
        .update({
          weight: newWeight,
          updated_at: new Date().toISOString(),
          updated_by: 'admin'
        })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Update the ranking engine with new weights
      const newWeights = weights.reduce((acc, w) => {
        acc[w.factor] = w.id === id ? newWeight : w.weight;
        return acc;
      }, {} as {[key: string]: number});

      await updateRankingWeights(newWeights);

      // Reload weights
      await loadRankingWeights();
      
      setEditingWeight(null);
      setTempValues(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      setSuccessMessage('Weight updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update weight');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = (id: string) => {
    setEditingWeight(null);
    setTempValues(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleResetToDefaults = async () => {
    if (!window.confirm('Are you sure you want to reset all weights to default values? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Update all weights to defaults
      const updates = defaultWeights.map(dw => {
        const existing = weights.find(w => w.factor === dw.factor);
        return {
          id: existing?.id,
          weight: dw.defaultWeight,
          updated_at: new Date().toISOString(),
          updated_by: 'admin'
        };
      }).filter(u => u.id);

      for (const update of updates) {
        const { error } = await supabase
          .from('ranking_weights')
          .update({
            weight: update.weight,
            updated_at: update.updated_at,
            updated_by: update.updated_by
          })
          .eq('id', update.id);

        if (error) {
          throw new Error(error.message);
        }
      }

      // Update ranking engine
      const newWeights = defaultWeights.reduce((acc, dw) => {
        acc[dw.factor] = dw.defaultWeight;
        return acc;
      }, {} as {[key: string]: number});

      await updateRankingWeights(newWeights);

      // Reload weights
      await loadRankingWeights();
      setSuccessMessage('All weights reset to default values');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset weights');
    } finally {
      setSaving(false);
    }
  };

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const isWeightBalanced = Math.abs(totalWeight - 1.0) < 0.01;

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
                        Ranking Weights
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                Broker Ranking Weights
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Configure the weights used in the broker ranking algorithm
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleResetToDefaults}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Weight Balance Indicator */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Weight Balance</h3>
                <p className="text-sm text-gray-600">Total weight: {totalWeight.toFixed(3)}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isWeightBalanced 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isWeightBalanced ? 'Balanced' : 'Needs Adjustment'}
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    totalWeight > 1 ? 'bg-red-500' : totalWeight < 0.95 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(totalWeight * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ideal total: 1.0 (100%)
              </p>
            </div>
          </div>
        </div>

        {/* Weights Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Ranking Factors</h2>
            <p className="text-sm text-gray-600 mt-1">
              Adjust the weight of each factor in the ranking algorithm
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {weights.map((weight) => (
                  <tr key={weight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {weight.factor.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {weight.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingWeight === weight.id ? (
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={tempValues[weight.id] ?? weight.weight}
                          onChange={(e) => setTempValues(prev => ({
                            ...prev,
                            [weight.id]: parseFloat(e.target.value) || 0
                          }))}
                          className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {weight.weight.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(weight.weight * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">
                          {(weight.weight * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {new Date(weight.updated_at).toLocaleDateString()}
                      </div>
                      {weight.updated_by && (
                        <div className="text-xs text-gray-400">
                          by {weight.updated_by}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingWeight === weight.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveWeight(weight.id)}
                            disabled={saving}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleCancelEdit(weight.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingWeight(weight.id);
                            setTempValues(prev => ({ ...prev, [weight.id]: weight.weight }));
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">How Ranking Weights Work</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Regulation (25%)</strong>: Higher weight for brokers with strong regulatory oversight (FCA, ASIC, etc.)</p>
            <p>• <strong>Execution (20%)</strong>: Considers trade execution speed, slippage, and order filling reliability</p>
            <p>• <strong>Costs (20%)</strong>: Lower spreads and commissions result in higher rankings</p>
            <p>• <strong>Platform (15%)</strong>: Evaluates trading platform features, stability, and user experience</p>
            <p>• <strong>Country Availability (10%)</strong>: Brokers available in more countries score higher</p>
            <p>• <strong>User Reviews (10%)</strong>: Community ratings and feedback influence final rankings</p>
          </div>
          <p className="text-sm text-blue-700 mt-4">
            <strong>Note:</strong> Total weights should equal 1.0 (100%). Changes take effect immediately and will be reflected in all broker rankings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RankingWeights;
