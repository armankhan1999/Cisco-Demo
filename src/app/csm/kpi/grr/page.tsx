'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import { calculateAllKPIs, calculateGRR } from '@/lib/kpis/csmKPICalculations';
import { getActiveAccounts, getAllRevenueMovements, getActiveSubscriptions } from '@/lib/data/csmDataLoader';

export default function GRRDrillDown() {
  const [loading, setLoading] = useState(true);
  const [grrData, setGRRData] = useState<any>(null);
  const [tierBreakdown, setTierBreakdown] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    try {
      console.log('💰 Loading GRR Drill-Down Data...');
      
      // Get main GRR calculation
      const mainGRR = calculateGRR();
      const allAccounts = getActiveAccounts();
      const revenueMovements = getAllRevenueMovements();
      const subscriptions = getActiveSubscriptions();
      
      // Calculate GRR by tier
      const tierStats: { [tier: string]: any } = {};
      
      // Initialize tier stats
      allAccounts.forEach(acc => {
        const tier = acc.account.tier;
        if (!tierStats[tier]) {
          tierStats[tier] = {
            tier,
            totalARR: 0,
            accountCount: 0,
            churnedARR: 0,
            contractedARR: 0,
            retainedARR: 0
          };
        }
        tierStats[tier].totalARR += acc.account.arr;
        tierStats[tier].accountCount += 1;
      });
      
      // Calculate churn and contraction by tier
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      revenueMovements
        .filter(m => {
          const effectiveDate = new Date(m.effective_date);
          return effectiveDate >= oneYearAgo && 
                 (m.movement_type === 'churn' || m.movement_type === 'contraction');
        })
        .forEach(movement => {
          const account = allAccounts.find(acc => acc.account.id === movement.customer_id);
          if (account) {
            const tier = account.account.tier;
            if (tierStats[tier]) {
              if (movement.movement_type === 'churn') {
                tierStats[tier].churnedARR += Math.abs(movement.arr_change);
              } else if (movement.movement_type === 'contraction') {
                tierStats[tier].contractedARR += Math.abs(movement.arr_change);
              }
            }
          }
        });
      
      // Calculate GRR for each tier
      const tierBreakdownData = Object.values(tierStats).map((tier: any) => {
        const totalLoss = tier.churnedARR + tier.contractedARR;
        tier.retainedARR = tier.totalARR - totalLoss;
        tier.grr = tier.totalARR > 0 ? (tier.retainedARR / tier.totalARR) * 100 : 0;
        tier.churnRate = tier.totalARR > 0 ? (tier.churnedARR / tier.totalARR) * 100 : 0;
        tier.contractionRate = tier.totalARR > 0 ? (tier.contractedARR / tier.totalARR) * 100 : 0;
        
        return tier;
      }).sort((a, b) => b.totalARR - a.totalARR);
      
      // Get recent revenue movements for detail table
      const recentMovements = revenueMovements
        .filter(m => m.movement_type === 'churn' || m.movement_type === 'contraction')
        .map(movement => {
          const account = allAccounts.find(acc => acc.account.id === movement.customer_id);
          return {
            ...movement,
            accountName: account?.account.name || 'Unknown',
            tier: account?.account.tier || 'Unknown',
            healthScore: account?.account.health_score || 0
          };
        })
        .sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime());
      
      // Calculate historical trend (mock quarterly data)
      const historicalTrend = [
        { period: 'Q1 2024', grr: 94.2, churn: 4.8, contraction: 1.0 },
        { period: 'Q2 2024', grr: 96.8, churn: 2.5, contraction: 0.7 },
        { period: 'Q3 2024', grr: 98.1, churn: 1.2, contraction: 0.7 },
        { period: 'Q4 2024', grr: mainGRR.value, churn: tierBreakdownData.reduce((sum, t) => sum + t.churnRate, 0) / tierBreakdownData.length, contraction: tierBreakdownData.reduce((sum, t) => sum + t.contractionRate, 0) / tierBreakdownData.length }
      ];
      
      setGRRData({
        overallGRR: mainGRR.value,
        totalARR: tierBreakdownData.reduce((sum, t) => sum + t.totalARR, 0),
        totalChurnedARR: tierBreakdownData.reduce((sum, t) => sum + t.churnedARR, 0),
        totalContractedARR: tierBreakdownData.reduce((sum, t) => sum + t.contractedARR, 0),
        totalRetainedARR: tierBreakdownData.reduce((sum, t) => sum + t.retainedARR, 0),
        historicalTrend
      });
      
      setTierBreakdown(tierBreakdownData);
      setMovements(recentMovements);
      setLoading(false);
      
      console.log(`💰 GRR Analysis Complete:`);
      console.log(`  Overall GRR: ${mainGRR.value.toFixed(1)}%`);
      console.log(`  Total ARR: $${tierBreakdownData.reduce((sum, t) => sum + t.totalARR, 0).toLocaleString()}`);
      
    } catch (error) {
      console.error('Error loading GRR data:', error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading GRR Analysis...</div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(movements.length / perPage);
  const paginatedMovements = movements.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPersona="CSM"
        onPersonaChange={() => {}} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/csm/portfolio" 
              className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Portfolio Dashboard
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gross Revenue Retention (GRR)</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive analysis of revenue retention excluding expansions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Export Report
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall GRR</p>
                  <p className="text-3xl font-bold text-green-600">
                    {grrData.overallGRR.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-center text-sm font-medium ${
                  grrData.overallGRR >= 95 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {grrData.overallGRR >= 95 ? '✓ Above Target' : '⚠️ Below Target'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Retained ARR</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${(grrData.totalRetainedARR / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-blue-600">
                  📈 Revenue Retained
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Churned ARR</p>
                  <p className="text-3xl font-bold text-red-600">
                    ${(grrData.totalChurnedARR / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-red-600">
                  📉 Lost Revenue
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contracted ARR</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${(grrData.totalContractedARR / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-orange-600">
                  📊 Downgrades
                </span>
              </div>
            </div>
          </div>

          {/* GRR by Tier Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-6">GRR Breakdown by Customer Tier</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accounts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total ARR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retained ARR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GRR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Churn Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contraction</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tierBreakdown.map((tier: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tier.tier}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tier.accountCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(tier.totalARR / 1000000).toFixed(1)}M
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${(tier.retainedARR / 1000000).toFixed(1)}M
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tier.grr >= 95 ? 'bg-green-100 text-green-800' :
                          tier.grr >= 90 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tier.grr.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tier.churnRate.toFixed(1)}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tier.contractionRate.toFixed(1)}%</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Trend */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-6">GRR Historical Trend</h3>
            <div className="grid grid-cols-4 gap-6">
              {grrData.historicalTrend.map((period: any, idx: number) => (
                <div key={idx} className="text-center">
                  <div className="text-lg font-bold text-gray-900">{period.period}</div>
                  <div className="text-2xl font-bold text-green-600 mt-2">{period.grr.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Churn: {period.churn.toFixed(1)}% | Contraction: {period.contraction.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Revenue Movements */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Revenue Movements (Churn & Contraction)</h3>
              <div className="flex items-center gap-4">
                <select 
                  value={perPage} 
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, movements.length)} of {movements.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ARR Impact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedMovements.map((movement: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(movement.effective_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{movement.accountName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          movement.movement_type === 'churn' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {movement.movement_type.charAt(0).toUpperCase() + movement.movement_type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">
                          -${Math.abs(movement.arr_change).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{movement.tier}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{movement.healthScore}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Action Insights */}
          <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">GRR Analysis Insights</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Current GRR of {grrData.overallGRR.toFixed(1)}% {grrData.overallGRR >= 95 ? 'exceeds' : 'is below'} the 95% target</li>
                  <li>• Total churned ARR: ${(grrData.totalChurnedARR / 1000000).toFixed(1)}M represents revenue lost to non-renewals</li>
                  <li>• {tierBreakdown.find(t => t.grr < 90)?.tier || 'All tiers'} showing strong retention performance</li>
                  <li>• Monitor {movements.filter(m => m.movement_type === 'churn').length} recent churn events for patterns</li>
                  <li>• Focus on preventing contraction in {tierBreakdown.filter(t => t.contractionRate > 1).length} underperforming tiers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
