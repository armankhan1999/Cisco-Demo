'use client';

import { useState, useEffect } from 'react';
import { Q2CCycleDrillDownService, type Q2CLevel1ProcessStage } from '@/services/q2cDrillDownService';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, Filter, ChevronRight, FileText, ShoppingCart, Settings, CreditCard, Zap, ArrowRight } from '@/utils/iconMapping';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface Q2CLevel1ProcessBreakdownProps {
  onBack: () => void;
  onDrillToLevel2: (stage: string) => void;
}

export default function Q2CLevel1ProcessBreakdown({ onBack, onDrillToLevel2 }: Q2CLevel1ProcessBreakdownProps) {
  const [processData, setProcessData] = useState<Q2CLevel1ProcessStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = Q2CCycleDrillDownService.getLevel1ProcessBreakdown();
        setProcessData(data);
      } catch (error) {
        console.error('Error fetching Q2C Level 1 data:', error);
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

  // Prepare waterfall chart data
  const waterfallData = processData.map((stage, index) => ({
    name: stage.stage,
    days: stage.avgDays,
    target: stage.targetDays,
    variance: stage.variance,
    color: stage.color,
    volume: stage.volume,
    status: stage.status
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
            Back to Overview
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quote-to-Cash Process Breakdown</h1>
            <p className="text-gray-600">Which stages are causing delays?</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Complete Q2C Pipeline Analysis
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
              <option value="all">All Deal Types</option>
              <option value="new">New Business</option>
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
            Showing {processData.length} stages • Total avg: {Math.round(processData.reduce((sum, p) => sum + p.avgDays, 0) * 10) / 10} days
          </div>
        </div>
      </div>

      {/* Key Insights - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {processData.filter(p => p.status === 'critical').slice(0, 1).map(stage => (
          <div key={stage.stage} className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium text-red-700">Critical Bottleneck</span>
            </div>
            <p className="text-sm text-red-600">
              {stage.stage} averaging {stage.avgDays} days ({stage.variance > 0 ? '+' : ''}{stage.variance} vs target)
            </p>
          </div>
        ))}
        
        {processData.filter(p => p.status === 'warning').slice(0, 1).map(stage => (
          <div key={stage.stage} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-yellow-700">Needs Attention</span>
            </div>
            <p className="text-sm text-yellow-600">
              {stage.stage} - {stage.avgDays} days (target: {stage.targetDays})
            </p>
          </div>
        ))}
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Performing Well</span>
          </div>
          <p className="text-sm text-green-600">
            {processData.filter(p => p.status === 'good').length} stages meeting SLA targets
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Total Cycle Time</span>
          </div>
          <p className="text-sm text-blue-600">
            {Math.round(processData.reduce((sum, p) => sum + p.avgDays, 0) * 10) / 10} days end-to-end
          </p>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Process Stage Performance</h2>
            <p className="text-sm text-gray-600">Average days per stage vs target (waterfall view)</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Average:</span> {data.days} days
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Target:</span> {data.target} days
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Variance:</span> {data.variance > 0 ? '+' : ''}{data.variance} days
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Volume:</span> {data.volume} transactions
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={45} stroke="#6B7280" strokeDasharray="5 5" />
              <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                {processData.map((item, index) => (
                  <Cell key={`cell-${item.id}-${index}`} fill={item.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Stage Performance Details</h2>
            <p className="text-sm text-gray-600">Click any row to drill down into segment analysis</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stage</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Avg Days</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Target</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Δ Target</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Volume</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {processData.map((stage, index) => (
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
                  <td className="py-4 px-4 text-right">
                    <span className="font-medium text-gray-900">{stage.avgDays}</span>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">
                    {stage.targetDays}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-medium ${
                      stage.variance > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {stage.variance > 0 ? '+' : ''}{stage.variance}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-600">
                    {stage.volume}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stage.status === 'good' ? 'bg-green-100 text-green-800' :
                      stage.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stage.status === 'good' ? '✅' : stage.status === 'warning' ? '🟡' : '🔴'}
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

      {/* Enhanced End-to-End Process Flow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Complete Quote-to-Cash Pipeline</h2>
          <p className="text-sm text-gray-600">End-to-end process flow including subscription lifecycle management</p>
        </div>

        <div className="relative">
          {/* Process Flow Timeline */}
          <div className="flex items-start justify-between relative">
            {/* Background connecting line */}
            <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 z-0"></div>
            
            {processData.map((stage, index) => {
              const IconComponent = {
                'FileText': FileText,
                'CheckCircle': CheckCircle,
                'ShoppingCart': ShoppingCart,
                'Settings': Settings,
                'CreditCard': CreditCard,
                'Zap': Zap
              }[stage.icon] || FileText;
              
              return (
                <div key={stage.id} className="flex flex-col items-center relative z-10" style={{ flex: 1 }}>
                  {/* Stage Circle */}
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-4 border-white relative`}
                    style={{ backgroundColor: stage.color }}
                  >
                    <IconComponent className="h-6 w-6" />
                    {/* Days badge */}
                    <div className="absolute -top-2 -right-2 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow border">
                      {stage.avgDays}d
                    </div>
                  </div>
                  
                  {/* Stage Info */}
                  <div className="mt-3 text-center max-w-24">
                    <div className="text-xs font-semibold text-gray-900 leading-tight">
                      {stage.stage}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Target: {stage.targetDays}d
                    </div>
                    <div className={`text-xs font-medium mt-1 ${
                      stage.status === 'good' ? 'text-green-600' :
                      stage.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {stage.variance > 0 ? '+' : ''}{stage.variance}d
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  {index < processData.length - 1 && (
                    <div className="absolute top-8 -right-4 z-20">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Process Description */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processData.map((stage, index) => (
              <div key={stage.id} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                </div>
                <p className="text-xs text-gray-600">{stage.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{stage.volume} transactions</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    stage.status === 'good' ? 'bg-green-100 text-green-700' :
                    stage.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {stage.status === 'good' ? 'On Track' : stage.status === 'warning' ? 'At Risk' : 'Critical'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
