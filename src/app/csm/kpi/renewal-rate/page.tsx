'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import { calculateAllKPIs, calculateRenewalPipeline } from '@/lib/kpis/csmKPICalculations';
import { getActiveAccounts, getActiveSubscriptions, getAllChurnPredictions } from '@/lib/data/csmDataLoader';

export default function RenewalRateDrillDown() {
  const [loading, setLoading] = useState(true);
  const [renewalData, setRenewalData] = useState<any>(null);
  const [upcomingRenewals, setUpcomingRenewals] = useState<any[]>([]);
  const [renewalPipeline, setRenewalPipeline] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    try {
      console.log('🔄 Loading Renewal Rate Drill-Down Data...');
      
      // Get renewal rate and pipeline data
      const kpis = calculateAllKPIs();
      const renewalRate = kpis.renewalRate;
      const pipeline = calculateRenewalPipeline();
      const allAccounts = getActiveAccounts();
      const subscriptions = getActiveSubscriptions();
      const churnPredictions = getAllChurnPredictions();
      
      // Calculate renewal pipeline buckets
      const now = new Date();
      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
      const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      const oneEightyDays = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
      
      // Get upcoming renewals with account details
      const renewalsWithDetails = subscriptions
        .filter(sub => {
          const endDate = new Date(sub.subscription_end_date);
          return endDate >= now && endDate <= oneEightyDays;
        })
        .map(subscription => {
          const account = allAccounts.find(acc => acc.account.id === subscription.customer_id);
          const churnPrediction = churnPredictions.find(pred => pred.customer_id === subscription.customer_id);
          
          const endDate = new Date(subscription.subscription_end_date);
          const daysToRenewal = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Determine renewal confidence
          let confidence = 'High';
          let riskLevel = 'Low';
          
          if (account) {
            if (account.account.health_score < 50) {
              confidence = 'Low';
              riskLevel = 'Critical';
            } else if (account.account.health_score < 70) {
              confidence = 'Medium';
              riskLevel = 'High';
            } else if (account.account.health_score < 85) {
              confidence = 'High';
              riskLevel = 'Medium';
            } else {
              confidence = 'Very High';
              riskLevel = 'Low';
            }
          }
          
          // Add churn probability if available
          const churnProbability = churnPrediction ? churnPrediction.churn_probability : 0;
          if (churnProbability > 0.7) {
            confidence = 'Low';
            riskLevel = 'Critical';
          } else if (churnProbability > 0.4) {
            confidence = 'Medium';
            riskLevel = 'High';
          }
          
          // Determine time bucket
          let timeBucket = '';
          if (daysToRenewal <= 30) timeBucket = '0-30 days';
          else if (daysToRenewal <= 60) timeBucket = '31-60 days';
          else if (daysToRenewal <= 90) timeBucket = '61-90 days';
          else timeBucket = '91-180 days';
          
          // Mock CSM assignment
          const csms = ['Sarah Martinez', 'Mike Thompson', 'Lisa Chen', 'David Wilson'];
          const assignedCSM = csms[Math.floor(Math.random() * csms.length)];
          
          return {
            subscriptionId: subscription.subscription_id,
            customerId: subscription.customer_id,
            accountName: account?.account.name || 'Unknown Account',
            tier: account?.account.tier || 'Unknown',
            arr: subscription.arr,
            healthScore: account?.account.health_score || 0,
            renewalDate: subscription.subscription_end_date,
            daysToRenewal,
            timeBucket,
            confidence,
            riskLevel,
            churnProbability,
            csm: assignedCSM,
            productFamily: subscription.product_family || 'Unknown',
            lastContact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          };
        })
        .sort((a, b) => a.daysToRenewal - b.daysToRenewal);
      
      // Group renewals by time buckets for summary
      const pipelineStats = [
        {
          period: '0-30 days',
          renewals: renewalsWithDetails.filter(r => r.timeBucket === '0-30 days'),
          highConfidence: renewalsWithDetails.filter(r => r.timeBucket === '0-30 days' && (r.confidence === 'High' || r.confidence === 'Very High')).length,
          atRisk: renewalsWithDetails.filter(r => r.timeBucket === '0-30 days' && r.confidence === 'Low').length
        },
        {
          period: '31-60 days',
          renewals: renewalsWithDetails.filter(r => r.timeBucket === '31-60 days'),
          highConfidence: renewalsWithDetails.filter(r => r.timeBucket === '31-60 days' && (r.confidence === 'High' || r.confidence === 'Very High')).length,
          atRisk: renewalsWithDetails.filter(r => r.timeBucket === '31-60 days' && r.confidence === 'Low').length
        },
        {
          period: '61-90 days',
          renewals: renewalsWithDetails.filter(r => r.timeBucket === '61-90 days'),
          highConfidence: renewalsWithDetails.filter(r => r.timeBucket === '61-90 days' && (r.confidence === 'High' || r.confidence === 'Very High')).length,
          atRisk: renewalsWithDetails.filter(r => r.timeBucket === '61-90 days' && r.confidence === 'Low').length
        },
        {
          period: '91-180 days',
          renewals: renewalsWithDetails.filter(r => r.timeBucket === '91-180 days'),
          highConfidence: renewalsWithDetails.filter(r => r.timeBucket === '91-180 days' && (r.confidence === 'High' || r.confidence === 'Very High')).length,
          atRisk: renewalsWithDetails.filter(r => r.timeBucket === '91-180 days' && r.confidence === 'Low').length
        }
      ].map(bucket => ({
        ...bucket,
        count: bucket.renewals.length,
        totalARR: bucket.renewals.reduce((sum, r) => sum + r.arr, 0),
        confidenceRate: bucket.renewals.length > 0 ? (bucket.highConfidence / bucket.renewals.length) * 100 : 0
      }));
      
      // Calculate overall statistics
      const totalUpcomingARR = renewalsWithDetails.reduce((sum, r) => sum + r.arr, 0);
      const highConfidenceRenewals = renewalsWithDetails.filter(r => r.confidence === 'High' || r.confidence === 'Very High');
      const atRiskRenewals = renewalsWithDetails.filter(r => r.confidence === 'Low');
      const overallConfidenceRate = renewalsWithDetails.length > 0 ? 
        (highConfidenceRenewals.length / renewalsWithDetails.length) * 100 : 0;
      
      // Historical renewal performance (mock data)
      const historicalData = [
        { period: 'Q1 2024', renewalRate: 89.2, onTimeRenewals: 92.5, atRiskConverted: 65 },
        { period: 'Q2 2024', renewalRate: 91.8, onTimeRenewals: 94.1, atRiskConverted: 72 },
        { period: 'Q3 2024', renewalRate: 94.3, onTimeRenewals: 96.2, atRiskConverted: 78 },
        { period: 'Q4 2024', renewalRate: renewalRate.value, onTimeRenewals: 95.8, atRiskConverted: 74 }
      ];
      
      setRenewalData({
        overallRenewalRate: renewalRate.value,
        totalUpcomingRenewals: renewalsWithDetails.length,
        totalUpcomingARR,
        highConfidenceCount: highConfidenceRenewals.length,
        atRiskCount: atRiskRenewals.length,
        overallConfidenceRate,
        historicalData
      });
      
      setRenewalPipeline(pipelineStats);
      setUpcomingRenewals(renewalsWithDetails);
      setLoading(false);
      
      console.log(`🔄 Renewal Analysis Complete:`);
      console.log(`  Overall Renewal Rate: ${renewalRate.value.toFixed(1)}%`);
      console.log(`  Upcoming Renewals: ${renewalsWithDetails.length} accounts`);
      console.log(`  Total ARR at Risk: $${totalUpcomingARR.toLocaleString()}`);
      
    } catch (error) {
      console.error('Error loading renewal data:', error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading Renewal Analysis...</div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(upcomingRenewals.length / perPage);
  const paginatedRenewals = upcomingRenewals.slice((currentPage - 1) * perPage, currentPage * perPage);

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
              <h1 className="text-3xl font-bold text-gray-900">Renewal Rate Analysis</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive analysis of renewal pipeline and confidence levels
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
                  <p className="text-sm font-medium text-gray-600">Renewal Rate</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {renewalData.overallRenewalRate.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-center text-sm font-medium ${
                  renewalData.overallRenewalRate >= 92 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {renewalData.overallRenewalRate >= 92 ? '✓ Above Target' : '⚠️ Below Target'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Renewals</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {renewalData.totalUpcomingRenewals}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-indigo-600">
                  📅 Next 180 Days
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pipeline ARR</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${(renewalData.totalUpcomingARR / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-green-600">
                  💰 Revenue at Stake
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">At-Risk Renewals</p>
                  <p className="text-3xl font-bold text-red-600">
                    {renewalData.atRiskCount}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-red-600">
                  ⚠️ Low Confidence
                </span>
              </div>
            </div>
          </div>

          {/* Renewal Pipeline by Time Buckets */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-6">Renewal Pipeline (Next 180 Days)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total ARR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">High Confidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">At Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {renewalPipeline.map((bucket: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bucket.period}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bucket.count}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(bucket.totalARR / 1000000).toFixed(1)}M
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-600 font-medium">{bucket.highConfidence}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600 font-medium">{bucket.atRisk}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bucket.confidenceRate >= 80 ? 'bg-green-100 text-green-800' :
                          bucket.confidenceRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {bucket.confidenceRate.toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          bucket.period === '0-30 days' ? 'text-red-600' :
                          bucket.period === '31-60 days' ? 'text-orange-600' :
                          'text-blue-600'
                        }`}>
                          {bucket.period === '0-30 days' ? 'Critical' : 
                           bucket.period === '31-60 days' ? 'High' : 'Medium'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Renewal Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-6">Historical Renewal Performance</h3>
            <div className="grid grid-cols-4 gap-6">
              {renewalData.historicalData.map((period: any, idx: number) => (
                <div key={idx} className="text-center">
                  <div className="text-lg font-bold text-gray-900">{period.period}</div>
                  <div className="text-2xl font-bold text-blue-600 mt-2">{period.renewalRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600 mt-1">Renewal Rate</div>
                  <div className="text-xs text-green-600 mt-1">
                    On-time: {period.onTimeRenewals.toFixed(1)}%
                  </div>
                  <div className="text-xs text-orange-600">
                    At-Risk Saved: {period.atRiskConverted}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Renewals Detail */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Upcoming Renewals Detail</h3>
              <div className="flex items-center gap-4">
                <select 
                  value={perPage} 
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, upcomingRenewals.length)} of {upcomingRenewals.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ARR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CSM</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRenewals.map((renewal: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{renewal.accountName}</div>
                            <div className="text-sm text-gray-500">{renewal.tier}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(renewal.arr / 1000).toFixed(0)}K
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(renewal.renewalDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          renewal.daysToRenewal <= 30 ? 'bg-red-100 text-red-800' :
                          renewal.daysToRenewal <= 60 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {renewal.daysToRenewal} days
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          renewal.healthScore >= 85 ? 'bg-green-100 text-green-800' :
                          renewal.healthScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {renewal.healthScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          renewal.confidence === 'Very High' || renewal.confidence === 'High' ? 'bg-green-100 text-green-800' :
                          renewal.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {renewal.confidence}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{renewal.csm}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-1">
                          {renewal.confidence === 'Low' && (
                            <button className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-600 rounded">
                              Save Plan
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-600 rounded">
                            Schedule QBR
                          </button>
                        </div>
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

          {/* Renewal Optimization Recommendations */}
          <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Renewal Optimization Strategy</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Focus immediate attention on {renewalData.atRiskCount} low-confidence renewals</li>
                  <li>• Schedule QBRs for all renewals in the next 30 days to build confidence</li>
                  <li>• Current overall confidence rate: {renewalData.overallConfidenceRate.toFixed(0)}% - target &gt;85%</li>
                  <li>• Monitor health scores weekly for accounts renewing within 90 days</li>
                  <li>• Implement early renewal incentives for high-confidence accounts</li>
                  <li>• Deploy executive engagement for high-ARR at-risk renewals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
