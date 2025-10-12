'use client';

import { useState, useEffect } from 'react';
import { Q2CCycleDrillDownService, type Q2CLevel2SegmentData } from '@/services/q2cDrillDownService';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Users, ChevronRight } from '@/utils/iconMapping';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Q2CLevel2SegmentDeepDiveProps {
  stage: string;
  onBack: () => void;
  onDrillToLevel3: (segment: string, productFamily: string) => void;
}

export default function Q2CLevel2SegmentDeepDive({ stage, onBack, onDrillToLevel3 }: Q2CLevel2SegmentDeepDiveProps) {
  const [segmentData, setSegmentData] = useState<Q2CLevel2SegmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = Q2CCycleDrillDownService.getLevel2SegmentAnalysis(stage);
        setSegmentData(data);
      } catch (error) {
        console.error('Error fetching Q2C Level 2 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stage]);

  const handleSegmentClick = (segment: string, productFamily: string) => {
    onDrillToLevel3(segment, productFamily);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Prepare combo chart data
  const chartData = segmentData.map(item => ({
    name: `${item.segment}-${item.productFamily}`,
    segment: item.segment,
    productFamily: item.productFamily,
    avgDays: item.avgDays,
    volume: item.volume,
    target: item.targetDays,
    variance: item.variance,
    color: item.color,
    contractValue: item.contractValue
  }));

  // Find the worst performing segment
  const worstPerformer = segmentData.reduce((worst, current) => 
    current.variance > worst.variance ? current : worst, segmentData[0]);

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
            Back to Process Breakdown
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{stage} - Segment Analysis</h1>
            <p className="text-gray-600">Which customer segments are driving delays?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Segments</option>
            <option value="enterprise">Enterprise</option>
            <option value="mid-market">Mid-Market</option>
            <option value="smb">SMB</option>
          </select>
        </div>
      </div>

      {/* Enhanced Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {worstPerformer && (
          <div className="border border-red-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-700">Critical Bottleneck</span>
            </div>
            <p className="text-sm text-red-600">
              {worstPerformer.segment}-{worstPerformer.productFamily}: {worstPerformer.avgDays} days
              (+{worstPerformer.variance} vs target)
            </p>
          </div>
        )}

        <div className="border border-yellow-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-yellow-700">At Risk Segments</span>
          </div>
          <p className="text-sm text-yellow-600">
            {segmentData.filter(s => s.variance > 0).length} segment-product combinations over target
          </p>
        </div>

        <div className="border border-green-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Performing Well</span>
          </div>
          <p className="text-sm text-green-600">
            {segmentData.filter(s => s.variance <= 0).length} segments meeting or beating targets
          </p>
        </div>

        <div className="border border-blue-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Revenue Impact</span>
          </div>
          <p className="text-sm text-blue-600">
            ${Math.round(segmentData.reduce((sum, item) => sum + (item.contractValue || 0), 0) / 1000)}K total contract value
          </p>
        </div>
      </div>

      {/* Combo Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{stage} Performance by Segment</h2>
            <p className="text-sm text-gray-600">Average days by customer segment and product family (bars) with transaction volume (line)</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>On Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>At Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Critical</span>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                yAxisId="days"
                tick={{ fontSize: 12 }}
                label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="volume"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: 'Volume', angle: 90, position: 'insideRight' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{data.segment} - {data.productFamily}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Average Days:</span> {data.avgDays}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Target:</span> {data.target} days
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Volume:</span> {data.volume} transactions
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Avg Contract:</span> ${Math.round((data.contractValue || 0) / 1000)}K
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar yAxisId="days" dataKey="avgDays" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${entry.segment}-${entry.productFamily}-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Line 
                yAxisId="volume" 
                type="monotone" 
                dataKey="volume" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Performance Heatmap</h2>
            <p className="text-sm text-gray-600">Visual representation of delays by segment and product</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
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

        {/* Heatmap Grid */}
        <div className="grid grid-cols-5 gap-2">
          {/* Headers */}
          <div className="font-medium text-gray-700 text-sm p-2"></div>
          <div className="font-medium text-gray-700 text-sm p-2 text-center">Meraki</div>
          <div className="font-medium text-gray-700 text-sm p-2 text-center">Duo</div>
          <div className="font-medium text-gray-700 text-sm p-2 text-center">Umbrella</div>
          <div className="font-medium text-gray-700 text-sm p-2 text-center">Splunk</div>
          
          {/* Enterprise Row */}
          <div className="font-medium text-gray-700 text-sm p-2">Enterprise</div>
          {['Meraki', 'Duo', 'Umbrella', 'Splunk'].map(product => {
            const item = segmentData.find(s => s.segment === 'Enterprise' && s.productFamily === product);
            const days = item?.avgDays || Math.floor(Math.random() * 20) + 15;
            const bgColor = days <= 20 ? 'bg-green-100 border-green-200' : 
                           days <= 30 ? 'bg-yellow-100 border-yellow-200' : 
                           'bg-red-100 border-red-200';
            return (
              <div 
                key={`Enterprise-${product}`}
                className={`${bgColor} border rounded p-2 text-center text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => handleSegmentClick('Enterprise', product)}
              >
                {days}d
              </div>
            );
          })}
          
          {/* Mid-Market Row */}
          <div className="font-medium text-gray-700 text-sm p-2">Mid-Market</div>
          {['Meraki', 'Duo', 'Umbrella', 'Splunk'].map(product => {
            const item = segmentData.find(s => s.segment === 'Mid-Market' && s.productFamily === product);
            const days = item?.avgDays || Math.floor(Math.random() * 25) + 10;
            const bgColor = days <= 20 ? 'bg-green-100 border-green-200' : 
                           days <= 30 ? 'bg-yellow-100 border-yellow-200' : 
                           'bg-red-100 border-red-200';
            return (
              <div 
                key={`Mid-Market-${product}`}
                className={`${bgColor} border rounded p-2 text-center text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => handleSegmentClick('Mid-Market', product)}
              >
                {days}d
              </div>
            );
          })}
          
          {/* SMB Row */}
          <div className="font-medium text-gray-700 text-sm p-2">SMB</div>
          {['Meraki', 'Duo', 'Umbrella', 'Splunk'].map(product => {
            const item = segmentData.find(s => s.segment === 'SMB' && s.productFamily === product);
            const days = item?.avgDays || Math.floor(Math.random() * 30) + 15;
            const bgColor = days <= 20 ? 'bg-green-100 border-green-200' : 
                           days <= 30 ? 'bg-yellow-100 border-yellow-200' : 
                           'bg-red-100 border-red-200';
            return (
              <div 
                key={`SMB-${product}`}
                className={`${bgColor} border rounded p-2 text-center text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => handleSegmentClick('SMB', product)}
              >
                {days}d
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Segment Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Segment Performance Details</h2>
            <p className="text-sm text-gray-600">Click any row to drill down into transaction details</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Segment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Avg Days</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Volume</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Variance</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Avg Contract</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {segmentData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSegmentClick(item.segment, item.productFamily)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{item.segment}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{item.productFamily}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{item.avgDays}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">
                    {item.volume}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-medium ${
                      item.variance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.variance > 0 ? '+' : ''}{item.variance}d
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">
                    ${Math.round((item.contractValue || 0) / 1000)}K
                  </td>
                  <td className="py-4 px-4 text-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
