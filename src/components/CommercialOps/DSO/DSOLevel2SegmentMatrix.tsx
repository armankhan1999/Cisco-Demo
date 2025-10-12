'use client';

import { useState, useEffect } from 'react';
import { DSODrillDownService, type DSOLevel2SegmentData } from '@/services/dsoDrillDownService';
import { ArrowLeft, TrendingUp, AlertTriangle, DollarSign, Users, Target, Filter } from '@/utils/iconMapping';

interface DSOLevel2SegmentMatrixProps {
  segment?: string;
  productFamily?: string;
  onBack: () => void;
  onDrillToLevel3: (segment: string, productFamily: string) => void;
}

export default function DSOLevel2SegmentMatrix({ 
  segment,
  productFamily,
  onBack, 
  onDrillToLevel3 
}: DSOLevel2SegmentMatrixProps) {
  const [segmentData, setSegmentData] = useState<DSOLevel2SegmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = DSODrillDownService.getLevel2SegmentData();
        setSegmentData(data);
      } catch (error) {
        console.error('Error fetching DSO Level 2 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [segment, productFamily]);

  const handleBubbleClick = (segmentName: string, productName: string) => {
    onDrillToLevel3(segmentName, productName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter data based on selections
  const filteredData = segmentData.filter(item => {
    const matchesSegment = selectedSegment === 'all' || item.segment === selectedSegment;
    const matchesProduct = selectedProduct === 'all' || item.productFamily === selectedProduct;
    return matchesSegment && matchesProduct;
  });

  // Calculate insights
  const slowestPayers = filteredData.filter(item => item.dsoValue > 45);
  const highestARSegment = filteredData.reduce((max, item) => 
    item.arBalance > max.arBalance ? item : max, filteredData[0] || {} as DSOLevel2SegmentData
  );
  const avgDSO = filteredData.reduce((sum, item) => sum + item.dsoValue, 0) / filteredData.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trend
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DSO Segment Performance Matrix</h1>
            <p className="text-gray-600">Which segments are slow payers? Bubble chart analysis by segment and product</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Segments</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="SMB">SMB</option>
            </select>
            
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="Meraki">Meraki</option>
              <option value="Duo">Duo</option>
              <option value="Splunk">Splunk</option>
              <option value="Umbrella">Umbrella</option>
              <option value="ThousandEyes">ThousandEyes</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Analyzing {filteredData.length} segment-product combinations
          </div>
        </div>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Average DSO</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{Math.round(avgDSO)} days</p>
          <p className="text-sm text-blue-600">Across all segments</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-700">Slow Payers</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{slowestPayers.length}</p>
          <p className="text-sm text-red-600">Segments &gt;45 days DSO</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Highest AR</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            ${Math.round(highestARSegment.arBalance / 1000)}K
          </p>
          <p className="text-sm text-green-600">{highestARSegment.segment}-{highestARSegment.productFamily}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span className="font-medium text-purple-700">Total Customers</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {filteredData.reduce((sum, item) => sum + item.customerCount, 0)}
          </p>
          <p className="text-sm text-purple-600">With outstanding AR</p>
        </div>
      </div>

      {/* Bubble Chart Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Segment Performance Matrix</h2>
            <p className="text-sm text-gray-600">Bubble size = AR Balance, Color = DSO Performance</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Good (&lt;35 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Warning (35-45 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Critical (&gt;45 days)</span>
            </div>
          </div>
        </div>
        
        {/* Bubble Chart Grid */}
        <div className="relative h-96 bg-gray-50 rounded-lg p-8">
          {/* Grid Lines */}
          <div className="absolute inset-8">
            {/* Vertical line at 35 days */}
            <div className="absolute border-l border-gray-300 border-dashed" style={{ left: '35%', height: '100%' }}></div>
            {/* Vertical line at 45 days */}
            <div className="absolute border-l border-gray-300 border-dashed" style={{ left: '60%', height: '100%' }}></div>
            {/* Horizontal line for high ARR */}
            <div className="absolute border-t border-gray-300 border-dashed" style={{ top: '40%', width: '100%' }}></div>
          </div>
          
          {/* Quadrant Labels */}
          <div className="absolute top-2 left-8 text-xs text-gray-500 font-medium">High ARR</div>
          <div className="absolute bottom-2 left-8 text-xs text-gray-500 font-medium">Low ARR</div>
          <div className="absolute bottom-2 left-1/3 text-xs text-gray-500 font-medium">Good Payers (&lt;35d)</div>
          <div className="absolute bottom-2 right-8 text-xs text-gray-500 font-medium">Slow Payers (&gt;45d)</div>
          
          {/* Bubbles */}
          <div className="absolute inset-8">
            {filteredData.map((item, index) => {
              // Position calculation
              const xPosition = Math.min((item.dsoValue / 80) * 100, 95); // Cap at 95%
              const yPosition = 100 - Math.min((Math.log(item.arBalance) / Math.log(10000000)) * 100, 95); // Log scale for Y
              
              // Bubble size calculation (min 20px, max 80px)
              const bubbleSize = Math.max(20, Math.min(80, (item.arBalance / 1000000) * 40));
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleBubbleClick(item.segment, item.productFamily)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 group"
                  style={{
                    left: `${xPosition}%`,
                    top: `${yPosition}%`,
                    width: `${bubbleSize}px`,
                    height: `${bubbleSize}px`
                  }}
                >
                  <div 
                    className={`w-full h-full rounded-full shadow-lg border-2 border-white opacity-80 hover:opacity-100`}
                    style={{ backgroundColor: item.color }}
                  ></div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <div className="font-semibold">{item.segment}-{item.productFamily}</div>
                    <div>DSO: {item.dsoValue} days</div>
                    <div>AR: ${Math.round(item.arBalance / 1000)}K</div>
                    <div>Customers: {item.customerCount}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Segment Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Detailed Segment Performance</h2>
            <p className="text-sm text-gray-600">Click any row to drill down to customer details</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Segment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">DSO (Days)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">AR Balance</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Customers</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .sort((a, b) => b.dsoValue - a.dsoValue) // Sort by DSO descending
                .map((item) => (
                <tr 
                  key={item.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleBubbleClick(item.segment, item.productFamily)}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{item.segment}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-700">{item.productFamily}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`font-semibold ${
                      item.dsoValue > 45 ? 'text-red-600' : 
                      item.dsoValue > 35 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {item.dsoValue}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-medium text-gray-900">
                      ${Math.round(item.arBalance / 1000)}K
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-gray-700">{item.customerCount}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'critical' ? 'bg-red-100 text-red-800' :
                      item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status === 'critical' ? '🔴 Critical' :
                       item.status === 'warning' ? '🟡 Warning' : '✅ Good'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Key Insights</h3>
          <div className="space-y-3">
            {slowestPayers.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-800">Critical Segments</span>
                </div>
                <p className="text-xs text-red-600">
                  {slowestPayers.map(s => `${s.segment}-${s.productFamily}`).join(', ')} require immediate attention
                </p>
              </div>
            )}
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-800">Pattern Analysis</span>
              </div>
              <p className="text-xs text-blue-600">
                Enterprise segments show higher DSO but larger AR balances - payment terms mismatch detected
              </p>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-800">Best Performers</span>
              </div>
              <p className="text-xs text-green-600">
                Mid-Market Duo and SMB Meraki segments consistently meet DSO targets
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Recommendations</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <span className="text-sm font-medium text-yellow-800">Review Payment Terms</span>
              </div>
              <p className="text-xs text-yellow-600">
                Align payment terms with customer segment capabilities (Net 30 for SMB, Net 45 for Enterprise)
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <span className="text-sm font-medium text-blue-800">Automate Collections</span>
              </div>
              <p className="text-xs text-blue-600">
                Implement automated reminder sequences for high-DSO segments
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <span className="text-sm font-medium text-purple-800">CSM Engagement</span>
              </div>
              <p className="text-xs text-purple-600">
                Engage CSMs for relationship-based collection on high-value accounts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
