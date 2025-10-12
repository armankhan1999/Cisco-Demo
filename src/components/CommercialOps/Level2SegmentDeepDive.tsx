'use client';

import { useState, useEffect } from 'react';
import { enhancedDrillDownService, QuoteToCashDrillDown, type UniversalFilters, type Level2SegmentData } from '@/services/enhancedDrillDownService';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Users, ChevronRight } from '@/utils/iconMapping';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Level2SegmentDeepDiveProps {
  kpiId: string;
  context: any;
  onBack: () => void;
  onDrillToLevel3: (context: any) => void;
}

export default function Level2SegmentDeepDive({ kpiId, context, onBack, onDrillToLevel3 }: Level2SegmentDeepDiveProps) {
  const [segmentData, setSegmentData] = useState<Level2SegmentData[]>([]);
  const [filters, setFilters] = useState<UniversalFilters>(enhancedDrillDownService.getFilters());
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'payment-collection' | 'segment-analysis'>('payment-collection');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data: Level2SegmentData[] = [];
        
        if (kpiId === 'quote-to-cash-cycle') {
          data = QuoteToCashDrillDown.getLevel2SegmentAnalysis(filters);
        }
        
        setSegmentData(data);
      } catch (error) {
        console.error('Error fetching Level 2 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kpiId, filters]);

  const handleSegmentClick = (segment: Level2SegmentData) => {
    onDrillToLevel3({ segment: segment.segment, segmentData: segment });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getWorstPerformer = () => {
    return segmentData.reduce((worst, segment) => 
      segment.avgDays > worst.avgDays ? segment : worst, 
      segmentData[0] || { avgDays: 0, segment: 'None' }
    );
  };

  const getBestPerformer = () => {
    return segmentData.reduce((best, segment) => 
      segment.avgDays < best.avgDays ? segment : best, 
      segmentData[0] || { avgDays: 0, segment: 'None' }
    );
  };

  const getTotalImpact = () => {
    return segmentData.reduce((sum, segment) => sum + segment.amount, 0);
  };

  // Create heatmap data for visualization
  const createHeatmapData = () => {
    const segments = ['Enterprise', 'Mid-Market', 'SMB'];
    const products = ['Meraki', 'Duo', 'Umbrella', 'ThousandEyes', 'Splunk'];
    
    return segments.map(segment => ({
      segment,
      ...products.reduce((acc, product) => {
        const data = segmentData.find(d => d.segment === `${segment}-${product}`);
        acc[product] = data ? data.avgDays : 0;
        return acc;
      }, {} as any)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading segment analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Process Breakdown
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Collection Deep Dive</h1>
                <p className="text-gray-600">Which customer segments are driving payment delays?</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Worst Performer</p>
                <p className="text-lg font-bold text-red-600">{getWorstPerformer().segment}</p>
                <p className="text-sm text-red-500">{getWorstPerformer().avgDays} days avg</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Impact</p>
                <p className="text-lg font-bold text-gray-900">${(getTotalImpact() / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-gray-500">ARR affected</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setSelectedView('payment-collection')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedView === 'payment-collection'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payment Collection Analysis
            </button>
            <button
              onClick={() => setSelectedView('segment-analysis')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedView === 'segment-analysis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Segment Performance Matrix
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 space-y-8">
        {selectedView === 'payment-collection' && (
          <>
            {/* Combo Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Days by Segment & Product</h2>
                  <p className="text-gray-600">Average payment collection time with transaction volume overlay</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Avg Days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-orange-500"></div>
                    <span>Volume</span>
                  </div>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={segmentData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="segment" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={11}
                    />
                    <YAxis yAxisId="left" label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Volume', angle: 90, position: 'insideRight' }} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'avgDays' ? `${value} days` : `${value} deals`,
                        name === 'avgDays' ? 'Average Days' : 'Volume'
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="avgDays" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#F97316" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insights Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-red-700">Critical Issue</span>
                  </div>
                  <p className="text-sm text-red-600">
                    SMB-Duo averaging 29 days (15 orders) - Payment terms mismatch detected
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium text-yellow-700">Process Delay</span>
                  </div>
                  <p className="text-sm text-yellow-600">
                    Enterprise deals require multi-level approvals causing 16.7d avg delay
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">Best Practice</span>
                  </div>
                  <p className="text-sm text-green-600">
                    SMB performs well: 28.4d avg - Simple approval processes work
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedView === 'segment-analysis' && (
          <>
            {/* Heatmap Visualization */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Segment Performance Heatmap</h2>
                  <p className="text-gray-600">Payment collection performance by customer tier and product</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Segment</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Meraki</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Duo</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Umbrella</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">ThousandEyes</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Splunk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createHeatmapData().map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-100">
                        <td className="py-4 px-4 font-medium text-gray-900">{row.segment}</td>
                        {['Meraki', 'Duo', 'Umbrella', 'ThousandEyes', 'Splunk'].map((product, colIndex) => {
                          const value = row[product];
                          const intensity = value > 30 ? 'bg-red-100 text-red-800' : 
                                          value > 20 ? 'bg-yellow-100 text-yellow-800' : 
                                          value > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-400';
                          
                          return (
                            <td key={colIndex} className="py-4 px-4 text-center">
                              <div className={`inline-flex items-center justify-center w-16 h-8 rounded-md ${intensity} font-medium text-sm`}>
                                {value > 0 ? `${value.toFixed(1)}d` : '-'}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span>Color Scale:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span>≤20 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                  <span>21-30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span>&gt;30 days</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Detailed Segment Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Segment Performance Details</h2>
              <p className="text-gray-600">Click any segment to drill down to transaction details</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Segment</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Days</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Volume</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {segmentData.slice(0, 15).map((segment, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSegmentClick(segment)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(segment.status)}
                        <span className="font-medium text-gray-900">{segment.segment}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-lg font-bold text-gray-900">{segment.avgDays}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{segment.volume}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">${(segment.amount / 1000).toFixed(0)}K</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        segment.status === 'good' ? 'bg-green-100 text-green-800' :
                        segment.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {segment.status === 'good' ? 'Good' : 
                         segment.status === 'warning' ? 'At Risk' : 'Critical'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <ChevronRight className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Best Performer</h3>
            <p className="text-xl font-bold mb-1">{getBestPerformer().segment}</p>
            <p className="text-blue-100">{getBestPerformer().avgDays} days average</p>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Needs Attention</h3>
            <p className="text-xl font-bold mb-1">{getWorstPerformer().segment}</p>
            <p className="text-red-100">{getWorstPerformer().avgDays} days average</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Segments</h3>
            <p className="text-xl font-bold mb-1">{segmentData.length}</p>
            <p className="text-green-100">analyzed combinations</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Avg Performance</h3>
            <p className="text-xl font-bold mb-1">
              {(segmentData.reduce((sum, s) => sum + s.avgDays, 0) / segmentData.length).toFixed(1)} days
            </p>
            <p className="text-purple-100">across all segments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
