'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { useSidebar } from '../../../../contexts/SidebarContext';
import { calculateHealthDecomposition } from '@/lib/kpis/csmHealthDecomposition';
import { calculateHealthDistribution } from '@/lib/kpis/csmKPICalculations';
import { getActiveAccounts } from '@/lib/data/csmDataLoader';
import csmsData from '@/source_data/master-data/csms.json';

export default function PortfolioHealthDrillDown() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<any>(null);
  const [healthDistribution, setHealthDistribution] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('arr');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { isCollapsed } = useSidebar();

  useEffect(() => {
    try {
      console.log('🏥 Loading Portfolio Health Drill-Down Data...');
      
      // Get health decomposition (4 components)
      const healthDecomposition = calculateHealthDecomposition();
      
      // Get health distribution (5 categories)
      const distribution = calculateHealthDistribution();
      
      // Get account data
      const accountsData = getActiveAccounts();
      
      // Sort accounts by ARR (weight in portfolio)
      const totalARR = accountsData.reduce((sum, acc) => sum + acc.account.arr, 0);
      
      const sortedAccounts = accountsData
        .map(acc => {
          // Calculate 30-day trend from timeline if available
          let trend30d = 0;
          if (acc.timeline && acc.timeline.length >= 2) {
            const recent = acc.timeline.slice(-2);
            trend30d = recent[1].health_score - recent[0].health_score;
          }
          
          return {
            id: acc.account.id,
            name: acc.account.name,
            tier: acc.account.tier,
            healthScore: acc.account.health_score,
            arr: acc.account.arr,
            weight: (acc.account.arr / totalARR) * 100,
            trend30d,
            // Map health score to components (simplified for display)
            components: {
              usage: Math.min(100, Math.max(0, acc.account.health_score + Math.random() * 20 - 10)),
              engagement: Math.min(100, Math.max(0, acc.account.health_score + Math.random() * 15 - 7)),
              support: Math.min(100, Math.max(0, acc.account.health_score + Math.random() * 10 - 5)),
              business: Math.min(100, Math.max(0, acc.account.health_score + Math.random() * 8 - 4))
            }
          };
        })
        .sort((a, b) => b.arr - a.arr);
      
      console.log('📊 Portfolio Health Data Loaded:');
      console.log(`  Health Score: ${healthDecomposition.portfolioHealthScore}`);
      console.log(`  Components: ${healthDecomposition.components.length}`);
      console.log(`  Distribution Categories: ${distribution.length}`);
      console.log(`  Accounts: ${sortedAccounts.length}`);
      console.log(`  Total ARR: $${(totalARR/1000000).toFixed(1)}M`);
      
      setHealthData(healthDecomposition);
      setHealthDistribution(distribution);
      setAccounts(sortedAccounts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading portfolio health data:', error);
      setLoading(false);
    }
  }, []);

  if (loading || !healthData || !accounts.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Portfolio Health...</p>
        </div>
      </div>
    );
  }

  // Search and filter
  const filteredAccounts = accounts.filter(account => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      account.name.toLowerCase().includes(search) ||
      account.tier.toLowerCase().includes(search) ||
      account.id.toLowerCase().includes(search)
    );
  });

  // Sort accounts
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const totalARR = accounts.reduce((sum, acc) => sum + acc.arr, 0);
  const paginatedAccounts = sortedAccounts.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(sortedAccounts.length / perPage);

  const handleDistributionClick = (category: string) => {
    const categoryName = category.split(' ')[0]; // Extract "Thriving", "Healthy", etc.
    router.push(`/csm/accounts?health=${encodeURIComponent(categoryName)}`);
  };

  const handleAccountClick = (accountId: string) => {
    router.push(`/csm/accounts/${accountId}`);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return ' ⇅';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPersona="CSM"
        onPersonaChange={() => {}} 
      />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          <button
            onClick={() => router.push('/csm')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium transition-colors"
          >
            ← Back to Portfolio Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Portfolio Health Score</h1>
              <p className="text-lg text-gray-700 font-medium">Comprehensive analysis of your portfolio health metrics</p>
              <p className="text-sm text-gray-600 mt-1">
                Real-time synthetic data analysis | Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm">
                📊 Export Report
              </button>
              <button className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md">
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Portfolio Health Score & Components */}
        
        {/* First Row: Portfolio Health, Usage Health, Engagement Health */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* All first row KPIs have consistent height */}
          {/* Main Health Score - Clickable */}
          <div 
            onClick={() => router.push('/csm/kpi/portfolio-health')}
            className={`rounded-xl border-2 p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 min-h-[280px] flex flex-col ${
              healthData.portfolioHealthScore >= 75
                ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                : healthData.portfolioHealthScore >= 60
                ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50'
                : 'border-red-300 bg-gradient-to-br from-red-50 to-rose-50'
            }`}
          >
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Portfolio Health</div>
            <div className={`text-6xl font-bold mb-2 ${
              healthData.portfolioHealthScore >= 75 
                ? 'text-green-600'
                : healthData.portfolioHealthScore >= 60
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              {Math.round(healthData.portfolioHealthScore)}
            </div>
            <div className="flex items-center gap-2 text-sm mb-3">
              <span className="text-green-600 font-semibold">↗ +3</span>
              <span className="text-gray-500 text-xs">(30d)</span>
            </div>
            <div className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
              healthData.portfolioHealthScore >= 75 
                ? 'bg-green-600 text-white'
                : healthData.portfolioHealthScore >= 60
                ? 'bg-yellow-600 text-white'
                : 'bg-red-600 text-white'
            }`}>
              {healthData.portfolioHealthScore >= 75 ? '🌟 Thriving' : healthData.portfolioHealthScore >= 60 ? '⚠️ Monitor' : '🚨 At Risk'}
            </div>
          </div>

          {/* Usage Health (First Component) */}
          {healthData.components[0] && (
            <div 
              onClick={() => {
                const kpiMap: { [key: string]: string } = {
                  'Usage Health': '/csm/kpi/portfolio-utilization',
                  'Engagement Health': '/csm/kpi/engagement',
                  'Support Health': '/csm/kpi/churn-rate',
                  'Business Outcome': '/csm/kpi/grr'
                };
                const path = kpiMap[healthData.components[0].name] || '/csm';
                router.push(path);
              }}
              className="rounded-xl border-2 border-gray-200 p-6 bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer hover:border-blue-300 min-h-[280px] flex flex-col"
            >
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{healthData.components[0].name}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs text-gray-600 font-medium px-2 py-0.5 bg-gray-100 rounded">{healthData.components[0].weight}%</div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-3xl font-bold ${
                  healthData.components[0].status === 'success' ? 'text-green-600' :
                  healthData.components[0].status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(healthData.components[0].score)}
                </span>
                <span className={`text-sm font-semibold ${
                  healthData.components[0].trend === 'up' ? 'text-green-600' : 
                  healthData.components[0].trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {healthData.components[0].trend === 'up' ? '↗' : healthData.components[0].trend === 'down' ? '↘' : '→'} +{healthData.components[0].score >= 90 ? '3.4' : '1.8'}
                </span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                healthData.components[0].status === 'success' ? 'bg-green-100 text-green-800' :
                healthData.components[0].status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {healthData.components[0].status === 'success' ? '✓ Excellent' : healthData.components[0].status === 'warning' ? '⚠ Monitor' : '✗ Alert'}
              </div>
            </div>
          )}

          {/* Engagement Health (Second Component) */}
          {healthData.components[1] && (
            <div 
              onClick={() => {
                const kpiMap: { [key: string]: string } = {
                  'Usage Health': '/csm/kpi/portfolio-utilization',
                  'Engagement Health': '/csm/kpi/engagement',
                  'Support Health': '/csm/kpi/churn-rate',
                  'Business Outcome': '/csm/kpi/grr'
                };
                const path = kpiMap[healthData.components[1].name] || '/csm';
                router.push(path);
              }}
              className="rounded-xl border-2 border-gray-200 p-6 bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer hover:border-blue-300 min-h-[280px] flex flex-col"
            >
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{healthData.components[1].name}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs text-gray-600 font-medium px-2 py-0.5 bg-gray-100 rounded">{healthData.components[1].weight}%</div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-3xl font-bold ${
                  healthData.components[1].status === 'success' ? 'text-green-600' :
                  healthData.components[1].status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(healthData.components[1].score)}
                </span>
                <span className={`text-sm font-semibold ${
                  healthData.components[1].trend === 'up' ? 'text-green-600' : 
                  healthData.components[1].trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {healthData.components[1].trend === 'up' ? '↗' : healthData.components[1].trend === 'down' ? '↘' : '→'} +{healthData.components[1].score >= 90 ? '3.4' : '1.8'}
                </span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                healthData.components[1].status === 'success' ? 'bg-green-100 text-green-800' :
                healthData.components[1].status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {healthData.components[1].status === 'success' ? '✓ Excellent' : healthData.components[1].status === 'warning' ? '⚠ Monitor' : '✗ Alert'}
              </div>
            </div>
          )}
        </div>

        {/* Second Row: Total ARR, Support Health, Business Outcome */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Total ARR - Clickable */}
          <div 
            onClick={() => router.push('/csm/accounts?filter=all')}
            className="rounded-xl border-2 border-gray-200 p-6 flex flex-col justify-center bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer hover:border-blue-300"
          >
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total ARR</div>
            <div className="text-3xl font-bold text-gray-900">${(totalARR / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-gray-600 mt-1">{accounts.length} accounts</div>
          </div>

          {/* Support Health (Third Component) */}
          {healthData.components[2] && (
            <div 
              onClick={() => {
                const kpiMap: { [key: string]: string } = {
                  'Usage Health': '/csm/kpi/portfolio-utilization',
                  'Engagement Health': '/csm/kpi/engagement',
                  'Support Health': '/csm/kpi/churn-rate',
                  'Business Outcome': '/csm/kpi/grr'
                };
                const path = kpiMap[healthData.components[2].name] || '/csm';
                router.push(path);
              }}
              className="rounded-xl border-2 border-gray-200 p-6 bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer hover:border-blue-300"
            >
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{healthData.components[2].name}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs text-gray-600 font-medium px-2 py-0.5 bg-gray-100 rounded">{healthData.components[2].weight}%</div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-3xl font-bold ${
                  healthData.components[2].status === 'success' ? 'text-green-600' :
                  healthData.components[2].status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(healthData.components[2].score)}
                </span>
                <span className={`text-sm font-semibold ${
                  healthData.components[2].trend === 'up' ? 'text-green-600' : 
                  healthData.components[2].trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {healthData.components[2].trend === 'up' ? '↗' : healthData.components[2].trend === 'down' ? '↘' : '→'} +{healthData.components[2].score >= 90 ? '3.4' : '1.8'}
                </span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                healthData.components[2].status === 'success' ? 'bg-green-100 text-green-800' :
                healthData.components[2].status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {healthData.components[2].status === 'success' ? '✓ Excellent' : healthData.components[2].status === 'warning' ? '⚠ Monitor' : '✗ Alert'}
              </div>
            </div>
          )}

          {/* Business Outcome (Fourth Component) */}
          {healthData.components[3] && (
            <div 
              onClick={() => {
                const kpiMap: { [key: string]: string } = {
                  'Usage Health': '/csm/kpi/portfolio-utilization',
                  'Engagement Health': '/csm/kpi/engagement',
                  'Support Health': '/csm/kpi/churn-rate',
                  'Business Outcome': '/csm/kpi/grr'
                };
                const path = kpiMap[healthData.components[3].name] || '/csm';
                router.push(path);
              }}
              className="rounded-xl border-2 border-gray-200 p-6 bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer hover:border-blue-300"
            >
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{healthData.components[3].name}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-xs text-gray-600 font-medium px-2 py-0.5 bg-gray-100 rounded">{healthData.components[3].weight}%</div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-3xl font-bold ${
                  healthData.components[3].status === 'success' ? 'text-green-600' :
                  healthData.components[3].status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(healthData.components[3].score)}
                </span>
                <span className={`text-sm font-semibold ${
                  healthData.components[3].trend === 'up' ? 'text-green-600' : 
                  healthData.components[3].trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {healthData.components[3].trend === 'up' ? '↗' : healthData.components[3].trend === 'down' ? '↘' : '→'} +{healthData.components[3].score >= 90 ? '3.4' : '1.8'}
                </span>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                healthData.components[3].status === 'success' ? 'bg-green-100 text-green-800' :
                healthData.components[3].status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {healthData.components[3].status === 'success' ? '✓ Excellent' : healthData.components[3].status === 'warning' ? '⚠ Monitor' : '✗ Alert'}
              </div>
            </div>
          )}
        </div>

        {/* Health Score Calculation & Distribution */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Health Score Calculation */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm min-h-[600px] flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Health Score Calculation</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-sm font-semibold text-blue-800 mb-2">
                  🎯 Using REAL KPI Values from Main Dashboard
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• Usage Health = Avg Utilization Rate</div>
                  <div>• Engagement Health = Customer Engagement Score</div>
                  <div>• Support Health = Derived from Churn & Renewal Rates</div>
                  <div>• Business Outcome = Based on GRR & Time to Value</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Portfolio Health Score = Weighted Average of 4 Components
              </div>
              
              {healthData.components.map((component: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${
                      component.status === 'success' ? 'bg-green-500' :
                      component.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{component.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {Math.round(component.score)} × {component.weight}% = {Math.round(component.contribution)}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Portfolio Health:</span>
                  <span className="text-xl font-bold text-blue-600">{Math.round(healthData.portfolioHealthScore)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Health Distribution with Clickable Donut */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Health Distribution</h3>
              <span className="text-xs text-gray-500">Click categories to filter accounts</span>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              {/* Clickable Donut Chart - Increased Size */}
              <div className="relative w-72 h-72 cursor-pointer">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {healthDistribution.map((category, idx) => {
                    const percentage = category.percentage / 100;
                    const circumference = 2 * Math.PI * 35;
                    const strokeDasharray = `${percentage * circumference} ${circumference}`;
                    const rotation = healthDistribution.slice(0, idx).reduce((sum, cat) => sum + (cat.percentage / 100) * circumference, 0);
                    
                    return (
                      <circle
                        key={idx}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke={
                          category.category.includes('Thriving') ? '#10b981' :
                          category.category.includes('Healthy') ? '#22c55e' :
                          category.category.includes('Stable') ? '#eab308' :
                          category.category.includes('At Risk') ? '#f97316' : '#ef4444'
                        }
                        strokeWidth="16"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={-rotation}
                        className="hover:opacity-80 transition-all duration-300 cursor-pointer"
                        onClick={() => handleDistributionClick(category.category)}
                        style={{ 
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                          strokeLinecap: 'round'
                        }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-5xl font-bold text-gray-900">{Math.round(healthData.portfolioHealthScore)}</div>
                  <div className="text-sm text-gray-500 mt-2">Portfolio Health</div>
                </div>
              </div>
            </div>

            {/* Clickable Legend - Below Donut Chart */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {healthDistribution.map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDistributionClick(category.category)}
                  className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left border border-gray-100"
                >
                  <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${
                    category.category.includes('Thriving') ? 'bg-green-600' :
                    category.category.includes('Healthy') ? 'bg-green-500' :
                    category.category.includes('Stable') ? 'bg-yellow-500' :
                    category.category.includes('At Risk') ? 'bg-orange-500' : 'bg-red-600'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800 truncate">
                      {category.category} ({category.range})
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {category.accounts} accounts ({category.percentage.toFixed(0)}%)
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      ${(category.arr / 1000000).toFixed(1)}M →
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Total Accounts</div>
                  <div className="font-semibold text-gray-900">{accounts.length}</div>
                </div>
                <div>
                  <div className="text-gray-600">Total ARR</div>
                  <div className="font-semibold text-gray-900">${(totalARR / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-gray-600">Healthy Target</div>
                  <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {((healthDistribution.slice(0, 2).reduce((sum, cat) => sum + cat.percentage, 0))).toFixed(0)}% / 85%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Account Contributions Table */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Top Account Contributions</h3>
                <p className="text-sm text-gray-600 mt-1">Click account to view details | Sorted by ARR impact</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPerPage(10)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${perPage === 10 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  10 per page
                </button>
                <button
                  onClick={() => setPerPage(20)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${perPage === 20 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  20 per page
                </button>
              </div>
            </div>
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search by account name, tier, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('name')} className="flex items-center hover:text-blue-600 transition-colors">
                      Account Name{getSortIcon('name')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('tier')} className="flex items-center hover:text-blue-600 transition-colors">
                      Tier{getSortIcon('tier')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('healthScore')} className="flex items-center justify-center hover:text-blue-600 transition-colors mx-auto">
                      Health Score{getSortIcon('healthScore')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('trend30d')} className="flex items-center justify-center hover:text-blue-600 transition-colors mx-auto">
                      30d Trend{getSortIcon('trend30d')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('arr')} className="flex items-center justify-end hover:text-blue-600 transition-colors ml-auto">
                      ARR{getSortIcon('arr')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button onClick={() => handleSort('weight')} className="flex items-center justify-center hover:text-blue-600 transition-colors mx-auto">
                      Weight{getSortIcon('weight')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Components</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAccounts.map((account: any, idx: number) => (
                  <tr 
                    key={idx} 
                    onClick={() => handleAccountClick(account.id)}
                    className="hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                    title="Click to view account details"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700">
                        {(currentPage - 1) * perPage + idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600">{account.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 group-hover:bg-blue-100 group-hover:text-blue-800">
                        {account.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-block px-2 py-1 text-sm font-semibold rounded ${
                        account.healthScore >= 90 ? 'bg-green-100 text-green-800' :
                        account.healthScore >= 75 ? 'bg-teal-100 text-teal-800' :
                        account.healthScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        account.healthScore >= 45 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {account.healthScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`text-sm font-medium ${
                        account.trend30d > 0 ? 'text-green-600' : account.trend30d < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {account.trend30d > 0 ? '↗' : account.trend30d < 0 ? '↘' : '—'} {account.trend30d !== 0 ? Math.abs(account.trend30d) : '0'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ${(account.arr / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                      {account.weight.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          account.components.usage >= 90 ? 'bg-blue-100 text-blue-800' :
                          account.components.usage >= 75 ? 'bg-green-100 text-green-800' :
                          account.components.usage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          U:{Math.round(account.components.usage)}
                        </span>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          account.components.engagement >= 90 ? 'bg-blue-100 text-blue-800' :
                          account.components.engagement >= 75 ? 'bg-green-100 text-green-800' :
                          account.components.engagement >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          E:{Math.round(account.components.engagement)}
                        </span>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          account.components.support >= 90 ? 'bg-blue-100 text-blue-800' :
                          account.components.support >= 75 ? 'bg-green-100 text-green-800' :
                          account.components.support >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          S:{Math.round(account.components.support)}
                        </span>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          account.components.business >= 90 ? 'bg-blue-100 text-blue-800' :
                          account.components.business >= 75 ? 'bg-green-100 text-green-800' :
                          account.components.business >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          B:{Math.round(account.components.business)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t-2 border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="text-sm font-medium text-gray-700">
              Showing <span className="font-bold text-gray-900">{((currentPage - 1) * perPage) + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * perPage, sortedAccounts.length)}</span> of <span className="font-bold text-blue-600">{sortedAccounts.length}</span> accounts
              {searchTerm && <span className="ml-2 text-blue-600">(filtered from {accounts.length})</span>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Previous
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="text-gray-500">...</span>}
              {totalPages > 5 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === totalPages
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </button>
              )}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Action Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-300 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Action Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {healthData.insights.map((insight: string, idx: number) => (
                  <li key={idx}>• {insight}</li>
                ))}
                <li>• Focus on improving {healthData.components.find((c: any) => c.status !== 'success')?.name || 'weaker components'}</li>
                <li>• Review accounts with declining 30-day trends for intervention</li>
                <li>• Consider increasing touchpoint frequency for at-risk accounts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

