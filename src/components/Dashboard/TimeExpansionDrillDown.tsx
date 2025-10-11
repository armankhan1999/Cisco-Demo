import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

// Import master data
import expansionOpportunities from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import customersData from '@/source_data/master-data/customers.json';

interface TimeExpansionDrillDownProps {
  level: number;
  onClose: () => void;
  onLevelChange: (level: number) => void;
}

export const TimeExpansionDrillDown: React.FC<TimeExpansionDrillDownProps> = ({ level, onClose, onLevelChange }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Calculate real time to expansion metrics
  const avgTimeToExpansion = Math.round(
    expansionOpportunities.reduce((sum, opp) => sum + opp.days_in_stage, 0) / expansionOpportunities.length
  );
  
  const fastExpansions = expansionOpportunities.filter(opp => opp.days_in_stage < 120);
  const mediumExpansions = expansionOpportunities.filter(opp => opp.days_in_stage >= 120 && opp.days_in_stage <= 180);
  const slowExpansions = expansionOpportunities.filter(opp => opp.days_in_stage > 180);
  
  const totalExpansions = expansionOpportunities.length;
  const fastPercent = Math.round((fastExpansions.length / totalExpansions) * 100);
  const mediumPercent = Math.round((mediumExpansions.length / totalExpansions) * 100);
  const slowPercent = Math.round((slowExpansions.length / totalExpansions) * 100);
  
  // Calculate by tier
  const tierData = ['Strategic', 'Enterprise', 'Commercial', 'SMB'].map(tier => {
    const tierOpps = expansionOpportunities.filter(opp => {
      const customer = customersData.find(c => c.customer_id === opp.customer_id);
      return customer?.tier === tier;
    });
    const avgDays = tierOpps.length > 0 
      ? Math.round(tierOpps.reduce((sum, opp) => sum + opp.days_in_stage, 0) / tierOpps.length)
      : 0;
    return {
      tier,
      days: avgDays,
      count: tierOpps.length,
      variance: avgDays - avgTimeToExpansion
    };
  });
  
  // Calculate by product
  const products = ['Duo', 'Umbrella', 'Meraki', 'ThousandEyes', 'Splunk'];
  const productData = products.map(product => {
    const productOpps = expansionOpportunities.filter(opp => opp.recommended_product === product);
    const avgDays = productOpps.length > 0
      ? Math.round(productOpps.reduce((sum, opp) => sum + opp.days_in_stage, 0) / productOpps.length)
      : 0;
    return {
      product,
      days: avgDays,
      count: productOpps.length
    };
  });
  
  // Accounts approaching timeline (high days in stage)
  const accountsNearTimeline = expansionOpportunities
    .filter(opp => opp.days_in_stage > 150)
    .slice(0, 5)
    .map(opp => {
      const customer = customersData.find(c => c.customer_id === opp.customer_id);
      return {
        customer: customer?.customer_name || 'Unknown',
        product: opp.recommended_product,
        days: opp.days_in_stage,
        arr: `$${Math.round(opp.estimated_arr / 1000)}K`,
        stage: opp.stage,
        tier: customer?.tier || 'Unknown',
        health: opp.expansion_readiness_score || 75,
        action: opp.stage === 'Prospecting' ? 'Schedule expansion QBR' : 'Present cross-sell opportunity'
      };
    });
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Time to Expansion Analysis</h2>
            <div className="flex gap-4 mt-3">
              <button
                onClick={() => onLevelChange(2)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 2
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Tier & Product
              </button>
              <button
                onClick={() => onLevelChange(3)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  level === 3
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Accounts Near Timeline
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="p-8">
          {level === 2 && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-xl border-2 border-amber-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Average Days</div>
                  <div className="text-4xl font-bold text-amber-600">{avgTimeToExpansion}</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">↓ {180 - avgTimeToExpansion} days vs target (180d)</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Fast (&lt;120d)</div>
                  <div className="text-4xl font-bold text-green-600">{fastExpansions.length}</div>
                  <div className="text-xs text-gray-600 mt-1">{fastPercent}% of expansions</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Medium (121-180d)</div>
                  <div className="text-4xl font-bold text-amber-600">{mediumExpansions.length}</div>
                  <div className="text-xs text-gray-600 mt-1">{mediumPercent}% of expansions</div>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-md">
                  <div className="text-sm text-gray-600 mb-2">Slow (&gt;180d)</div>
                  <div className="text-4xl font-bold text-orange-600">{slowExpansions.length}</div>
                  <div className="text-xs text-gray-600 mt-1">{slowPercent}% of expansions</div>
                </div>
              </div>

              {/* Time to Expansion Trend */}
              <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-xl border-2 border-amber-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Time to Expansion Trend (Last 6 Quarters)</h3>
                <div className="relative h-64">
                  <svg className="w-full h-full" viewBox="0 0 600 256" preserveAspectRatio="xMidYMid meet">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line key={i} x1="0" y1={i * 64} x2="600" y2={i * 64} stroke="#e5e7eb" strokeWidth="1" />
                    ))}
                    
                    {/* Shaded area */}
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 64 L 100 51 L 200 38 L 300 30 L 400 26 L 500 20 L 500 256 L 0 256 Z"
                      fill="url(#areaGradient)"
                    />
                    
                    {/* Line */}
                    <path
                      d="M 0 64 L 100 51 L 200 38 L 300 30 L 400 26 L 500 20"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {[
                      { x: 0, y: 64, days: 165 },
                      { x: 100, y: 51, days: 158 },
                      { x: 200, y: 38, days: 152 },
                      { x: 300, y: 30, days: 148 },
                      { x: 400, y: 26, days: 145 },
                      { x: 500, y: 20, days: 142 }
                    ].map((point, idx) => (
                      <g key={idx}>
                        <circle cx={point.x} cy={point.y} r="6" fill="#f59e0b" stroke="white" strokeWidth="2" />
                        <text x={point.x} y={point.y - 15} textAnchor="middle" fill="#78350f" fontSize="14" fontWeight="bold">
                          {point.days}d
                        </text>
                      </g>
                    ))}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="flex justify-between mt-4">
                    {['Q1 24', 'Q2 24', 'Q3 24', 'Q4 24', 'Q1 25', 'Q2 25'].map((label, idx) => (
                      <span key={idx} className="text-sm text-gray-700 font-semibold">{label}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                  <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">
                    ↓ 23 days improvement over 6 quarters • 14% faster
                  </div>
                </div>
              </div>

              {/* Time to Expansion by Customer Tier */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border-2 border-purple-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Time to Expansion by Customer Tier</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tierData.map((tier, idx) => {
                    const colors = [
                      { bg: 'from-green-100 to-green-50', border: 'border-green-300', text: 'text-green-600' },
                      { bg: 'from-blue-100 to-blue-50', border: 'border-blue-300', text: 'text-blue-600' },
                      { bg: 'from-yellow-100 to-yellow-50', border: 'border-yellow-300', text: 'text-yellow-600' },
                      { bg: 'from-orange-100 to-orange-50', border: 'border-orange-300', text: 'text-orange-600' }
                    ][idx];
                    return (
                      <div key={tier.tier} className={`bg-gradient-to-br ${colors.bg} p-6 rounded-xl border-2 ${colors.border} shadow-md hover:shadow-lg transition-all`}>
                        <div className="text-sm text-gray-700 font-semibold mb-2">{tier.tier}</div>
                        <div className={`text-5xl font-bold ${colors.text}`}>{tier.days}d</div>
                        <div className="text-sm text-gray-600 mt-2">{tier.count} expansions</div>
                        <div className={`text-xs font-semibold mt-1 ${tier.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tier.variance < 0 ? '↓' : '↑'} {Math.abs(tier.variance)}d vs avg
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time to Expansion by Product */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Time to Expansion by Product</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-bold text-gray-700">Initial Product</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Avg Days</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Expansions</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Fastest</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">Slowest</th>
                        <th className="text-center py-4 px-4 font-bold text-gray-700">vs Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.map((row, idx) => {
                        const productOpps = expansionOpportunities.filter(opp => opp.recommended_product === row.product);
                        const fastest = productOpps.length > 0 ? Math.min(...productOpps.map(o => o.days_in_stage)) : 0;
                        const slowest = productOpps.length > 0 ? Math.max(...productOpps.map(o => o.days_in_stage)) : 0;
                        return (
                          <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 font-semibold">{row.product}</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-bold">
                                {row.days} days
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">{row.count}</td>
                            <td className="py-4 px-4 text-center text-green-600 font-bold">{fastest}d</td>
                            <td className="py-4 px-4 text-center text-red-600">{slowest}d</td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">
                                {180 - row.days}d
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {level === 3 && (
            <div className="space-y-6">
              {/* Accounts Approaching Expansion Timeline */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Accounts Approaching Expansion Timeline (90-150 Days Since Acquisition)</h3>
                <div className="space-y-4">
                  {accountsNearTimeline.map((account, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-white rounded-lg hover:shadow-md transition-all border-l-4 border-amber-500 cursor-pointer"
                      onClick={() => setSelectedAccount(account.customer)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-lg font-bold text-gray-900">{account.customer}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              {account.days} days since acquisition • {account.tier} • {account.product}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm text-gray-600">ARR: <span className="font-semibold">{account.arr}</span></span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            account.health >= 85 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Health: {account.health}%
                          </span>
                          <span className="text-sm text-amber-600 font-semibold">→ {account.action}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-semibold">
                          Create Expansion Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intervention Opportunities - Slow Expansions */}
              <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl border-2 border-red-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Intervention Required - Slow Expansion Accounts (&gt;180 Days)</h3>
                <div className="space-y-4">
                  {[
                    { customer: 'Legacy Systems Inc', days: 215, arr: '$180K', product: 'Meraki', health: 68, tier: 'Commercial', issue: 'Low engagement' },
                    { customer: 'OldTech Partners', days: 198, arr: '$240K', product: 'Umbrella', health: 72, tier: 'Commercial', issue: 'Budget constraints' },
                    { customer: 'SlowAdopt Corp', days: 185, arr: '$320K', product: 'Duo', health: 75, tier: 'Enterprise', issue: 'Change management' }
                  ].map((account, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-6 bg-white rounded-lg border-l-4 border-red-500 shadow-md cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setSelectedAccount(account.customer)}
                    >
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-900">{account.customer}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {account.days} days since acquisition • {account.tier} • {account.product}
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm text-gray-600">ARR: <span className="font-semibold">{account.arr}</span></span>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                            Health: {account.health}%
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                            Issue: {account.issue}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">
                          Intervention Plan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Account Detail Modal */}
      {selectedAccount && (
        <AccountDetailModal
          accountName={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  );
};
