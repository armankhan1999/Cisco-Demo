'use client';
import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

// Import ONLY master data
import whiteSpaceAnalysis from '@/source_data/csm-data/white_space_analysis.json';
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';

interface WhiteSpaceLevel2Props {
  onProductClick?: (product: string) => void;
  onTierClick?: (tier: string) => void;
  onCardClick?: (type: 'product' | 'tier' | 'readiness' | 'all', value: string) => void;
}

export const WhiteSpaceLevel2: React.FC<WhiteSpaceLevel2Props> = ({ onProductClick, onTierClick, onCardClick }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Flatten white space opportunities from nested structure
  const allOpportunities = whiteSpaceAnalysis.flatMap(ws => 
    ws.white_space_opportunities.map(opp => ({
      ...opp,
      account_id: ws.account_id,
      account_name: ws.account_name,
      current_arr: ws.current_arr
    }))
  );
  
  // Calculate ALL metrics from master data
  const totalWhiteSpace = allOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const totalOpportunities = allOpportunities.length;
  const avgOpportunity = totalWhiteSpace / totalOpportunities;
  const avgReadiness = Math.round(allOpportunities.reduce((sum, opp) => sum + opp.fit_score, 0) / totalOpportunities);
  
  // Calculate product gap analysis from real data
  const products = ['Duo', 'Meraki', 'Umbrella', 'ThousandEyes', 'Splunk'];
  const productGaps = products.map(product => {
    const customersWithProduct = new Set(licensesData.filter(l => l.product_family === product).map(l => l.customer_id));
    const haveIt = customersWithProduct.size;
    const missingIt = customersData.length - haveIt;
    const whiteSpacePct = Math.round((missingIt / customersData.length) * 100);
    const opportunityARR = allOpportunities.filter(opp => opp.product === product).reduce((sum, opp) => sum + opp.estimated_arr, 0);
    const priority = whiteSpacePct > 50 ? 'Low' : whiteSpacePct > 30 ? 'Medium' : 'High';
    return { product, haveIt, missingIt, whiteSpacePct, opportunityARR, priority };
  });
  
  // Calculate white space by tier from real data
  const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
  const tierData = tiers.map(tier => {
    const tierCustomers = customersData.filter(c => c.tier === tier);
    const tierOpps = allOpportunities.filter(opp => {
      const customer = customersData.find(c => c.customer_id === opp.account_id);
      return customer?.tier === tier;
    });
    const totalARR = tierOpps.reduce((sum, opp) => sum + opp.estimated_arr, 0);
    const avgPerCustomer = tierCustomers.length > 0 ? totalARR / tierCustomers.length : 0;
    const avgReadiness = tierOpps.length > 0 ? Math.round(tierOpps.reduce((sum, opp) => sum + opp.fit_score, 0) / tierOpps.length) : 0;
    return { tier, customers: tierCustomers.length, opportunities: tierOpps.length, totalARR, avgPerCustomer, avgReadiness };
  });
  
  const productColors: Record<string, {bg: string, text: string}> = {
    'Duo': {bg: 'bg-blue-500', text: 'text-blue-700'},
    'Meraki': {bg: 'bg-green-500', text: 'text-green-700'},
    'Umbrella': {bg: 'bg-cyan-500', text: 'text-cyan-700'},
    'ThousandEyes': {bg: 'bg-indigo-500', text: 'text-indigo-700'},
    'Splunk': {bg: 'bg-purple-500', text: 'text-purple-700'}
  };
  
  return (
  <>
  <div className="space-y-8">
    {/* Summary Cards - ALL CLICKABLE */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div 
        className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border-2 border-orange-200/50 cursor-pointer hover:shadow-lg transition-all"
        onClick={() => onCardClick?.('all', 'all')}
      >
        <div className="text-center">
          <div className="text-5xl font-bold text-orange-600 mb-2">${(totalWhiteSpace / 1000000).toFixed(1)}M</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Total White Space</div>
          <div className="text-xs text-gray-600">Identified opportunities</div>
          <div className="text-xs text-orange-600 font-semibold mt-2">View All →</div>
        </div>
      </div>
      <div 
        className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50 cursor-pointer hover:shadow-lg transition-all"
        onClick={() => onCardClick?.('all', 'all')}
      >
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">{totalOpportunities}</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Opportunities</div>
          <div className="text-xs text-gray-600">Cross-sell potential</div>
          <div className="text-xs text-blue-600 font-semibold mt-2">View List →</div>
        </div>
      </div>
      <div 
        className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50 cursor-pointer hover:shadow-lg transition-all"
        onClick={() => onCardClick?.('readiness', 'high')}
      >
        <div className="text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">${(avgOpportunity / 1000).toFixed(0)}K</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Avg Opportunity</div>
          <div className="text-xs text-gray-600">Per account</div>
          <div className="text-xs text-green-600 font-semibold mt-2">View High-Value →</div>
        </div>
      </div>
      <div 
        className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50 cursor-pointer hover:shadow-lg transition-all"
        onClick={() => onCardClick?.('readiness', 'high')}
      >
        <div className="text-center">
          <div className="text-5xl font-bold text-purple-600 mb-2">{avgReadiness}</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Readiness Score</div>
          <div className="text-xs text-gray-600">Avg across accounts</div>
          <div className="text-xs text-purple-600 font-semibold mt-2">View Ready →</div>
        </div>
      </div>
    </div>

    {/* Product Gap Analysis Matrix */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Product Gap Analysis Matrix</h4>
      <p className="text-sm text-gray-600 mb-6">Shows customers missing each product (white space opportunities)</p>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-base font-bold text-gray-900 border-2 border-gray-300">Product</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Have It</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Missing It</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">White Space %</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Opportunity ARR</th>
              <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Priority</th>
            </tr>
          </thead>
          <tbody>
            {productGaps.map((gap) => (
              <tr 
                key={gap.product} 
                className="hover:bg-orange-50 transition-colors cursor-pointer"
                onClick={() => onProductClick?.(gap.product)}
              >
                <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${productColors[gap.product].bg} flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{gap.product[0]}</span>
                    </div>
                    <span>{gap.product}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center border-2 border-gray-200">
                  <span className="text-lg font-bold text-green-600">{gap.haveIt}</span>
                </td>
                <td className="px-4 py-4 text-center border-2 border-gray-200">
                  <span className="text-lg font-bold text-orange-600">{gap.missingIt}</span>
                </td>
                <td className="px-4 py-4 text-center border-2 border-gray-200">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                      <div className={`${gap.whiteSpacePct > 50 ? 'bg-red-600' : 'bg-orange-600'} h-2 rounded-full`} style={{ width: `${gap.whiteSpacePct}%` }}></div>
                    </div>
                    <span className={`text-base font-bold ${gap.whiteSpacePct > 50 ? 'text-red-600' : 'text-orange-600'}`}>{gap.whiteSpacePct}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center border-2 border-gray-200">
                  <span className="text-lg font-bold text-gray-900">${(gap.opportunityARR / 1000000).toFixed(1)}M</span>
                </td>
                <td className="px-4 py-4 text-center border-2 border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    gap.priority === 'High' ? 'bg-green-100 text-green-700' :
                    gap.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>{gap.priority}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* White Space by Customer Tier */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 White Space by Customer Tier</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Tier</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customers</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Opportunities</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Avg per Customer</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Readiness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tierData.map((tier) => (
              <tr 
                key={tier.tier} 
                className="hover:bg-orange-50 transition-colors cursor-pointer"
                onClick={() => onTierClick?.(tier.tier)}
              >
                <td className="px-6 py-4 text-base font-bold text-gray-900">{tier.tier}</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">{tier.customers}</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">{tier.opportunities}</td>
                <td className="px-6 py-4 text-lg font-bold text-gray-900">${(tier.totalARR / 1000000).toFixed(1)}M</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">${(tier.avgPerCustomer / 1000).toFixed(0)}K</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                      <div className={`${tier.avgReadiness >= 80 ? 'bg-green-600' : 'bg-yellow-600'} h-2 rounded-full`} style={{ width: `${tier.avgReadiness}%` }}></div>
                    </div>
                    <span className={`text-base font-bold ${tier.avgReadiness >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>{tier.avgReadiness}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

interface WhiteSpaceLevel3Props {
  selectedFilter?: {
    type: 'product' | 'tier' | 'readiness' | 'all';
    value: string;
  } | null;
  onBack?: () => void;
}

export const WhiteSpaceLevel3: React.FC<WhiteSpaceLevel3Props> = ({ selectedFilter, onBack }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Flatten white space opportunities
  const allOpportunities = whiteSpaceAnalysis.flatMap(ws => 
    ws.white_space_opportunities.map(opp => ({
      ...opp,
      account_id: ws.account_id,
      account_name: ws.account_name,
      current_arr: ws.current_arr,
      owned_products: ws.owned_products
    }))
  );
  
  // Filter opportunities based on drill-through context
  const getFilteredOpportunities = () => {
    if (!selectedFilter) return allOpportunities.sort((a, b) => b.fit_score - a.fit_score).slice(0, 10);
    
    let filtered = allOpportunities;
    
    switch (selectedFilter.type) {
      case 'product':
        filtered = allOpportunities.filter(opp => opp.product === selectedFilter.value);
        break;
      case 'tier':
        filtered = allOpportunities.filter(opp => {
          const customer = customersData.find(c => c.customer_id === opp.account_id);
          return customer?.tier === selectedFilter.value;
        });
        break;
      case 'readiness':
        filtered = allOpportunities.filter(opp => opp.fit_score >= 80);
        break;
      default:
        filtered = allOpportunities;
    }
    
    return filtered.sort((a, b) => b.fit_score - a.fit_score);
  };
  
  const filteredOpportunities = getFilteredOpportunities();
  
  const getFilterTitle = () => {
    if (!selectedFilter) return 'Top White Space Opportunities';
    
    switch (selectedFilter.type) {
      case 'product':
        return `${selectedFilter.value} White Space Opportunities`;
      case 'tier':
        return `${selectedFilter.value} Tier White Space Opportunities`;
      case 'readiness':
        return 'High-Readiness White Space Opportunities';
      default:
        return 'All White Space Opportunities';
    }
  };
  
  return (
  <>
  <div className="space-y-8">
    {/* Filtered Opportunity Accounts */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-base font-semibold text-orange-600 hover:text-orange-700 mb-3 flex items-center gap-2"
            >
              ← Back to Analytics
            </button>
          )}
          <h4 className="text-2xl font-bold text-gray-900">🎯 {getFilterTitle()}</h4>
          <p className="text-sm text-gray-600 mt-1">Showing {filteredOpportunities.length} opportunities • Total ARR: ${(filteredOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0) / 1000000).toFixed(2)}M</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Current Products</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Missing Product</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Est. ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Fit Score</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOpportunities.map((opp, index) => {
              const customer = customersData.find(c => c.customer_id === opp.account_id);
              return (
                <tr 
                  key={`${opp.account_id}-${opp.product}`}
                  className="hover:bg-green-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAccount(opp.account_name)}
                >
                  <td className="px-6 py-4">
                    <div className="text-base font-bold text-gray-900">{opp.account_name}</div>
                    <div className="text-xs text-gray-600">{customer?.tier} | {customer?.industry}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{opp.owned_products.join(', ')}</td>
                  <td className="px-6 py-4 text-base font-bold text-orange-600">{opp.product}</td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">${(opp.estimated_arr / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      opp.fit_score >= 80 ? 'bg-green-100 text-green-700' :
                      opp.fit_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>{opp.fit_score}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{opp.use_case}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    {/* Recommended Next Actions */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">⚡ Recommended Next Actions</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpportunities.slice(0, 4).map((opp, index) => {
          const colors = [
            { bg: 'from-green-50 to-green-100/50', border: 'border-green-200/50', badge: 'bg-green-500', text: 'text-green-700' },
            { bg: 'from-purple-50 to-purple-100/50', border: 'border-purple-200/50', badge: 'bg-purple-500', text: 'text-purple-700' },
            { bg: 'from-blue-50 to-blue-100/50', border: 'border-blue-200/50', badge: 'bg-blue-500', text: 'text-blue-700' },
            { bg: 'from-orange-50 to-orange-100/50', border: 'border-orange-200/50', badge: 'bg-orange-500', text: 'text-orange-700' }
          ][index];
          
          return (
            <div key={`${opp.account_id}-${opp.product}`} className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 border-2 ${colors.border}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${colors.badge} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <h5 className="text-lg font-bold text-gray-900">High-Priority Outreach</h5>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                <strong>{opp.account_name}</strong> - {opp.use_case}
              </p>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-green-100 ${colors.text}`}>{opp.fit_score} Fit Score</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">${(opp.estimated_arr / 1000).toFixed(0)}K</span>
              </div>
            </div>
          );
        })}
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
export const renderWhiteSpaceLevel2 = () => <WhiteSpaceLevel2 />;
export const renderWhiteSpaceLevel3 = () => <WhiteSpaceLevel3 />;
