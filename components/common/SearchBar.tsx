import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface SuggestionItem {
  id: string;
  name: string;
  slug: string;
  type: 'broker' | 'category' | 'country' | 'platform' | 'feature';
  logo_url?: string;
  flag_emoji?: string;
  icon?: string;
  count?: number;
  rating?: number;
}

interface SuggestResponse {
  suggestions: SuggestionItem[];
  query: string;
  total_count: number;
}

interface SearchBarProps {
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  showRecentSearches?: boolean;
  onSearch?: (query: string, suggestion?: SuggestionItem) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search brokers, categories, countries...",
  size = 'medium',
  showRecentSearches = true,
  onSearch,
  className = ''
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load recent searches from localStorage
  useEffect(() => {
    if (showRecentSearches && typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved).slice(0, 5));
        } catch (e) {
          console.error('Failed to parse recent searches:', e);
        }
      }
    }
  }, [showRecentSearches]);

  // Save to recent searches
  const saveToRecentSearches = (searchQuery: string) => {
    if (!showRecentSearches || typeof window === 'undefined') return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  // Fetch suggestions
  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/brokers/suggest?q=${encodeURIComponent(searchQuery)}&limit=8`);
      if (response.ok) {
        const data: SuggestResponse = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setShowSuggestions(true);
  };

  // Handle search submission
  const handleSearch = (searchQuery?: string, suggestion?: SuggestionItem) => {
    const finalQuery = searchQuery || query;
    
    if (!finalQuery.trim()) return;

    // Save to recent searches
    saveToRecentSearches(finalQuery);
    
    // Close suggestions
    setShowSuggestions(false);
    setSelectedIndex(-1);

    // Call custom onSearch handler if provided
    if (onSearch) {
      onSearch(finalQuery, suggestion);
      return;
    }

    // Navigate based on suggestion type or default to search
    if (suggestion) {
      switch (suggestion.type) {
        case 'broker':
          router.push(`/broker/${suggestion.slug}`);
          break;
        case 'category':
          router.push(`/categories/${suggestion.slug}`);
          break;
        case 'country':
          router.push(`/countries/${suggestion.slug}`);
          break;
        default:
          router.push(`/brokers?q=${encodeURIComponent(finalQuery)}`);
      }
    } else {
      router.push(`/brokers?q=${encodeURIComponent(finalQuery)}`);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const totalItems = suggestions.length + (recentSearches.length > 0 && !query ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (!query && recentSearches.length > 0) {
            // Recent search selected
            const recentQuery = recentSearches[selectedIndex];
            setQuery(recentQuery);
            handleSearch(recentQuery);
          } else {
            // Suggestion selected
            const suggestion = suggestions[selectedIndex];
            if (suggestion) {
              handleSearch(suggestion.name, suggestion);
            } else {
              handleSearch();
            }
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle clear
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Size classes
  const sizeClasses = {
    small: 'h-10 text-sm',
    medium: 'h-12 text-base',
    large: 'h-14 text-lg'
  };

  const iconSizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  // Render suggestion item
  const renderSuggestionItem = (item: SuggestionItem, index: number, isSelected: boolean) => {
    const getTypeColor = (type: string) => {
      switch (type) {
        case 'broker': return 'bg-blue-100 text-blue-700';
        case 'category': return 'bg-green-100 text-green-700';
        case 'country': return 'bg-purple-100 text-purple-700';
        case 'platform': return 'bg-orange-100 text-orange-700';
        case 'feature': return 'bg-teal-100 text-teal-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <button
        key={item.id}
        onClick={() => handleSearch(item.name, item)}
        className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
          isSelected ? 'bg-blue-50' : ''
        }`}
      >
        <div className="flex items-center flex-1 min-w-0">
          {/* Icon/Logo/Flag */}
          <div className="flex-shrink-0 mr-3">
            {item.logo_url ? (
              <img src={item.logo_url} alt={item.name} className="w-6 h-6 rounded" />
            ) : item.flag_emoji ? (
              <span className="text-lg">{item.flag_emoji}</span>
            ) : item.icon ? (
              <span className="text-lg">{item.icon}</span>
            ) : (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getTypeColor(item.type)}`}>
                {item.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 truncate">{item.name}</span>
              <div className="flex items-center space-x-2 ml-2">
                {item.rating && (
                  <div className="flex items-center">
                    <span className="text-sm text-yellow-600 font-medium">{item.rating}</span>
                    <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
                {item.count && (
                  <span className="text-xs text-gray-500">{item.count} items</span>
                )}
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(item.type)}`}>
                  {item.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className={`${iconSizeClasses[size]} text-gray-400`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-12 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${sizeClasses[size]}`}
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className={`${iconSizeClasses[size]} text-gray-400 hover:text-gray-600`} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && !isLoading && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                Recent Searches
              </div>
              {recentSearches.map((recentQuery, index) => (
                <button
                  key={recentQuery}
                  onClick={() => {
                    setQuery(recentQuery);
                    handleSearch(recentQuery);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    selectedIndex === index ? 'bg-blue-50' : ''
                  }`}
                >
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{recentQuery}</span>
                </button>
              ))}
            </>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <>
              {!query && recentSearches.length > 0 && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-t">
                  Suggestions
                </div>
              )}
              {suggestions.map((suggestion, index) => 
                renderSuggestionItem(
                  suggestion, 
                  index, 
                  selectedIndex === (query ? index : recentSearches.length + index)
                )
              )}
            </>
          )}

          {/* No Results */}
          {query && suggestions.length === 0 && !isLoading && (
            <div className="px-4 py-6 text-center text-gray-500">
              <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
            </div>
          )}

          {/* Search All Results */}
          {query && (suggestions.length > 0 || !isLoading) && (
            <div className="border-t border-gray-100">
              <button
                onClick={() => handleSearch()}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-blue-600 font-medium"
              >
                Search all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;