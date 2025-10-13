'use client';
import React, { useState } from 'react';
import { AccountDetailModal } from './AccountDetailModal';
import potentialArrData from '@/data/POTENTIAL_ARR_ANALYSIS.json';

export const WhiteSpaceLevel2: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'segment' | 'lookalike'>('segment');

  return (
  <>
  <div className="space-y-8">
    {/* Tab Navigation */}
    <div className="flex gap-4 border-b border-gray-300">
      <button
        onClick={() => setActiveTab('segment')}
        className={`px-6 py-3 text-base font-bold transition-colors ${
          activeTab === 'segment'
            ? 'border-b-4 border-orange-500 text-orange-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        White Space by Segment
      </button>
      <button
        onClick={() => setActiveTab('lookalike')}
        className={`px-6 py-3 text-base font-bold transition-colors ${
          activeTab === 'lookalike'
            ? 'border-b-4 border-orange-500 text-orange-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Lookalike Analysis
      </button>
    </div>

    {/* Tab Content */}
    {activeTab === 'segment' && <WhiteSpaceBySegment setSelectedAccount={setSelectedAccount} />}
    {activeTab === 'lookalike' && <LookalikeAnalysisTab />}
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

const WhiteSpaceBySegment: React.FC<{ setSelectedAccount: (account: string | null) => void }> = ({ setSelectedAccount }) => {
  return (
  <div className="space-y-8">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="rounded-xl p-6 border-2 border-orange-200/50" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="text-center">
          <div className="text-5xl font-bold text-orange-600 mb-2">$8.2M</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Total White Space</div>
          <div className="text-xs text-gray-600">Identified opportunities</div>
        </div>
      </div>
      <div className="rounded-xl p-6 border-2 border-blue-200/50" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="text-center">
          <div className="text-5xl font-bold text-blue-600 mb-2">127</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Opportunities</div>
          <div className="text-xs text-gray-600">Cross-sell potential</div>
        </div>
      </div>
      <div className="rounded-xl p-6 border-2 border-green-200/50" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">$64K</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Avg Opportunity</div>
          <div className="text-xs text-gray-600">Per account</div>
        </div>
      </div>
      <div className="rounded-xl p-6 border-2 border-purple-200/50" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="text-center">
          <div className="text-5xl font-bold text-purple-600 mb-2">82%</div>
          <div className="text-sm font-bold text-gray-700 mb-1">Readiness Score</div>
          <div className="text-xs text-gray-600">Avg across accounts</div>
        </div>
      </div>
    </div>

    {/* Product Gap Analysis Matrix */}
    <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
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
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">D</span>
                  </div>
                  <span>Duo</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">38</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">12</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  <span className="text-base font-bold text-orange-600">24%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$1.8M</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">High</span>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span>Meraki</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">35</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">15</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-base font-bold text-orange-600">30%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$2.4M</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">High</span>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <span>Umbrella</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">32</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">18</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                  <span className="text-base font-bold text-orange-600">36%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$2.1M</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Medium</span>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TE</span>
                  </div>
                  <span>ThousandEyes</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">22</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">28</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '56%' }}></div>
                  </div>
                  <span className="text-base font-bold text-red-600">56%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$1.2M</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Medium</span>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-4 py-4 text-base font-bold text-gray-900 border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span>Splunk</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-green-600">15</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-orange-600">35</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-base font-bold text-red-600">70%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="text-lg font-bold text-gray-900">$700K</span>
              </td>
              <td className="px-4 py-4 text-center border-2 border-gray-200">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Low</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* White Space by Customer Tier */}
    <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
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
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">Strategic</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$3.2M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$400K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-base font-bold text-green-600">92</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">Enterprise</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">42</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$3.1M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$172K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-base font-bold text-green-600">85</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">Commercial</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">16</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">48</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$1.5M</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$94K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-base font-bold text-yellow-600">78</span>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-orange-50 transition-colors">
              <td className="px-6 py-4 text-base font-bold text-gray-900">SMB</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">19</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$400K</td>
              <td className="px-6 py-4 text-base font-semibold text-gray-800">$50K</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-base font-bold text-yellow-600">65</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
  );
};

