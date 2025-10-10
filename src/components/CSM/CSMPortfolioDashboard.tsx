'use client';

import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { KPITile } from './KPITile';
import { HealthDistribution } from './HealthDistribution';
import { RenewalPipeline } from './RenewalPipeline';
import { CriticalActions, CriticalAction } from './CriticalActions';
import { PortfolioUtilizationKPI } from './LicenseUtilization/PortfolioUtilizationKPI';
import { FilterPanel } from '@/components/Filters/FilterPanel';
import { TimeRangeSelector } from '@/components/Filters/TimeRangeSelector';
import { FilterState } from '@/contexts/FilterContext';
import { filterAccounts, calculatePortfolioMetrics } from '@/lib/utils/filterAccounts';
import {
  calculateAllKPIs,
  calculateHealthDistribution,
  calculateRenewalPipeline,
  HealthCategory,
  RenewalPipeline as RenewalPipelineType
} from '@/lib/kpis/csmKPICalculations';
import { getActiveAccounts, getAllQBRTracking } from '@/lib/data/csmDataLoader';

export function CSMPortfolioDashboard() {
  const [kpis, setKPIs] = useState<ReturnType<typeof calculateAllKPIs> | null>(null);
  const [healthDistribution, setHealthDistribution] = useState<HealthCategory[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Initialize filters from URL parameters on mount
  const getInitialFilters = (): FilterState => {
    if (typeof window === 'undefined') {
      return {
        csmId: [],
        tier: [],
        products: [],
        healthCategories: [],
        arrRange: [0, 10000000],
        timeRange: 'all'
      };
    }
    
    const params = new URLSearchParams(window.location.search);
    return {
      csmId: params.get('csm')?.split(',').filter(Boolean) || [],
      tier: params.get('tier')?.split(',').filter(Boolean) || [],
      products: params.get('products')?.split(',').filter(Boolean) || [],
      healthCategories: params.get('health')?.split(',').filter(Boolean) || [],
      arrRange: params.get('arr')?.split('-').map(Number) as [number, number] || [0, 10000000],
      timeRange: (params.get('time') as FilterState['timeRange']) || 'all'
    };
  };
  
  const [filters, setFilters] = useState<FilterState>(getInitialFilters());
  const [allAccounts, setAllAccounts] = useState<any[]>([]);
  
  // Sync filters to URL whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams();
    
    if (filters.csmId.length > 0) params.set('csm', filters.csmId.join(','));
    if (filters.tier.length > 0) params.set('tier', filters.tier.join(','));
    if (filters.products.length > 0) params.set('products', filters.products.join(','));
    if (filters.healthCategories.length > 0) params.set('health', filters.healthCategories.join(','));
    if (filters.arrRange[0] > 0 || filters.arrRange[1] < 10000000) {
      params.set('arr', `${filters.arrRange[0]}-${filters.arrRange[1]}`);
    }
    if (filters.timeRange !== 'all') params.set('time', filters.timeRange);
    
    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);
  const [filteredAccountsData, setFilteredAccountsData] = useState<any[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalAccounts: 0,
    filteredAccounts: 0,
    totalARR: 0,
    filteredARR: 0,
    avgHealth: 0,
    atRiskCount: 0
  });
  const [renewalPipeline, setRenewalPipeline] = useState<RenewalPipelineType[]>([]);
  const [criticalActions, setCriticalActions] = useState<CriticalAction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Helper function to build KPI drill-down URLs with filter state
  const buildDrillDownUrl = (basePath: string): string => {
    const params = new URLSearchParams();
    
    if (filters.csmId.length > 0) params.set('csm', filters.csmId.join(','));
    if (filters.tier.length > 0) params.set('tier', filters.tier.join(','));
    if (filters.products.length > 0) params.set('products', filters.products.join(','));
    if (filters.healthCategories.length > 0) params.set('health', filters.healthCategories.join(','));
    if (filters.arrRange[0] > 0 || filters.arrRange[1] < 10000000) {
      params.set('arr', `${filters.arrRange[0]}-${filters.arrRange[1]}`);
    }
    if (filters.timeRange !== 'all') params.set('time', filters.timeRange);
    
    return params.toString() ? `${basePath}?${params.toString()}` : basePath;
  };

  // Initial load - fetch all accounts
  useEffect(() => {
    try {
      const accounts = getActiveAccounts();
      setAllAccounts(accounts);
      setFilteredAccountsData(accounts);
      
      // Calculate initial portfolio metrics
      const allMetrics = calculatePortfolioMetrics(accounts);
      setPortfolioMetrics({
        totalAccounts: allMetrics.totalAccounts,
        filteredAccounts: allMetrics.totalAccounts,
        totalARR: allMetrics.totalARR,
        filteredARR: allMetrics.totalARR,
        avgHealth: allMetrics.avgHealth,
        atRiskCount: allMetrics.atRiskCount
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading accounts:', error);
      setLoading(false);
    }
  }, []);

  // Recalculate KPIs when filters change
  useEffect(() => {
    if (allAccounts.length === 0) return;
    
    try {
      // Apply filters
      const filtered = filterAccounts(allAccounts, filters);
      setFilteredAccountsData(filtered);
      
      // Calculate metrics for filtered data
      const filteredMetrics = calculatePortfolioMetrics(filtered);
      const totalMetrics = calculatePortfolioMetrics(allAccounts);
      
      setPortfolioMetrics({
        totalAccounts: totalMetrics.totalAccounts,
        filteredAccounts: filteredMetrics.totalAccounts,
        totalARR: totalMetrics.totalARR,
        filteredARR: filteredMetrics.totalARR,
        avgHealth: filteredMetrics.avgHealth,
        atRiskCount: filteredMetrics.atRiskCount
      });
      
      // Recalculate KPIs with filtered data - pass filtered accounts to all calculations
      const calculatedKPIs = calculateAllKPIs(filtered);
      const health = calculateHealthDistribution(filtered);
      const pipeline = calculateRenewalPipeline(filtered, filters.timeRange);
      
      const accounts = filtered;
      const qbrTracking = getAllQBRTracking();
      const now = Date.now();
      const msPerDay = 24 * 60 * 60 * 1000;
      
      // 1. CRITICAL HEALTH: Health Score 0-45 (Immediate intervention needed)
      // MUST MATCH Health Distribution table range: Critical (0-45)
      const criticalHealthAccounts = accounts.filter(a => a.account.health_score >= 0 && a.account.health_score <= 45);
      const criticalHealthARR = criticalHealthAccounts.reduce((sum, a) => sum + a.account.arr, 0);
      
      // 2. AT-RISK HEALTH: Health Score 46-60 (Proactive engagement needed)
      // MUST MATCH Health Distribution table range: At Risk (46-60)
      const atRiskHealthAccounts = accounts.filter(a => a.account.health_score >= 46 && a.account.health_score <= 60);
      const atRiskHealthARR = atRiskHealthAccounts.reduce((sum, a) => sum + a.account.arr, 0);
      
      // 3. OVERDUE QBRs: Accounts without QBR in last 90 days
      const overdueQBRAccounts: any[] = [];
      accounts.forEach(account => {
        const accountQBRs = qbrTracking.filter(q => q.account_id === account.account.id);
        if (accountQBRs.length === 0) {
          overdueQBRAccounts.push({ ...account, daysSinceQBR: 999 }); // Never had QBR
        } else {
          const lastQBRDate = Math.max(...accountQBRs.map(q => new Date(q.qbr_date).getTime()));
          const daysSinceQBR = Math.floor((now - lastQBRDate) / msPerDay);
          if (daysSinceQBR > 90) {
            overdueQBRAccounts.push({ ...account, daysSinceQBR });
          }
        }
      });
      const overdueQBRARR = overdueQBRAccounts.reduce((sum, a) => sum + a.account.arr, 0);
      
      // 4. DECLINING HEALTH: Accounts with negative 30-day trend (calculated from timeline)
      const decliningHealthAccounts = accounts.filter(a => {
        if (!a.timeline || a.timeline.length < 2) return false;
        const recent = a.timeline.slice(-2);
        const trend = recent[1].health_score - recent[0].health_score;
        return trend < 0;
      });
      const decliningHealthARR = decliningHealthAccounts.reduce((sum, a) => sum + a.account.arr, 0);
      
      // 5. AT-RISK RENEWALS: Renewals in next 90 days with low confidence
      const atRiskRenewals = pipeline.slice(0, 3).reduce((sum, p) => sum + p.atRisk, 0);
      const atRiskRenewalARR = pipeline.slice(0, 3).reduce((sum, p) => {
        const pctAtRisk = p.count > 0 ? p.atRisk / p.count : 0;
        return sum + (p.arr * pctAtRisk);
      }, 0);
      
      // 6. LOW UTILIZATION: Accounts with utilization < 50% (risk of churn)
      const lowUtilizationAccounts = accounts.filter(a => {
        // Check if account has low average utilization
        return a.account.health_score < 65; // Using health as proxy for utilization
      });
      const lowUtilAccounts = lowUtilizationAccounts.slice(0, 10); // Top 10 most critical
      
      // 7. HIGH-VALUE AT-RISK: Large accounts (ARR > $500K) with health < 70
      const highValueAtRisk = accounts.filter(a => a.account.arr > 500000 && a.account.health_score < 70);
      const highValueAtRiskARR = highValueAtRisk.reduce((sum, a) => sum + a.account.arr, 0);
      
      // Build dynamic action list (only show if count > 0)
      const allActions: CriticalAction[] = [];
      
      // CRITICAL (Red) - Immediate action required
      if (criticalHealthAccounts.length > 0) {
        allActions.push({
          icon: '🚨',
          message: `${criticalHealthAccounts.length} accounts in CRITICAL health (0-45) - $${(criticalHealthARR / 1000000).toFixed(1)}M ARR at risk`,
          severity: 'critical',
          count: criticalHealthAccounts.length,
          amount: `$${(criticalHealthARR / 1000000).toFixed(1)}M`
        });
      }
      
      // HIGH (Orange) - Action needed soon
      if (highValueAtRisk.length > 0) {
        allActions.push({
          icon: '💎',
          message: `${highValueAtRisk.length} high-value accounts (>$500K) below health threshold - $${(highValueAtRiskARR / 1000000).toFixed(1)}M ARR`,
          severity: 'high',
          count: highValueAtRisk.length,
          amount: `$${(highValueAtRiskARR / 1000000).toFixed(1)}M`
        });
      }
      
      if (overdueQBRAccounts.length > 0) {
        allActions.push({
          icon: '📅',
          message: `${overdueQBRAccounts.length} accounts with QBRs overdue >90 days - $${(overdueQBRARR / 1000000).toFixed(1)}M ARR`,
          severity: 'high',
          count: overdueQBRAccounts.length,
          amount: `$${(overdueQBRARR / 1000000).toFixed(1)}M`
        });
      }
      
      if (atRiskRenewals > 0) {
        allActions.push({
          icon: '⚠️',
          message: `${atRiskRenewals} renewals at risk in next 90 days - $${(atRiskRenewalARR / 1000000).toFixed(1)}M ARR`,
          severity: 'high',
          count: atRiskRenewals,
          amount: `$${(atRiskRenewalARR / 1000000).toFixed(1)}M`
        });
      }
      
      // MEDIUM (Yellow) - Monitor closely
      if (atRiskHealthAccounts.length > 0) {
        allActions.push({
          icon: '⚕️',
          message: `${atRiskHealthAccounts.length} accounts at-risk health (46-60) - proactive engagement needed`,
          severity: 'medium',
          count: atRiskHealthAccounts.length,
          amount: `$${(atRiskHealthARR / 1000000).toFixed(1)}M`
        });
      }
      
      if (decliningHealthAccounts.length > 0) {
        allActions.push({
          icon: '📉',
          message: `${decliningHealthAccounts.length} accounts with declining health trend (30-day) - investigate root cause`,
          severity: 'medium',
          count: decliningHealthAccounts.length
        });
      }
      
      // Sort by severity (critical first, then high, then medium)
      const severityOrder = { critical: 0, high: 1, medium: 2 };
      const actions = allActions
        .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
        .slice(0, 5); // Show top 5 most critical actions
      
      // If no critical actions, show positive message
      if (actions.length === 0) {
        actions.push({
          icon: '✅',
          message: 'No critical actions required - portfolio health is strong',
          severity: 'medium',
          count: 0
        });
      }
      
      console.log('\n🚨 === DYNAMIC CRITICAL ACTIONS ===');
      console.log(`Total Actions Identified: ${allActions.length}`);
      console.log(`Showing Top ${actions.length} Most Critical`);
      actions.forEach((action, idx) => {
        console.log(`${idx + 1}. [${action.severity.toUpperCase()}] ${action.message}`);
      });
      console.log('='.repeat(50));
      
      setKPIs(calculatedKPIs);
      setHealthDistribution(health);
      setRenewalPipeline(pipeline);
      setCriticalActions(actions);
    } catch (error) {
      console.error('Error calculating CSM KPIs:', error);
    }
  }, [filters, allAccounts]);

  if (loading || !kpis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Customer Success Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-8">
      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={() => setIsFilterPanelOpen(false)}
      />

      {/* Header */}
      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-medium text-gray-900 mb-1">
                Customer Success Portfolio Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Updated: {new Date().toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TimeRangeSelector
                value={filters.timeRange}
                onChange={(timeRange) => setFilters({ ...filters, timeRange })}
              />
              <button
                onClick={() => setIsFilterPanelOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Key Performance Indicators
          </h2>
        </div>
        
        {/* Row 1: GRR, Portfolio Health, At-Risk ARR, Renewal Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KPITile title="GRR" kpi={kpis.grr} drillDownUrl={buildDrillDownUrl('/csm/kpi/grr')} />
          <KPITile title="Portfolio Health" kpi={kpis.portfolioHealth} drillDownUrl={buildDrillDownUrl('/csm/kpi/portfolio-health')} />
          <KPITile title="At-Risk ARR" kpi={kpis.atRiskARR} drillDownUrl={buildDrillDownUrl('/csm/kpi/at-risk-arr')} />
          <KPITile title="Renewal Rate" kpi={kpis.renewalRate} drillDownUrl={buildDrillDownUrl('/csm/kpi/renewal-rate')} />
        </div>
        
        {/* Row 2: Churn Rate, Portfolio Utilization, Feature Adoption, Engagement Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KPITile title="Churn Rate" kpi={kpis.churnRate} drillDownUrl={buildDrillDownUrl('/csm/kpi/churn-rate')} />
          <PortfolioUtilizationKPI drillDownUrl={buildDrillDownUrl('/csm/kpi/portfolio-utilization')} />
          <KPITile title="Feature Adoption Rate" kpi={kpis.featureAdoption} drillDownUrl={buildDrillDownUrl('/csm/kpi/adoption')} />
          <KPITile title="Customer Engagement Score" kpi={kpis.engagementScore} drillDownUrl={buildDrillDownUrl('/csm/kpi/engagement')} />
        </div>
        
        {/* Row 3: Time to Value, QBR Completion and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPITile title="Time to Value (TTV)" kpi={kpis.timeToValue} drillDownUrl={buildDrillDownUrl('/csm/kpi/time-to-value')} />
          <KPITile title="QBR Completion Rate" kpi={kpis.qbrCompletion} drillDownUrl={buildDrillDownUrl('/csm/kpi/qbr-completion')} />
          
          {/* Summary Cards */}
          <div className="col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">📋</div>
              <h3 className="text-lg font-bold text-gray-900">Portfolio Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {healthDistribution.reduce((sum, h) => sum + h.accounts, 0)}
                </div>
                <div className="text-xs text-gray-600 font-medium">Active Accounts</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ${(healthDistribution.reduce((sum, h) => sum + h.arr, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-600 font-medium">Portfolio ARR</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-700 mb-1">
                  {healthDistribution.slice(0, 2).reduce((sum, h) => sum + h.accounts, 0)}
                </div>
                <div className="text-xs text-green-600 font-medium">Healthy Accounts</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-700 mb-1">
                  {healthDistribution.slice(3, 5).reduce((sum, h) => sum + h.accounts, 0)}
                </div>
                <div className="text-xs text-red-600 font-medium">At-Risk Accounts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Distribution */}
      <div className="mb-8">
        <HealthDistribution 
          data={healthDistribution}
          onClick={(category) => console.log('Navigate to', category.category, 'accounts')}
        />
      </div>

      {/* Renewal Pipeline */}
      <div className="mb-8">
        <RenewalPipeline 
          data={renewalPipeline}
          onClick={(period) => console.log('Navigate to', period.period, 'renewals')}
        />
      </div>

      {/* Critical Actions */}
      <div className="mb-8">
        <CriticalActions 
          actions={criticalActions}
          onActionClick={(action) => console.log('Handle action:', action.message)}
        />
      </div>

      {/* Footer */}
      <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
        <div className="text-sm text-gray-600">
          <p className="font-medium">Dashboard Information</p>
          <p className="mt-2">Data refreshed: {new Date().toLocaleString()}</p>
          <p className="mt-1">
            Click on any KPI tile for detailed analytics and insights
          </p>
        </div>
      </div>
    </div>
  );
}

