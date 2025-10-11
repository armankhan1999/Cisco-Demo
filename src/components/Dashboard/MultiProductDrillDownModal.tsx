import React, { useState, useEffect } from 'react';
import { AccountDetailModal } from './AccountDetailModal';
import { MultiProductLevel2, MultiProductLevel3 } from './MultiProductDrillDown';

// Import master data
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
import expansionOpportunities from '@/source_data/sales-expansion-data/expansion-opportunities.json';

interface MultiProductDrillDownModalProps {
  level: 1 | 2 | 3;
  onClose: () => void;
  onLevelChange: (level: 1 | 2 | 3) => void;
}

export default function MultiProductDrillDownModal({ level, onClose, onLevelChange }: MultiProductDrillDownModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [selectedProductCombo, setSelectedProductCombo] = useState<{product1: string, product2: string, count: number} | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  
  // Calculate metrics from master data
  const totalCustomers = customersData.length;
  const multiProductCustomers = customersData.filter(c => c.product_count >= 2).length;
  const singleProductCustomers = customersData.filter(c => c.product_count === 1).length;
  const avgProducts = (customersData.reduce((sum, c) => sum + c.product_count, 0) / totalCustomers).toFixed(1);
  const crossSellValue = customersData
    .filter(c => c.product_count === 1)
    .reduce((sum, c) => sum + c.arr, 0);
  
  // Calculate product counts
  const productCounts = {
    'Duo': licensesData.filter(l => l.product_family === 'Duo').map(l => l.customer_id).filter((v, i, a) => a.indexOf(v) === i).length,
    'Meraki': licensesData.filter(l => l.product_family === 'Meraki').map(l => l.customer_id).filter((v, i, a) => a.indexOf(v) === i).length,
    'Umbrella': licensesData.filter(l => l.product_family === 'Umbrella').map(l => l.customer_id).filter((v, i, a) => a.indexOf(v) === i).length,
    'ThousandEyes': licensesData.filter(l => l.product_family === 'ThousandEyes').map(l => l.customer_id).filter((v, i, a) => a.indexOf(v) === i).length,
    'Splunk': licensesData.filter(l => l.product_family === 'Splunk').map(l => l.customer_id).filter((v, i, a) => a.indexOf(v) === i).length,
  };
  
  // Calculate customer segmentation
  const threeOrMoreProducts = customersData.filter(c => c.product_count >= 3).length;
  const twoProducts = customersData.filter(c => c.product_count === 2).length;
  
  // Calculate expansion opportunities for cross-sell
  const crossSellOpportunities = expansionOpportunities.filter(opp => opp.opportunity_type === 'cross_sell');
  const totalCrossSellValue = crossSellOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
  
  const renderLevel1 = () => (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'overview' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'analytics' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'overview' ? renderOverview() : (
        <MultiProductLevel2 
          onProductComboClick={(p1, p2, count) => {
            setSelectedProductCombo({ product1: p1, product2: p2, count });
            setSelectedTier(null);
            onLevelChange(2);
          }}
          onTierClick={(tier) => {
            setSelectedTier(tier);
            setSelectedProductCombo(null);
            onLevelChange(2);
          }}
        />
      )}
    </div>
  );

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-4 gap-8 mb-8">
        <div className="bg-green-50/50 rounded-xl p-8 border-l-4 border-green-400">
          <div className="text-base font-semibold text-gray-600 mb-3">Multi-Product Customers</div>
          <div className="text-5xl font-bold text-green-600">{multiProductCustomers}</div>
          <div className="text-sm text-gray-600 mt-2">{Math.round((multiProductCustomers / totalCustomers) * 100)}% of total</div>
        </div>
        <div className="bg-orange-50/50 rounded-xl p-8 border-l-4 border-orange-400">
          <div className="text-base font-semibold text-gray-600 mb-3">Single Product</div>
          <div className="text-5xl font-bold text-orange-600">{singleProductCustomers}</div>
          <div className="text-sm text-gray-600 mt-2">{Math.round((singleProductCustomers / totalCustomers) * 100)}% opportunity</div>
        </div>
        <div className="bg-purple-50/50 rounded-xl p-8 border-l-4 border-purple-400">
          <div className="text-base font-semibold text-gray-600 mb-3">Avg Products</div>
          <div className="text-5xl font-bold text-purple-600">{avgProducts}</div>
          <div className="text-sm text-gray-600 mt-2">per customer</div>
        </div>
        <div className="bg-blue-50/50 rounded-xl p-8 border-l-4 border-blue-400">
          <div className="text-base font-semibold text-gray-600 mb-3">Cross-Sell Value</div>
          <div className="text-5xl font-bold text-blue-600">${(crossSellValue / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-gray-600 mt-2">from {singleProductCustomers} accounts</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8">
        <h4 className="text-xl font-bold mb-6 text-gray-900">🎯 Customer Segmentation by Product Count</h4>
        <div className="space-y-4">
          {[
            { title: '3+ Products', desc: 'Strategic multi-product customers', count: threeOrMoreProducts, pct: `${Math.round((threeOrMoreProducts / totalCustomers) * 100)}%`, color: 'green' },
            { title: '2 Products', desc: 'Expansion ready customers', count: twoProducts, pct: `${Math.round((twoProducts / totalCustomers) * 100)}%`, color: 'blue' },
            { title: '1 Product', desc: 'High cross-sell potential', count: singleProductCustomers, pct: `${Math.round((singleProductCustomers / totalCustomers) * 100)}%`, color: 'orange' }
          ].map(item => (
            <div key={item.title} className={`flex items-center justify-between p-4 bg-${item.color}-50 rounded-lg`}>
              <div>
                <div className="text-base font-bold text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold text-${item.color}-600`}>{item.count} accounts</div>
                <div className={`text-xs text-${item.color}-600 font-semibold`}>{item.pct} of base</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
        <h4 className="text-xl font-bold mb-6 text-gray-900">💰 Cross-Sell Expansion Opportunities</h4>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-green-50 rounded-lg p-6">
            <div className="text-sm font-semibold text-gray-600 mb-2">Total Opportunities</div>
            <div className="text-4xl font-bold text-green-600 mb-2">{crossSellOpportunities.length}</div>
            <div className="text-sm text-gray-600">Active cross-sell deals</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="text-sm font-semibold text-gray-600 mb-2">Potential ARR</div>
            <div className="text-4xl font-bold text-blue-600 mb-2">${(totalCrossSellValue / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-600">Estimated value</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-6">
            <div className="text-sm font-semibold text-gray-600 mb-2">Avg Deal Size</div>
            <div className="text-4xl font-bold text-purple-600 mb-2">${Math.round(totalCrossSellValue / crossSellOpportunities.length / 1000)}K</div>
            <div className="text-sm text-gray-600">Per opportunity</div>
          </div>
        </div>
        <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
          <strong>💡 Insight:</strong> {singleProductCustomers} single-product accounts represent ${(crossSellValue / 1000000).toFixed(1)}M in potential cross-sell value with {crossSellOpportunities.length} active opportunities worth ${(totalCrossSellValue / 1000000).toFixed(1)}M.
        </div>
      </div>
    </>
  );

  const renderLevel2 = () => {
    if (!selectedProductCombo && !selectedTier) return null;
    
    let filteredCustomers: typeof customersData = [];
    let title = '';
    let description = '';
    
    if (selectedTier) {
      // Filter by tier
      filteredCustomers = customersData.filter(c => c.tier === selectedTier);
      title = `${selectedTier} Tier Accounts`;
      description = `${filteredCustomers.length} accounts in ${selectedTier} tier`;
    } else if (selectedProductCombo) {
      const { product1, product2 } = selectedProductCombo;
      const isDiagonal = product1 === product2;
      
      // Get actual customers with the selected product combination
      if (isDiagonal) {
        // Single product - customers with only this product
        const customersWithProduct = licensesData
          .filter(l => l.product_family === product1)
          .map(l => l.customer_id);
        filteredCustomers = customersData.filter(c => 
          customersWithProduct.includes(c.customer_id) && c.product_count === 1
        );
      } else {
        // Two products - customers with both
        const customersWithProduct1 = new Set(licensesData
          .filter(l => l.product_family === product1)
          .map(l => l.customer_id));
        const customersWithProduct2 = new Set(licensesData
          .filter(l => l.product_family === product2)
          .map(l => l.customer_id));
        filteredCustomers = customersData.filter(c => 
          customersWithProduct1.has(c.customer_id) && customersWithProduct2.has(c.customer_id)
        );
      }
      title = isDiagonal ? `${product1} Only Accounts` : `${product1} + ${product2} Accounts`;
      description = `${filteredCustomers.length} accounts with this product combination`;
    }
    
    // Show ALL accounts, not just first 10
    const accounts = filteredCustomers.map(c => ({
      name: c.customer_name,
      arr: `$${(c.arr / 1000000).toFixed(1)}M`,
      products: c.product_count,
      tier: c.tier
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={() => onLevelChange(1)}
              className="text-base font-semibold text-purple-600 hover:text-purple-700 mb-3 flex items-center gap-2"
            >
              ← Back to Analytics
            </button>
            <h3 className="text-3xl font-bold text-gray-900">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 Account List</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Account Name</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total ARR</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Products</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Tier</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accounts.map((account, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-purple-50 cursor-pointer transition-colors" 
                    onClick={() => setSelectedAccount(account.name)}
                  >
                    <td className="px-6 py-4 text-base font-bold text-gray-900">{account.name}</td>
                    <td className="px-6 py-4 text-base font-semibold text-gray-800">{account.arr}</td>
                    <td className="px-6 py-4 text-base font-semibold text-gray-800">{account.products}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">{account.tier}</span>
                    </td>
                    <td className="px-6 py-4 text-base text-purple-600 font-bold">View Details →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Multi-Product Penetration</h2>
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
          {level === 3 && <MultiProductLevel3 />}
        </div>
      </div>
      
      {selectedAccount && (
        <AccountDetailModal
          accountName={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  );
}
