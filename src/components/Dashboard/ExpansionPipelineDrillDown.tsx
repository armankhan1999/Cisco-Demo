'use client';
import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

export const ExpansionPipelineLevel2: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  return (
  <>
  <div className="space-y-8">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="rounded-xl p-6 border-2 border-teal-200/50" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="text-center">
          <div className="text-5xl font-bold text-teal-600 mb-2">$8.2M</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Total Pipeline</div>
          <div className="text-xs text-gray-600">59 opportunities</div>
        </div>
      </div>
      <div className="rounded-xl p-6 border-2 border-green-200/50" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">$5.1M</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Weighted Pipeline</div>
          <div className="text-xs text-gray-600">Probability adjusted</div>
        </div>
      </div>
      <div className="rounded-xl p-6 border-2 border-blue-200/50" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">3.2x</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Coverage Ratio</div>
          <div className="text-xs text-gray-600">vs $2.5M quota</div>
        </div>
      </div>
      <div className="rounded-xl p-6 border-2 border-purple-200/50" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="text-center">
          <div className="text-5xl font-bold text-purple-600 mb-2">62%</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Avg Win Probability</div>
          <div className="text-xs text-gray-600">Across all stages</div>
        </div>
      </div>
    </div>

    {/* Pipeline by Stage */}
    <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
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
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-base font-bold text-gray-900">Negotiating</span>
                </div>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">10</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$1.26M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$126K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                  <span className="text-base font-bold text-green-600">83%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-lg font-bold text-green-600">$1.05M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">20 days</td>
            </tr>
            <tr className="hover:bg-blue-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-base font-bold text-gray-900">Proposed</span>
                </div>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">16</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$1.87M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$117K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '61%' }}></div>
                  </div>
                  <span className="text-base font-bold text-blue-600">61%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-lg font-bold text-blue-600">$1.14M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">38 days</td>
            </tr>
            <tr className="hover:bg-yellow-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-base font-bold text-gray-900">Engaged</span>
                </div>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">16</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$1.51M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$94K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '43%' }}></div>
                  </div>
                  <span className="text-base font-bold text-yellow-600">43%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-lg font-bold text-yellow-600">$649K</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">43 days</td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-base font-bold text-gray-900">Prospecting</span>
                </div>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">13</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$1.58M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$122K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '29%' }}></div>
                  </div>
                  <span className="text-base font-bold text-orange-600">29%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-lg font-bold text-orange-600">$458K</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">62 days</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Pipeline by Type */}
    <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Pipeline by Expansion Type</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 border-2 border-blue-200/50" style={{ backgroundColor: '#F3F3F3' }}>
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

        <div className="rounded-xl p-6 border-2 border-green-200/50" style={{ backgroundColor: '#F3F3F3' }}>
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
    <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
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
  
  return (
  <>
  <div className="space-y-8">
    {/* Top Opportunities */}
    <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
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
            <tr 
              className="hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => setSelectedAccount('TechCorp Industries')}
            >
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">TechCorp Industries</div>
                <div className="text-xs text-gray-600">Enterprise | Technology</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Cross-Sell</span>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Splunk</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$223K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Proposed</span>
              </td>
              <td className="px-6 py-4 text-base font-bold text-green-600">67%</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">POC kickoff</td>
            </tr>
            <tr 
              className="hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => setSelectedAccount('MedSecure Systems')}
            >
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">MedSecure Systems</div>
                <div className="text-xs text-gray-600">Strategic | Healthcare</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Upsell</span>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Umbrella</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$169K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Proposed</span>
              </td>
              <td className="px-6 py-4 text-base font-bold text-green-600">67%</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Exec review</td>
            </tr>
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">Global Financial Partners</div>
                <div className="text-xs text-gray-600">Enterprise | Financial Services</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Cross-Sell</span>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Duo</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$295K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Negotiating</span>
              </td>
              <td className="px-6 py-4 text-base font-bold text-green-600">83%</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">12</td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Contract review</td>
            </tr>
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">InnovateTech Solutions</div>
                <div className="text-xs text-gray-600">Enterprise | Technology</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Cross-Sell</span>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">ThousandEyes</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$185K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Engaged</span>
              </td>
              <td className="px-6 py-4 text-base font-bold text-yellow-600">43%</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">25</td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Demo setup</td>
            </tr>
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">CloudFirst Solutions</div>
                <div className="text-xs text-gray-600">Commercial | Technology</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Upsell</span>
              </td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">Duo</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$142K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Negotiating</span>
              </td>
              <td className="px-6 py-4 text-base font-bold text-green-600">83%</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Pricing finalize</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Risk Factors & Next Actions */}
    <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
      <h4 className="text-2xl font-bold mb-6 text-gray-900">⚠️ Pipeline Risks & Actions</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 border-2 border-red-200/50" style={{ backgroundColor: '#F3F3F3' }}>
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

        <div className="rounded-xl p-6 border-2 border-yellow-200/50" style={{ backgroundColor: '#F3F3F3' }}>
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

        <div className="rounded-xl p-6 border-2 border-blue-200/50" style={{ backgroundColor: '#F3F3F3' }}>
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

        <div className="rounded-xl p-6 border-2 border-green-200/50" style={{ backgroundColor: '#F3F3F3' }}>
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
