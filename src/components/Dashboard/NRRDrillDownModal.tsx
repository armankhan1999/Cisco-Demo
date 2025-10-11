import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

// Import master data
import expansionOpportunities from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import customersData from '@/source_data/master-data/customers.json';
import churnPredictions from '@/source_data/csm-data/churn_predictions.json';
import contractsData from '@/source_data/master-data/contracts.json';

interface NRRDrillDownModalProps {
  level: 1 | 2 | 3;
  onClose: () => void;
  onLevelChange: (level: 1 | 2 | 3) => void;
}

export default function NRRDrillDownModal({ level, onClose, onLevelChange }: NRRDrillDownModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'details'>('analytics');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  
  // Calculate total expansion ARR from real data
  const totalExpansionARR = expansionOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const baseARR = 42200000; // $42.2M
  const churnARR = 1440000; // $1.44M
  const netNRR = baseARR + totalExpansionARR - churnARR;
  const expansionPct = ((totalExpansionARR / baseARR) * 100).toFixed(1);
  const churnPct = ((churnARR / baseARR) * 100).toFixed(1);
  const nrrPct = ((netNRR / baseARR) * 100).toFixed(0);
  const expansionChurnRatio = (totalExpansionARR / churnARR).toFixed(1);
  
  const renderLevel1 = () => (
    <div className="space-y-6">
      {/* Tabs - Overview and Analytics */}
      <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'analytics'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'details'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Overview Tab Content - Simple breakdown */}
      {activeTab === 'analytics' && (
        <>
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="text-base font-semibold text-gray-600 mb-3">Base ARR</div>
              <div className="text-5xl font-bold text-gray-900">$42.2M</div>
            </div>
            <div className="bg-green-50/50 rounded-xl p-8 border-l-4 border-green-400">
              <div className="text-base font-semibold text-gray-600 mb-3">Expansion</div>
              <div className="text-5xl font-bold text-green-600">+${(totalExpansionARR / 1000000).toFixed(2)}M</div>
              <div className="text-sm text-gray-600 mt-2">+{((totalExpansionARR / 42200000) * 100).toFixed(1)}% of base ARR</div>
            </div>
            <div className="bg-red-50/50 rounded-xl p-8 border-l-4 border-red-400">
              <div className="text-base font-semibold text-gray-600 mb-3">Churn & Contraction</div>
              <div className="text-5xl font-bold text-red-600">-${(churnARR / 1000000).toFixed(2)}M</div>
              <div className="text-sm text-gray-600 mt-2">-{churnPct}% of base ARR</div>
            </div>
            <div className="bg-blue-50/50 rounded-xl p-8 border-l-4 border-blue-400">
              <div className="text-base font-semibold text-gray-600 mb-3">Expansion/Churn Ratio</div>
              <div className="text-5xl font-bold text-blue-600">{expansionChurnRatio}:1</div>
              <div className="text-sm text-gray-600 mt-2">Strong expansion</div>
            </div>
          </div>
        </>
      )}

      {/* Analytics Tab Content - Charts */}
      {activeTab === 'details' && (
        <>
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="bg-blue-50/50 rounded-xl p-8 border-l-4 border-blue-400">
              <div className="text-base font-semibold text-gray-600 mb-3">Current Quarter</div>
              <div className="text-5xl font-bold text-blue-600 mb-2">${(netNRR / 1000000).toFixed(1)}M</div>
              <div className="text-sm font-medium text-green-600">+${((netNRR - 46400000) / 1000000).toFixed(1)}M vs target</div>
            </div>
            <div className="bg-green-50/50 rounded-xl p-8 border-l-4 border-green-400">
              <div className="text-base font-semibold text-gray-600 mb-3">YoY Comparison</div>
              <div className="text-5xl font-bold text-green-600 mb-2">+$3.6M</div>
              <div className="text-sm font-medium text-gray-600">vs same quarter last year</div>
            </div>
            <div className="bg-purple-50/50 rounded-xl p-8 border-l-4 border-purple-400">
              <div className="text-base font-semibold text-gray-600 mb-3">Target</div>
              <div className="text-5xl font-bold text-purple-600 mb-2">≥ $46.4M</div>
              <div className="text-sm font-medium text-green-600">✓ Target achieved</div>
            </div>
          </div>

          {/* NRR by Customer Tier - Clickable for drill-through to accounts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h4 className="text-lg font-bold mb-4 text-gray-900">📊 NRR by Customer Tier</h4>
            <div className="grid grid-cols-4 gap-4">
              {['Strategic', 'Enterprise', 'Commercial', 'SMB'].map((tier, idx) => {
                const tierCustomers = customersData.filter(c => c.tier === tier);
                const tierARR = tierCustomers.reduce((sum, c) => sum + c.arr, 0);
                const colors = ['purple', 'blue', 'green', 'yellow'];
                const color = colors[idx];
                
                return (
                  <div 
                    key={tier}
                    onClick={() => {
                      setSelectedTier(tier);
                      onLevelChange(2);
                    }}
                    className={`bg-${color}-50 rounded-lg p-4 text-center cursor-pointer hover:bg-${color}-100 transition-colors`}
                  >
                    <div className="text-xs font-semibold text-gray-600 mb-1">{tier}</div>
                    <div className={`text-2xl font-bold text-${color}-600`}>${(tierARR / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-gray-500 mt-1">{tierCustomers.length} customers</div>
                    <div className={`text-xs text-${color}-600 font-semibold mt-2`}>View Accounts →</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Waterfall Chart - Only in Analytics Tab */}
      {activeTab === 'details' && (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 NRR Waterfall Chart</h4>
        <div className="space-y-6">
          {/* Visual Waterfall as Line Graph */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 800 280" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              <line x1="80" y1="220" x2="720" y2="220" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="80" y1="165" x2="720" y2="165" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="80" y1="110" x2="720" y2="110" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="80" y1="55" x2="720" y2="55" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Shaded area under line */}
              <defs>
                <linearGradient id="waterfallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              <path
                d="M 120 100 L 300 65 L 480 75 L 660 70 L 660 220 L 120 220 Z"
                fill="url(#waterfallGradient)"
              />
              
              {/* Connecting lines */}
              <path
                d="M 120 100 L 300 65 L 480 75 L 660 70"
                stroke="#60A5FA"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points with pastel colors */}
              <circle cx="120" cy="100" r="8" fill="#9CA3AF" stroke="white" strokeWidth="2" />
              <circle cx="300" cy="65" r="8" fill="#86EFAC" stroke="white" strokeWidth="2" />
              <circle cx="480" cy="75" r="8" fill="#FCA5A5" stroke="white" strokeWidth="2" />
              <circle cx="660" cy="70" r="9" fill="#60A5FA" stroke="white" strokeWidth="2" />
              
              {/* Labels */}
              <text x="120" y="250" textAnchor="middle" fontSize="13" fill="#6B7280" fontWeight="600">Base</text>
              <text x="300" y="250" textAnchor="middle" fontSize="13" fill="#6B7280" fontWeight="600">Expansion</text>
              <text x="480" y="250" textAnchor="middle" fontSize="13" fill="#6B7280" fontWeight="600">Churn</text>
              <text x="660" y="250" textAnchor="middle" fontSize="13" fill="#2563EB" fontWeight="700">Net NRR</text>
              
              {/* Values */}
              <text x="120" y="90" textAnchor="middle" fontSize="15" fill="#111827" fontWeight="700">${(baseARR / 1000000).toFixed(1)}M</text>
              <text x="300" y="50" textAnchor="middle" fontSize="15" fill="#16A34A" fontWeight="700">+${(totalExpansionARR / 1000000).toFixed(2)}M</text>
              <text x="480" y="65" textAnchor="middle" fontSize="15" fill="#DC2626" fontWeight="700">-${(churnARR / 1000000).toFixed(2)}M</text>
              <text x="660" y="55" textAnchor="middle" fontSize="17" fill="#2563EB" fontWeight="700">${(netNRR / 1000000).toFixed(1)}M</text>
            </svg>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-3 pt-6 border-t-2">
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-lg font-bold text-gray-900">Base Retention</span>
              <span className="text-2xl font-bold text-gray-900">${(baseARR / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-lg font-bold text-gray-900">+ Expansion Revenue</span>
              <span className="text-2xl font-bold text-green-600">+${(totalExpansionARR / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <span className="text-lg font-bold text-gray-900">- Churn & Contraction</span>
              <span className="text-2xl font-bold text-red-600">-${(churnARR / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex items-center justify-between py-4 bg-blue-50 px-4 rounded-lg">
              <span className="text-xl font-bold text-gray-900">Net Revenue Retention</span>
              <span className="text-3xl font-bold text-blue-600">${(netNRR / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Quarterly Trend Chart - Shaded Line Graph - Only in Analytics Tab */}
      {activeTab === 'analytics' && (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📈 NRR Quarterly Trend</h4>
        <div className="space-y-4">
          {/* Line Chart with Shading */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              <line x1="80" y1="200" x2="720" y2="200" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="80" y1="150" x2="720" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="80" y1="100" x2="720" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="80" y1="50" x2="720" y2="50" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Shaded area under line */}
              <defs>
                <linearGradient id="nrrGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              <path
                d="M 80 130 L 240 110 L 400 95 L 560 75 L 720 60 L 720 200 L 80 200 Z"
                fill="url(#nrrGradient)"
              />
              
              {/* Line */}
              <path
                d="M 80 130 L 240 110 L 400 95 L 560 75 L 720 60"
                stroke="#60A5FA"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              <circle cx="80" cy="130" r="6" fill="#3B82F6" stroke="white" strokeWidth="2" />
              <circle cx="240" cy="110" r="6" fill="#3B82F6" stroke="white" strokeWidth="2" />
              <circle cx="400" cy="95" r="6" fill="#3B82F6" stroke="white" strokeWidth="2" />
              <circle cx="560" cy="75" r="6" fill="#3B82F6" stroke="white" strokeWidth="2" />
              <circle cx="720" cy="60" r="7" fill="#2563EB" stroke="white" strokeWidth="2" />
              
              {/* Labels */}
              <text x="80" y="225" textAnchor="middle" fontSize="12" fill="#6B7280" fontWeight="600">Q1 2024</text>
              <text x="240" y="225" textAnchor="middle" fontSize="12" fill="#6B7280" fontWeight="600">Q2 2024</text>
              <text x="400" y="225" textAnchor="middle" fontSize="12" fill="#6B7280" fontWeight="600">Q3 2024</text>
              <text x="560" y="225" textAnchor="middle" fontSize="12" fill="#6B7280" fontWeight="600">Q4 2024</text>
              <text x="720" y="225" textAnchor="middle" fontSize="12" fill="#2563EB" fontWeight="700">Current</text>
              
              {/* Values */}
              <text x="80" y="120" textAnchor="middle" fontSize="14" fill="#111827" fontWeight="700">$44.9M</text>
              <text x="240" y="100" textAnchor="middle" fontSize="14" fill="#111827" fontWeight="700">$46.2M</text>
              <text x="400" y="85" textAnchor="middle" fontSize="14" fill="#111827" fontWeight="700">$47.3M</text>
              <text x="560" y="65" textAnchor="middle" fontSize="14" fill="#111827" fontWeight="700">$48.1M</text>
              <text x="720" y="45" textAnchor="middle" fontSize="16" fill="#2563EB" fontWeight="700">${(netNRR / 1000000).toFixed(1)}M</text>
            </svg>
          </div>
          <div className="text-center pt-4 border-t">
            <span className="text-base font-bold text-green-600">↗ +8.5% YoY Growth</span>
          </div>
        </div>
      </div>
      )}
    </div>
  );

  const renderLevel2 = () => {
    // Get all customers for the selected tier
    const tierCustomers = selectedTier ? customersData.filter(c => c.tier === selectedTier) : [];
    
    // Calculate expansion for each customer from opportunities
    const accounts = tierCustomers.map(customer => {
      const customerOpps = expansionOpportunities.filter(opp => opp.customer_id === customer.customer_id);
      const expansionValue = customerOpps.reduce((sum, opp) => sum + opp.estimated_arr, 0);
      const nrrValue = customer.arr + expansionValue - (customer.arr * 0.034); // Assuming 3.4% churn
      const nrrPercent = ((nrrValue / customer.arr) * 100).toFixed(1);
      
      return {
        name: customer.customer_name,
        arr: `$${(customer.arr / 1000).toFixed(0)}K`,
        expansion: expansionValue > 0 ? `+$${(expansionValue / 1000).toFixed(0)}K` : '$0',
        nrr: `${nrrPercent}%`,
        nrrDollar: `$${(nrrValue / 1000).toFixed(0)}K`
      };
    });
    
    const totalTierARR = tierCustomers.reduce((sum, c) => sum + c.arr, 0);

    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => onLevelChange(1)}
            className="text-base font-semibold text-blue-600 hover:text-blue-700 mb-3 flex items-center gap-2"
          >
            ← Back to Analytics
          </button>
          <h3 className="text-3xl font-bold text-gray-900">{selectedTier} Tier Accounts</h3>
          <p className="text-sm text-gray-600 mt-1">{accounts.length} accounts • Total ARR: ${(totalTierARR / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Account List */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 Account List</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Account Name</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total ARR</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Expansion</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">NRR</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {accounts.map((account, index) => (
                <tr 
                  key={index}
                  className="hover:bg-blue-50 cursor-pointer transition-colors" 
                  onClick={() => setSelectedAccount(account.name)}
                >
                  <td className="px-6 py-4 text-base font-bold text-gray-900">{account.name}</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">{account.arr}</td>
                  <td className="px-6 py-4 text-base font-bold text-green-600">{account.expansion}</td>
                  <td className="px-6 py-4 text-lg font-bold text-green-600">{account.nrr}</td>
                  <td className="px-6 py-4 text-base text-blue-600 font-bold">View Details →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  const renderLevel3 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => onLevelChange(1)}
            className="text-base font-semibold text-blue-600 hover:text-blue-700 mb-3 flex items-center gap-2"
          >
            ← Back to Overview
          </button>
          <h3 className="text-3xl font-bold text-gray-900">NRR Action Items - Operational View</h3>
          <p className="text-sm text-gray-600 mt-1">Immediate actions required to improve NRR</p>
        </div>
      </div>

      {/* Action Items Grid - Matching screenshot - All Clickable */}
      <div className="grid grid-cols-3 gap-6">
        <div 
          className="bg-red-50/50 rounded-lg p-4 border-l-4 border-red-400 cursor-pointer hover:bg-red-100 transition-colors"
          onClick={() => {
            document.getElementById('at-risk-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-xs font-semibold text-gray-600 mb-2">At-Risk Accounts</div>
          <div className="text-5xl font-bold text-red-600 mb-1">{churnPredictions.filter(p => p.churn_probability_tier === 'High' || p.churn_probability_tier === 'Medium').length}</div>
          <div className="text-xs font-medium text-gray-600">Require immediate intervention</div>
          <div className="text-xs text-red-600 font-semibold mt-2">View All →</div>
        </div>
        <div 
          className="bg-orange-50/50 rounded-xl p-6 border-l-4 border-orange-400 cursor-pointer hover:bg-orange-100 transition-colors"
          onClick={() => {
            document.getElementById('expansion-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-xs font-semibold text-gray-600 mb-2">Expansion Opportunities</div>
          <div className="text-5xl font-bold text-orange-600 mb-1">{expansionOpportunities.filter(o => o.expansion_readiness_score >= 80).length}</div>
          <div className="text-xs font-medium text-gray-600">Ready to outreach</div>
          <div className="text-xs text-orange-600 font-semibold mt-2">View All →</div>
        </div>
        <div 
          className="bg-green-50/50 rounded-xl p-6 border-l-4 border-green-400 cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => {
            document.getElementById('renewal-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-xs font-semibold text-gray-600 mb-2">Renewal + Expansion</div>
          <div className="text-5xl font-bold text-green-600 mb-1">{contractsData.filter(c => {
            const renewalDate = new Date(c.end_date);
            const today = new Date();
            const daysToRenewal = Math.floor((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return daysToRenewal > 0 && daysToRenewal <= 90;
          }).length}</div>
          <div className="text-xs font-medium text-gray-600">Upcoming renewals with upsell</div>
          <div className="text-xs text-green-600 font-semibold mt-2">View All →</div>
        </div>
      </div>

      {/* Additional Tier 3 Operational Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-purple-50/50 rounded-lg p-4 border-l-4 border-purple-400">
          <div className="text-xs font-semibold text-gray-600 mb-1">Capacity Alerts</div>
          <div className="text-3xl font-bold text-purple-600">18</div>
          <div className="text-xs text-gray-500 mt-1">Utilization &gt;85%</div>
        </div>
        <div className="bg-yellow-50/50 rounded-lg p-4 border-l-4 border-yellow-400">
          <div className="text-xs font-semibold text-gray-600 mb-1">Overdue Follow-ups</div>
          <div className="text-3xl font-bold text-yellow-600">6</div>
          <div className="text-xs text-gray-500 mt-1">Action required</div>
        </div>
        <div className="bg-blue-50/50 rounded-lg p-4 border-l-4 border-blue-400">
          <div className="text-xs font-semibold text-gray-600 mb-1">Champion Departures</div>
          <div className="text-3xl font-bold text-blue-600">3</div>
          <div className="text-xs text-gray-500 mt-1">Need new contact</div>
        </div>
        <div className="bg-teal-50/50 rounded-lg p-4 border-l-4 border-teal-400">
          <div className="text-xs font-semibold text-gray-600 mb-1">Budget Cycle Opps</div>
          <div className="text-3xl font-bold text-teal-600">9</div>
          <div className="text-xs text-gray-500 mt-1">Planning phase</div>
        </div>
      </div>

      {/* At-Risk Accounts Table */}
      <div id="at-risk-section" className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">🚨 At-Risk Accounts Requiring Action</h4>
        <p className="text-sm text-gray-600 mb-4">Showing all {churnPredictions.filter(p => p.churn_probability_tier === 'High' || p.churn_probability_tier === 'Medium').length} at-risk accounts</p>
        <div className="space-y-3">
          {churnPredictions
            .filter(p => p.churn_probability_tier === 'High' || p.churn_probability_tier === 'Medium')
            .map(prediction => {
              const customer = customersData.find(c => c.customer_id === prediction.account_id);
              if (!customer) return null;
              
              const isHighRisk = prediction.churn_probability_tier === 'High';
              const bgColor = isHighRisk ? 'bg-red-50' : 'bg-orange-50';
              const borderColor = isHighRisk ? 'border-red-500' : 'border-orange-500';
              const textColor = isHighRisk ? 'text-red-600' : 'text-orange-600';
              const hoverColor = isHighRisk ? 'hover:bg-red-100' : 'hover:bg-orange-100';
              
              // Get primary risk factors
              const riskFactors = prediction.risk_factors.slice(0, 2).map((rf: any) => rf.factor).join(' • ');
              
              return (
                <div 
                  key={prediction.account_id}
                  className={`${bgColor} rounded-lg p-4 border-l-4 ${borderColor} cursor-pointer ${hoverColor} transition-colors`}
                  onClick={() => setSelectedAccount(customer.customer_name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-gray-900">{customer.customer_name}</div>
                      <div className="text-sm text-gray-600 mt-1">{riskFactors}</div>
                      <div className={`text-xs ${textColor} font-semibold mt-2`}>Action: {prediction.recommended_action} →</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${textColor}`}>${(customer.arr / 1000).toFixed(0)}K ARR</div>
                      <div className={`text-xs ${textColor} font-semibold`}>{prediction.churn_probability_tier} Risk</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Expansion Opportunities */}
      <div id="expansion-section" className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Hot Expansion Opportunities</h4>
        <p className="text-sm text-gray-600 mb-4">Showing all {expansionOpportunities.filter(o => o.expansion_readiness_score >= 80).length} high-readiness opportunities</p>
        <div className="space-y-3">
          {expansionOpportunities
            .filter(opp => opp.expansion_readiness_score >= 80)
            .sort((a, b) => b.expansion_readiness_score - a.expansion_readiness_score)
            .map(opp => {
              const customer = customersData.find(c => c.customer_id === opp.customer_id);
              if (!customer) return null;
              
              return (
                <div 
                  key={opp.opportunity_id}
                  className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => setSelectedAccount(customer.customer_name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-gray-900">{customer.customer_name}</div>
                      <div className="text-sm text-gray-600 mt-1">{opp.business_case} • {opp.stage}</div>
                      <div className="text-xs text-green-600 font-semibold mt-2">Action: {opp.next_action} →</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">+${(opp.estimated_arr / 1000).toFixed(0)}K potential</div>
                      <div className="text-xs text-green-600 font-semibold">{opp.close_probability}% win rate</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Renewal + Expansion */}
      <div id="renewal-section" className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">🔄 Upcoming Renewals with Expansion Potential</h4>
        <p className="text-sm text-gray-600 mb-4">Showing all {contractsData.filter(c => {
          const renewalDate = new Date(c.end_date);
          const today = new Date();
          const daysToRenewal = Math.floor((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return daysToRenewal > 0 && daysToRenewal <= 90;
        }).length} renewals in next 90 days</p>
        <div className="space-y-3">
          {contractsData
            .filter(contract => {
              const renewalDate = new Date(contract.end_date);
              const today = new Date();
              const daysToRenewal = Math.floor((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return daysToRenewal > 0 && daysToRenewal <= 90;
            })
            .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
            .map(contract => {
              const customer = customersData.find(c => c.customer_id === contract.customer_id);
              if (!customer) return null;
              
              const customerOpps = expansionOpportunities.filter(opp => opp.customer_id === contract.customer_id);
              const expansionValue = customerOpps.reduce((sum, opp) => sum + opp.estimated_arr, 0);
              
              const renewalDate = new Date(contract.end_date);
              const today = new Date();
              const daysToRenewal = Math.floor((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div 
                  key={contract.contract_id}
                  className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => setSelectedAccount(customer.customer_name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-gray-900">{customer.customer_name}</div>
                      <div className="text-sm text-gray-600 mt-1">Renewal in {daysToRenewal} days • {customerOpps.length} expansion opps</div>
                      <div className="text-xs text-blue-600 font-semibold mt-2">Action: Prepare renewal + expansion proposal →</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">${(contract.arr / 1000).toFixed(0)}K renewal</div>
                      {expansionValue > 0 && (
                        <div className="text-xs text-blue-600 font-semibold">+${(expansionValue / 1000).toFixed(0)}K expansion</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Account-Level Action Metrics */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 Account Expansion Readiness Scores</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">92</div>
              <div>
                <div className="text-base font-bold text-gray-900">TechCorp Industries</div>
                <div className="text-sm text-gray-600">High health • Strong utilization • Active champion</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Create Opportunity
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xl">68</div>
              <div>
                <div className="text-base font-bold text-gray-900">CloudFirst Solutions</div>
                <div className="text-sm text-gray-600">Medium health • Growing usage • Budget confirmed</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
              Schedule QBR
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl">34</div>
              <div>
                <div className="text-base font-bold text-gray-900">DataVault Corp</div>
                <div className="text-sm text-gray-600">Low health • Declining usage • Risk mitigation needed</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Intervention Plan
            </button>
          </div>
        </div>
      </div>

      {/* Competitive Threats & Budget Cycles */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h4 className="text-xl font-bold mb-4 text-gray-900">⚠️ Competitive Threat Alerts</h4>
          <div className="space-y-2">
            <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
              <div className="text-sm font-bold text-gray-900">SecureNet Global</div>
              <div className="text-xs text-gray-600 mt-1">Competitor activity detected • $2.1M at risk</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-500">
              <div className="text-sm font-bold text-gray-900">HealthTech Partners</div>
              <div className="text-xs text-gray-600 mt-1">RFP issued • Defensive strategy required</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h4 className="text-xl font-bold mb-4 text-gray-900">💰 Budget Cycle Opportunities</h4>
          <div className="space-y-2">
            <div className="bg-teal-50 rounded-lg p-3 border-l-4 border-teal-500">
              <div className="text-sm font-bold text-gray-900">Enterprise Systems Inc</div>
              <div className="text-xs text-gray-600 mt-1">Q1 planning • Submit proposal by Dec 15</div>
            </div>
            <div className="bg-teal-50 rounded-lg p-3 border-l-4 border-teal-500">
              <div className="text-sm font-bold text-gray-900">Digital Transform Co</div>
              <div className="text-xs text-gray-600 mt-1">Annual budget review • $1.6M opportunity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Net Revenue Retention</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-5xl font-bold leading-none px-4"
          >
            ×
          </button>
        </div>
        
        <div className="px-8 py-6">
          {level === 1 && renderLevel1()}
          {level === 2 && renderLevel2()}
          {level === 3 && renderLevel3()}
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
}
