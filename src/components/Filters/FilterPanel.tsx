'use client';

import { useState, useEffect } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { FilterState } from '@/contexts/FilterContext';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
}

export function FilterPanel({ isOpen, onClose, filters, onFiltersChange, onApplyFilters }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const csmOptions = [
    { id: 'CSM_001', name: 'Sarah Johnson' },
    { id: 'CSM_002', name: 'Michael Chen' },
    { id: 'CSM_003', name: 'Emily Rodriguez' },
    { id: 'CSM_004', name: 'David Kim' },
    { id: 'CSM_005', name: 'Lisa Anderson' },
  ];

  const tierOptions = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
  const productOptions = ['Duo', 'Meraki', 'Umbrella', 'ThousandEyes', 'Splunk'];
  const healthOptions = [
    { label: 'Thriving', range: '91-100' },
    { label: 'Healthy', range: '76-90' },
    { label: 'Stable', range: '61-75' },
    { label: 'At Risk', range: '46-60' },
    { label: 'Critical', range: '0-45' }
  ];

  const handleCheckboxChange = (category: 'csmId' | 'tier' | 'products' | 'healthCategories', value: string) => {
    const currentValues = localFilters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setLocalFilters({ ...localFilters, [category]: newValues });
  };

  const handleRangeChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...localFilters.arrRange] as [number, number];
    newRange[index] = value;
    setLocalFilters({ ...localFilters, arrRange: newRange });
  };


  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      csmId: [],
      tier: [],
      products: [],
      healthCategories: [],
      arrRange: [0, 10000000],
      timeRange: 'all'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onApplyFilters();
  };

  const hasActiveFilters = 
    localFilters.csmId.length > 0 ||
    localFilters.tier.length > 0 ||
    localFilters.products.length > 0 ||
    localFilters.healthCategories.length > 0 ||
    localFilters.arrRange[0] > 0 ||
    localFilters.arrRange[1] < 10000000 ||
    localFilters.timeRange !== 'all';

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-hidden flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">Filters</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* CSM Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              CSM {localFilters.csmId.length > 0 && `(${localFilters.csmId.length})`}
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {csmOptions.map(csm => (
                <label key={csm.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                  <input
                    type="checkbox"
                    checked={localFilters.csmId.includes(csm.id)}
                    onChange={() => handleCheckboxChange('csmId', csm.id)}
                    className="w-3.5 h-3.5 text-gray-900 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-700">{csm.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tier Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Tier {localFilters.tier.length > 0 && `(${localFilters.tier.length})`}
            </label>
            <div className="space-y-1.5">
              {tierOptions.map(tier => (
                <label key={tier} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                  <input
                    type="checkbox"
                    checked={localFilters.tier.includes(tier)}
                    onChange={() => handleCheckboxChange('tier', tier)}
                    className="w-3.5 h-3.5 text-gray-900 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-700">{tier}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Product {localFilters.products.length > 0 && `(${localFilters.products.length})`}
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {productOptions.map(product => (
                <label key={product} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                  <input
                    type="checkbox"
                    checked={localFilters.products.includes(product)}
                    onChange={() => handleCheckboxChange('products', product)}
                    className="w-3.5 h-3.5 text-gray-900 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-700">{product}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Health Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Health Score {localFilters.healthCategories.length > 0 && `(${localFilters.healthCategories.length})`}
            </label>
            <div className="space-y-1.5">
              {healthOptions.map(health => (
                <label key={health.label} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded">
                  <input
                    type="checkbox"
                    checked={localFilters.healthCategories.includes(health.label)}
                    onChange={() => handleCheckboxChange('healthCategories', health.label)}
                    className="w-3.5 h-3.5 text-gray-900 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-700">{health.label} <span className="text-gray-500">({health.range})</span></span>
                </label>
              ))}
            </div>
          </div>

          {/* ARR Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              ARR Range
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="number"
                  value={localFilters.arrRange[0]}
                  onChange={(e) => handleRangeChange(0, Number(e.target.value))}
                  placeholder="Min"
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={localFilters.arrRange[1]}
                  onChange={(e) => handleRangeChange(1, Number(e.target.value))}
                  placeholder="Max"
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs"
                />
              </div>
              <div className="text-xs text-gray-500">
                ${(localFilters.arrRange[0] / 1000).toFixed(0)}K - ${(localFilters.arrRange[1] / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-5 py-3 bg-white space-y-2">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="w-full text-xs text-gray-600 hover:text-gray-900 py-2"
            >
              Clear all
            </button>
          )}
          <button
            onClick={handleApply}
            className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-normal rounded hover:bg-gray-800 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
