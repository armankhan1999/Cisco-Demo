'use client';

import { useEffect, useState } from 'react';
import { getActiveAccounts } from '@/lib/data/csmDataLoader';
import qbrTrackingData from '@/source_data/csm-data/qbr_tracking.json';

// Helper function to calculate quarterly trends from QBR dates
function calculateQuarterlyTrends(allQBRs: any[], accounts: any[]) {
  const quarters = [
    { key: 'q4_2024', period: 'Q4 2024', start: new Date('2024-10-01'), end: new Date('2024-12-31') },
    { key: 'q1_2025', period: 'Q1 2025', start: new Date('2025-01-01'), end: new Date('2025-03-31') },
    { key: 'q2_2025', period: 'Q2 2025', start: new Date('2025-04-01'), end: new Date('2025-06-30') }
  ];
  
  const results: any = {};
  
  quarters.forEach(quarter => {
    const qbrsInQuarter = allQBRs.filter(qbr => {
      const qbrDate = new Date(qbr.qbr_date);
      return qbrDate >= quarter.start && qbrDate <= quarter.end;
    });
    
    // Calculate avg prep time for this quarter
    const avgPrepTime = qbrsInQuarter.length > 0
      ? qbrsInQuarter.reduce((sum, qbr) => sum + (qbr.prep_time_hours || 0), 0) / qbrsInQuarter.length
      : 0;
    
    // Count unique accounts with QBRs in this quarter
    const accountsWithQBR = new Set(qbrsInQuarter.map(qbr => qbr.account_id)).size;
    const totalAccounts = accounts.length;
    const completionRate = totalAccounts > 0 ? (accountsWithQBR / totalAccounts) * 100 : 0;
    
    results[quarter.key] = {
      period: quarter.period,
      completionRate: Math.round(completionRate * 10) / 10,
      onTimeQBRs: accountsWithQBR,
      totalQBRs: totalAccounts,
      avgPrepTime: Math.round(avgPrepTime * 10) / 10,
      qbrsCompleted: qbrsInQuarter.length
    };
  });
  
  return results;
}

