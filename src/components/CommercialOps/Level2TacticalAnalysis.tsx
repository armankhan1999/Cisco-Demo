'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Filter, Download, RefreshCw, Layers, Target, AlertCircle } from 'lucide-react';
import { drillDownService, type KPIDrillDown, type Level2View } from '@/services/drillDownService';
import { getCommercialOpsKPIs } from '@/services/commercialOpsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ComposedChart, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import AdvancedVisualizationCharts from './AdvancedVisualizationCharts';

interface Level2TacticalAnalysisProps {
  kpiId: string;
  onBack: () => void;
  onDrillToLevel3: (actionId: string) => void;
}

export default function Level2TacticalAnalysis({ kpiId, onBack, onDrillToLevel3 }: Level2TacticalAnalysisProps) {
  const [activeView, setActiveView] = useState<string>('');
  const [kpiDrillDown, setKpiDrillDown] = useState<KPIDrillDown | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    timeRange: 'Q2-2025',
    segment: 'all',
    product: 'all'
  });

  useEffect(() => {
    const drillDown = drillDownService.getKPIDrillDown(kpiId);
    if (drillDown) {
      setKpiDrillDown(drillDown);
      setActiveView(drillDown.level2Views[0]?.id || '');
    }
    setLoading(false);
  }, [kpiId]);

  if (loading || !kpiDrillDown) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading Tactical Analysis...</p>
        </div>
      </div>
    );
  }

  const activeViewData = kpiDrillDown.level2Views.find(view => view.id === activeView);

  const getChartData = (viewId: string, chartType: string) => {
    switch (viewId) {
      case 'stage-breakdown':
        return [
          { stage: 'Quote Creation', avgDays: 0.8, target: 1.0, slaCompliance: 95, status: 'good' },
          { stage: 'Quote Approval', avgDays: 12.5, target: 10.0, slaCompliance: 72, status: 'warning' },
          { stage: 'Order Processing', avgDays: 0.2, target: 0.5, slaCompliance: 98, status: 'good' },
          { stage: 'Fulfillment', avgDays: 1.5, target: 2.0, slaCompliance: 94, status: 'good' },
          { stage: 'Invoicing', avgDays: 0.5, target: 1.0, slaCompliance: 97, status: 'good' },
          { stage: 'Payment Collection', avgDays: 22.5, target: 30.0, slaCompliance: 83, status: 'good' }
        ];
      case 'customer-segment':
        return [
          { segment: 'Strategic', avgCycle: 35, volume: 45, impact: 'high', color: '#10B981' },
          { segment: 'Enterprise', avgCycle: 42, volume: 128, impact: 'medium', color: '#F59E0B' },
          { segment: 'Commercial', avgCycle: 38, volume: 234, impact: 'medium', color: '#3B82F6' },
          { segment: 'SMB', avgCycle: 28, volume: 456, impact: 'low', color: '#8B5CF6' }
        ];
      case 'approval-funnel':
        return [
          { stage: 'Submitted', count: 1000, percentage: 100 },
          { stage: 'Initial Review', count: 950, percentage: 95 },
          { stage: 'Legal Review', count: 720, percentage: 72 },
          { stage: 'Pricing Approval', count: 680, percentage: 68 },
          { stage: 'Final Approval', count: 650, percentage: 65 },
          { stage: 'Approved', count: 620, percentage: 62 }
        ];
      case 'error-analysis':
        return [
          { product: 'Meraki', errorRate: 1.2, volume: 234, impact: 12450, color: '#049FD9' },
          { product: 'Duo', errorRate: 0.8, volume: 189, impact: 6780, color: '#6CC04A' },
          { product: 'Umbrella', errorRate: 1.5, volume: 156, impact: 18900, color: '#F58220' },
          { product: 'ThousandEyes', errorRate: 2.1, volume: 127, impact: 28340, color: '#ED1C24' },
          { product: 'Splunk', errorRate: 1.8, volume: 98, impact: 22150, color: '#7B5EA7' }
        ];
      case 'aging-analysis':
        return [
          { tier: 'Strategic', current: 8200, aging31_60: 1200, aging61_90: 400, aging90Plus: 200, avgDSO: 22 },
          { tier: 'Enterprise', current: 5500, aging31_60: 1100, aging61_90: 500, aging90Plus: 200, avgDSO: 28 },
          { tier: 'Commercial', current: 3800, aging31_60: 1000, aging61_90: 500, aging90Plus: 300, avgDSO: 35 },
          { tier: 'SMB', current: 1200, aging31_60: 500, aging61_90: 200, aging90Plus: 100, avgDSO: 42 }
        ];
      case 'variance-drivers':
        return [
          { driver: 'Contract Modifications', impact: 245, percentage: 42, trend: 'up' },
          { driver: 'Usage True-up', impact: 158, percentage: 27, trend: 'stable' },
          { driver: 'Amendment Delays', impact: 92, percentage: 16, trend: 'down' },
          { driver: 'Multi-year Allocation', impact: 68, percentage: 12, trend: 'down' },
          { driver: 'Other', impact: 18, percentage: 3, trend: 'stable' }
        ];
      case 'win-loss-analysis':
        return [
          { segment: 'Strategic', winRate: 78, volume: 45, avgDealSize: 285000, color: '#10B981' },
          { segment: 'Enterprise', winRate: 65, volume: 128, avgDealSize: 156000, color: '#3B82F6' },
          { segment: 'Commercial', winRate: 58, volume: 234, avgDealSize: 92000, color: '#F59E0B' },
          { segment: 'SMB', winRate: 45, volume: 456, avgDealSize: 35000, color: '#EF4444' }
        ];
      case 'renewal-pipeline':
        return [
          { stage: 'Renewal Triggered', count: 150, percentage: 100 },
          { stage: 'Quote Generated', count: 142, percentage: 95 },
          { stage: 'Customer Review', count: 128, percentage: 85 },
          { stage: 'Negotiation', count: 115, percentage: 77 },
          { stage: 'Signed', count: 108, percentage: 72 }
        ];
      case 'expansion-opportunities':
        return [
          { customer: 'TechCorp', currentARR: 425000, expansionPotential: 280000, utilizationRate: 92, products: 2 },
          { customer: 'GlobalHealth', currentARR: 380000, expansionPotential: 225000, utilizationRate: 88, products: 3 },
          { customer: 'FinanceFirst', currentARR: 290000, expansionPotential: 156000, utilizationRate: 85, products: 1 },
          { customer: 'DataCorp', currentARR: 195000, expansionPotential: 125000, utilizationRate: 89, products: 2 }
        ];
      case 'revenue-schedule':
        return [
          { month: 'Jul 2025', scheduled: 4200000, recognized: 4150000, variance: -50000 },
          { month: 'Aug 2025', scheduled: 3800000, recognized: 3825000, variance: 25000 },
          { month: 'Sep 2025', scheduled: 4500000, recognized: 4480000, variance: -20000 },
          { month: 'Oct 2025', scheduled: 3900000, recognized: 0, variance: 0 },
          { month: 'Nov 2025', scheduled: 4100000, recognized: 0, variance: 0 },
          { month: 'Dec 2025', scheduled: 4800000, recognized: 0, variance: 0 }
        ];
      case 'performance-radar':
        return [
          { metric: 'Speed', score: 85 },
          { metric: 'Accuracy', score: 92 },
          { metric: 'Compliance', score: 78 },
          { metric: 'Customer Satisfaction', score: 88 },
          { metric: 'Cost Efficiency', score: 75 },
          { metric: 'Quality', score: 90 }
        ];
      case 'deal-scatter':
        return [
          { x: 50, y: 25, name: 'Deal A' },
          { x: 120, y: 35, name: 'Deal B' },
          { x: 200, y: 45, name: 'Deal C' },
          { x: 85, y: 28, name: 'Deal D' },
          { x: 300, y: 55, name: 'Deal E' },
          { x: 150, y: 40, name: 'Deal F' }
        ];
      case 'process-composed':
        return [
          { name: 'Quote Creation', volume: 150, efficiency: 95 },
          { name: 'Approval', volume: 142, efficiency: 72 },
          { name: 'Legal Review', volume: 128, efficiency: 85 },
          { name: 'Fulfillment', volume: 125, efficiency: 94 },
          { name: 'Invoicing', volume: 123, efficiency: 97 }
        ];
      default:
        return [];
    }
  };

  const renderChart = (view: Level2View) => {
    const data = getChartData(view.id, view.chartType);

    switch (view.chartType) {
      case 'breakdown':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgDays" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'funnel':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'heatmap':
        return (
          <div className="grid grid-cols-4 gap-4 h-96">
            {data.map((item: any, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg`} 
                       style={{ backgroundColor: item.color }}>
                    {item.avgCycle || item.avgDSO}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.segment || item.tier}</h4>
                  <p className="text-sm text-gray-600">Volume: {item.volume}</p>
                  <p className="text-xs text-gray-500 capitalize">Impact: {item.impact}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'waterfall':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="driver" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="impact" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Overview</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  {kpiDrillDown.kpiName} - Tactical Analysis
                </h1>
                <p className="text-gray-600 mt-1">{kpiDrillDown.businessContext}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Filters */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select 
                  value={filters.timeRange}
                  onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="Q2-2025">Q2 2025</option>
                  <option value="Q1-2025">Q1 2025</option>
                  <option value="Q4-2024">Q4 2024</option>
                </select>
                <select 
                  value={filters.segment}
                  onChange={(e) => setFilters({...filters, segment: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="all">All Segments</option>
                  <option value="strategic">Strategic</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="commercial">Commercial</option>
                  <option value="smb">SMB</option>
                </select>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* View Navigation */}
        <div className="px-8">
          <nav className="flex space-x-8">
            {kpiDrillDown.level2Views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === view.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Layers className="h-4 w-4" />
                {view.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {activeViewData && (
          <div className="space-y-8">
            {/* View Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{activeViewData.title}</h2>
                  <p className="text-gray-600 mb-4">{activeViewData.description}</p>
                  
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Business Question</p>
                      <p className="text-sm text-blue-700">{activeViewData.businessQuestion}</p>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6">
                  <button
                    onClick={() => onDrillToLevel3('main')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <AlertCircle className="h-4 w-4" />
                    View Action Items
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Data Visualization</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time data</span>
                </div>
              </div>
              
              {renderChart(activeViewData)}
            </div>

            {/* Actionable Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Key Insights & Recommendations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeViewData.actionableInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Action Items</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kpiDrillDown.level3Actions.map((action) => (
                  <div key={action.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => onDrillToLevel3(action.id)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                        <p className="text-xs text-blue-600 font-medium">{action.businessImpact}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        action.urgency === 'high' ? 'bg-red-100 text-red-800' :
                        action.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {action.urgency}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
