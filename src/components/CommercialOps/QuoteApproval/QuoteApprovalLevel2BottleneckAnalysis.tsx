'use client';

import { useState, useEffect } from 'react';
import { QuoteApprovalDrillDownService, type QuoteApprovalLevel2BottleneckData } from '@/services/quoteApprovalDrillDownService';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Target, Users } from '@/utils/iconMapping';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface QuoteApprovalLevel2BottleneckAnalysisProps {
  stage: string;
  onBack: () => void;
  onDrillToLevel3: (dealSize: string, complexity: string) => void;
}

export default function QuoteApprovalLevel2BottleneckAnalysis({ 
  stage, 
  onBack, 
  onDrillToLevel3 
}: QuoteApprovalLevel2BottleneckAnalysisProps) {
  const [bottleneckData, setBottleneckData] = useState<QuoteApprovalLevel2BottleneckData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = QuoteApprovalDrillDownService.getLevel2BottleneckAnalysis();
        setBottleneckData(data);
      } catch (error) {
        console.error('Error fetching Quote Approval Level 2 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stage]);

  const handleBottleneckClick = (dealSize: string, complexity: string) => {
    onDrillToLevel3(dealSize, complexity);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter data based on selected filters
  const filteredData = bottleneckData.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.quoteType === selectedFilter;
    const matchesSegment = selectedSegment === 'all' || item.customerSegment === selectedSegment;
    return matchesFilter && matchesSegment;
  });

  // Calculate insights
  const complexDeals = filteredData.filter(d => d.complexity === 'complex');
  const avgComplexDealTime = complexDeals.reduce((sum, d) => sum + d.approvalDays, 0) / complexDeals.length || 0;
  const simpleDeals = filteredData.filter(d => d.complexity === 'simple');
  const avgSimpleDealTime = simpleDeals.reduce((sum, d) => sum + d.approvalDays, 0) / simpleDeals.length || 0;
  
  const highValueDeals = filteredData.filter(d => d.dealSize > 100000);
  const avgHighValueTime = highValueDeals.reduce((sum, d) => sum + d.approvalDays, 0) / highValueDeals.length || 0;

  // Prepare scatter plot data
  const scatterData = filteredData.map(item => ({
    x: item.dealSize / 1000, // Convert to K
    y: item.approvalDays,
    complexity: item.complexity,
    color: item.color,
    quoteId: item.quoteId,
    productFamily: item.productFamily,
    customerSegment: item.customerSegment,
    discountPercentage: item.discountPercentage
  }));

  // Group data by complexity for summary
  const complexityGroups = filteredData.reduce((acc, item) => {
    if (!acc[item.complexity]) {
      acc[item.complexity] = [];
    }
    acc[item.complexity].push(item);
    return acc;
  }, {} as Record<string, QuoteApprovalLevel2BottleneckData[]>);

  const complexitySummary = Object.entries(complexityGroups).map(([complexity, items]) => ({
    complexity,
    count: items.length,
    avgDays: Math.round((items.reduce((sum, item) => sum + item.approvalDays, 0) / items.length) * 10) / 10,
    avgDealSize: Math.round(items.reduce((sum, item) => sum + item.dealSize, 0) / items.length / 1000),
    color: items[0].color
  }));

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
            Back to Funnel
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Approval Bottleneck Analysis</h1>
            <p className="text-gray-600">Why are high-value quotes slow? Deal size vs approval time analysis</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Quote Types</option>
              <option value="new_business">New Business</option>
              <option value="renewal">Renewals</option>
              <option value="expansion">Expansions</option>
            </select>
            
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
          </div>
          
          <div className="text-sm text-gray-600">
            Analyzing {filteredData.length} quotes requiring approval
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-700">Complex Deals</span>
          </div>
          <p className="text-sm text-red-600">
            Averaging {Math.round(avgComplexDealTime * 10) / 10} days ({complexDeals.length} deals {'>'}$100K)
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Simple Renewals</span>
          </div>
          <p className="text-sm text-green-600">
            Fast track: {Math.round(avgSimpleDealTime * 10) / 10} days average ({simpleDeals.length} deals)
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-yellow-700">High-Value Impact</span>
          </div>
          <p className="text-sm text-yellow-600">
            $100K+ deals: {Math.round(avgHighValueTime * 10) / 10} days ({highValueDeals.length} deals)
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Opportunity</span>
          </div>
          <p className="text-sm text-blue-600">
            Pre-approved bands could save 2-3 days
          </p>
        </div>
      </div>

      {/* Scatter Plot Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Deal Size vs Approval Time</h2>
            <p className="text-sm text-gray-600">Scatter plot colored by deal complexity</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Simple</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Complex</span>
            </div>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Deal Size"
                unit="K"
                tick={{ fontSize: 11 }}
                label={{ value: 'Deal Size ($K)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Approval Days"
                tick={{ fontSize: 11 }}
                label={{ value: 'Approval Days', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{data.productFamily}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Deal Size:</span> ${data.x}K
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Approval Days:</span> {data.y}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Complexity:</span> {data.complexity}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Segment:</span> {data.customerSegment}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Discount:</span> {data.discountPercentage}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter 
                name="Quotes" 
                data={scatterData} 
                fill="#8884d8"
              >
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complexity Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Approval Time by Complexity</h2>
            <p className="text-sm text-gray-600">Average approval days for each complexity level</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complexitySummary} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="complexity" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900 capitalize">{label} Deals</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Avg Days:</span> {data.avgDays}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Count:</span> {data.count} deals
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Avg Size:</span> ${data.avgDealSize}K
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgDays" radius={[4, 4, 0, 0]}>
                  {complexitySummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Pattern Analysis</h2>
            <p className="text-sm text-gray-600">Key insights from approval bottleneck data</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-blue-700">Pattern Detected</span>
              </div>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Complex deals {'>'}$100K averaging {Math.round(avgComplexDealTime * 10) / 10} days</li>
                <li>• Simple renewals complete in {'<'}48 hours</li>
                <li>• Cross-sell quotes require multi-tier approval</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-700">Opportunities</span>
              </div>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Pre-approved discount bands could save 2-3 days</li>
                <li>• Automated approval for renewals &lt;$50K</li>
                <li>• Streamline multi-product bundle approvals</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-yellow-700">Recommendations</span>
              </div>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• Implement deal complexity scoring</li>
                <li>• Create approval fast-track criteria</li>
                <li>• Set up escalation triggers at 48 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Quote Analysis Details</h2>
            <p className="text-sm text-gray-600">Click any row to drill down into pending queue</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Quote ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Deal Size</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Approval Days</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Complexity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Segment</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Discount %</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 10).map((item, index) => (
                <tr 
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleBottleneckClick(item.dealSize.toString(), item.complexity)}
                >
                  <td className="py-4 px-4 text-sm font-mono text-gray-900">{item.quoteId.split('_')[0]}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{item.productFamily}</td>
                  <td className="py-4 px-4 text-right text-sm text-gray-900">${Math.round(item.dealSize / 1000)}K</td>
                  <td className="py-4 px-4 text-right text-sm font-medium text-gray-900">{item.approvalDays}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.complexity === 'simple' ? 'bg-green-100 text-green-800' :
                      item.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.complexity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{item.customerSegment}</td>
                  <td className="py-4 px-4 text-right text-sm text-gray-900">{item.discountPercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