export function QBRCompletionAnalysis() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    try {
      const qbrTracking = qbrTrackingData as any[];
      const accounts = getActiveAccounts();
      
      // Use actual account count from accounts.json (50 unique accounts)
      const actualTotalAccounts = accounts.length;
      
      // Calculate QBR completion using same logic as Portfolio Dashboard
      // Count accounts with QBR in last 120 days
      const now = Date.now();
      const daysAgo120 = 120 * 24 * 60 * 60 * 1000;
      
      // Extract all QBR records from nested structure
      const allQBRs: any[] = [];
      qbrTracking.forEach(csmData => {
        if (csmData.qbr_history && Array.isArray(csmData.qbr_history)) {
          allQBRs.push(...csmData.qbr_history);
        }
      });
      
      // Count accounts with recent QBR (last 120 days)
      let accountsWithRecentQBR = 0;
      accounts.forEach(account => {
        const accountQBRs = allQBRs.filter(q => q.account_id === account.account.id);
        const hasRecentQBR = accountQBRs.some(qbr => {
          const qbrDate = new Date(qbr.qbr_date).getTime();
          return (now - qbrDate) <= daysAgo120;
        });
        if (hasRecentQBR) accountsWithRecentQBR++;
      });
      
      const compliantAccounts = accountsWithRecentQBR;
      const overdueAccounts = actualTotalAccounts - compliantAccounts;
      
      // Calculate comprehensive metrics
      let totalAccounts = 0;
      let totalAtRiskARR = 0;
      let totalPrepTime = 0;
      let totalQBRs = 0;
      let manualQBRs = 0;
      let autoQBRs = 0;
      
      // Build CSM and Tier maps by recalculating with 120-day logic
      const tierMap = new Map();
      const csmMap = new Map();
      const allOverdueAccounts: any[] = [];
      
      // Initialize CSM metrics and create CSM name map
      const csmMetricsMap = new Map();
      const csmNameMap = new Map();
      qbrTracking.forEach(csmData => {
        csmNameMap.set(csmData.csm_id, csmData.csm_name);
        csmMetricsMap.set(csmData.csm_id, {
          csmId: csmData.csm_id,
          csmName: csmData.csm_name,
          totalAccounts: 0,
          compliantAccounts: 0,
          overdueAccounts: 0,
          completionRate: 0,
          totalQBRsCompleted: csmData.qbr_history?.length || 0,
          avgPrepTime: 0
        });
        
        if (csmData.qbr_history && csmData.qbr_history.length > 0) {
          const totalPrepTimeForCSM = csmData.qbr_history.reduce((sum: number, qbr: any) => sum + (qbr.prep_time_hours || 0), 0);
          const metrics = csmMetricsMap.get(csmData.csm_id);
          metrics.avgPrepTime = totalPrepTimeForCSM / csmData.qbr_history.length;
          totalPrepTime += totalPrepTimeForCSM;
          totalQBRs += csmData.qbr_history.length;
          
          csmData.qbr_history.forEach((qbr: any) => {
            if (qbr.generation_method === 'Manual') manualQBRs++;
            else if (qbr.generation_method === 'Auto') autoQBRs++;
          });
        }
        
      });
      
      // Dynamically recalculate tier and CSM breakdowns using 120-day logic
      accounts.forEach(account => {
        const accountId = account.account.id;
        const tier = account.account.tier;
        const csmId = account.account.csm_id;
        
        // Check if account has recent QBR (120 days)
        const accountQBRs = allQBRs.filter(q => q.account_id === accountId);
        const hasRecentQBR = accountQBRs.some(qbr => {
          const qbrDate = new Date(qbr.qbr_date).getTime();
          return (now - qbrDate) <= daysAgo120;
        });
        
        // Initialize tier if not exists
        if (!tierMap.has(tier)) {
          tierMap.set(tier, {
            tier: tier,
            qbrFrequencyDays: tier === 'Strategic' ? 90 : 180,
            totalAccounts: 0,
            compliant: 0,
            overdue: 0,
            completionRate: 0
          });
        }
        
        // Update tier metrics
        const tierMetrics = tierMap.get(tier);
        tierMetrics.totalAccounts++;
        if (hasRecentQBR) {
          tierMetrics.compliant++;
        } else {
          tierMetrics.overdue++;
          
          // Find last QBR date for overdue calculation
          const lastQBR = accountQBRs.length > 0 
            ? accountQBRs.sort((a, b) => new Date(b.qbr_date).getTime() - new Date(a.qbr_date).getTime())[0]
            : null;
          
          const daysSinceLastQBR = lastQBR 
            ? Math.floor((now - new Date(lastQBR.qbr_date).getTime()) / (24 * 60 * 60 * 1000))
            : 999;
          
          allOverdueAccounts.push({
            account_id: accountId,
            account_name: account.account.name,
            last_qbr_date: lastQBR ? lastQBR.qbr_date : null,
            days_overdue: lastQBR ? Math.max(0, daysSinceLastQBR - 120) : null,
            days_since_last: lastQBR ? daysSinceLastQBR : null,
            arr: account.account.arr || 0,
            tier: tier,
            csm: csmNameMap.get(csmId) || csmId,
            qbrFrequency: tier === 'Strategic' ? 90 : 180
          });
          
          totalAtRiskARR += account.account.arr || 0;
        }
        
        // Update CSM metrics
        if (csmMetricsMap.has(csmId)) {
          const csmMetrics = csmMetricsMap.get(csmId);
          csmMetrics.totalAccounts++;
          if (hasRecentQBR) {
            csmMetrics.compliantAccounts++;
          } else {
            csmMetrics.overdueAccounts++;
          }
        }
      });
      
      // Calculate completion rates
      tierMap.forEach((tier: any) => {
        if (tier.totalAccounts > 0) {
          tier.completionRate = (tier.compliant / tier.totalAccounts) * 100;
        }
      });
      
      csmMetricsMap.forEach((csm: any) => {
        if (csm.totalAccounts > 0) {
          csm.completionRate = (csm.compliantAccounts / csm.totalAccounts) * 100;
        }
      });
      
      
      // Use actual account count for accurate completion rate
      const overallCompletionRate = actualTotalAccounts > 0 ? (compliantAccounts / actualTotalAccounts) * 100 : 0;
      const avgPrepTime = totalQBRs > 0 ? totalPrepTime / totalQBRs : 0;
      
      allOverdueAccounts.sort((a, b) => (b.days_overdue || 0) - (a.days_overdue || 0));
      
      // Calculate real historical quarterly trends from QBR dates
      const quarterlyData = calculateQuarterlyTrends(allQBRs, accounts);
      
      console.log('📊 Quarterly QBR Data:', quarterlyData);
      console.log('📅 Total QBRs found:', allQBRs.length);
      
      const historicalTrend = [
        quarterlyData.q4_2024,
        quarterlyData.q1_2025,
        quarterlyData.q2_2025,
        { period: 'Q3 2025', completionRate: overallCompletionRate, onTimeQBRs: compliantAccounts, totalQBRs: actualTotalAccounts, avgPrepTime: avgPrepTime, qbrsCompleted: totalQBRs }
      ];
      
      setMetrics({
        overallCompletionRate,
        totalAccounts: actualTotalAccounts,
        compliantAccounts,
        overdueAccounts,
        totalAtRiskARR,
        avgPrepTime,
        manualQBRs,
        autoQBRs,
        tierBreakdown: Array.from(tierMap.values()).sort((a: any, b: any) => b.totalAccounts - a.totalAccounts),
        csmBreakdown: Array.from(csmMetricsMap.values()).sort((a: any, b: any) => b.totalAccounts - a.totalAccounts),
        overdueAccountsList: allOverdueAccounts,
        historicalTrend
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading QBR data:', error);
      setLoading(false);
    }
  }, []);

  if (loading || !metrics) {
    return <div className="p-8 text-center text-gray-500">Loading QBR Analysis...</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(metrics.overdueAccountsList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOverdue = metrics.overdueAccountsList.slice(startIndex, endIndex);

  return (
    <div className="p-8">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className={`text-3xl font-bold ${metrics.overallCompletionRate >= 85 ? 'text-green-600' : 'text-orange-600'}`}>
                {metrics.overallCompletionRate.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${metrics.overallCompletionRate >= 85 ? 'bg-green-100' : 'bg-orange-100'}`}>
              <svg className={`w-6 h-6 ${metrics.overallCompletionRate >= 85 ? 'text-green-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-medium ${metrics.overallCompletionRate >= 85 ? 'text-green-600' : 'text-orange-600'}`}>
              {metrics.overallCompletionRate >= 85 ? '✓ Above Target (85%)' : '⚠️ Below Target (85%)'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Overdue QBRs</p>
          <p className="text-3xl font-bold text-red-600">{metrics.overdueAccounts}</p>
          <span className="text-sm font-medium text-red-600 mt-4 block">⏰ Need Action</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">At-Risk ARR</p>
          <p className="text-3xl font-bold text-orange-600">${(metrics.totalAtRiskARR / 1000000).toFixed(1)}M</p>
          <span className="text-sm font-medium text-orange-600 mt-4 block">💰 Overdue Accounts</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Avg Prep Time</p>
          <p className="text-3xl font-bold text-blue-600">{metrics.avgPrepTime.toFixed(1)}h</p>
          <span className="text-sm font-medium text-blue-600 mt-4 block">⚡ Per QBR</span>
        </div>
      </div>

      {/* Historical Trend Line Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-6">📈 QBR Completion Trend (Last 4 Quarters)</h3>
        
        {/* Improved Line Chart */}
        <div className="mb-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6">
          <div className="relative" style={{height: '320px'}}>
            {/* Y-axis */}
            <div className="absolute left-0 top-0 bottom-12 w-16 flex flex-col justify-between text-sm font-medium text-gray-600">
              <span className="text-right pr-3">100%</span>
              <span className="text-right pr-3">75%</span>
              <span className="text-right pr-3">50%</span>
              <span className="text-right pr-3">25%</span>
              <span className="text-right pr-3">0%</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-16 mr-8 h-full pb-12">
              <svg viewBox="0 0 800 280" className="w-full h-full">
                {/* Grid lines */}
                <g>
                  {[0, 25, 50, 75, 100].map((val, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={280 - (val * 2.8)}
                      x2="800"
                      y2={280 - (val * 2.8)}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray={val === 0 ? "0" : "5,5"}
                    />
                  ))}
                </g>
                
                {/* Target line at 85% */}
                <line
                  x1="0"
                  y1={280 - (85 * 2.8)}
                  x2="800"
                  y2={280 - (85 * 2.8)}
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                />
                <text x="750" y={280 - (85 * 2.8) - 8} fill="#10b981" fontSize="14" fontWeight="600">Target: 85%</text>
                
                {/* Data line and area */}
                {(() => {
                  const points = metrics.historicalTrend.map((period: any, idx: number) => ({
                    x: (idx / (metrics.historicalTrend.length - 1)) * 800,
                    y: 280 - (period.completionRate * 2.8),
                    rate: period.completionRate
                  }));
                  
                  const linePoints = points.map((p: any) => `${p.x},${p.y}`).join(' ');
                  const areaPoints = `0,280 ${linePoints} 800,280`;
                  
                  return (
                    <g>
                      {/* Area under line */}
                      <polygon
                        points={areaPoints}
                        fill="url(#areaGradient)"
                        opacity="0.3"
                      />
                      
                      {/* Main line */}
                      <polyline
                        points={linePoints}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Data points */}
                      {points.map((point: any, idx: number) => (
                        <g key={idx}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="8"
                            fill="white"
                            stroke={point.rate >= 85 ? '#10b981' : point.rate > 0 ? '#3b82f6' : '#9ca3af'}
                            strokeWidth="4"
                          />
                          {point.rate > 0 && (
                            <text
                              x={point.x}
                              y={point.y - 20}
                              textAnchor="middle"
                              fill={point.rate >= 85 ? '#10b981' : '#3b82f6'}
                              fontSize="16"
                              fontWeight="700"
                            >
                              {point.rate.toFixed(1)}%
                            </text>
                          )}
                        </g>
                      ))}
                    </g>
                  );
                })()}
                
                {/* Gradient definitions */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                {metrics.historicalTrend.map((period: any, idx: number) => (
                  <div key={idx} className="text-center flex-1">
                    <div className="text-sm font-bold text-gray-700">{period.period}</div>
                    <div className="text-xs text-gray-500">
                      {period.qbrsCompleted || 0} QBRs
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quarterly details cards */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.historicalTrend.map((period: any, idx: number) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-bold text-gray-900 mb-2">{period.period}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div><span className="font-semibold text-gray-900">{period.onTimeQBRs}</span> / {period.totalQBRs}</div>
                <div className="text-xs text-gray-500">Prep: {period.avgPrepTime.toFixed(1)}h</div>
                {period.qbrsCompleted && <div className="text-xs text-blue-600">{period.qbrsCompleted} QBRs done</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-6">📊 QBR Completion by Customer Tier</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QBR Frequency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Accounts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overdue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Rate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metrics.tierBreakdown.map((tier: any, idx: number) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{tier.tier}</div></td>
                <td className="px-6 py-4"><div className="text-sm text-gray-600">Every {tier.qbrFrequencyDays} days</div></td>
                <td className="px-6 py-4"><div className="text-sm text-gray-900">{tier.totalAccounts}</div></td>
                <td className="px-6 py-4"><div className="text-sm font-medium text-green-600">{tier.compliant}</div></td>
                <td className="px-6 py-4"><div className="text-sm font-medium text-red-600">{tier.overdue}</div></td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tier.completionRate >= 85 ? 'bg-green-100 text-green-800' :
                    tier.completionRate >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tier.completionRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CSM Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-6">👥 QBR Performance by CSM</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CSM Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Accounts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overdue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QBRs Done (Q3)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Prep Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metrics.csmBreakdown.map((csm: any, idx: number) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{csm.csmName}</div></td>
                <td className="px-6 py-4"><div className="text-sm text-gray-900">{csm.totalAccounts}</div></td>
                <td className="px-6 py-4"><div className="text-sm font-medium text-green-600">{csm.compliantAccounts}</div></td>
                <td className="px-6 py-4"><div className="text-sm font-medium text-red-600">{csm.overdueAccounts}</div></td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    csm.completionRate >= 85 ? 'bg-green-100 text-green-800' :
                    csm.completionRate >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {csm.completionRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4"><div className="text-sm text-gray-900">{csm.totalQBRsCompleted}</div></td>
                <td className="px-6 py-4"><div className="text-sm text-gray-900">{csm.avgPrepTime.toFixed(1)}h</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generation Method Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">🤖 QBR Generation Method</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Manual Generation</span>
                <span className="text-sm font-bold text-gray-900">{metrics.manualQBRs} ({((metrics.manualQBRs / (metrics.manualQBRs + metrics.autoQBRs)) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(metrics.manualQBRs / (metrics.manualQBRs + metrics.autoQBRs)) * 100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Automated Generation</span>
                <span className="text-sm font-bold text-gray-900">{metrics.autoQBRs} ({((metrics.autoQBRs / (metrics.manualQBRs + metrics.autoQBRs)) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: `${(metrics.autoQBRs / (metrics.manualQBRs + metrics.autoQBRs)) * 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Key Insights</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Current completion rate: <span className="font-semibold">{metrics.overallCompletionRate.toFixed(1)}%</span> {metrics.overallCompletionRate >= 85 ? '(Above target ✓)' : '(Below 85% target)'}</li>
            <li>• <span className="font-semibold">{metrics.overdueAccounts} accounts</span> need immediate QBR scheduling</li>
            <li>• <span className="font-semibold">${(metrics.totalAtRiskARR / 1000000).toFixed(1)}M ARR</span> in overdue accounts</li>
            <li>• Average prep time: <span className="font-semibold">{metrics.avgPrepTime.toFixed(1)} hours</span> per QBR</li>
            <li>• <span className="font-semibold">{((metrics.autoQBRs / (metrics.manualQBRs + metrics.autoQBRs)) * 100).toFixed(0)}%</span> automation adoption rate</li>
          </ul>
        </div>
      </div>

      {/* Overdue Accounts Detail */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">🚨 Overdue QBR Accounts (Immediate Action Required)</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {startIndex + 1}-{Math.min(endIndex, metrics.overdueAccountsList.length)} of {metrics.overdueAccountsList.length} accounts
              </p>
            </div>
            <div className="text-2xl font-bold text-red-600">{metrics.overdueAccountsList.length}</div>
          </div>
          
          {/* Calculation Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <span className="font-semibold">📅 How "Overdue" is Calculated:</span> An account is overdue if it hasn't had a QBR in the last <span className="font-bold">120 days</span>. 
              <span className="ml-2">If an account has never had a QBR, it shows "No QBR Yet" with no specific days overdue.</span>
              <span className="ml-2">Days overdue = Days since last QBR - 120.</span>
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CSM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last QBR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ARR</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOverdue.map((acc: any, idx: number) => (
                <tr key={idx} className="hover:bg-red-50">
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{acc.account_name}</div></td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-600">{acc.tier}</div></td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-600">{acc.csm}</div></td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {acc.last_qbr_date ? new Date(acc.last_qbr_date).toLocaleDateString() : 'No QBR Yet'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {acc.days_overdue !== null ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        acc.days_overdue > 60 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {acc.days_overdue} days
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No QBR
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">${(acc.arr / 1000).toFixed(0)}K</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                ← Previous
              </button>
              
              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