const LookalikeAnalysisTab: React.FC = () => {
  const [sortBy, setSortBy] = useState<'opportunity' | 'similarity' | 'products'>('opportunity');
  const [filterByProductCount, setFilterByProductCount] = useState<number>(0);

  // Parse and prepare the data
  const analysisData = potentialArrData.map((item: any) => {
    let potentialProducts = [];
    try {
      potentialProducts = JSON.parse(item.POTENTIAL_PRODUCTS);
    } catch (e) {
      console.error('Error parsing potential products:', e);
    }
    return {
      customerId: item.CUSTOMER_ID,
      companyName: item.COMPANY_NAME,
      currentArr: parseFloat(item.CURRENT_ARR),
      currentProductCount: parseInt(item.CURRENT_PRODUCT_COUNT),
      potentialProductCount: parseInt(item.POTENTIAL_PRODUCT_COUNT),
      totalPotentialArr: parseFloat(item.TOTAL_POTENTIAL_ARR),
      totalExpectedArr: parseFloat(item.TOTAL_EXPECTED_POTENTIAL_ARR),
      similarCompanies: item.TOP_5_SIMILAR_COMPANIES.split(', '),
      avgSimilarityScore: parseFloat(item.AVG_SIMILARITY_SCORE),
      potentialProducts: potentialProducts,
      topProduct: item.TOP_PRODUCT_RECOMMENDATION,
      topProductExpectedArr: parseFloat(item.TOP_PRODUCT_EXPECTED_ARR),
    };
  });

  // Filter and sort
  let filteredData = analysisData;
  if (filterByProductCount > 0) {
    filteredData = analysisData.filter(item => item.potentialProductCount >= filterByProductCount);
  }

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'opportunity':
        return b.totalExpectedArr - a.totalExpectedArr;
      case 'similarity':
        return b.avgSimilarityScore - a.avgSimilarityScore;
      case 'products':
        return b.potentialProductCount - a.potentialProductCount;
      default:
        return 0;
    }
  });

  // Calculate summary statistics
  const totalOpportunity = analysisData.reduce((sum, item) => sum + item.totalExpectedArr, 0);
  const avgSimilarity = analysisData.reduce((sum, item) => sum + item.avgSimilarityScore, 0) / analysisData.length;
  const totalAccounts = analysisData.length;
  const avgOpportunityPerAccount = totalOpportunity / totalAccounts;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl p-6 border-2 border-blue-200/50" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">{formatCurrency(totalOpportunity)}</div>
            <div className="text-sm font-bold text-gray-700 mb-1">Total Expected ARR</div>
            <div className="text-xs text-gray-600">Across all lookalike opportunities</div>
          </div>
        </div>
        <div className="rounded-xl p-6 border-2 border-green-200/50" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 mb-2">{totalAccounts}</div>
            <div className="text-sm font-bold text-gray-700 mb-1">Total Accounts</div>
            <div className="text-xs text-gray-600">With expansion potential</div>
          </div>
        </div>
        <div className="rounded-xl p-6 border-2 border-purple-200/50" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-600 mb-2">{avgSimilarity.toFixed(1)}%</div>
            <div className="text-sm font-bold text-gray-700 mb-1">Avg Similarity Score</div>
            <div className="text-xs text-gray-600">Match with top performers</div>
          </div>
        </div>
        <div className="rounded-xl p-6 border-2 border-orange-200/50" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-600 mb-2">{formatCurrency(avgOpportunityPerAccount)}</div>
            <div className="text-sm font-bold text-gray-700 mb-1">Avg per Account</div>
            <div className="text-xs text-gray-600">Expected ARR opportunity</div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="rounded-xl border-2 border-gray-200 p-4" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold"
            >
              <option value="opportunity">Expected ARR (High to Low)</option>
              <option value="similarity">Similarity Score (High to Low)</option>
              <option value="products">Product Opportunities (Most to Least)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-700">Min Products:</label>
            <select
              value={filterByProductCount}
              onChange={(e) => setFilterByProductCount(parseInt(e.target.value))}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold"
            >
              <option value="0">All</option>
              <option value="4">4+ Products</option>
              <option value="5">5+ Products</option>
              <option value="6">6+ Products</option>
              <option value="7">7+ Products</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lookalike Analysis Table */}
      <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <h4 className="text-2xl font-bold mb-6 text-gray-900">🔍 Lookalike Customer Analysis</h4>
        <p className="text-sm text-gray-600 mb-6">
          Customers similar to top performers with expansion opportunities based on adoption patterns
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-base font-bold text-gray-900 border-2 border-gray-300">Customer</th>
                <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Current ARR</th>
                <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Current Products</th>
                <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Potential Products</th>
                <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Expected ARR</th>
                <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Similarity Score</th>
                <th className="px-4 py-3 text-center text-base font-bold text-gray-900 border-2 border-gray-300">Top Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.slice(0, 20).map((account) => (
                <tr key={account.customerId} className="hover:bg-orange-50 transition-colors">
                  <td className="px-4 py-4 border-2 border-gray-200">
                    <div className="text-base font-bold text-gray-900">{account.companyName}</div>
                    <div className="text-xs text-gray-600">{account.customerId}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Similar to: {account.similarCompanies.slice(0, 2).join(', ')}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center border-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(account.currentArr)}</span>
                  </td>
                  <td className="px-4 py-4 text-center border-2 border-gray-200">
                    <span className="text-lg font-bold text-blue-600">{account.currentProductCount}</span>
                  </td>
                  <td className="px-4 py-4 text-center border-2 border-gray-200">
                    <span className="text-lg font-bold text-orange-600">{account.potentialProductCount}</span>
                  </td>
                  <td className="px-4 py-4 text-center border-2 border-gray-200">
                    <span className="text-lg font-bold text-green-600">{formatCurrency(account.totalExpectedArr)}</span>
                  </td>
                  <td className="px-4 py-4 text-center border-2 border-gray-200">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full max-w-[80px] bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${account.avgSimilarityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-base font-bold text-green-600">{account.avgSimilarityScore.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-2 border-gray-200">
                    <div className="text-sm font-bold text-gray-900">{account.topProduct}</div>
                    <div className="text-xs font-semibold text-green-600">{formatCurrency(account.topProductExpectedArr)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedData.length > 20 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing top 20 of {sortedData.length} accounts
          </div>
        )}
      </div>

      {/* Product Recommendations Summary */}
      <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Top Product Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(() => {
            const productCounts: { [key: string]: { count: number; totalArr: number } } = {};
            sortedData.forEach(account => {
              if (!productCounts[account.topProduct]) {
                productCounts[account.topProduct] = { count: 0, totalArr: 0 };
              }
              productCounts[account.topProduct].count++;
              productCounts[account.topProduct].totalArr += account.topProductExpectedArr;
            });

            return Object.entries(productCounts)
              .sort((a, b) => b[1].totalArr - a[1].totalArr)
              .slice(0, 6)
              .map(([product, data]) => (
                <div key={product} className="rounded-xl p-4 border-2 border-blue-200/50" style={{ backgroundColor: '#F3F3F3' }}>
                  <div className="text-sm font-bold text-gray-900 mb-2">{product}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{data.count} accounts</span>
                    <span className="text-base font-bold text-blue-600">{formatCurrency(data.totalArr)}</span>
                  </div>
                </div>
              ));
          })()}
        </div>
      </div>
    </div>
  );
};

