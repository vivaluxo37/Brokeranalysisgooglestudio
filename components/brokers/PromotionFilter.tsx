import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Filter, SortAsc, X, Calendar, Gift, TrendingUp, Star } from 'lucide-react';

interface PromotionFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  showExclusive: boolean;
  onExclusiveChange: (value: boolean) => void;
  showActiveOnly: boolean;
  onActiveOnlyChange: (value: boolean) => void;
  totalResults: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const promotionTypes = [
  { value: 'all', label: 'All Promotions' },
  { value: 'welcome-bonus', label: 'Welcome Bonus' },
  { value: 'deposit-bonus', label: 'Deposit Bonus' },
  { value: 'no-deposit-bonus', label: 'No Deposit Bonus' },
  { value: 'cashback', label: 'Cashback' },
  { value: 'loyalty-program', label: 'Loyalty Program' },
  { value: 'trading-competition', label: 'Trading Competition' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest', icon: Calendar },
  { value: 'ending-soon', label: 'Ending Soon', icon: Calendar },
  { value: 'highest-bonus', label: 'Highest Bonus', icon: Gift },
  { value: 'popular', label: 'Most Popular', icon: Star },
  { value: 'broker-score', label: 'Broker Score', icon: TrendingUp }
];

const PromotionFilter: React.FC<PromotionFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  showExclusive,
  onExclusiveChange,
  showActiveOnly,
  onActiveOnlyChange,
  totalResults,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filters & Search</span>
          <Badge variant="outline" className="ml-2">
            {totalResults} {totalResults === 1 ? 'Result' : 'Results'}
          </Badge>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Search brokers or promotions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Main Filter Row */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Promotion Type Filter */}
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[200px]">
            <Gift className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Promotion Type" />
          </SelectTrigger>
          <SelectContent>
            {promotionTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Toggle Filters */}
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => onActiveOnlyChange(e.target.checked)}
              className="rounded border-input"
            />
            <span className="text-sm font-medium">Active Only</span>
            {showActiveOnly && (
              <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
            )}
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
            <input
              type="checkbox"
              checked={showExclusive}
              onChange={(e) => onExclusiveChange(e.target.checked)}
              className="rounded border-input"
            />
            <span className="text-sm font-medium">Exclusive Only</span>
            {showExclusive && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">Exclusive</Badge>
            )}
          </label>
        </div>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchTerm}"
              <X
                className="h-3 w-3 cursor-pointer hover:text-foreground"
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          {selectedType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Type: {promotionTypes.find(t => t.value === selectedType)?.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-foreground"
                onClick={() => onTypeChange('all')}
              />
            </Badge>
          )}
          {showExclusive && (
            <Badge variant="secondary" className="gap-1">
              Exclusive Only
              <X
                className="h-3 w-3 cursor-pointer hover:text-foreground"
                onClick={() => onExclusiveChange(false)}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">{totalResults}</div>
          <div className="text-sm text-muted-foreground">Total Promotions</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {promotionTypes.length - 1}
          </div>
          <div className="text-sm text-muted-foreground">Promotion Types</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {sortOptions.length}
          </div>
          <div className="text-sm text-muted-foreground">Sort Options</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {hasActiveFilters ? 'Applied' : 'None'}
          </div>
          <div className="text-sm text-muted-foreground">Active Filters</div>
        </div>
      </div>
    </div>
  );
};

export default PromotionFilter;