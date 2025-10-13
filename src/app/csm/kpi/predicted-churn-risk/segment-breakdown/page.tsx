'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingDown, AlertCircle } from 'lucide-react';
import { calculatePredictedChurnRisk, getChurnRiskDrivers } from '@/lib/kpis/predictedChurnRisk';
import { getActiveAccounts } from '@/lib/data/csmDataLoader';

export default function SegmentBreakdownPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [segmentData, setSegmentData] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [totalData, setTotalData] = useState<any>(null);

  useEffect(() => {
    try {
      const riskData = calculatePredictedChurnRisk();
      const accounts = getActiveAccounts();
      
      // Calculate risk by tier
      const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
      const tierIcons: Record<string, string> = {
        'Strategic': '🏆',
        'Enterprise': '🏢',
        'Commercial': '🏪',
        'SMB': '🏬'
      };
      
      const segments = tiers.map(tier => {
        const tierAccounts = accounts.filter(a => a.account.tier === tier);
        const tierPredictions = riskData.predictions.filter(p => 
          tierAccounts.some(acc => acc.account.id === p.account_id)
        );
        
        const totalARR = tierAccounts.reduce((sum, a) => sum + a.account.arr, 0);
        const atRiskARR = tierPredictions.reduce((sum, p) => sum + p.arr_at_risk, 0);
        const riskPercentage = totalARR > 0 ? (atRiskARR / totalARR) * 100 : 0;
        
        const avgChurnProb = tierPredictions.length > 0
          ? tierPredictions.reduce((sum, p) => sum + p.churn_probability, 0) / tierPredictions.length
          : 0;
        
        let churnProbability: 'Low' | 'Medium' | 'High' = 'Low';
        if (avgChurnProb > 0.6) churnProbability = 'High';
        else if (avgChurnProb > 0.3) churnProbability = 'Medium';
        
        return {
          tier,
          icon: tierIcons[tier],
          totalARR,
          atRiskARR,
          riskPercentage,
          atRiskAccountCount: tierPredictions.length,
          totalAccountCount: tierAccounts.length,
          avgChurnProbability: avgChurnProb,
          churnProbability
        };
      }).filter(s => s.totalAccountCount > 0);
      
      setSegmentData(segments);
      
      // Get churn drivers
      const allDrivers = getChurnRiskDrivers(riskData.predictions);
      setDrivers(allDrivers);
      
      setTotalData({
        totalARR: riskData.totalARR,
        atRiskARR: riskData.atRiskARR,
        riskPercentage: riskData.riskRate
      });
      
    } catch (error) {
      console.error('Error loading segment data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading segment analysis...</div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getRiskBadge = (prob: string) => {
    const badges: Record<string, string> = {
      Low: 'bg-green-100 text-green-800 border-green-300',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      High: 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[prob] || badges.Low;
  };

  const getPriorityBadge = (priority: number) => {
    if (priority === 1) return 'bg-red-600 text-white';
    if (priority === 2) return 'bg-orange-500 text-white';
    if (priority === 3) return 'bg-yellow-500 text-white';
    return 'bg-gray-400 text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <button
            onClick={() => router.push('/csm/kpi/predicted-churn-risk')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Churn Risk Overview</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              📊 Churn Risk by Customer Tier
            </h1>
            <p className="text-gray-600 mt-2">
              Segment analysis showing risk concentration across different customer tiers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-[1800px] mx-auto">
        
        {/* Tier Breakdown Table */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg mb-8 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Risk by Customer Tier</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Tier</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm">Total ARR</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm">At-Risk ARR</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">Risk %</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">Accounts</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">Churn Prob</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {segmentData.map((segment, idx) => (
                  <tr 
                    key={segment.tier}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{segment.icon}</span>
                        <span className="font-semibold text-gray-900">{segment.tier}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-6 font-semibold text-gray-900">
                      {formatCurrency(segment.totalARR)}
                    </td>
                    <td className="text-right py-4 px-6">
                      <span className={`font-semibold ${
                        segment.riskPercentage > 15 ? 'text-red-600' :
                        segment.riskPercentage > 10 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(segment.atRiskARR)}
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        segment.riskPercentage > 15 ? 'bg-red-100 text-red-800' :
                        segment.riskPercentage > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {segment.riskPercentage.toFixed(1)}%
                        {segment.riskPercentage > 15 ? ' ⚠️' : 
                         segment.riskPercentage > 10 ? ' ⚠' : ' ✓'}
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="font-semibold text-gray-900">
                        {segment.atRiskAccountCount} / {segment.totalAccountCount}
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadge(segment.churnProbability)}`}>
                        {segment.churnProbability}
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <button
                        onClick={() => router.push(`/csm/kpi/predicted-churn-risk/at-risk-accounts?tier=${segment.tier}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className="bg-gray-50 border-t-2 border-gray-300">
                  <td className="py-4 px-6 font-bold text-gray-900">💰 Total</td>
                  <td className="text-right py-4 px-6 font-bold text-gray-900">
                    {formatCurrency(totalData?.totalARR || 0)}
                  </td>
                  <td className="text-right py-4 px-6 font-bold text-orange-600">
                    {formatCurrency(totalData?.atRiskARR || 0)}
                  </td>
                  <td className="text-center py-4 px-6">
                    <span className="inline-block px-4 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-800 border border-orange-300">
                      {totalData?.riskPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Primary Churn Drivers */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900">Primary Churn Drivers Across All Tiers</h3>
          </div>
          
          <div className="space-y-3">
            {drivers.slice(0, 6).map((driver, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(driver.priority)}`}>
                    P{driver.priority}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{idx + 1}. {driver.driver}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Contribution: {(driver.avgContribution * 100).toFixed(0)}% avg per account
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 text-right">
                  <div>
                    <div className="text-sm text-gray-600">Accounts</div>
                    <div className="text-lg font-bold text-gray-900">{driver.accountCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">ARR Impact</div>
                    <div className="text-lg font-bold text-orange-600">{formatCurrency(driver.totalARR)}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Priority: {driver.priority}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => router.push('/csm/kpi/predicted-churn-risk/at-risk-accounts')}
              className="w-full bg-blue-600 text-white rounded-lg py-3 px-6 font-semibold hover:bg-blue-700 transition-colors"
            >
              View Account Details by Tier →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
