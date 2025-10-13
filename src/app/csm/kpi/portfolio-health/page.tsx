'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { useSidebar } from '../../../../contexts/SidebarContext';
import { calculateHealthDecomposition } from '@/lib/kpis/csmHealthDecomposition';
import { calculateHealthDistribution } from '@/lib/kpis/csmKPICalculations';
import { getActiveAccounts } from '@/lib/data/csmDataLoader';

export default function PortfolioHealthDrillDown() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<any>(null);
  const [healthDistribution, setHealthDistribution] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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

  const totalARR = accounts.reduce((sum, acc) => sum + acc.arr, 0);
  const paginatedAccounts = accounts.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(accounts.length / perPage);

  const handleDistributionClick = (category: string) => {
    console.log(`Clicked on ${category} distribution`);
    // TODO: Navigate to filtered accounts page
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
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <button
          onClick={() => router.push('/csm')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium transition-colors"
        >
          ← Back to Portfolio Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Portfolio Health Score</h1>
            <p className="text-lg text-gray-600 font-medium">Comprehensive analysis of your portfolio health metrics</p>
            <p className="text-sm text-gray-500 mt-1">
              Real-time synthetic data analysis | Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm">
              Export Report
            </button>
            <button className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg">
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Portfolio Health Score & Components */}
        <div className="space-y-6 mb-8">
          {/* Row 1: 3 KPIs */}
          <div className="grid grid-cols-3 gap-6">
            {/* Main Health Score */}
            <div className={`rounded-lg border-2 p-6 h-48 flex flex-col justify-between ${
              healthData.portfolioHealthScore >= 75
                ? 'border-green-200'
                : healthData.portfolioHealthScore >= 60
                ? 'border-yellow-200'
                : 'border-red-200'
            }`} style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-xs text-gray-600 mb-1">Overall Health Score</div>
              <div className={`text-4xl font-bold ${
                healthData.portfolioHealthScore >= 75 
                  ? 'text-green-600'
                  : healthData.portfolioHealthScore >= 60
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}>
                {Math.round(healthData.portfolioHealthScore)}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">↗ +3</span>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  healthData.portfolioHealthScore >= 75 
                    ? 'bg-green-100 text-green-800'
                    : healthData.portfolioHealthScore >= 60
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {healthData.portfolioHealthScore >= 75 ? 'Thriving' : healthData.portfolioHealthScore >= 60 ? 'Monitor' : 'At Risk'}
                </div>
              </div>
            </div>

            {/* Component Scores - First 2 */}
            {healthData.components.slice(0, 2).map((component: any, idx: number) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-6 h-48 flex flex-col justify-between" style={{ backgroundColor: '#F3F3F3' }}>
                <div>
                  <div className="text-xs text-gray-600 mb-1">{component.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{component.weight}%</div>
                </div>
                <div className={`text-4xl font-bold ${
                  component.status === 'success' ? 'text-green-600' :
                  component.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(component.score)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {component.trend === 'up' ? '↗' : component.trend === 'down' ? '↘' : '→'} +{component.score >= 90 ? '3' : '2'}
                  </span>
                  <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    component.status === 'success' ? 'bg-green-100 text-green-800' :
                    component.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {component.status === 'success' ? 'Excellent' : component.status === 'warning' ? 'Monitor' : 'Alert'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 2 KPIs */}
          <div className="grid grid-cols-3 gap-6">
            {/* Total ARR */}
            <div className="rounded-lg border border-gray-200 p-6 h-48 flex flex-col justify-between" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="text-xs text-gray-600 mb-1">Total ARR</div>
              <div className="text-4xl font-bold text-gray-900">${(totalARR / 1000000).toFixed(1)}M</div>
              <div></div>
            </div>

            {/* Component Scores - Last 2 */}
            {healthData.components.slice(2, 4).map((component: any, idx: number) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-6 h-48 flex flex-col justify-between" style={{ backgroundColor: '#F3F3F3' }}>
                <div>
                  <div className="text-xs text-gray-600 mb-1">{component.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{component.weight}%</div>
                </div>
                <div className={`text-4xl font-bold ${
                  component.status === 'success' ? 'text-green-600' :
                  component.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(component.score)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {component.trend === 'up' ? '↗' : component.trend === 'down' ? '↘' : '→'} +{component.score >= 90 ? '3' : '2'}
                  </span>
                  <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    component.status === 'success' ? 'bg-green-100 text-green-800' :
                    component.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {component.status === 'success' ? 'Excellent' : component.status === 'warning' ? 'Monitor' : 'Alert'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Score Calculation & Distribution */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Health Score Calculation */}
          <div className="rounded-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
            <h3 className="font-semibold text-gray-900 mb-4">Health Score Calculation</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="text-sm font-semibold text-blue-800 mb-2">
                  🎯 Using REAL KPI Values from Main Dashboard
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• Usage Health = Avg Utilization Rate ({Math.round(healthData.components.find((c: any) => c.name === 'Usage Health')?.score)})</div>
                  <div>• Engagement Health = Customer Engagement Score ({Math.round(healthData.components.find((c: any) => c.name === 'Engagement Health')?.score)})</div>
                  <div>• Support Health = Derived from Churn & Renewal Rates</div>
                  <div>• Business Outcome = Based on GRR & Time to Value</div>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-2 font-medium">
                Health Score Formula:
              </div>
              <div className="text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg font-mono">
                Health Score (0-100) = <br/>
                &nbsp;&nbsp;(Usage Health × 40%) +<br/>
                &nbsp;&nbsp;(Engagement Health × 30%) +<br/>
                &nbsp;&nbsp;(Support Health × 20%) +<br/>
                &nbsp;&nbsp;(Business Outcome × 10%)
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
          <div className="rounded-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
            <h3 className="font-semibold text-gray-900 mb-6">Health Distribution</h3>
            
            <div className="flex items-center justify-center mb-6">
              {/* Clickable Donut Chart */}
              <div className="relative w-48 h-48 cursor-pointer">
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
                          category.status === 'success' ? '#10b981' :
                          category.status === 'warning' ? '#f59e0b' : '#ef4444'
                        }
                        strokeWidth="12"
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
                  <div className="text-3xl font-bold text-gray-900">{healthData.portfolioHealthScore}</div>
                  <div className="text-xs text-gray-500">Portfolio Health</div>
                </div>
              </div>
            </div>

            {/* Clickable Legend */}
            <div className="space-y-2">
              {healthDistribution.map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDistributionClick(category.category)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      category.status === 'success' ? 'bg-green-500' :
                      category.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {category.category} ({category.range}):
                    </span>
                    <span className="text-sm text-gray-600">
                      {category.accounts} accounts ({category.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    ${(category.arr / 1000000).toFixed(1)}M →
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
        <div className="rounded-lg border border-gray-200" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Top Account Contributions</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPerPage(10)}
                className={`px-3 py-1 text-sm rounded ${perPage === 10 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                10 per page
              </button>
              <button
                onClick={() => setPerPage(20)}
                className={`px-3 py-1 text-sm rounded ${perPage === 20 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                20 per page
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Health Score</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">30d Trend</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ARR</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Weight</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Components</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAccounts.map((account: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(currentPage - 1) * perPage + idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{account.tier}</td>
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
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, accounts.length)} of {accounts.length} accounts
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
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
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Action Recommendations */}
        <div className="mt-8 bg-yellow-50 rounded-lg border border-yellow-200 p-6">
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

