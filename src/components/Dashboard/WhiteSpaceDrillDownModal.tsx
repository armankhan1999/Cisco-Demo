import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';
import { WhiteSpaceLevel2, WhiteSpaceLevel3 } from './WhiteSpaceDrillDown';

// Import ONLY master data
import whiteSpaceAnalysis from '@/source_data/csm-data/white_space_analysis.json';
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';

interface WhiteSpaceDrillDownModalProps {
  level: 1 | 2 | 3;
  onClose: () => void;
  onLevelChange: (level: 1 | 2 | 3) => void;
  initialFilter?: {
    type: 'product' | 'tier' | 'readiness' | 'all';
    value: string;
  } | null;
}

export default function WhiteSpaceDrillDownModal({ level, onClose, onLevelChange, initialFilter }: WhiteSpaceDrillDownModalProps) {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [selectedFilter, setSelectedFilter] = useState<{
    type: 'product' | 'tier' | 'readiness' | 'all';
    value: string;
  } | null>(initialFilter || null);
  
  // Flatten white space opportunities from nested structure
  const allOpportunities = whiteSpaceAnalysis.flatMap(ws => 
    ws.white_space_opportunities.map(opp => ({
      ...opp,
      account_id: ws.account_id,
      account_name: ws.account_name,
      current_arr: ws.current_arr,
      owned_products: ws.owned_products
    }))
  );
  
  // Calculate ALL metrics from master data
  const totalWhiteSpace = allOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const totalOpportunities = allOpportunities.length;
  const avgOpportunity = totalWhiteSpace / totalOpportunities;
  const avgReadiness = Math.round(allOpportunities.reduce((sum, opp) => sum + opp.fit_score, 0) / totalOpportunities);
  const highReadinessOpps = allOpportunities.filter(opp => opp.fit_score >= 80).length;
  
  // Calculate product gaps
  const products = ['Duo', 'Meraki', 'Umbrella', 'ThousandEyes', 'Splunk'];
  const productGaps = products.map(product => {
    const customersWithProduct = new Set(licensesData.filter(l => l.product_family === product).map(l => l.customer_id));
    const missingIt = customersData.length - customersWithProduct.size;
    const opportunityARR = allOpportunities.filter(opp => opp.product === product).reduce((sum, opp) => sum + opp.estimated_arr, 0);
    return { product, missingCustomers: missingIt, opportunityARR };
  });
  
  // Calculate tier data
  const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
  const tierData = tiers.map(tier => {
    const tierOpps = allOpportunities.filter(opp => {
      const customer = customersData.find(c => c.customer_id === opp.account_id);
      return customer?.tier === tier;
    });
    const totalARR = tierOpps.reduce((sum, opp) => sum + opp.estimated_arr, 0);
    return { tier, opportunities: tierOpps.length, totalARR };
  });

  const renderLevel1 = () => (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'overview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'analytics' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'overview' ? renderOverview() : (
        <WhiteSpaceLevel2 
          onProductClick={(product) => {
            setSelectedFilter({ type: 'product', value: product });
            onLevelChange(2);
          }}
          onTierClick={(tier) => {
            setSelectedFilter({ type: 'tier', value: tier });
            onLevelChange(2);
          }}
          onCardClick={(type, value) => {
            setSelectedFilter({ type, value });
            onLevelChange(2);
          }}
        />
      )}
    </div>
  );

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-4 gap-8 mb-8">
        <div 
          className="bg-orange-50/50 rounded-xl p-8 border-l-4 border-orange-400 cursor-pointer hover:bg-orange-100 transition-colors"
          onClick={() => {
            setSelectedFilter({ type: 'all', value: 'all' });
            onLevelChange(3);
          }}
        >
          <div className="text-base font-semibold text-gray-600 mb-3">Total White Space</div>
          <div className="text-5xl font-bold text-orange-600">${(totalWhiteSpace / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-gray-600 mt-2">{totalOpportunities} opportunities</div>
          <div className="text-xs text-orange-600 font-semibold mt-2">View All →</div>
        </div>
        <div 
          className="bg-green-50/50 rounded-xl p-8 border-l-4 border-green-400 cursor-pointer hover:bg-green-100 transition-colors"
          onClick={() => {
            setSelectedFilter({ type: 'readiness', value: 'high' });
            onLevelChange(3);
          }}
        >
          <div className="text-base font-semibold text-gray-600 mb-3">High-Priority Opps</div>
          <div className="text-5xl font-bold text-green-600">{highReadinessOpps}</div>
          <div className="text-sm text-gray-600 mt-2">Fit score ≥ 80</div>
          <div className="text-xs text-green-600 font-semibold mt-2">View Details →</div>
        </div>
        <div 
          className="bg-blue-50/50 rounded-xl p-8 border-l-4 border-blue-400 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => {
            setActiveTab('analytics');
          }}
        >
          <div className="text-base font-semibold text-gray-600 mb-3">Product Gaps</div>
          <div className="text-5xl font-bold text-blue-600">{products.length}</div>
          <div className="text-sm text-gray-600 mt-2">Products analyzed</div>
          <div className="text-xs text-blue-600 font-semibold mt-2">View Matrix →</div>
        </div>
        <div 
          className="bg-purple-50/50 rounded-xl p-8 border-l-4 border-purple-400 cursor-pointer hover:bg-purple-100 transition-colors"
          onClick={() => {
            setActiveTab('analytics');
          }}
        >
          <div className="text-base font-semibold text-gray-600 mb-3">Tier Analysis</div>
          <div className="text-5xl font-bold text-purple-600">{tiers.length}</div>
          <div className="text-sm text-gray-600 mt-2">Customer tiers</div>
          <div className="text-xs text-purple-600 font-semibold mt-2">View Breakdown →</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8">
        <h4 className="text-xl font-bold mb-6 text-gray-900">🎯 Key Insights</h4>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-4">
            <span className="font-bold">White Space Analysis:</span> {highReadinessOpps} high-priority opportunities (fit score ≥ 80) 
            represent ${((allOpportunities.filter(o => o.fit_score >= 80).reduce((sum, o) => sum + o.estimated_arr, 0)) / 1000000).toFixed(1)}M 
            in potential ARR across {whiteSpaceAnalysis.length} accounts.
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-bold">Top Gap:</span> {productGaps.sort((a, b) => b.missingCustomers - a.missingCustomers)[0].product} 
            has the largest opportunity with {productGaps.sort((a, b) => b.missingCustomers - a.missingCustomers)[0].missingCustomers} customers 
            missing this product, representing ${(productGaps.sort((a, b) => b.opportunityARR - a.opportunityARR)[0].opportunityARR / 1000000).toFixed(1)}M in potential ARR.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
        <h4 className="text-xl font-bold mb-6 text-gray-900">🏆 Top White Space Categories</h4>
        <div className="space-y-4">
          {productGaps.sort((a, b) => b.opportunityARR - a.opportunityARR).slice(0, 3).map((gap, index) => (
            <div key={gap.product} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <div className="text-base font-bold text-gray-900">{gap.product} - Cross-sell Opportunity</div>
                <div className="text-sm text-gray-600">{gap.missingCustomers} customers without this product</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">${(gap.opportunityARR / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-orange-600 font-semibold">#{index + 1} Priority</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderLevel2 = () => {
    return (
      <WhiteSpaceLevel3 
        selectedFilter={selectedFilter}
        onBack={() => onLevelChange(1)}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[90vh] flex flex-col" style={{ backgroundColor: 'white' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {level === 1 ? '🎯 White Space Opportunities' : 
               level === 2 ? '📊 White Space Analytics' : 
               '🎯 White Space Account Details'}
            </h2>
            {level > 1 && (
              <button
                onClick={() => onLevelChange(1)}
                className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-2"
              >
                ← Back to Overview
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {level === 1 && renderLevel1()}
          {level === 2 && renderLevel2()}
          {level === 3 && (
            <div className="text-center py-12">
              <div className="text-gray-500">Account detail view - Level 3 placeholder</div>
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
}
