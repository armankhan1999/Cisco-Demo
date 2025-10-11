'use client';
import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

// Import ONLY master data
import expansionOpportunities from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import customersData from '@/source_data/master-data/customers.json';

export const ExpansionPipelineLevel2: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Calculate real metrics from master data
  const totalPipeline = expansionOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const weightedPipeline = expansionOpportunities.reduce((sum, opp) => sum + (opp.estimated_arr * (opp.close_probability / 100)), 0);
  const avgWinProbability = Math.round(expansionOpportunities.reduce((sum, opp) => sum + opp.close_probability, 0) / expansionOpportunities.length);
  const quota = 2500000; // $2.5M quota
  const coverageRatio = totalPipeline / quota;
  
  // Group by stage - using actual stage names from data
  const stages = ['Identified', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
  const stageData = stages.map(stage => ({
    stage,
    count: expansionOpportunities.filter(o => o.stage === stage).length,
    arr: expansionOpportunities.filter(o => o.stage === stage).reduce((sum, o) => sum + o.estimated_arr, 0),
    avgProbability: expansionOpportunities.filter(o => o.stage === stage).length > 0 
      ? Math.round(expansionOpportunities.filter(o => o.stage === stage).reduce((sum, o) => sum + o.close_probability, 0) / expansionOpportunities.filter(o => o.stage === stage).length)
      : 0
  }));
  
  return (
  <>
  <div className="space-y-8">
    {/* Summary Cards - ALL REAL DATA */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-6 border-2 border-teal-200/50 cursor-pointer hover:shadow-lg transition-all">
        <div className="text-center">
          <div className="text-5xl font-bold text-teal-600 mb-2">${(totalPipeline / 1000000).toFixed(1)}M</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Total Pipeline</div>
          <div className="text-xs text-gray-600">{expansionOpportunities.length} opportunities</div>
          <div className="text-xs text-teal-600 font-semibold mt-2">View Analytics →</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50 cursor-pointer hover:shadow-lg transition-all">
        <div className="text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">${(weightedPipeline / 1000000).toFixed(1)}M</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Weighted Pipeline</div>
          <div className="text-xs text-gray-600">Probability adjusted</div>
          <div className="text-xs text-green-600 font-semibold mt-2">View Analytics →</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50 cursor-pointer hover:shadow-lg transition-all">
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">{coverageRatio.toFixed(1)}x</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Coverage Ratio</div>
          <div className="text-xs text-gray-600">vs ${(quota / 1000000).toFixed(1)}M quota</div>
          <div className="text-xs text-blue-600 font-semibold mt-2">View Analytics →</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50 cursor-pointer hover:shadow-lg transition-all">
        <div className="text-center">
          <div className="text-5xl font-bold text-purple-600 mb-2">{avgWinProbability}%</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Avg Win Probability</div>
          <div className="text-xs text-gray-600">Across all stages</div>
          <div className="text-xs text-purple-600 font-semibold mt-2">View Analytics →</div>
        </div>
      </div>
    </div>

    {/* Pipeline by Stage */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 Pipeline by Stage</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Stage</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Opportunities</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Avg Deal Size</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Win Probability</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Weighted ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Avg Days</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stageData.map((stage, index) => {
              const colors = [
                { bg: 'hover:bg-green-50', dot: 'bg-green-500', text: 'text-green-600', bar: 'bg-green-600' },
                { bg: 'hover:bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-600', bar: 'bg-blue-600' },
                { bg: 'hover:bg-yellow-50', dot: 'bg-yellow-500', text: 'text-yellow-600', bar: 'bg-yellow-600' },
                { bg: 'hover:bg-orange-50', dot: 'bg-orange-500', text: 'text-orange-600', bar: 'bg-orange-600' },
                { bg: 'hover:bg-purple-50', dot: 'bg-purple-500', text: 'text-purple-600', bar: 'bg-purple-600' }
              ][index] || { bg: 'hover:bg-gray-50', dot: 'bg-gray-500', text: 'text-gray-600', bar: 'bg-gray-600' };
              
              const avgDealSize = stage.count > 0 ? stage.arr / stage.count : 0;
              const weightedARR = stage.arr * (stage.avgProbability / 100);
              const avgDaysInStage = stage.count > 0 
                ? Math.round(expansionOpportunities.filter(o => o.stage === stage.stage).reduce((sum, o) => sum + o.days_in_stage, 0) / stage.count)
                : 0;
              
              return (
                <tr key={stage.stage} className={`${colors.bg} transition-colors cursor-pointer`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                      <span className="text-base font-bold text-gray-900">{stage.stage}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">{stage.count}</td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">${(stage.arr / 1000000).toFixed(2)}M</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">${(avgDealSize / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div className={`${colors.bar} h-2 rounded-full`} style={{ width: `${stage.avgProbability}%` }}></div>
                      </div>
                      <span className={`text-base font-bold ${colors.text}`}>{stage.avgProbability}%</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-lg font-bold ${colors.text}`}>${(weightedARR / 1000000).toFixed(2)}M</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">{avgDaysInStage} days</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    {/* Pipeline by Type */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Pipeline by Expansion Type</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold text-gray-900">Cross-Sell</h5>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">36 Opps</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">$5.3M</div>
          <div className="text-sm text-gray-700 mb-3">
            <strong>Top Products:</strong> Duo, ThousandEyes, Umbrella
          </div>
          <div className="text-xs text-gray-600">61% of total pipeline</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold text-gray-900">Upsell</h5>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">22 Opps</span>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">$2.9M</div>
          <div className="text-sm text-gray-700 mb-3">
            <strong>Avg Expansion:</strong> 37% increase
          </div>
          <div className="text-xs text-gray-600">35% of total pipeline</div>
        </div>
      </div>
    </div>

    {/* Stage Conversion Rates */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🔄 Stage Conversion Rates</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex-1">
            <div className="text-base font-bold text-gray-900 mb-1">Prospecting → Engaged</div>
            <div className="text-sm text-gray-600">Early stage qualification</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <span className="text-xl font-bold text-green-600 w-16 text-right">68%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex-1">
            <div className="text-base font-bold text-gray-900 mb-1">Engaged → Proposed</div>
            <div className="text-sm text-gray-600">Solution presentation</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <span className="text-xl font-bold text-blue-600 w-16 text-right">80%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
          <div className="flex-1">
            <div className="text-base font-bold text-gray-900 mb-1">Proposed → Negotiating</div>
            <div className="text-sm text-gray-600">Commercial discussion</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '77%' }}></div>
            </div>
            <span className="text-xl font-bold text-purple-600 w-16 text-right">77%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
          <div className="flex-1">
            <div className="text-base font-bold text-gray-900 mb-1">Negotiating → Closed Won</div>
            <div className="text-sm text-gray-600">Final close</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: '84%' }}></div>
            </div>
            <span className="text-xl font-bold text-teal-600 w-16 text-right">84%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
  );
};

export const ExpansionPipelineLevel3: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Get top opportunities from real data
  const topOpportunities = expansionOpportunities
    .sort((a, b) => b.estimated_arr - a.estimated_arr)
    .slice(0, 10)
    .map(opp => {
      const customer = customersData.find(c => c.customer_id === opp.customer_id);
      return { ...opp, customer };
    });
  
  return (
  <>
  <div className="space-y-8">
    {/* Top Opportunities */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Top Pipeline Opportunities</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Product</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Stage</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Win Prob</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Days in Stage</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topOpportunities.map((opp) => {
              const typeColors = {
                'cross_sell': { bg: 'bg-blue-100', text: 'text-blue-700' },
                'upsell': { bg: 'bg-green-100', text: 'text-green-700' },
                'capacity': { bg: 'bg-purple-100', text: 'text-purple-700' }
              };
              
              const stageColors = {
                'Identified': { bg: 'bg-orange-100', text: 'text-orange-700' },
                'Qualified': { bg: 'bg-blue-100', text: 'text-blue-700' },
                'Proposal': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
                'Negotiation': { bg: 'bg-green-100', text: 'text-green-700' },
                'Closed Won': { bg: 'bg-emerald-100', text: 'text-emerald-700' }
              };
              
              const typeColor = typeColors[opp.opportunity_type as keyof typeof typeColors] || { bg: 'bg-gray-100', text: 'text-gray-700' };
              const stageColor = stageColors[opp.stage as keyof typeof stageColors] || { bg: 'bg-gray-100', text: 'text-gray-700' };
              
              return (
                <tr 
                  key={opp.opportunity_id}
                  className="hover:bg-green-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAccount(opp.customer?.customer_name || 'Unknown')}
                >
                  <td className="px-6 py-4">
                    <div className="text-base font-bold text-gray-900">{opp.customer?.customer_name || 'Unknown'}</div>
                    <div className="text-xs text-gray-600">{opp.customer?.tier} | {opp.customer?.industry}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeColor.bg} ${typeColor.text}`}>
                      {opp.opportunity_type.replace('_', '-')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">{opp.recommended_product}</td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">${(opp.estimated_arr / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${stageColor.bg} ${stageColor.text}`}>
                      {opp.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-green-600">{opp.close_probability}%</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">{opp.days_in_stage}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{opp.next_action}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    {/* Risk Factors & Next Actions */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">⚠️ Pipeline Risks & Actions</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-6 border-2 border-red-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">!</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Stuck Deals</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>8 opportunities</strong> in stage &gt;45 days - Need intervention
          </p>
          <div className="text-lg font-bold text-red-600">$1.2M at risk</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-6 border-2 border-yellow-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">⏰</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Overdue Actions</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>12 opportunities</strong> with overdue next steps
          </p>
          <div className="text-lg font-bold text-yellow-600">Immediate follow-up</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎯</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Hot Opportunities</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>6 deals</strong> in Negotiating stage - Close this quarter
          </p>
          <div className="text-lg font-bold text-blue-600">$1.05M weighted</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Pipeline Health</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>3.2x coverage</strong> - Above target of 3x quota
          </p>
          <div className="text-lg font-bold text-green-600">Healthy pipeline</div>
        </div>
      </div>
    </div>
  </div>
  
  {/* Account Detail Modal */}
  {selectedAccount && (
    <AccountDetailModal
      accountName={selectedAccount}
      onClose={() => setSelectedAccount(null)}
    />
  )}
  </>
  );
};

// Legacy exports for backward compatibility
export const renderExpansionPipelineLevel2 = () => <ExpansionPipelineLevel2 />;
export const renderExpansionPipelineLevel3 = () => <ExpansionPipelineLevel3 />;
