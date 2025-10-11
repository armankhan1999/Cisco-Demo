'use client';
import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';

// Import master data
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
import expansionOpportunities from '@/source_data/sales-expansion-data/expansion-opportunities.json';

interface MultiProductLevel2Props {
  onProductComboClick?: (product1: string, product2: string, count: number) => void;
  onTierClick?: (tier: string) => void;
}

export const MultiProductLevel2: React.FC<MultiProductLevel2Props> = ({ onProductComboClick, onTierClick }) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Calculate real metrics from master data
  const totalCustomers = customersData.length;
  const multiProductCustomers = customersData.filter(c => c.product_count >= 2).length;
  const singleProductCustomers = customersData.filter(c => c.product_count === 1).length;
  const avgProducts = (customersData.reduce((sum, c) => sum + c.product_count, 0) / totalCustomers).toFixed(1);
  const crossSellValue = customersData
    .filter(c => c.product_count === 1)
    .reduce((sum, c) => sum + c.arr, 0);
  
  // Calculate product combination matrix
  const products = ['Duo', 'Meraki', 'Umbrella', 'ThousandEyes', 'Splunk'];
  const calculateProductCombo = (product1: string, product2: string) => {
    if (product1 === product2) {
      // Diagonal: customers with ONLY this product
      const customersWithProduct = licensesData
        .filter(l => l.product_family === product1)
        .map(l => l.customer_id);
      return customersData.filter(c => 
        customersWithProduct.includes(c.customer_id) && c.product_count === 1
      ).length;
    } else {
      // Off-diagonal: customers with BOTH products
      const customersWithProduct1 = new Set(licensesData
        .filter(l => l.product_family === product1)
        .map(l => l.customer_id));
      const customersWithProduct2 = new Set(licensesData
        .filter(l => l.product_family === product2)
        .map(l => l.customer_id));
      return customersData.filter(c => 
        customersWithProduct1.has(c.customer_id) && customersWithProduct2.has(c.customer_id)
      ).length;
    }
  };
  
  return (
  <>
  <div className="space-y-8">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">{multiProductCustomers}</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Multi-Product Customers</div>
          <div className="text-xs text-gray-600">{Math.round((multiProductCustomers / totalCustomers) * 100)}% of total</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border-2 border-orange-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-orange-600 mb-2">{singleProductCustomers}</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Single Product</div>
          <div className="text-xs text-gray-600">{Math.round((singleProductCustomers / totalCustomers) * 100)}% opportunity</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-purple-600 mb-2">{avgProducts}</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Avg Products</div>
          <div className="text-xs text-gray-600">per customer</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50">
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">${(crossSellValue / 1000000).toFixed(1)}M</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Cross-Sell Value</div>
          <div className="text-xs text-gray-600">from {singleProductCustomers} accounts</div>
        </div>
      </div>
    </div>

    {/* Product Penetration Matrix - Clickable */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 Product Penetration Matrix</h4>
      <p className="text-sm text-gray-600 mb-6">Heatmap showing product combinations across customer base</p>
      
      <div className="grid grid-cols-6 gap-2">
        {/* Header Row */}
        <div className="text-xs font-bold text-gray-700"></div>
        <div className="text-xs font-bold text-gray-700 text-center">Duo</div>
        <div className="text-xs font-bold text-gray-700 text-center">Meraki</div>
        <div className="text-xs font-bold text-gray-700 text-center">Umbrella</div>
        <div className="text-xs font-bold text-gray-700 text-center">ThousandEyes</div>
        <div className="text-xs font-bold text-gray-700 text-center">Splunk</div>
        
        {/* Duo Row */}
        <div className="text-xs font-bold text-gray-700">Duo</div>
        {products.map(product => {
          const count = calculateProductCombo('Duo', product);
          const intensity = count === 0 ? 'bg-gray-100 text-gray-400' :
                          count >= 10 ? 'bg-purple-600 text-white' :
                          count >= 5 ? 'bg-purple-400 text-white' :
                          count >= 3 ? 'bg-purple-300 text-white' :
                          count >= 1 ? 'bg-purple-200 text-gray-700' :
                          'bg-purple-100 text-gray-700';
          return (
            <div key={product} className={`${intensity} text-center py-3 rounded font-bold text-sm cursor-pointer hover:opacity-80 transition-all`} onClick={() => count > 0 && onProductComboClick?.('Duo', product, count)}>
              {count}
            </div>
          );
        })}
        
        {/* Meraki Row */}
        <div className="text-xs font-bold text-gray-700">Meraki</div>
        {products.map(product => {
          const count = calculateProductCombo('Meraki', product);
          const intensity = count === 0 ? 'bg-gray-100 text-gray-400' :
                          count >= 10 ? 'bg-purple-600 text-white' :
                          count >= 5 ? 'bg-purple-400 text-white' :
                          count >= 3 ? 'bg-purple-300 text-white' :
                          count >= 1 ? 'bg-purple-200 text-gray-700' :
                          'bg-purple-100 text-gray-700';
          return (
            <div key={product} className={`${intensity} text-center py-3 rounded font-bold text-sm cursor-pointer hover:opacity-80 transition-all`} onClick={() => count > 0 && onProductComboClick?.('Meraki', product, count)}>
              {count}
            </div>
          );
        })}
        
        {/* Umbrella Row */}
        <div className="text-xs font-bold text-gray-700">Umbrella</div>
        {products.map(product => {
          const count = calculateProductCombo('Umbrella', product);
          const intensity = count === 0 ? 'bg-gray-100 text-gray-400' :
                          count >= 10 ? 'bg-purple-600 text-white' :
                          count >= 5 ? 'bg-purple-400 text-white' :
                          count >= 3 ? 'bg-purple-300 text-white' :
                          count >= 1 ? 'bg-purple-200 text-gray-700' :
                          'bg-purple-100 text-gray-700';
          return (
            <div key={product} className={`${intensity} text-center py-3 rounded font-bold text-sm cursor-pointer hover:opacity-80 transition-all`} onClick={() => count > 0 && onProductComboClick?.('Umbrella', product, count)}>
              {count}
            </div>
          );
        })}
        
        {/* ThousandEyes Row */}
        <div className="text-xs font-bold text-gray-700">ThousandEyes</div>
        {products.map(product => {
          const count = calculateProductCombo('ThousandEyes', product);
          const intensity = count === 0 ? 'bg-gray-100 text-gray-400' :
                          count >= 10 ? 'bg-purple-600 text-white' :
                          count >= 5 ? 'bg-purple-400 text-white' :
                          count >= 3 ? 'bg-purple-300 text-white' :
                          count >= 1 ? 'bg-purple-200 text-gray-700' :
                          'bg-purple-100 text-gray-700';
          return (
            <div key={product} className={`${intensity} text-center py-3 rounded font-bold text-sm cursor-pointer hover:opacity-80 transition-all`} onClick={() => count > 0 && onProductComboClick?.('ThousandEyes', product, count)}>
              {count}
            </div>
          );
        })}
        
        {/* Splunk Row */}
        <div className="text-xs font-bold text-gray-700">Splunk</div>
        {products.map(product => {
          const count = calculateProductCombo('Splunk', product);
          const intensity = count === 0 ? 'bg-gray-100 text-gray-400' :
                          count >= 10 ? 'bg-purple-600 text-white' :
                          count >= 5 ? 'bg-purple-400 text-white' :
                          count >= 3 ? 'bg-purple-300 text-white' :
                          count >= 1 ? 'bg-purple-200 text-gray-700' :
                          'bg-purple-100 text-gray-700';
          return (
            <div key={product} className={`${intensity} text-center py-3 rounded font-bold text-sm cursor-pointer hover:opacity-80 transition-all`} onClick={() => count > 0 && onProductComboClick?.('Splunk', product, count)}>
              {count}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center gap-6">
        <div className="text-xs font-semibold text-gray-700">Legend:</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded"></div>
          <span className="text-xs text-gray-600">High (≥10)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-400 rounded"></div>
          <span className="text-xs text-gray-600">Medium (5-9)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-300 rounded"></div>
          <span className="text-xs text-gray-600">Low (3-4)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-200 rounded"></div>
          <span className="text-xs text-gray-600">Very Low (1-2)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span className="text-xs text-gray-600">None (0)</span>
        </div>
      </div>
    </div>

    {/* Penetration by Tier */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Multi-Product Penetration by Customer Tier</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Tier</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total Customers</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">1 Product</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">2 Products</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">3+ Products</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Multi-Product %</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {['Strategic', 'Enterprise', 'Commercial', 'SMB'].map(tier => {
              const tierCustomers = customersData.filter(c => c.tier === tier);
              const total = tierCustomers.length;
              const oneProduct = tierCustomers.filter(c => c.product_count === 1).length;
              const twoProducts = tierCustomers.filter(c => c.product_count === 2).length;
              const threePlus = tierCustomers.filter(c => c.product_count >= 3).length;
              const multiProductPct = total > 0 ? Math.round(((total - oneProduct) / total) * 100) : 0;
              const performance = multiProductPct >= 90 ? 'Excellent' : multiProductPct >= 70 ? 'Good' : 'Opportunity';
              const color = multiProductPct >= 90 ? 'green' : multiProductPct >= 70 ? 'green' : 'yellow';
              
              return (
                <tr key={tier} className="hover:bg-purple-50 cursor-pointer transition-colors" onClick={() => onTierClick?.(tier)}>
                  <td className="px-6 py-4 text-base font-bold text-gray-900">{tier}</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">{total}</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">{oneProduct}</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">{twoProducts}</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">{threePlus}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className={`bg-${color}-600 h-2 rounded-full`} style={{ width: `${multiProductPct}%` }}></div>
                      </div>
                      <span className={`text-base font-bold text-${color}-600`}>{multiProductPct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${color}-100 text-${color}-700`}>{performance}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>

    {/* Cross-Sell Expansion Opportunities by Product */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">💰 Active Cross-Sell Opportunities by Product</h4>
      <p className="text-sm text-gray-600 mb-6">Expansion opportunities from sales pipeline data</p>
      <div className="grid grid-cols-5 gap-4">
        {['Duo', 'Meraki', 'Umbrella', 'ThousandEyes', 'Splunk'].map((product) => {
          const productOpps = expansionOpportunities.filter(opp => 
            opp.opportunity_type === 'cross_sell' && opp.recommended_product === product
          );
          const totalValue = productOpps.reduce((sum, opp) => sum + opp.estimated_arr, 0);
          const avgProbability = productOpps.length > 0 
            ? Math.round(productOpps.reduce((sum, opp) => sum + opp.close_probability, 0) / productOpps.length)
            : 0;
          
          return (
            <div key={product} className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50">
              <div className="text-center">
                <div className="text-xs font-bold text-gray-700 mb-2">{product}</div>
                <div className="text-4xl font-bold text-purple-600 mb-1">{productOpps.length}</div>
                <div className="text-xs text-gray-600 mb-3">opportunities</div>
                <div className="text-lg font-bold text-green-600 mb-1">${(totalValue / 1000).toFixed(0)}K</div>
                <div className="text-xs text-gray-600 mb-2">potential ARR</div>
                <div className="inline-block px-2 py-1 bg-blue-100 rounded text-xs font-bold text-blue-700">
                  {avgProbability}% avg win rate
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <div className="text-sm text-gray-700">
          <strong>💡 Pipeline Insight:</strong> Total of {expansionOpportunities.filter(o => o.opportunity_type === 'cross_sell').length} active cross-sell opportunities worth ${(expansionOpportunities.filter(o => o.opportunity_type === 'cross_sell').reduce((sum, opp) => sum + opp.estimated_arr, 0) / 1000000).toFixed(2)}M in potential ARR across all products.
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

export const MultiProductLevel3: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Get all single-product customers with their product info from REAL expansion opportunities
  const singleProductCustomers = customersData
    .filter(c => c.product_count === 1)
    .map(c => {
      const license = licensesData.find(l => l.customer_id === c.customer_id);
      const currentProduct = license?.product_family || 'Unknown';
      
      // Find real cross-sell opportunity for this customer
      const crossSellOpp = expansionOpportunities.find(opp => 
        opp.customer_id === c.customer_id && opp.opportunity_type === 'cross_sell'
      );
      
      const recommendedProduct = crossSellOpp?.recommended_product || 'N/A';
      const estimatedARR = crossSellOpp?.estimated_arr || 0;
      const readinessScore = crossSellOpp?.expansion_readiness_score || 0;
      const readiness = readinessScore >= 80 ? 'High' : 
                       readinessScore >= 60 ? 'Medium' : 'Low';
      
      return {
        ...c,
        currentProduct,
        recommendedProduct,
        estimatedARR,
        readiness
      };
    });
  
  return (
  <>
  <div className="space-y-8">
    {/* Single-Product Accounts List */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Single-Product Accounts (Cross-Sell Opportunities)</h4>
      <p className="text-sm text-gray-600 mb-4">Showing all {singleProductCustomers.length} single-product accounts</p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Current Product</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Tier</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Recommended Add-On</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Est. ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Readiness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {singleProductCustomers.map((customer) => (
              <tr 
                key={customer.customer_id}
                className="hover:bg-green-50 transition-colors cursor-pointer"
                onClick={() => setSelectedAccount(customer.customer_name)}
              >
                <td className="px-6 py-4 text-base font-bold text-gray-900">{customer.customer_name}</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">{customer.currentProduct}</td>
                <td className="px-6 py-4 text-lg font-bold text-gray-900">${(customer.arr / 1000).toFixed(0)}K</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    customer.tier === 'Strategic' ? 'bg-purple-100 text-purple-700' :
                    customer.tier === 'Enterprise' ? 'bg-blue-100 text-blue-700' :
                    customer.tier === 'Commercial' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{customer.tier}</span>
                </td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">{customer.recommendedProduct}</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">${(customer.estimatedARR / 1000).toFixed(0)}K</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    customer.readiness === 'High' ? 'bg-green-100 text-green-700' :
                    customer.readiness === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>{customer.readiness}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Recommended Actions - Top 2 High-Readiness Opportunities */}
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-900">⚡ Recommended Next Actions</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {singleProductCustomers
          .filter(c => c.readiness === 'High')
          .sort((a, b) => b.estimatedARR - a.estimatedARR)
          .slice(0, 2)
          .map((customer, index) => {
            const colors = index === 0 ? 
              { bg: 'from-green-50 to-green-100/50', border: 'border-green-200/50', badge: 'bg-green-500', text: 'text-green-700' } :
              { bg: 'from-purple-50 to-purple-100/50', border: 'border-purple-200/50', badge: 'bg-purple-500', text: 'text-purple-700' };
            
            return (
              <div key={customer.customer_id} className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 border-2 ${colors.border}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${colors.badge} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <h5 className="text-lg font-bold text-gray-900">High-Priority Outreach</h5>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  <strong>{customer.customer_name}</strong> - Schedule QBR to discuss {customer.recommendedProduct} integration
                </p>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-green-100 ${colors.text}`}>High Readiness</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">${(customer.estimatedARR / 1000).toFixed(0)}K Opportunity</span>
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
export const renderMultiProductLevel2 = () => <MultiProductLevel2 />;
export const renderMultiProductLevel3 = () => <MultiProductLevel3 />;