export const WhiteSpaceLevel3: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  return (
  <>
  <div className="space-y-8">
    {/* Top Opportunity Accounts */}
    <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
      <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Top White Space Opportunities</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Current Products</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Missing Product</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Est. ARR</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Readiness</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Match Score</th>
              <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">TechCorp Industries</div>
                <div className="text-xs text-gray-600">Enterprise | Technology</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Duo, Meraki, Umbrella</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">Splunk</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$223K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">93</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">76%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">POC kickoff</td>
            </tr>
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">MedSecure Systems</div>
                <div className="text-xs text-gray-600">Strategic | Healthcare</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Duo, Umbrella, ThousandEyes</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">Meraki</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$385K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">89</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">82%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Schedule QBR</td>
            </tr>
            <tr 
              className="hover:bg-green-50 transition-colors cursor-pointer"
              onClick={() => setSelectedAccount('Global Financial Partners')}
            >
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">Global Financial Partners</div>
                <div className="text-xs text-gray-600">Enterprise | Financial Services</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Meraki, Umbrella</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">Duo</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$295K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">87</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">85%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Security review</td>
            </tr>
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">InnovateTech Solutions</div>
                <div className="text-xs text-gray-600">Enterprise | Technology</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Duo, Meraki</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">ThousandEyes</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$185K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">78</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">76%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Demo setup</td>
            </tr>
            <tr className="hover:bg-green-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-base font-bold text-gray-900">CloudFirst Solutions</div>
                <div className="text-xs text-gray-600">Commercial | Technology</div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Duo</td>
              <td className="px-6 py-4 text-base font-bold text-orange-600">Meraki</td>
              <td className="px-6 py-4 text-lg font-bold text-gray-900">$420K</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">91</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">85%</span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">Bundle proposal</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Recommended Next Actions */}
    <div className="rounded-xl border-2 border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
      <h4 className="text-2xl font-bold mb-6 text-gray-900">⚡ Recommended Next Actions</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 border-2 border-green-200/50" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">High-Priority Outreach</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>CloudFirst Solutions</strong> - Schedule QBR to discuss Meraki network security integration
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">91 Readiness</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$420K</span>
          </div>
        </div>

        <div className="rounded-xl p-6 border-2 border-purple-200/50" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Strategic Account Expansion</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>MedSecure Systems</strong> - Present Meraki healthcare security bundle with compliance focus
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Strategic Tier</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$385K</span>
          </div>
        </div>

        <div className="rounded-xl p-6 border-2 border-blue-200/50" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Security Bundle Opportunity</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>Global Financial Partners</strong> - Duo + existing products security bundle with 15% discount
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">85% Match</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$295K</span>
          </div>
        </div>

        <div className="rounded-xl p-6 border-2 border-orange-200/50" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">4</span>
            </div>
            <h5 className="text-lg font-bold text-gray-900">Lookalike Campaign</h5>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            <strong>12 Duo customers</strong> - Launch targeted Meraki campaign based on successful patterns
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Campaign Ready</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">$1.9M</span>
          </div>
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
export const renderWhiteSpaceLevel2 = () => <WhiteSpaceLevel2 />;
export const renderWhiteSpaceLevel3 = () => <WhiteSpaceLevel3 />;
