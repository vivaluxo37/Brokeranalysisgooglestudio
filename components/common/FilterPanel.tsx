import React, { useState, useEffect } from 'react';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface RangeFilter {
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'checkbox' | 'radio' | 'toggle';
  options?: FilterOption[];
  range?: RangeFilter;
  defaultValue?: any;
  placeholder?: string;
  searchable?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

interface FilterValues {
  [key: string]: any;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  values: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
  onReset?: () => void;
  className?: string;
  showActiveCount?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

interface FilterItemProps {
  config: FilterConfig;
  value: any;
  onChange: (key: string, value: any) => void;
}

const FilterItem: React.FC<FilterItemProps> = ({ config, value, onChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(config.defaultCollapsed || false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = config.options?.filter(option =>
    !searchTerm || option.label.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const renderSelectFilter = () => (
    <select
      value={value || ''}
      onChange={(e) => onChange(config.key, e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">{config.placeholder || `All ${config.label}`}</option>
      {filteredOptions.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
          {option.count !== undefined && ` (${option.count})`}
        </option>
      ))}
    </select>
  );

  const renderMultiSelectFilter = () => {
    const selectedValues = Array.isArray(value) ? value : [];
    
    return (
      <div className="space-y-2">
        {config.searchable && filteredOptions.length > 5 && (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        )}
        <div className="max-h-48 overflow-y-auto space-y-1">
          {filteredOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={(e) => {
                  const newValues = e.target.checked
                    ? [...selectedValues, option.value]
                    : selectedValues.filter(v => v !== option.value);
                  onChange(config.key, newValues);
                }}
                disabled={option.disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {option.label}
                {option.count !== undefined && (
                  <span className="text-gray-500 ml-1">({option.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const renderRangeFilter = () => {
    const rangeValue = value || { min: config.range?.min, max: config.range?.max };
    
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Min</label>
            <input
              type="number"
              min={config.range?.min}
              max={config.range?.max}
              step={config.range?.step || 1}
              value={rangeValue.min || ''}
              onChange={(e) => onChange(config.key, {
                ...rangeValue,
                min: e.target.value ? Number(e.target.value) : undefined
              })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Max</label>
            <input
              type="number"
              min={config.range?.min}
              max={config.range?.max}
              step={config.range?.step || 1}
              value={rangeValue.max || ''}
              onChange={(e) => onChange(config.key, {
                ...rangeValue,
                max: e.target.value ? Number(e.target.value) : undefined
              })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {config.range && (
          <div className="px-1">
            <input
              type="range"
              min={config.range.min}
              max={config.range.max}
              step={config.range.step || 1}
              value={rangeValue.min || config.range.min}
              onChange={(e) => onChange(config.key, {
                ...rangeValue,
                min: Number(e.target.value)
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{config.range.min}{config.range.unit}</span>
              <span>{config.range.max}{config.range.unit}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRadioFilter = () => (
    <div className="space-y-2">
      {filteredOptions.map((option) => (
        <label
          key={option.value}
          className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
        >
          <input
            type="radio"
            name={config.key}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(config.key, e.target.value)}
            disabled={option.disabled}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <span className="ml-2 text-sm text-gray-700">
            {option.label}
            {option.count !== undefined && (
              <span className="text-gray-500 ml-1">({option.count})</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );

  const renderToggleFilter = () => (
    <div className="flex items-center">
      <button
        onClick={() => onChange(config.key, !value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="ml-3 text-sm text-gray-700">
        {value ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );

  const renderFilterControl = () => {
    switch (config.type) {
      case 'select':
        return renderSelectFilter();
      case 'multiselect':
        return renderMultiSelectFilter();
      case 'range':
        return renderRangeFilter();
      case 'radio':
        return renderRadioFilter();
      case 'toggle':
        return renderToggleFilter();
      case 'checkbox':
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(config.key, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">{config.label}</span>
          </label>
        );
      default:
        return null;
    }
  };

  if (config.collapsible) {
    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">{config.label}</span>
          {isCollapsed ? (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {!isCollapsed && (
          <div className="px-4 pb-4">
            {renderFilterControl()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {config.type !== 'checkbox' && (
        <label className="block font-medium text-gray-700 text-sm">
          {config.label}
        </label>
      )}
      {renderFilterControl()}
    </div>
  );
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  values,
  onFiltersChange,
  onReset,
  className = '',
  showActiveCount = true,
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...values,
      [key]: value
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(values).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== undefined && v !== null && v !== '');
      }
      return value !== undefined && value !== null && value !== '' && value !== false;
    }).length;
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  const handleReset = () => {
    const resetValues: FilterValues = {};
    filters.forEach(filter => {
      if (filter.defaultValue !== undefined) {
        resetValues[filter.key] = filter.defaultValue;
      } else {
        switch (filter.type) {
          case 'multiselect':
            resetValues[filter.key] = [];
            break;
          case 'toggle':
          case 'checkbox':
            resetValues[filter.key] = false;
            break;
          case 'range':
            resetValues[filter.key] = filter.range ? {
              min: filter.range.min,
              max: filter.range.max
            } : null;
            break;
          default:
            resetValues[filter.key] = '';
        }
      }
    });
    
    onFiltersChange(resetValues);
    if (onReset) onReset();
  };

  if (collapsible) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900">Filters</span>
            {showActiveCount && hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          {isCollapsed ? (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {!isCollapsed && (
          <div>
            <div className="divide-y divide-gray-200">
              {filters.map((filter) => (
                <div key={filter.key} className="p-4">
                  <FilterItem
                    config={filter}
                    value={values[filter.key]}
                    onChange={handleFilterChange}
                  />
                </div>
              ))}
            </div>

            {hasActiveFilters && (
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {showActiveCount && hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="divide-y divide-gray-200">
        {filters.map((filter) => (
          <div key={filter.key} className="p-4">
            <FilterItem
              config={filter}
              value={values[filter.key]}
              onChange={handleFilterChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Utility component for quick filter tags
export const ActiveFilters: React.FC<{
  filters: FilterConfig[];
  values: FilterValues;
  onRemove: (key: string) => void;
  onClear: () => void;
  className?: string;
}> = ({ filters, values, onRemove, onClear, className = '' }) => {
  const activeFilters = Object.entries(values).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined && v !== null && v !== '');
    }
    return value !== undefined && value !== null && value !== '' && value !== false;
  });

  if (activeFilters.length === 0) return null;

  const getFilterLabel = (key: string, value: any) => {
    const filter = filters.find(f => f.key === key);
    if (!filter) return `${key}: ${value}`;

    if (Array.isArray(value)) {
      const labels = value.map(v => {
        const option = filter.options?.find(opt => opt.value === v);
        return option ? option.label : v;
      });
      return `${filter.label}: ${labels.join(', ')}`;
    }

    if (typeof value === 'object' && value !== null) {
      const parts = [];
      if (value.min !== undefined) parts.push(`Min: ${value.min}`);
      if (value.max !== undefined) parts.push(`Max: ${value.max}`);
      return `${filter.label}: ${parts.join(' - ')}`;
    }

    if (filter.type === 'toggle' || filter.type === 'checkbox') {
      return filter.label;
    }

    const option = filter.options?.find(opt => opt.value === value);
    const displayValue = option ? option.label : value;
    
    return `${filter.label}: ${displayValue}`;
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">Active filters:</span>
      
      {activeFilters.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
        >
          {getFilterLabel(key, value)}
          <button
            onClick={() => onRemove(key)}
            className="ml-2 hover:text-blue-900"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </span>
      ))}
      
      {activeFilters.length > 1 && (
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default FilterPanel;