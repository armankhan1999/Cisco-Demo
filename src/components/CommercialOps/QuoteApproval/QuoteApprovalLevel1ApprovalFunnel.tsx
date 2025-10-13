'use client';

import { useState, useEffect } from 'react';
import { QuoteApprovalDrillDownService, type QuoteApprovalLevel1ApprovalStage } from '@/services/quoteApprovalDrillDownService';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, Filter, ChevronRight, Users, Target, DollarSign } from '@/utils/iconMapping';
import { FunnelChart, Funnel, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

interface QuoteApprovalLevel1ApprovalFunnelProps {
  onBack: () => void;
  onDrillToLevel2: (stage: string) => void;
}

export default function QuoteApprovalLevel1ApprovalFunnel({ onBack, onDrillToLevel2 }: QuoteApprovalLevel1ApprovalFunnelProps) {
  const [approvalData, setApprovalData] = useState<QuoteApprovalLevel1ApprovalStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = QuoteApprovalDrillDownService.getLevel1ApprovalStageFunnel();
        setApprovalData(data);
      } catch (error) {
        console.error('Error fetching Quote Approval Level 1 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStageClick = (stage: string) => {
    onDrillToLevel2(stage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Prepare funnel chart data
  const funnelData = approvalData.map((stage, index) => ({
    name: stage.stage,
    value: stage.count,
    percentage: stage.percentage,
    avgDays: stage.avgDays,
    fill: stage.color
  }));

  // Prepare bar chart data for approval times
  const barChartData = approvalData.map(stage => ({
    name: stage.stage.replace(' Review', '').replace('Auto-', ''),
    avgDays: stage.avgDays,
    targetDays: stage.targetDays,
    variance: stage.variance,
    count: stage.count,
    color: stage.color,
    status: stage.status
  }));

  const totalQuotes = approvalData.reduce((sum, stage) => sum + stage.count, 0);
  const avgApprovalTime = approvalData.reduce((sum, stage) => sum + (stage.avgDays * stage.count), 0) / totalQuotes;
  const criticalStages = approvalData.filter(s => s.status === 'critical').length;
  const warningStages = approvalData.filter(s => s.status === 'warning').length;

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
            Back to Overview
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quote Approval Stage Funnel</h1>
            <p className="text-gray-600">Where are quotes getting stuck in the approval process?</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Complete Approval Pipeline Analysis
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="rounded-xl shadow-sm border border-gray-200 p-4 mb-6" style={{ backgroundColor: '#F3F3F3' }}>
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
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Complexity</option>
              <option value="simple">Simple</option>
              <option value="moderate">Moderate</option>
              <option value="complex">Complex</option>
            </select>
            
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="Meraki">Meraki</option>
              <option value="Duo">Duo</option>
              <option value="Umbrella">Umbrella</option>
              <option value="Splunk">Splunk</option>
              <option value="ThousandEyes">ThousandEyes</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            {totalQuotes} quotes • Avg: {Math.round(avgApprovalTime * 10) / 10} days
          </div>
        </div>
      </div>

      {/* Enhanced Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {approvalData.filter(s => s.status === 'critical').slice(0, 1).map(stage => (
          <div key={stage.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-700">Critical Bottleneck</span>
            </div>
            <p className="text-sm text-red-600">
              {stage.stage}: {stage.avgDays} days (+{stage.variance} vs target)
            </p>
          </div>
        ))}
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-yellow-700">Stages At Risk</span>
          </div>
          <p className="text-sm text-yellow-600">
            {warningStages + criticalStages} approval stages over target
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">On Track</span>
          </div>
          <p className="text-sm text-green-600">
            {approvalData.filter(s => s.status === 'good').length} stages meeting SLA targets
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Total Volume</span>
          </div>
          <p className="text-sm text-blue-600">
            {totalQuotes} quotes in last 30 days
          </p>
        </div>
      </div>

      {/* Approval Funnel Chart */}
      <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Approval Stage Funnel</h2>
            <p className="text-sm text-gray-600">Quote volume and approval times by stage</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funnel Chart */}
          <div className="h-80">
            <h3 className="text-md font-medium text-gray-900 mb-4">Quote Volume Flow</h3>
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900">{data.name}</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Volume:</span> {data.value} quotes ({data.percentage}%)
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Avg Days:</span> {data.avgDays}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive={true}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart for Approval Times */}
          <div className="h-80">
            <h3 className="text-md font-medium text-gray-900 mb-4">Approval Time Performance</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900">{label}</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Avg Days:</span> {data.avgDays}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Target:</span> {data.targetDays} days
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Volume:</span> {data.count} quotes
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgDays" radius={[4, 4, 0, 0]}>
                  {barChartData.map((item, index) => (
                    <Cell key={`bar-cell-${item.name}-${index}`} fill={item.color} />
                  ))}
                </Bar>
                <ReferenceLine y={5} stroke="#6B7280" strokeDasharray="5 5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Approval Stage Performance</h2>
            <p className="text-sm text-gray-600">Click any row to drill down into bottleneck analysis</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Approval Stage</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Volume</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Percentage</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Avg Days</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Target</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Δ Target</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {approvalData.map((stage, index) => (
                <tr 
                  key={stage.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleStageClick(stage.stage)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{stage.stage}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-900">{stage.count}</td>
                  <td className="py-4 px-4 text-right text-gray-600">{stage.percentage}%</td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">{stage.avgDays}</td>
                  <td className="py-4 px-4 text-right text-gray-600">{stage.targetDays}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-medium ${
                      stage.variance <= 0 ? 'text-green-600' : 
                      stage.variance <= stage.targetDays * 0.5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {stage.variance > 0 ? '+' : ''}{stage.variance}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stage.status === 'good' ? 'bg-green-100 text-green-800' :
                      stage.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stage.status === 'good' ? 'On Track' : stage.status === 'warning' ? 'At Risk' : 'Critical'}
                    </span>
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
