'use client';

import { useState, useEffect } from 'react';
import { enhancedDrillDownService, QuoteToCashDrillDown, type UniversalFilters, type Level1ProcessStage } from '@/services/enhancedDrillDownService';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, Filter, ChevronRight } from '@/utils/iconMapping';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface Level1ProcessBreakdownProps {
  kpiId: string;
  onBack: () => void;
  onDrillToLevel2: (context: any) => void;
}

export default function Level1ProcessBreakdown({ kpiId, onBack, onDrillToLevel2 }: Level1ProcessBreakdownProps) {
  const [processData, setProcessData] = useState<Level1ProcessStage[]>([]);
  const [filters, setFilters] = useState<UniversalFilters>(enhancedDrillDownService.getFilters());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data: Level1ProcessStage[] = [];
        
        if (kpiId === 'quote-to-cash-cycle') {
          data = QuoteToCashDrillDown.getLevel1ProcessBreakdown(filters);
        }
        
        setProcessData(data);
      } catch (error) {
        console.error('Error fetching Level 1 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kpiId, filters]);

  const handleFilterChange = (filterType: keyof UniversalFilters, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    enhancedDrillDownService.updateFilters(newFilters);
  };

  const handleStageClick = (stage: Level1ProcessStage) => {
    onDrillToLevel2({ stage: stage.stage, stageData: stage });
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
      case 'good': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getTotalCycleTime = () => {
    return processData.reduce((sum, stage) => sum + stage.avgDays, 0);
  };

  const getWorstBottleneck = () => {
    return processData.reduce((worst, stage) => 
      stage.delta > worst.delta ? stage : worst, 
      processData[0] || { delta: 0, stage: 'None' }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading process breakdown...</p>
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
                Back to Overview
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Process Stage Breakdown</h1>
                <p className="text-gray-600">Which stages are causing delays in the quote-to-cash process?</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Cycle Time</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalCycleTime().toFixed(1)} days</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Biggest Bottleneck</p>
                <p className="text-lg font-bold text-red-600">{getWorstBottleneck().stage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-8 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filters.timePeriod}
              onChange={(e) => handleFilterChange('timePeriod', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={filters.customerSegment}
              onChange={(e) => handleFilterChange('customerSegment', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Segments</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="SMB">SMB</option>
            </select>
            <select
              value={filters.productFamily}
              onChange={(e) => handleFilterChange('productFamily', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Products</option>
              <option value="Meraki">Meraki</option>
              <option value="Duo">Duo</option>
              <option value="Umbrella">Umbrella</option>
              <option value="ThousandEyes">ThousandEyes</option>
              <option value="Splunk">Splunk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 space-y-8">
        {/* Waterfall Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quote-to-Cash Process Flow</h2>
              <p className="text-gray-600">Time contribution of each stage in the process</p>
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
              <BarChart data={processData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="stage" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value} days`,
                    name === 'avgDays' ? 'Average Days' : name
                  ]}
                  labelFormatter={(label) => `Stage: ${label}`}
                />
                <Bar dataKey="avgDays" radius={[4, 4, 0, 0]}>
                  {processData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                  ))}
                </Bar>
                <ReferenceLine y={45} stroke="#EF4444" strokeDasharray="5 5" label="Target (45 days total)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Process Stages Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Stage Performance Details</h2>
              <p className="text-gray-600">Click any stage to drill down for detailed analysis</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Stage</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Days</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Target</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Δ Target</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Volume</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {processData.map((stage, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleStageClick(stage)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(stage.status)}
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-lg font-bold text-gray-900">{stage.avgDays}</span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">{stage.target}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {stage.delta > 0 ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className={`font-medium ${stage.delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {stage.delta > 0 ? '+' : ''}{stage.delta}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">{stage.volume}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stage.status === 'good' ? 'bg-green-100 text-green-800' :
                        stage.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {stage.status === 'good' ? 'On Target' : 
                         stage.status === 'warning' ? 'At Risk' : 'Critical'}
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

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Primary Bottleneck</h3>
            <p className="text-2xl font-bold mb-2">{getWorstBottleneck().stage}</p>
            <p className="text-red-100">+{getWorstBottleneck().delta} days over target</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Process Efficiency</h3>
            <p className="text-2xl font-bold mb-2">{((45 / getTotalCycleTime()) * 100).toFixed(1)}%</p>
            <p className="text-blue-100">vs 100% target efficiency</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Stages On Target</h3>
            <p className="text-2xl font-bold mb-2">{processData.filter(s => s.status === 'good').length}</p>
            <p className="text-green-100">out of {processData.length} total stages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
