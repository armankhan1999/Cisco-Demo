'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, AlertCircle, Filter, RefreshCw, DollarSign, Users, HelpCircle, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis, FunnelChart, Funnel, LabelList, PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getSalesExpansionKPIs, getTrendData, getExceptionAlerts, type SalesExpansionKPIs, type TrendData, type ExceptionAlert } from '@/services/salesExpansionService';
import DrillDownKPICard from '../CommercialOps/DrillDownKPICard';
import Level2TacticalAnalysis from '../CommercialOps/Level2TacticalAnalysis';
import Level3OperationalActions from '../CommercialOps/Level3OperationalActions';
import { drillDownService, type DrillDownLevel } from '@/services/drillDownService';
import expansionOpportunitiesData from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import pipelineTrackingData from '@/source_data/sales-expansion-data/expansion-pipeline-tracking.json';

export default function DrillDownDashboard() {
  const [currentLevel, setCurrentLevel] = useState<DrillDownLevel>({
    level: 1,
    title: 'Strategic Overview',
    description: 'High-level expansion KPIs and performance metrics'
  });
  
  const [kpis, setKPIs] = useState<SalesExpansionKPIs | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [alerts, setAlerts] = useState<ExceptionAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      const kpiData = getSalesExpansionKPIs();
      const trends = getTrendData();
      const alertData = getExceptionAlerts();
      
      setKPIs(kpiData);
      setTrendData(trends);
      setAlerts(alertData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrillDown = (kpiId: string, level: 2 | 3, actionId?: string) => {
    const newLevel = drillDownService.drillDown(kpiId, level, undefined, actionId);
    setCurrentLevel(newLevel);
  };

  const handleDrillUp = () => {
    const newLevel = drillDownService.drillUp();
    setCurrentLevel(newLevel);
  };

  const handleResetToLevel1 = () => {
    const newLevel = drillDownService.resetToLevel1();
    setCurrentLevel(newLevel);
  };

  const renderBreadcrumb = () => {
    const history = drillDownService.getNavigationHistory();
    
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <button
          onClick={handleResetToLevel1}
          className="hover:text-blue-600 transition-colors"
        >
          Sales Expansion
        </button>
        {history.map((level, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>/</span>
            <span className={index === history.length - 1 ? 'text-blue-600 font-semibold' : ''}>
              {level.title}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading || !kpis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading Sales Expansion Dashboard...</p>
        </div>
      </div>
    );
  }

  // Render Level 2 Tactical Analysis
  if (currentLevel.level === 2 && currentLevel.kpi) {
    return (
      <Level2TacticalAnalysis 
        kpiId={currentLevel.kpi}
        onBack={handleDrillUp}
        onDrillToLevel3={(actionId) => handleDrillDown(currentLevel.kpi!, 3, actionId)}
      />
    );
  }

  // Render Level 3 Operational Actions
  if (currentLevel.level === 3 && currentLevel.kpi) {
    return (
      <Level3OperationalActions 
        kpiId={currentLevel.kpi}
        actionId={currentLevel.actionId}
        onBack={handleDrillUp}
      />
    );
  }

  // Level 1: Strategic Overview
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-6">
          {renderBreadcrumb()}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                Sales Expansion Command Center
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">V2</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Strategic oversight of expansion pipeline, NRR, and growth opportunities
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Q2 2025
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></span>
                Excellent
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors"
                title="Help & Guide"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* KPI Cards Grid - Optimized 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DrillDownKPICard
            kpiId="nrr"
            title="Net Revenue Retention"
            value={(kpis.nrr.value / 1000000).toFixed(2)}
            unit="M"
            target={`≥ $${(kpis.nrr.target / 1000000).toFixed(2)}M`}
            trend={parseFloat(kpis.nrr.trend.toFixed(2))}
            status={kpis.nrr.status}
            icon={<TrendingUp className="h-8 w-8" />}
            color="blue"
            description="Retained + expansion revenue in dollars"
            onDrillDown={handleDrillDown}
            customBgColor="#F3F3F3"
            variant="q2c"
          />
          
          <DrillDownKPICard
            kpiId="expansion-arr"
            title="Expansion ARR"
            value={`$${(kpis.expansionARR.value / 1000000).toFixed(2)}M`}
            unit=""
            target={`≥ $${(kpis.expansionARR.target / 1000000).toFixed(2)}M`}
            trend={parseFloat(kpis.expansionARR.trend.toFixed(2))}
            status={kpis.expansionARR.status}
            icon={<DollarSign className="h-8 w-8" />}
            color="green"
            description="Total ARR from upsell/cross-sell in period"
            onDrillDown={handleDrillDown}
            customBgColor="#F3F3F3"
            variant="q2c"
          />
          
          <DrillDownKPICard
            kpiId="multi-product-penetration"
            title="Multi-Product Penetration"
            value={kpis.multiProductPenetration.value.toFixed(2)}
            unit="%"
            target={`≥ ${kpis.multiProductPenetration.target}%`}
            trend={parseFloat(kpis.multiProductPenetration.trend.toFixed(2))}
            status={kpis.multiProductPenetration.status}
            icon={<Users className="h-8 w-8" />}
            color="purple"
            description="% of customers with 2+ products"
            onDrillDown={handleDrillDown}
            customBgColor="#F3F3F3"
            variant="q2c"
          />
          
          <DrillDownKPICard
            kpiId="white-space-value"
            title="White Space Opportunity"
            value={`$${(kpis.whiteSpaceValue.value / 1000000).toFixed(2)}M`}
            unit=""
            target={`≥ $${(kpis.whiteSpaceValue.target / 1000000).toFixed(2)}M`}
            trend={parseFloat(kpis.whiteSpaceValue.trend.toFixed(2))}
            status={kpis.whiteSpaceValue.status}
            icon={<AlertCircle className="h-8 w-8" />}
            color="orange"
            description="Estimated ARR from identified gaps"
            onDrillDown={handleDrillDown}
            customBgColor="#F3F3F3"
            variant="q2c"
          />

          <DrillDownKPICard
            kpiId="performance-metrics"
            title="Rep Performance Metrics"
            value="92"
            unit="%"
            target="≥ 100%"
            trend={5.2}
            status="warning"
            icon={<Users className="h-8 w-8" />}
            color="indigo"
            description="Avg quota attainment across expansion reps"
            onDrillDown={handleDrillDown}
            customBgColor="#F3F3F3"
            variant="q2c"
          />
          
          <DrillDownKPICard
            kpiId="opportunity-readiness"
            title="Expansion-Ready Accounts"
            value="68"
            unit=" accounts"
            target="≥ 60 accounts"
            trend={8.5}
            status="good"
            icon={<TrendingUp className="h-8 w-8" />}
            color="teal"
            description="Accounts with high expansion readiness score"
            onDrillDown={handleDrillDown}
            customBgColor="#F3F3F3"
            variant="q2c"
          />
        </div>

        {/* NEW: Utilization-Driven Expansion Signals Section */}
        <div className="mb-8">
          <div 
            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => handleDrillDown('utilization-expansion', 2)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  🚨 Utilization-Driven Expansion Signals
                </h3>
                <p className="text-sm text-gray-600 mt-1">Real-time capacity alerts requiring immediate action</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-red-600">18</div>
                <div className="text-xs text-red-600 font-bold">Critical Alerts</div>
              </div>
            </div>

            {/* Alert Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Critical Alerts */}
              <div className="rounded-lg p-4 border border-red-200 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Immediate</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">6</div>
                <div className="text-xs text-gray-600">Critical (&gt;95%)</div>
                <div className="text-xs text-red-600 font-semibold">$840K ARR</div>
              </div>

              {/* High Alerts */}
              <div className="rounded-lg p-4 border border-orange-200 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Plan</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
                <div className="text-xs text-gray-600">High (90-95%)</div>
                <div className="text-xs text-orange-600 font-semibold">$960K ARR</div>
              </div>

              {/* Medium Alerts */}
              <div className="rounded-lg p-4 border border-yellow-200 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <Filter className="w-4 h-4 text-white" />
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Monitor</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">4</div>
                <div className="text-xs text-gray-600">Medium (85-90%)</div>
                <div className="text-xs text-yellow-600 font-semibold">$520K ARR</div>
              </div>

              {/* Response Rate */}
              <div className="rounded-lg p-4 border border-green-200 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Converted</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">78%</div>
                <div className="text-xs text-gray-600">Response Rate</div>
                <div className="text-xs text-green-600 font-semibold">3.2d avg</div>
              </div>
            </div>

            {/* Top Accounts Requiring Action */}
            <div className="rounded-lg p-4 border border-gray-200" style={{ backgroundColor: '#F3F3F3' }}>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-red-600" />
                Top 5 Accounts Requiring Action
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div>
                      <div className="font-semibold text-gray-900">TechCorp Industries</div>
                      <div className="text-xs text-gray-600">Duo • 97% utilization</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">$180K</div>
                    <div className="text-xs text-green-600 font-semibold">Expansion ready</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div>
                      <div className="font-semibold text-gray-900">MedSecure Systems</div>
                      <div className="text-xs text-gray-600">Meraki • 95% utilization</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">$240K</div>
                    <div className="text-xs text-green-600 font-semibold">Expansion ready</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <div>
                      <div className="font-semibold text-gray-900">Global Financial Partners</div>
                      <div className="text-xs text-gray-600">Umbrella • 93% utilization</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">$160K</div>
                    <div className="text-xs text-orange-600 font-semibold">Contact pending</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">
                  Total Potential ARR: <span className="text-red-600">$2.8M</span>
                </span>
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold"
                  onClick={() => handleDrillDown('utilization-expansion', 2)}
                >
                  View All Alerts
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Expansion Pipeline Funnel - Full Width */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => handleDrillDown('pipeline-arr', 2)}>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  Expansion Pipeline Funnel
                </h3>
                <p className="text-sm text-gray-600 mt-1">$33.9M total pipeline value</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-blue-600 font-semibold">Click to drill down →</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={450}>
              <FunnelChart>
                <Tooltip 
                  formatter={(value: any) => `$${(value / 1000000).toFixed(2)}M`}
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Funnel
                  dataKey="value"
                  data={(() => {
                    // Calculate real funnel from expansion-opportunities.json
                    // Proper sales funnel order: Prospecting → Qualified → Engaged → Proposed → Negotiating
                    const stages = ['Prospecting', 'Qualified', 'Engaged', 'Proposed', 'Negotiating'];
                    const stageData = stages.map((stage, index) => {
                      const stageOpps = expansionOpportunitiesData.filter((o: any) => o.stage === stage);
                      const totalARR = stageOpps.reduce((sum: number, o: any) => sum + o.estimated_arr, 0);
                      return {
                        name: stage,
                        value: totalARR,
                        count: stageOpps.length,
                        fill: ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3'][index]
                      };
                    });
                    // Return in sales process order (not sorted by value)
                    return stageData;
                  })()}
                  isAnimationActive
                >
                  <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs text-indigo-700 font-semibold">Weighted Pipeline</p>
                <p className="text-xl font-bold text-indigo-900">${(pipelineTrackingData[0].weighted_pipeline_arr / 1000000).toFixed(2)}M</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 font-semibold">Total Opportunities</p>
                <p className="text-xl font-bold text-green-900">{pipelineTrackingData[0].total_expansion_opportunities}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Scatter Plot & Cross-Sell Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Opportunity Readiness Scatter Plot */}
          <div
            className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            style={{ backgroundColor: '#F3F3F3' }}
            onClick={() => handleDrillDown('opportunity-readiness-matrix', 2)}
          >
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              Opportunity Readiness Matrix
              <span className="ml-auto text-xs text-blue-600 font-normal">Click for details →</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  dataKey="close_probability" 
                  name="Close Probability" 
                  unit="%" 
                  domain={[0, 100]}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  label={{ value: 'Close Probability (%)', position: 'insideBottom', offset: -10, fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="expansion_readiness_score" 
                  name="Readiness" 
                  domain={[0, 100]}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  label={{ value: 'Readiness Score', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="estimated_arr" range={[50, 400]} name="ARR" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg text-xs">
                          <p className="font-bold">{data.customer_id}</p>
                          <p>Readiness: {data.expansion_readiness_score}</p>
                          <p>Close Prob: {data.close_probability}%</p>
                          <p>ARR: ${(data.estimated_arr / 1000).toFixed(0)}K</p>
                          <p className="text-gray-300 mt-1">{data.stage}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  name="Opportunities" 
                  data={expansionOpportunitiesData.slice(0, 30)} 
                  fill="#8b5cf6"
                >
                  {expansionOpportunitiesData.slice(0, 30).map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.expansion_readiness_score >= 80 && entry.close_probability >= 60 ? '#10b981' :
                        entry.expansion_readiness_score >= 70 ? '#f59e0b' : '#ef4444'
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Hot (Ready)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600">Warm (Nurture)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Cold (Qualify)</span>
              </div>
            </div>
          </div>

          {/* Cross-Sell vs Upsell Breakdown */}
          <div
            className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            style={{ backgroundColor: '#F3F3F3' }}
            onClick={() => handleDrillDown('expansion-type-distribution', 2)}
          >
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-teal-600" />
              Expansion Type Distribution
              <span className="ml-auto text-xs text-blue-600 font-normal">Click for details →</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Cross-Sell', value: pipelineTrackingData[0].expansion_by_type.cross_sell.arr, fill: '#14b8a6' },
                    { name: 'Upsell', value: pipelineTrackingData[0].expansion_by_type.upsell.arr, fill: '#6366f1' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                </Pie>
                <Tooltip formatter={(value: any) => `$${(value / 1000000).toFixed(2)}M`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-teal-50 rounded-lg">
                <p className="text-xs text-teal-700 font-semibold">Cross-Sell ARR</p>
                <p className="text-xl font-bold text-teal-900">${(pipelineTrackingData[0].expansion_by_type.cross_sell.arr / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-teal-600 mt-1">{pipelineTrackingData[0].expansion_by_type.cross_sell.count} opportunities</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs text-indigo-700 font-semibold">Upsell ARR</p>
                <p className="text-xl font-bold text-indigo-900">${(pipelineTrackingData[0].expansion_by_type.upsell.arr / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-indigo-600 mt-1">{pipelineTrackingData[0].expansion_by_type.upsell.count} opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exception Alerts */}
        <div
          className="rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-lg transition-shadow"
          style={{ backgroundColor: '#F3F3F3' }}
          onClick={() => handleDrillDown('exception-alerts', 2)}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Exception Alerts
            <span className="ml-auto text-xs text-blue-600 font-normal">Click for details →</span>
          </h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => handleDrillDown(alert.type, 3)}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-500' : 
                    alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">${(alert.value / 1000000).toFixed(2)}M</p>
                  <p className="text-sm text-gray-600">{alert.count} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {isHelpOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300"
            onClick={() => setIsHelpOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Sales Expansion Overview</h2>
                    <p className="text-blue-100 text-sm">Complete guide and documentation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Content - iframe */}
              <div className="flex-1 overflow-hidden">
                <iframe
                  src="/se/overview"
                  className="w-full h-full border-0"
                  title="Sales Expansion Overview"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
