import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

// Import ONLY sales expansion data
import expansionOpportunities from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import customersData from '@/source_data/master-data/customers.json';

interface ExpansionARRDrillDownModalProps {
  level: 1 | 2 | 3;
  onClose: () => void;
  onLevelChange: (level: 1 | 2 | 3) => void;
}

export default function ExpansionARRDrillDownModal({ level, onClose, onLevelChange }: ExpansionARRDrillDownModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<'upsell' | 'cross_sell' | 'capacity' | 'bundle' | null>(null);
  
  // Calculate all metrics from sales expansion data ONLY
  const totalExpansionARR = expansionOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const upsellARR = expansionOpportunities.filter(o => o.opportunity_type === 'upsell').reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const crossSellARR = expansionOpportunities.filter(o => o.opportunity_type === 'cross_sell').reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const capacityARR = expansionOpportunities.filter(o => o.business_case?.includes('Capacity threshold')).reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const bundleARR = expansionOpportunities.filter(o => o.opportunity_type === 'bundle').reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const avgDealSize = totalExpansionARR / expansionOpportunities.length;
  const avgWinRate = Math.round(expansionOpportunities.reduce((sum, opp) => sum + opp.close_probability, 0) / expansionOpportunities.length);
  
  const renderLevel1 = () => (
    <div className="space-y-6">
      {/* Tabs - Overview and Analytics */}
      <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'overview'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'analytics'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div 
              className="bg-green-50/50 rounded-xl p-8 border-l-4 border-green-400 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => {
                setSelectedCategory('upsell');
                onLevelChange(2);
              }}
            >
              <div className="text-base font-semibold text-gray-600 mb-3">Upsell ARR</div>
              <div className="text-5xl font-bold text-green-600">${(upsellARR / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600 mt-2">{Math.round((upsellARR / totalExpansionARR) * 100)}% of total expansion</div>
              <div className="text-xs text-green-600 font-semibold mt-2">View Details →</div>
            </div>
            <div 
              className="bg-purple-50/50 rounded-xl p-8 border-l-4 border-purple-400 cursor-pointer hover:bg-purple-100 transition-colors"
              onClick={() => {
                setSelectedCategory('cross_sell');
                onLevelChange(2);
              }}
            >
              <div className="text-base font-semibold text-gray-600 mb-3">Cross-Sell ARR</div>
              <div className="text-5xl font-bold text-purple-600">${(crossSellARR / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600 mt-2">{Math.round((crossSellARR / totalExpansionARR) * 100)}% of total expansion</div>
              <div className="text-xs text-purple-600 font-semibold mt-2">View Details →</div>
            </div>
            <div 
              className="bg-orange-50/50 rounded-xl p-8 border-l-4 border-orange-400 cursor-pointer hover:bg-orange-100 transition-colors"
              onClick={() => {
                setSelectedCategory('capacity');
                onLevelChange(2);
              }}
            >
              <div className="text-base font-semibold text-gray-600 mb-3">Capacity ARR</div>
              <div className="text-5xl font-bold text-orange-600">${(capacityARR / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600 mt-2">{Math.round((capacityARR / totalExpansionARR) * 100)}% of total expansion</div>
              <div className="text-xs text-orange-600 font-semibold mt-2">View Details →</div>
            </div>
            <div 
              className="bg-blue-50/50 rounded-xl p-8 border-l-4 border-blue-400 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => {
                setSelectedCategory('bundle');
                onLevelChange(2);
              }}
            >
              <div className="text-base font-semibold text-gray-600 mb-3">Bundle ARR</div>
              <div className="text-5xl font-bold text-blue-600">${bundleARR > 0 ? `$${(bundleARR / 1000000).toFixed(1)}M` : `$${(bundleARR / 1000).toFixed(0)}K`}</div>
              <div className="text-sm text-gray-600 mt-2">{Math.round((bundleARR / totalExpansionARR) * 100)}% of total expansion</div>
              <div className="text-xs text-blue-600 font-semibold mt-2">View Details →</div>
            </div>
          </div>

          {/* Expansion Performance Summary */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8">
            <h4 className="text-xl font-bold mb-6 text-gray-900">📈 Expansion Performance Summary</h4>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Total Expansion ARR</div>
                <div className="text-4xl font-bold text-blue-600 mb-2">${(totalExpansionARR / 1000000).toFixed(2)}M</div>
                <div className="text-sm text-green-600 font-semibold">+{((totalExpansionARR / 42200000) * 100).toFixed(1)}% of base ARR</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Avg Deal Size</div>
                <div className="text-4xl font-bold text-green-600 mb-2">${(avgDealSize / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600">Across {expansionOpportunities.length} deals</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Win Rate</div>
                <div className="text-4xl font-bold text-purple-600 mb-2">{avgWinRate}%</div>
                <div className="text-sm text-green-600 font-semibold">+{avgWinRate - 60}pp vs target</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Key Insight:</span> {upsellARR > crossSellARR ? 'Upsell' : 'Cross-sell'} continues to drive the majority of expansion revenue ({Math.round((Math.max(upsellARR, crossSellARR) / totalExpansionARR) * 100)}%), 
                with {expansionOpportunities.filter(o => o.expansion_readiness_score >= 80).length} high-readiness opportunities. 
                Average deal size is ${(avgDealSize / 1000).toFixed(0)}K with {avgWinRate}% win rate across all categories.
              </p>
            </div>
          </div>

          {/* Quarterly Trend Chart */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8">
            <h4 className="text-xl font-bold mb-6 text-gray-900">📊 Quarterly Expansion Trend</h4>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-600 mb-2">Current Quarter Total</div>
                <div className="text-5xl font-bold text-blue-600 mb-2">${(totalExpansionARR / 1000000).toFixed(2)}M</div>
                <div className="text-sm text-gray-600">Based on {expansionOpportunities.length} active opportunities</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Historical trend data not available in current dataset
            </div>
          </div>

          {/* Top Performing Categories */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <h4 className="text-xl font-bold mb-6 text-gray-900">🏆 Top Performing Categories</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <div className="text-base font-bold text-gray-900">Upsell - License Expansion</div>
                  <div className="text-sm text-gray-600">Driven by utilization alerts and growth</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">$4.5M</div>
                  <div className="text-xs text-green-600 font-semibold">+22% YoY</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <div className="text-base font-bold text-gray-900">Cross-Sell - New Products</div>
                  <div className="text-sm text-gray-600">White space identification success</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">$3.8M</div>
                  <div className="text-xs text-purple-600 font-semibold">+18% YoY</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <div className="text-base font-bold text-gray-900">Capacity - Proactive Upsell</div>
                  <div className="text-sm text-gray-600">High utilization triggers</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">$1.5M</div>
                  <div className="text-xs text-orange-600 font-semibold">+16% YoY</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Analytics Tab Content */}
      {activeTab === 'analytics' && (
        <>
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="bg-blue-50/50 rounded-xl p-8 border-l-4 border-blue-400">
              <div className="text-base font-semibold text-gray-600 mb-3">Current Quarter</div>
              <div className="text-5xl font-bold text-blue-600 mb-2">$10.3M</div>
              <div className="text-sm font-medium text-green-600">+$1.8M vs target</div>
            </div>
            <div className="bg-green-50/50 rounded-xl p-8 border-l-4 border-green-400">
              <div className="text-base font-semibold text-gray-600 mb-3">QoQ Growth</div>
              <div className="text-5xl font-bold text-green-600 mb-2">+18%</div>
              <div className="text-sm font-medium text-gray-600">vs last quarter</div>
            </div>
            <div className="bg-purple-50/50 rounded-xl p-8 border-l-4 border-purple-400">
              <div className="text-base font-semibold text-gray-600 mb-3">Target</div>
              <div className="text-5xl font-bold text-purple-600 mb-2">$8.5M</div>
              <div className="text-sm font-medium text-green-600">✓ Target exceeded</div>
            </div>
          </div>

          {/* Expansion by Product Family - Clickable */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h4 className="text-lg font-bold mb-4 text-gray-900">📦 Expansion ARR by Product Family</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Customers</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Total ARR</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Attach Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">YoY Growth</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr 
                    className="hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCategory('Meraki');
                      onLevelChange(2);
                    }}
                  >
                    <td className="px-6 py-4 text-base font-bold text-gray-900">Meraki</td>
                    <td className="px-6 py-4 text-base font-semibold text-gray-800">35</td>
                    <td className="px-6 py-4 text-base font-bold text-gray-900">$3.2M</td>
                    <td className="px-6 py-4 text-base font-semibold text-green-600">70%</td>
                    <td className="px-6 py-4 text-base font-bold text-green-600">+22%</td>
                    <td className="px-6 py-4 text-base text-blue-600 font-bold">View Accounts →</td>
                  </tr>
                  <tr 
                    className="hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCategory('Duo');
                      onLevelChange(2);
                    }}
                  >
                    <td className="px-6 py-4 text-base font-bold text-gray-900">Duo</td>
                    <td className="px-6 py-4 text-base font-semibold text-gray-800">28</td>
                    <td className="px-6 py-4 text-base font-bold text-gray-900">$2.8M</td>
                    <td className="px-6 py-4 text-base font-semibold text-green-600">68%</td>
                    <td className="px-6 py-4 text-base font-bold text-green-600">+18%</td>
                    <td className="px-6 py-4 text-base text-blue-600 font-bold">View Accounts →</td>
                  </tr>
                  <tr 
                    className="hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCategory('Umbrella');
                      onLevelChange(2);
                    }}
                  >
                    <td className="px-6 py-4 text-base font-bold text-gray-900">Umbrella</td>
                    <td className="px-6 py-4 text-base font-semibold text-gray-800">25</td>
                    <td className="px-6 py-4 text-base font-bold text-gray-900">$2.1M</td>
                    <td className="px-6 py-4 text-base font-semibold text-green-600">60%</td>
                    <td className="px-6 py-4 text-base font-bold text-green-600">+16%</td>
                    <td className="px-6 py-4 text-base text-blue-600 font-bold">View Accounts →</td>
                  </tr>
                  <tr 
                    className="hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCategory('ThousandEyes');
                      onLevelChange(2);
                    }}
                  >
                    <td className="px-6 py-4 text-base font-bold text-gray-900">ThousandEyes</td>
                    <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
                    <td className="px-6 py-4 text-base font-bold text-gray-900">$1.6M</td>
                    <td className="px-6 py-4 text-base font-semibold text-green-600">55%</td>
                    <td className="px-6 py-4 text-base font-bold text-green-600">+25%</td>
                    <td className="px-6 py-4 text-base text-blue-600 font-bold">View Accounts →</td>
                  </tr>
                  <tr 
                    className="hover:bg-green-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedCategory('Splunk');
                      onLevelChange(2);
                    }}
                  >
                    <td className="px-6 py-4 text-base font-bold text-gray-900">Splunk</td>
                    <td className="px-6 py-4 text-base font-semibold text-gray-800">12</td>
                    <td className="px-6 py-4 text-base font-bold text-gray-900">$600K</td>
                    <td className="px-6 py-4 text-base font-semibold text-yellow-600">45%</td>
                    <td className="px-6 py-4 text-base font-bold text-green-600">+12%</td>
                    <td className="px-6 py-4 text-base text-blue-600 font-bold">View Accounts →</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Expansion Deal Size Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h4 className="text-lg font-bold mb-4 text-gray-900">💰 Expansion Deal Size Distribution</h4>
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div 
                className="bg-blue-50 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => onLevelChange(3)}
              >
                <div className="text-xs font-semibold text-gray-600 mb-2">&lt;$50K</div>
                <div className="text-3xl font-bold text-blue-600">18</div>
                <div className="text-xs text-gray-500 mt-1">deals</div>
                <div className="text-xs text-blue-600 font-semibold mt-2">View →</div>
              </div>
              <div 
                className="bg-green-50 rounded-lg p-4 text-center cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => onLevelChange(3)}
              >
                <div className="text-xs font-semibold text-gray-600 mb-2">$50K-$100K</div>
                <div className="text-3xl font-bold text-green-600">15</div>
                <div className="text-xs text-gray-500 mt-1">deals</div>
                <div className="text-xs text-green-600 font-semibold mt-2">View →</div>
              </div>
              <div 
                className="bg-purple-50 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => onLevelChange(3)}
              >
                <div className="text-xs font-semibold text-gray-600 mb-2">$100K-$250K</div>
                <div className="text-3xl font-bold text-purple-600">12</div>
                <div className="text-xs text-gray-500 mt-1">deals</div>
                <div className="text-xs text-purple-600 font-semibold mt-2">View →</div>
              </div>
              <div 
                className="bg-orange-50 rounded-lg p-4 text-center cursor-pointer hover:bg-orange-100 transition-colors"
                onClick={() => onLevelChange(3)}
              >
                <div className="text-xs font-semibold text-gray-600 mb-2">$250K-$500K</div>
                <div className="text-3xl font-bold text-orange-600">8</div>
                <div className="text-xs text-gray-500 mt-1">deals</div>
                <div className="text-xs text-orange-600 font-semibold mt-2">View →</div>
              </div>
              <div 
                className="bg-pink-50 rounded-lg p-4 text-center cursor-pointer hover:bg-pink-100 transition-colors"
                onClick={() => onLevelChange(3)}
              >
                <div className="text-xs font-semibold text-gray-600 mb-2">&gt;$500K</div>
                <div className="text-3xl font-bold text-pink-600">3</div>
                <div className="text-xs text-gray-500 mt-1">deals</div>
                <div className="text-xs text-pink-600 font-semibold mt-2">View →</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-700">Average Deal Size</div>
                  <div className="text-xs text-gray-600">Across all expansion categories</div>
                </div>
                <div className="text-3xl font-bold text-blue-600">$185K</div>
              </div>
            </div>
          </div>

          {/* Capacity-Driven Expansion ARR */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h4 className="text-lg font-bold mb-4 text-gray-900">⚡ Capacity-Driven Expansion ARR</h4>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Total Capacity ARR</div>
                <div className="text-4xl font-bold text-orange-600 mb-2">$1.5M</div>
                <div className="text-sm text-green-600 font-semibold">+16% YoY</div>
              </div>
              <div 
                className="bg-red-50 rounded-lg p-6 cursor-pointer hover:bg-red-100 transition-colors"
                onClick={() => onLevelChange(3)}
              >
                <div className="text-sm font-semibold text-gray-600 mb-2">Active Alerts</div>
                <div className="text-4xl font-bold text-red-600 mb-2">18</div>
                <div className="text-sm text-gray-600">Utilization &gt;85%</div>
                <div className="text-xs text-red-600 font-semibold mt-2">View Alerts →</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">Conversion Rate</div>
                <div className="text-4xl font-bold text-green-600 mb-2">72%</div>
                <div className="text-sm text-green-600 font-semibold">+8pp vs target</div>
              </div>
            </div>
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                onClick={() => onLevelChange(3)}
              >
                <div>
                  <div className="text-sm font-bold text-gray-900">High Utilization Accounts</div>
                  <div className="text-xs text-gray-600">12 accounts at 85-95% capacity</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">$850K potential</div>
                  <div className="text-xs text-orange-600 font-semibold">View Accounts →</div>
                </div>
              </div>
              <div 
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                onClick={() => onLevelChange(3)}
              >
                <div>
                  <div className="text-sm font-bold text-gray-900">Critical Capacity Alerts</div>
                  <div className="text-xs text-gray-600">6 accounts at &gt;95% capacity</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">$420K potential</div>
                  <div className="text-xs text-red-600 font-semibold">View Accounts →</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderLevel2 = () => {
    if (!selectedCategory) return null;
    
    // Filter opportunities by selected category
    const categoryOpportunities = selectedCategory === 'capacity' 
      ? expansionOpportunities.filter(opp => opp.business_case?.includes('Capacity threshold'))
      : expansionOpportunities.filter(opp => opp.opportunity_type === selectedCategory);
    
    // Map to account data
    const accounts = categoryOpportunities.map(opp => {
      const customer = customersData.find(c => c.customer_id === opp.customer_id);
      if (!customer) return null;
      
      return {
        name: customer.customer_name,
        arr: `$${(customer.arr / 1000).toFixed(0)}K`,
        expansion: `+$${(opp.estimated_arr / 1000).toFixed(0)}K`,
        type: opp.opportunity_type,
        stage: opp.stage,
        probability: opp.close_probability
      };
    }).filter(Boolean);
    
    const totalCategoryARR = categoryOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
    const categoryLabel = selectedCategory === 'cross_sell' ? 'Cross-Sell' : 
                         selectedCategory === 'upsell' ? 'Upsell' : 
                         selectedCategory === 'capacity' ? 'Capacity' : 'Bundle';

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={() => onLevelChange(1)}
              className="text-base font-semibold text-orange-600 hover:text-orange-700 mb-3 flex items-center gap-2"
            >
              ← Back to Analytics
            </button>
            <h3 className="text-3xl font-bold text-gray-900">{categoryLabel} Expansion Accounts</h3>
            <p className="text-sm text-gray-600 mt-1">{accounts.length} opportunities • Total ARR: ${(totalCategoryARR / 1000000).toFixed(2)}M</p>
          </div>
        </div>

        {/* Account List */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 Opportunity List</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Account Name</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Current ARR</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Expansion Potential</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Stage</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Win Rate</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accounts.map((account, index) => account && (
                  <tr 
                    key={index}
                    className="hover:bg-orange-50 cursor-pointer transition-colors" 
                    onClick={() => setSelectedAccount(account.name)}
                  >
                    <td className="px-6 py-4 text-base font-bold text-gray-900">{account.name}</td>
                    <td className="px-6 py-4 text-base font-semibold text-gray-800">{account.arr}</td>
                    <td className="px-6 py-4 text-base font-bold text-green-600">{account.expansion}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">{account.stage}</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">{account.probability}%</td>
                    <td className="px-6 py-4 text-base text-orange-600 font-bold">View Details →</td>
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
            className="text-base font-semibold text-orange-600 hover:text-orange-700 mb-3 flex items-center gap-2"
          >
            ← Back to Overview
          </button>
          <h3 className="text-3xl font-bold text-gray-900">Expansion ARR Action Items</h3>
          <p className="text-sm text-gray-600 mt-1">Immediate actions to drive expansion revenue</p>
        </div>
      </div>

      {/* Action Items Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div 
          className="bg-green-50/50 rounded-xl p-6 border-l-4 border-green-400 cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => {
            document.getElementById('upsell-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-xs font-semibold text-gray-600 mb-2">Upsell Opportunities</div>
          <div className="text-5xl font-bold text-green-600 mb-1">18</div>
          <div className="text-xs font-medium text-gray-600">Ready to quote</div>
          <div className="text-xs text-green-600 font-semibold mt-2">View All →</div>
        </div>
        <div 
          className="bg-purple-50/50 rounded-xl p-6 border-l-4 border-purple-400 cursor-pointer hover:bg-purple-100 transition-colors"
          onClick={() => {
            document.getElementById('crosssell-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-xs font-semibold text-gray-600 mb-2">Cross-Sell Opportunities</div>
          <div className="text-5xl font-bold text-purple-600 mb-1">15</div>
          <div className="text-xs font-medium text-gray-600">High fit score</div>
          <div className="text-xs text-purple-600 font-semibold mt-2">View All →</div>
        </div>
        <div 
          className="bg-orange-50/50 rounded-xl p-6 border-l-4 border-orange-400 cursor-pointer hover:bg-orange-100 transition-colors"
          onClick={() => {
            document.getElementById('capacity-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-xs font-semibold text-gray-600 mb-2">Capacity Alerts</div>
          <div className="text-5xl font-bold text-orange-600 mb-1">12</div>
          <div className="text-xs font-medium text-gray-600">Utilization &gt;85%</div>
          <div className="text-xs text-orange-600 font-semibold mt-2">View All →</div>
        </div>
        <div 
          className="bg-blue-50/50 rounded-xl p-6 border-l-4 border-blue-400 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => {
            document.getElementById('bundle-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="text-xs font-semibold text-gray-600 mb-2">Bundle Opportunities</div>
          <div className="text-5xl font-bold text-blue-600 mb-1">8</div>
          <div className="text-xs font-medium text-gray-600">Multi-product ready</div>
          <div className="text-xs text-blue-600 font-semibold mt-2">View All →</div>
        </div>
      </div>

      {/* Upsell Opportunities */}
      <div id="upsell-section" className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📈 Upsell Opportunities</h4>
        <div className="space-y-3">
          <div 
            className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500 cursor-pointer hover:bg-green-100 transition-colors"
            onClick={() => setSelectedAccount('TechCorp Industries')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-gray-900">TechCorp Industries</div>
                <div className="text-sm text-gray-600 mt-1">Utilization 92% • Additional licenses needed</div>
                <div className="text-xs text-green-600 font-semibold mt-2">Action: Quote 500 additional licenses →</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">+$650K potential</div>
                <div className="text-xs text-green-600 font-semibold">Meraki</div>
              </div>
            </div>
          </div>
          <div 
            className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500 cursor-pointer hover:bg-green-100 transition-colors"
            onClick={() => setSelectedAccount('CloudFirst Solutions')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-gray-900">CloudFirst Solutions</div>
                <div className="text-sm text-gray-600 mt-1">Growth trajectory • Expansion approved</div>
                <div className="text-xs text-green-600 font-semibold mt-2">Action: Present enterprise tier upgrade →</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">+$420K potential</div>
                <div className="text-xs text-green-600 font-semibold">Duo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Sell Opportunities */}
      <div id="crosssell-section" className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Cross-Sell Opportunities</h4>
        <div className="space-y-3">
          <div 
            className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500 cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => setSelectedAccount('MedSecure Systems')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-gray-900">MedSecure Systems</div>
                <div className="text-sm text-gray-600 mt-1">Single product • High fit for ThousandEyes</div>
                <div className="text-xs text-purple-600 font-semibold mt-2">Action: Schedule product demo →</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">+$850K potential</div>
                <div className="text-xs text-purple-600 font-semibold">ThousandEyes</div>
              </div>
            </div>
          </div>
          <div 
            className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500 cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => setSelectedAccount('Global Financial Partners')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-gray-900">Global Financial Partners</div>
                <div className="text-sm text-gray-600 mt-1">White space identified • Strong champion</div>
                <div className="text-xs text-purple-600 font-semibold mt-2">Action: Prepare business case →</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">+$650K potential</div>
                <div className="text-xs text-purple-600 font-semibold">Umbrella</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capacity Alerts */}
      <div id="capacity-section" className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">⚡ Capacity Alerts</h4>
        <div className="space-y-3">
          <div 
            className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500 cursor-pointer hover:bg-orange-100 transition-colors"
            onClick={() => setSelectedAccount('Enterprise Systems Inc')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-gray-900">Enterprise Systems Inc</div>
                <div className="text-sm text-gray-600 mt-1">Utilization 88% • Capacity planning needed</div>
                <div className="text-xs text-orange-600 font-semibold mt-2">Action: Proactive outreach →</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-600">+$420K potential</div>
                <div className="text-xs text-orange-600 font-semibold">Meraki</div>
              </div>
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
            <h2 className="text-3xl font-bold text-gray-900">Expansion ARR</h2>
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
