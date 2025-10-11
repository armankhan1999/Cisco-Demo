'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export type TimeRange = '30d' | '60d' | '90d' | 'all';

export interface FilterState {
  csmId: string[];
  tier: string[];
  products: string[];
  healthCategories: string[];
  arrRange: [number, number];
  timeRange: TimeRange;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  isFilterPanelOpen: boolean;
  openFilterPanel: () => void;
  closeFilterPanel: () => void;
  hasActiveFilters: boolean;
}

const defaultFilters: FilterState = {
  csmId: [],
  tier: [],
  products: [],
  healthCategories: [],
  arrRange: [0, 10000000],
  timeRange: 'all'
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasActiveFilters = 
    filters.csmId.length > 0 ||
    filters.tier.length > 0 ||
    filters.products.length > 0 ||
    filters.healthCategories.length > 0 ||
    filters.arrRange[0] > 0 ||
    filters.arrRange[1] < 10000000 ||
    filters.timeRange !== 'all';

  const setFilters = useCallback((newFilters: FilterState) => {
    setFiltersState(newFilters);
    
    // Sync to URL
    const params = new URLSearchParams(searchParams.toString());
    
    if (newFilters.csmId.length > 0) params.set('csm', newFilters.csmId.join(','));
    else params.delete('csm');
    
    if (newFilters.tier.length > 0) params.set('tier', newFilters.tier.join(','));
    else params.delete('tier');
    
    if (newFilters.products.length > 0) params.set('products', newFilters.products.join(','));
    else params.delete('products');
    
    if (newFilters.healthCategories.length > 0) params.set('health', newFilters.healthCategories.join(','));
    else params.delete('health');
    
    if (newFilters.arrRange[0] > 0 || newFilters.arrRange[1] < 10000000) {
      params.set('arr', `${newFilters.arrRange[0]}-${newFilters.arrRange[1]}`);
    } else {
      params.delete('arr');
    }
    
    if (newFilters.timeRange !== 'all') params.set('time', newFilters.timeRange);
    else params.delete('time');
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const openFilterPanel = useCallback(() => setIsFilterPanelOpen(true), []);
  const closeFilterPanel = useCallback(() => setIsFilterPanelOpen(false), []);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        resetFilters,
        isFilterPanelOpen,
        openFilterPanel,
        closeFilterPanel,
        hasActiveFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
