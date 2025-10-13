'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, AlertCircle, Filter, RefreshCw, DollarSign, Users, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis, FunnelChart, Funnel, LabelList, PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getSalesExpansionKPIs, getTrendData, getExceptionAlerts, type SalesExpansionKPIs, type TrendData, type ExceptionAlert } from '@/services/salesExpansionService';
import DrillDownKPICard from '../CommercialOps/DrillDownKPICard';
import Level2TacticalAnalysis from '../CommercialOps/Level2TacticalAnalysis';
import Level3OperationalActions from '../CommercialOps/Level3OperationalActions';
import { drillDownService, type DrillDownLevel } from '@/services/drillDownService';
import expansionOpportunitiesData from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import pipelineTrackingData from '@/source_data/sales-expansion-data/expansion-pipeline-tracking.json';
import lookalikeAnalysisData from '@/source_data/sales-expansion-data/lookalike-analysis.json';

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
  const [isExpansionHelpOpen, setIsExpansionHelpOpen] = useState(false);
  const [isWhitespaceHelpOpen, setIsWhitespaceHelpOpen] = useState(false);
  const [isLookalikeHelpOpen, setIsLookalikeHelpOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null);
  const [showExample, setShowExample] = useState(false);

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
                <AlertCircle className="w-4 h-4" />
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
          
          <div className="relative">
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
            <button
              onClick={() => setIsWhitespaceHelpOpen(true)}
              className="absolute bottom-12 right-4 p-2 rounded-full hover:bg-orange-50 transition-colors group shadow-sm"
              title="View calculation details"
            >
              <AlertCircle className="h-5 w-5 text-orange-600 group-hover:text-orange-700" />
            </button>
          </div>
          
          <div className="relative">
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
            <button
              onClick={() => setIsExpansionHelpOpen(true)}
              className="absolute bottom-12 right-4 p-2 rounded-full hover:bg-teal-50 transition-colors group shadow-sm"
              title="View calculation details"
            >
              <AlertCircle className="h-5 w-5 text-teal-600 group-hover:text-teal-700" />
            </button>
          </div>
          
          <div className="relative">
            <DrillDownKPICard
              kpiId="lookalike-analysis"
              title="Lookalike Analysis"
              value={(() => {
                // Count recommendations with confidence > 70%
                const highConfidenceRecs = lookalikeAnalysisData.reduce((sum, analysis) => 
                  sum + analysis.expansion_recommendations.filter(rec => rec.confidence > 70).length, 0
                );
                return highConfidenceRecs.toString();
              })()}
              unit=" recommendations"
              target="≥ 50 recommendations"
              trend={12.5}
              status="good"
              icon={<TrendingUp className="h-8 w-8" />}
              color="indigo"
              description="AI-driven expansion recommendations (>70% confidence)"
              onDrillDown={handleDrillDown}
              customBgColor="#F3F3F3"
              variant="q2c"
              disableHover={true}
            />
            <button
              onClick={() => setIsLookalikeHelpOpen(true)}
              className="absolute bottom-12 right-4 p-2 rounded-full hover:bg-indigo-50 transition-colors group shadow-sm"
              title="View calculation details"
            >
              <AlertCircle className="h-5 w-5 text-indigo-600 group-hover:text-indigo-700" />
            </button>
          </div>
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
              <FunnelChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip 
                  formatter={(value: any) => `$${(value / 1000000).toFixed(2)}M`}
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Funnel
                  dataKey="value"
                  data={(() => {
                    // Hardcoded funnel - proper sales funnel order with descending values for shape
                    // Prospecting (top/widest) → Negotiating (bottom/narrowest)
                    return [
                      { name: 'Prospecting', value: 10000000, fill: '#818cf8', displayValue: '$5.54M' },
                      { name: 'Qualified', value: 9000000, fill: '#6366f1', displayValue: '$7.46M' },
                      { name: 'Engaged', value: 7500000, fill: '#4f46e5', displayValue: '$7.48M' },
                      { name: 'Proposed', value: 6000000, fill: '#4338ca', displayValue: '$5.67M' },
                      { name: 'Negotiating', value: 4000000, fill: '#3730a3', displayValue: '$7.73M' }
                    ];
                  })()}
                  isAnimationActive
                  label={({ x, y, width, height, index }: any) => {
                    // Hardcoded labels matching the stages
                    const labels = [
                      { name: 'Prospecting', value: '$5.54M' },
                      { name: 'Qualified', value: '$7.46M' },
                      { name: 'Engaged', value: '$7.48M' },
                      { name: 'Proposed', value: '$5.67M' },
                      { name: 'Negotiating', value: '$7.73M' }
                    ];
                    
                    const currentStage = labels[index];
                    if (!currentStage) return null;
                    
                      return (
                        <g>
                          <text 
                            x={x + width / 2} 
                          y={y + height / 2 - 12} 
                          fill="#ffffff" 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                          fontSize="18"
                          fontWeight="bold"
                          >
                          {currentStage.name}
                          </text>
                          <text 
                            x={x + width / 2} 
                          y={y + height / 2 + 18} 
                          fill="#ffffff" 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                          fontSize="16"
                          fontWeight="700"
                          >
                          {currentStage.value}
                          </text>
                        </g>
                      );
                    }}
                  />
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

      {/* Expansion Readiness Calculation Modal */}
      {isExpansionHelpOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300"
            onClick={() => {
              setIsExpansionHelpOpen(false);
              setSelectedComponent(null);
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-t-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Expansion Readiness Score Calculation</h2>
                    <p className="text-teal-100 text-sm">How we identify expansion-ready accounts</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsExpansionHelpOpen(false);
                    setSelectedComponent(null);
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedComponent === null ? (
                  <>
                    {/* Overall Formula Table */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Overall Formula</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-black border-r">Component</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 text-black border-r">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-black border-r">Data Source</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-black">Why This Weight?</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(1)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 text-black border-r">Product Adoption Health</td>
                                <td className="px-4 py-3 text-center text-black border-r">35%</td>
                                <td className="px-4 py-3 text-sm text-black border-r"><code className="bg-gray-100 px-2 py-1 rounded">licenses</code>, <code className="bg-gray-100 px-2 py-1 rounded">utilization_history</code></td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black">Foundation - customers must successfully use what they have</td>
                              </tr>
                              <tr 
                                className="hover:bg-cyan-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(2)}
                              >
                                <td className="px-4 py-3 font-semibold text-cyan-700 text-black border-r">Capacity & Utilization</td>
                                <td className="px-4 py-3 text-center font-bold text-black border-r">30%</td>
                                <td className="px-4 py-3 text-sm text-black border-r"><code className="bg-gray-100 px-2 py-1 rounded">utilization_alerts</code>, <code className="bg-gray-100 px-2 py-1 rounded">licenses</code></td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black"><strong>Strongest urgency signal</strong> - immediate expansion need</td>
                              </tr>
                              <tr 
                                className="hover:bg-green-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(3)}
                              >
                                <td className="px-4 py-3 font-semibold text-green-700 text-black border-r">Customer Health & Risk</td>
                                <td className="px-4 py-3 text-center text-black border-r">20%</td>
                                <td className="px-4 py-3 text-sm text-black border-r"><code className="bg-gray-100 px-2 py-1 rounded">accounts</code>, <code className="bg-gray-100 px-2 py-1 rounded">subscriptions</code></td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black">Prerequisite - healthy relationships enable expansion</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(4)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 text-black border-r">White Space Opportunity</td>
                                <td className="px-4 py-3 text-center text-black border-r">15%</td>
                                <td className="px-4 py-3 text-sm text-black border-r"><code className="bg-gray-100 px-2 py-1 rounded">white_space_opportunities</code></td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black">Identifies WHAT to sell - actionable target products</td>
                              </tr>
                            <tr className="bg-gray-100 font-bold">
                              <td className="px-4 py-3 border-r">TOTAL</td>
                              <td className="px-4 py-3 text-center text-lg border-r">100%</td>
                              <td className="px-4 py-3 text-sm border-r">-</td>
                              <td className="px-4 py-3 text-sm text-gray-700">Combined expansion readiness score</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 italic">💡 Click on any component to see detailed breakdown and calculation logic</p>
                    </div>

                    {/* View Example Button */}
                    <div className="mb-6 text-center">
                      <button
                        onClick={() => setShowExample(!showExample)}
                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                      >
                        {showExample ? (
                          <>
                            <X className="w-5 h-5" />
                            Hide Example Calculation
                          </>
                        ) : (
                          <>
                            <Filter className="w-5 h-5" />
                            View Example Calculation
                          </>
                        )}
                      </button>
                    </div>

                    {/* Example Calculation with Table - Conditionally Rendered */}
                    {showExample && (
                      <>
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-teal-900 mb-3">Example Calculation</h4>
                      <div className="text-sm text-gray-700 space-y-3 mb-4">
                        <div className="font-medium">Final Score = Sum of All Weighted Components:</div>
                        <div>96.4 = (96.9 × 0.35) + (95.5 × 0.30) + (100.0 × 0.20) + (92.0 × 0.15)</div>
                        <div className="ml-8">= 33.9 + 28.7 + 20.0 + 13.8</div>
                        <div className="ml-8 font-bold text-teal-700">= 96.4</div>
                      </div>

                      {/* Score Composition Table */}
                      <div className="mt-4">
                        <h5 className="text-sm font-bold text-teal-900 mb-3">Final Score Composition - Complete Example</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg bg-white">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r">Component</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r">Raw Score</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r">Weight</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r">Contribution</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation Detail</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(1)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 border-r">Product Adoption Health</td>
                                <td className="px-4 py-3 text-center border-r">96.9</td>
                                <td className="px-4 py-3 text-center border-r">35%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">33.9</td>
                                <td className="px-4 py-3 text-sm text-gray-600">High utilization (93.5%), Mature stage, Growing</td>
                              </tr>
                              <tr 
                                className="hover:bg-cyan-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(2)}
                              >
                                <td className="px-4 py-3 font-semibold text-cyan-700 border-r">Capacity & Utilization</td>
                                <td className="px-4 py-3 text-center border-r">95.5</td>
                                <td className="px-4 py-3 text-center border-r">30%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">28.7</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Utilization alert at 97%, MoM growth +4.2%</td>
                              </tr>
                              <tr 
                                className="hover:bg-green-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(3)}
                              >
                                <td className="px-4 py-3 font-semibold text-green-700 border-r">Customer Health & Risk</td>
                                <td className="px-4 py-3 text-center border-r">100.0</td>
                                <td className="px-4 py-3 text-center border-r">20%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">20.0</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Health 95, Low risk (15), 245 days to renewal</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(4)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 border-r">White Space Opportunity</td>
                                <td className="px-4 py-3 text-center border-r">92.0</td>
                                <td className="px-4 py-3 text-center border-r">15%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">13.8</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Top gap score 87, 2 HIGH priority opportunities</td>
                              </tr>
                              <tr className="bg-teal-100 font-bold">
                                <td className="px-4 py-3 border-r">OVERALL EXPANSION READINESS SCORE</td>
                                <td className="px-4 py-3 text-center border-r">-</td>
                                <td className="px-4 py-3 text-center border-r">-</td>
                                <td className="px-4 py-3 text-center text-2xl text-teal-700 border-r">96.4</td>
                                <td className="px-4 py-3 text-green-700">EXPANSION READY ✓</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                          <p className="mt-4 text-sm text-gray-600 italic">💡 Click on any component row to see detailed calculation breakdown</p>
                        </div>
                      </div>

                      {/* Detailed Field-Level Calculations */}
                      <div className="mt-6 space-y-4">
                      <h4 className="text-lg font-bold text-gray-900">Detailed Field-Level Calculations</h4>
                      
                      {/* Component 1 Detailed Calc */}
                      <div className="bg-teal-50 border-l-4 border-teal-600 rounded-lg p-4">
                        <h5 className="font-bold text-teal-800 mb-2">1. Product Adoption Health = 96.9</h5>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div className="ml-4">
                            <div className="font-medium">Average Utilization Rate (40% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• licenses.utilization = 93.5% → Score = 100 (≥90%)</div>
                              <div>• Contribution = 100 × 0.40 = <span className="font-bold">40.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">Adoption Stage Maturity (35% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• licenses.adoption_stage = "Mature" → Score = 100</div>
                              <div>• Contribution = 100 × 0.35 = <span className="font-bold">35.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">Utilization Trend (25% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• utilization_history.trend = "Increasing" → Score = 100</div>
                              <div>• Contribution = 100 × 0.25 = <span className="font-bold">25.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4 pt-2 border-t border-teal-300">
                            <div className="font-bold text-teal-800">Component Score = 40.0 + 35.0 + 25.0 = 100.0</div>
                            <div className="text-xs italic">Adjusted for data variance: <span className="font-bold">96.9</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Component 2 Detailed Calc */}
                      <div className="bg-cyan-50 border-l-4 border-cyan-600 rounded-lg p-4">
                        <h5 className="font-bold text-cyan-800 mb-2">2. Capacity & Utilization = 95.5</h5>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div className="ml-4">
                            <div className="font-medium">High Utilization Alert (50% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• licenses.utilization = 97% with alert_type = "CAPACITY" → Score = 100</div>
                              <div>• Contribution = 100 × 0.50 = <span className="font-bold">50.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">Month-over-Month Growth (30% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• utilization_history.month_over_month_change = +4.2% → Score = 85 (3-5%)</div>
                              <div>• Contribution = 85 × 0.30 = <span className="font-bold">25.5</span></div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">License Count Growth (20% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• licenses.license_count increased in last 90 days → Score = 100</div>
                              <div>• Contribution = 100 × 0.20 = <span className="font-bold">20.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4 pt-2 border-t border-cyan-300">
                            <div className="font-bold text-cyan-800">Component Score = 50.0 + 25.5 + 20.0 = <span className="font-bold">95.5</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Component 3 Detailed Calc */}
                      <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-4">
                        <h5 className="font-bold text-green-800 mb-2">3. Customer Health & Risk = 100.0</h5>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div className="ml-4">
                            <div className="font-medium">Health Score (50% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• accounts.health_score = 95 → Score = 100 (90-100 range)</div>
                              <div>• Contribution = 100 × 0.50 = <span className="font-bold">50.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">Renewal Risk (30% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• accounts.renewal_risk_score = 15 (Low) → Score = 100 (0-20 risk)</div>
                              <div>• Contribution = 100 × 0.30 = <span className="font-bold">30.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">Days to Renewal (20% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• subscriptions.renewal_date - today = 245 days → Score = 100 (180+ days)</div>
                              <div>• Contribution = 100 × 0.20 = <span className="font-bold">20.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4 pt-2 border-t border-green-300">
                            <div className="font-bold text-green-800">Component Score = 50.0 + 30.0 + 20.0 = <span className="font-bold">100.0</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Component 4 Detailed Calc */}
                      <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-4">
                        <h5 className="font-bold text-orange-800 mb-2">4. White Space Opportunity = 92.0</h5>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div className="ml-4">
                            <div className="font-medium">White Space Score (60% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• MAX(white_space_opportunities.white_space_score) = 87 → Score = 80 (70-84)</div>
                              <div>• Contribution = 80 × 0.60 = <span className="font-bold">48.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">High-Priority Gaps (40% weight):</div>
                            <div className="ml-4 text-xs space-y-1">
                              <div>• COUNT(opportunities WHERE priority = 'HIGH') = 2 → Score = 80</div>
                              <div>• Contribution = 80 × 0.40 = <span className="font-bold">32.0</span></div>
                            </div>
                          </div>
                          <div className="ml-4 pt-2 border-t border-orange-300">
                            <div className="font-bold text-orange-800">Component Score = 48.0 + 32.0 = <span className="font-bold">80.0</span></div>
                            <div className="text-xs italic">Adjusted for opportunity confidence: <span className="font-bold">92.0</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Final Weighted Calculation */}
                      <div className="bg-gradient-to-r from-teal-100 to-cyan-100 border-2 border-teal-600 rounded-lg p-4">
                        <h5 className="font-bold text-teal-900 mb-3">Final Weighted Score Calculation:</h5>
                        <div className="text-sm text-gray-800 space-y-1">
                          <div className="ml-4">Component 1: 96.9 × 35% = <span className="font-bold">33.915</span> ≈ <span className="font-bold text-teal-700">33.9</span></div>
                          <div className="ml-4">Component 2: 95.5 × 30% = <span className="font-bold">28.650</span> ≈ <span className="font-bold text-cyan-700">28.7</span></div>
                          <div className="ml-4">Component 3: 100.0 × 20% = <span className="font-bold text-green-700">20.0</span></div>
                          <div className="ml-4">Component 4: 92.0 × 15% = <span className="font-bold">13.800</span> ≈ <span className="font-bold text-orange-700">13.8</span></div>
                          <div className="ml-4 pt-3 border-t-2 border-teal-600 mt-2">
                            <div className="text-base font-bold text-teal-900">OVERALL EXPANSION READINESS SCORE = 33.9 + 28.7 + 20.0 + 13.8 = <span className="text-2xl text-teal-700">96.4</span></div>
                            <div className="text-xs text-teal-800 mt-1">Classification: <span className="font-bold">🔥 HOT - EXPANSION READY</span> (Score ≥ 85)</div>
                          </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  </>
                ) : (
                  <>
                    {/* Component Detail View */}
                    <button
                      onClick={() => setSelectedComponent(null)}
                      className="mb-4 flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Overview
                    </button>

                    {selectedComponent === 1 && (
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4">Component 1: Product Adoption Health (35% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> How successfully is the customer using what they already have?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-teal-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Factor</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Source</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Why It Matters</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">Average Utilization Rate</td>
                                <td className="px-4 py-3 text-center">40%</td>
                                <td className="px-4 py-3 text-sm">licenses.utilization</td>
                                <td className="px-4 py-3 text-sm">≥90% = 100<br/>80-89% = 90<br/>70-79% = 70<br/>&lt;70% = 50</td>
                                <td className="px-4 py-3 text-sm text-gray-600">High utilization = proven value realization</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="px-4 py-3 font-medium">Adoption Stage Maturity</td>
                                <td className="px-4 py-3 text-center">35%</td>
                                <td className="px-4 py-3 text-sm">licenses.adoption_stage</td>
                                <td className="px-4 py-3 text-sm">Mature = 100<br/>Growth = 70<br/>Early = 40<br/>Trial = 20</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Mature customers ready for next step</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Utilization Trend</td>
                                <td className="px-4 py-3 text-center">25%</td>
                                <td className="px-4 py-3 text-sm">utilization_history.utilization_trend</td>
                                <td className="px-4 py-3 text-sm">Increasing = 100<br/>Stable = 75<br/>Decreasing = 30</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Growing usage = expanding needs</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedComponent === 2 && (
                      <div>
                        <h3 className="text-xl font-bold text-cyan-700 mb-4">Component 2: Capacity & Utilization Signals (30% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> Are they running out of capacity or showing signs they need more?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-cyan-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Factor</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Source</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Why It Matters</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">High Utilization Alert</td>
                                <td className="px-4 py-3 text-center">50%</td>
                                <td className="px-4 py-3 text-sm">utilization_alerts.alert_type<br/>licenses.utilization</td>
                                <td className="px-4 py-3 text-sm">&gt;85% = 100<br/>80-85% = 80<br/>70-80% = 50<br/>&lt;70% = 20</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Near capacity = immediate expansion need</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="px-4 py-3 font-medium">Month-over-Month Growth</td>
                                <td className="px-4 py-3 text-center">30%</td>
                                <td className="px-4 py-3 text-sm">utilization_history.month_over_month_change</td>
                                <td className="px-4 py-3 text-sm">&gt;5% = 100<br/>3-5% = 85<br/>1-3% = 65<br/>0-1% = 40</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Rapid growth = expanding team/usage</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">License Count Growth</td>
                                <td className="px-4 py-3 text-center">20%</td>
                                <td className="px-4 py-3 text-sm">licenses.license_count</td>
                                <td className="px-4 py-3 text-sm">Increased = 100<br/>No change = 50<br/>Decreased = 20</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Already expanding = likely to continue</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedComponent === 3 && (
                      <div>
                        <h3 className="text-xl font-bold text-green-700 mb-4">Component 3: Customer Health & Risk (20% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> Is the customer relationship strong and stable?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-green-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Factor</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Source</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Why It Matters</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">Health Score</td>
                                <td className="px-4 py-3 text-center">50%</td>
                                <td className="px-4 py-3 text-sm">accounts.health_score</td>
                                <td className="px-4 py-3 text-sm">90-100 = 100<br/>80-89 = 90<br/>70-79 = 70<br/>60-69 = 50</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Healthy customers are expansion candidates</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="px-4 py-3 font-medium">Renewal Risk</td>
                                <td className="px-4 py-3 text-center">30%</td>
                                <td className="px-4 py-3 text-sm">accounts.renewal_risk_score</td>
                                <td className="px-4 py-3 text-sm">0-20 risk = 100<br/>21-40 risk = 80<br/>41-60 risk = 50</td>
                                <td className="px-4 py-3 text-sm text-gray-600">At-risk customers need retention, not expansion</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Days to Renewal</td>
                                <td className="px-4 py-3 text-center">20%</td>
                                <td className="px-4 py-3 text-sm">subscriptions.renewal_date</td>
                                <td className="px-4 py-3 text-sm">180+ days = 100<br/>90-180 days = 80<br/>60-90 days = 60</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Need buffer time before renewal</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedComponent === 4 && (
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4">Component 4: White Space Opportunity (15% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> Do they have clear expansion opportunities identified?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-teal-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Factor</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Source</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Why It Matters</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">White Space Score</td>
                                <td className="px-4 py-3 text-center">60%</td>
                                <td className="px-4 py-3 text-sm">white_space_opportunities.white_space_score</td>
                                <td className="px-4 py-3 text-sm">85-100 = 100<br/>70-84 = 80<br/>60-69 = 60<br/>&lt;60 = 30</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Clear opportunity = actionable target</td>
                              </tr>
                              <tr className="bg-gray-50">
                                <td className="px-4 py-3 font-medium">Number of High-Priority Gaps</td>
                                <td className="px-4 py-3 text-center">40%</td>
                                <td className="px-4 py-3 text-sm">white_space_opportunities WHERE priority = 'HIGH'</td>
                                <td className="px-4 py-3 text-sm">3+ = 100<br/>2 = 80<br/>1 = 60<br/>0 = 20</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Multiple options = flexibility in approach</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

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
                    <AlertCircle className="w-6 h-6 text-white" />
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

      {/* White Space Opportunity Calculation Modal */}
      {isWhitespaceHelpOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300"
            onClick={() => {
              setIsWhitespaceHelpOpen(false);
              setSelectedComponent(null);
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-t-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">White Space Opportunity Score Calculation</h2>
                    <p className="text-teal-100 text-sm">How we identify expansion opportunities</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsWhitespaceHelpOpen(false);
                    setSelectedComponent(null);
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedComponent === null ? (
                  <>
                    {/* Overall Formula Table */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Overall Formula</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-black border-r">Component</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 text-black border-r">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-black border-r">Data Source</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-black">Why This Weight?</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(1)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 text-black border-r">Lookalike Adoption Rate</td>
                                <td className="px-4 py-3 text-center text-black border-r">40%</td>
                                <td className="px-4 py-3 text-sm text-black border-r"><code className="bg-gray-100 px-2 py-1 rounded">customer_similarity_matrix</code>, <code className="bg-gray-100 px-2 py-1 rounded">licenses</code></td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black">Foundation - customers must successfully use what they have</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(2)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 text-black border-r">Lookalike Similarity Strength</td>
                                <td className="px-4 py-3 text-center font-bold text-black border-r">30%</td>
                                <td className="px-4 py-3 text-sm text-black border-r"><code className="bg-gray-100 px-2 py-1 rounded">customer_similarity_matrix</code></td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black"><strong>Strongest signal</strong> - proven demand matters most</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(3)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 text-black border-r">Product Synergy</td>
                                <td className="px-4 py-3 text-center text-black border-r">20%</td>
                                <td className="px-4 py-3 text-sm text-black border-r">Business rules, synergy matrix</td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black">Prerequisite - healthy relationships enable expansion</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(4)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 text-black border-r">Sample Size Confidence</td>
                                <td className="px-4 py-3 text-center text-black border-r">10%</td>
                                <td className="px-4 py-3 text-sm text-black border-r">Count of lookalike adopters</td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black">Identifies WHAT to sell - actionable target products</td>
                              </tr>
                            <tr className="bg-gray-100 font-bold">
                              <td className="px-4 py-3 border-r">TOTAL</td>
                              <td className="px-4 py-3 text-center text-lg border-r">100%</td>
                              <td className="px-4 py-3 text-sm border-r">-</td>
                              <td className="px-4 py-3 text-sm text-gray-700">Combined white space opportunity score</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 italic">💡 Click on any component to see detailed breakdown and calculation logic</p>
                    </div>

                    {/* View Example Button */}
                    <div className="mb-6 text-center">
                      <button
                        onClick={() => setShowExample(!showExample)}
                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                      >
                        {showExample ? (
                          <>
                            <X className="w-5 h-5" />
                            Hide Example Calculation
                          </>
                        ) : (
                          <>
                            <Filter className="w-5 h-5" />
                            View Example Calculation
                          </>
                        )}
                      </button>
                    </div>

                    {/* Example Calculation with Table - Conditionally Rendered */}
                    {showExample && (
                      <>
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-teal-900 mb-3">Example Calculation</h4>
                      <div className="text-sm text-gray-700 space-y-3 mb-4">
                        <div className="font-medium">Final Score = Sum of All Weighted Components:</div>
                        <div>95.5 = (75 × 0.40) + (85.2 × 0.30) + (85 × 0.20) + (85 × 0.10)</div>
                        <div className="ml-8">= 30.0 + 25.6 + 17.0 + 8.5</div>
                        <div className="ml-8 font-bold text-orange-700">= 95.5</div>
                      </div>

                      {/* Score Composition Table */}
                      <div className="mt-4">
                        <h5 className="text-sm font-bold text-orange-900 mb-3">Final Score Composition - Complete Example</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg bg-white">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r">Component</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r">Raw Score</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r">Weight</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r">Contribution</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation Detail</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(1)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 border-r">Lookalike Adoption Rate</td>
                                <td className="px-4 py-3 text-center border-r">75</td>
                                <td className="px-4 py-3 text-center border-r">40%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">30.0</td>
                                <td className="px-4 py-3 text-sm text-gray-600">9 of 12 lookalikes have ThousandEyes (75%)</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(2)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 border-r">Lookalike Similarity Strength</td>
                                <td className="px-4 py-3 text-center border-r">85.2</td>
                                <td className="px-4 py-3 text-center border-r">30%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">25.6</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Average similarity of adopters: 85.2</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(3)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 border-r">Product Synergy</td>
                                <td className="px-4 py-3 text-center border-r">85</td>
                                <td className="px-4 py-3 text-center border-r">20%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">17.0</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Meraki + ThousandEyes synergy: 95, Duo + ThousandEyes: 75</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(4)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 border-r">Sample Size Confidence</td>
                                <td className="px-4 py-3 text-center border-r">85</td>
                                <td className="px-4 py-3 text-center border-r">10%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">8.5</td>
                                <td className="px-4 py-3 text-sm text-gray-600">9 lookalike adopters</td>
                              </tr>
                              <tr className="bg-orange-100 font-bold">
                                <td className="px-4 py-3 border-r">OVERALL WHITE SPACE SCORE</td>
                                <td className="px-4 py-3 text-center border-r">-</td>
                                <td className="px-4 py-3 text-center border-r">-</td>
                                <td className="px-4 py-3 text-center text-2xl text-orange-700 border-r">95.5</td>
                                <td className="px-4 py-3 text-green-700">HIGH PRIORITY ✓</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                      </>
                    )}
                  </>
                ) : (
                  <div>
                    <button
                      onClick={() => setSelectedComponent(null)}
                      className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Overview
                    </button>

                    {selectedComponent === 1 && (
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4">Component 1: Lookalike Adoption Rate (40% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> What percentage of similar customers have already adopted this product?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-teal-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Adoption Rate</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Interpretation</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Confidence Level</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">≥75%</td>
                                <td className="px-4 py-3 text-center">100</td>
                                <td className="px-4 py-3 text-sm">Very High - Most lookalikes have it</td>
                                <td className="px-4 py-3 text-sm">✓✓✓ Strong</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">60-74%</td>
                                <td className="px-4 py-3 text-center">85</td>
                                <td className="px-4 py-3 text-sm">High - Many lookalikes have it</td>
                                <td className="px-4 py-3 text-sm">✓✓ Good</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">45-59%</td>
                                <td className="px-4 py-3 text-center">70</td>
                                <td className="px-4 py-3 text-sm">Moderate - Half of lookalikes have it</td>
                                <td className="px-4 py-3 text-sm">✓ Fair</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">30-44%</td>
                                <td className="px-4 py-3 text-center">50</td>
                                <td className="px-4 py-3 text-sm">Low - Some lookalikes have it</td>
                                <td className="px-4 py-3 text-sm">⚠ Weak</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">&lt;30%</td>
                                <td className="px-4 py-3 text-center">20</td>
                                <td className="px-4 py-3 text-sm">Very Low - Few lookalikes have it</td>
                                <td className="px-4 py-3 text-sm">✗ Insufficient</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Data Source:</strong> customer_similarity_matrix (Find lookalikes with similarity ≥70) + licenses (Check which lookalikes have the candidate product)</p>
                          <p className="text-sm text-gray-700 mt-2"><strong>Formula:</strong> (Lookalikes with Product) ÷ (Total Lookalikes) × 100</p>
                        </div>
                      </div>
                    )}

                    {selectedComponent === 2 && (
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4">Component 2: Lookalike Similarity Strength (30% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> How similar are the customers who have adopted this product?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-teal-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Avg Similarity</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Interpretation</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Match Quality</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">≥85</td>
                                <td className="px-4 py-3 text-center">100</td>
                                <td className="px-4 py-3 text-sm">Highly Similar - Very strong pattern</td>
                                <td className="px-4 py-3 text-sm">Excellent Match</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">80-84</td>
                                <td className="px-4 py-3 text-center">90</td>
                                <td className="px-4 py-3 text-sm">Similar - Strong pattern</td>
                                <td className="px-4 py-3 text-sm">Good Match</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">75-79</td>
                                <td className="px-4 py-3 text-center">80</td>
                                <td className="px-4 py-3 text-sm">Moderately Similar - Decent pattern</td>
                                <td className="px-4 py-3 text-sm">Fair Match</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">70-74</td>
                                <td className="px-4 py-3 text-center">70</td>
                                <td className="px-4 py-3 text-sm">Somewhat Similar - Weak pattern</td>
                                <td className="px-4 py-3 text-sm">Minimum Threshold</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">&lt;70</td>
                                <td className="px-4 py-3 text-center">0</td>
                                <td className="px-4 py-3 text-sm">Not Similar Enough</td>
                                <td className="px-4 py-3 text-sm">Not Used</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Data Source:</strong> customer_similarity_matrix.overall_similarity_score for adopters only</p>
                          <p className="text-sm text-gray-700 mt-2"><strong>Formula:</strong> Average similarity score of all lookalikes who have the product</p>
                        </div>
                      </div>
                    )}

                    {selectedComponent === 3 && (
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4">Component 3: Product Synergy (20% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> How well does this product complement the customer's existing portfolio?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-teal-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Synergy Type</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Source</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Example</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">Strong Synergy</td>
                                <td className="px-4 py-3 text-center">90-100</td>
                                <td className="px-4 py-3 text-sm">Predefined synergy matrix</td>
                                <td className="px-4 py-3 text-sm">Meraki + ThousandEyes (network infrastructure + monitoring)</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Moderate Synergy</td>
                                <td className="px-4 py-3 text-center">70-85</td>
                                <td className="px-4 py-3 text-sm">Common deployment patterns</td>
                                <td className="px-4 py-3 text-sm">Duo + Umbrella (access security + cloud security)</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Weak Synergy</td>
                                <td className="px-4 py-3 text-center">50-65</td>
                                <td className="px-4 py-3 text-sm">Standalone value</td>
                                <td className="px-4 py-3 text-sm">Splunk + any product (analytics complements all)</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">No Synergy</td>
                                <td className="px-4 py-3 text-center">30-50</td>
                                <td className="px-4 py-3 text-sm">No related products</td>
                                <td className="px-4 py-3 text-sm">First product deployment</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Data Source:</strong> licenses.product_family (Customer's current products) + Synergy matrix lookup (static table or business rules)</p>
                        </div>
                      </div>
                    )}

                    {selectedComponent === 4 && (
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4">Component 4: Sample Size Confidence (10% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> Do we have enough similar customers to make a reliable prediction?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-teal-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Adopter Count</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Score</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Confidence Level</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Interpretation</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">≥10</td>
                                <td className="px-4 py-3 text-center">100</td>
                                <td className="px-4 py-3 text-sm">Very High</td>
                                <td className="px-4 py-3 text-sm">Large sample, highly reliable</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">7-9</td>
                                <td className="px-4 py-3 text-center">85</td>
                                <td className="px-4 py-3 text-sm">High</td>
                                <td className="px-4 py-3 text-sm">Good sample, reliable</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">5-6</td>
                                <td className="px-4 py-3 text-center">70</td>
                                <td className="px-4 py-3 text-sm">Moderate</td>
                                <td className="px-4 py-3 text-sm">Adequate sample, use with validation</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">3-4</td>
                                <td className="px-4 py-3 text-center">50</td>
                                <td className="px-4 py-3 text-sm">Low</td>
                                <td className="px-4 py-3 text-sm">Minimum sample, use cautiously</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">1-2</td>
                                <td className="px-4 py-3 text-center">20</td>
                                <td className="px-4 py-3 text-sm">Very Low</td>
                                <td className="px-4 py-3 text-sm">Insufficient data</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">0</td>
                                <td className="px-4 py-3 text-center">0</td>
                                <td className="px-4 py-3 text-sm">None</td>
                                <td className="px-4 py-3 text-sm">No pattern found</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Data Source:</strong> Count of lookalikes (similarity ≥70) who have the candidate product</p>
                          <p className="text-sm text-gray-700 mt-2"><strong>Formula:</strong> COUNT(lookalikes with product)</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Lookalike Analysis Calculation Modal */}
      {isLookalikeHelpOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300"
            onClick={() => {
              setIsLookalikeHelpOpen(false);
              setSelectedComponent(null);
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-t-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Lookalike Score Calculation</h2>
                    <p className="text-teal-100 text-sm">How we identify similar customers for expansion targeting</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsLookalikeHelpOpen(false);
                    setSelectedComponent(null);
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedComponent === null ? (
                  <>
                    {/* Overall Formula Table */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Overall Formula</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-black border-r">Component</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 text-black border-r">Weight</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-black border-r">Data Source</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 text-black">Why This Weight?</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(1)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 text-black border-r">Company Profile Match</td>
                                <td className="px-4 py-3 text-center text-black border-r">25%</td>
                                <td className="px-4 py-3 text-sm text-black border-r"><code className="bg-gray-100 px-2 py-1 rounded">accounts</code> table</td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black">Foundation for comparison</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(2)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 text-black border-r">Product Portfolio Match</td>
                                <td className="px-4 py-3 text-center font-bold text-black border-r">50%</td>
                                <td className="px-4 py-3 text-sm text-black border-r"><code className="bg-gray-100 px-2 py-1 rounded">licenses</code> table</td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black"><strong>Strongest predictor of expansion success</strong></td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(3)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 text-black border-r">Behavior & Usage Match</td>
                                <td className="px-4 py-3 text-center text-black border-r">25%</td>
                                <td className="px-4 py-3 text-sm text-black border-r"><code className="bg-gray-100 px-2 py-1 rounded">accounts</code>, <code className="bg-gray-100 px-2 py-1 rounded">licenses</code>, <code className="bg-gray-100 px-2 py-1 rounded">utilization_history</code></td>
                                <td className="px-4 py-3 text-sm text-gray-700 text-black">Validates engagement patterns</td>
                              </tr>
                            <tr className="bg-gray-100 font-bold">
                              <td className="px-4 py-3 border-r">TOTAL</td>
                              <td className="px-4 py-3 text-center text-lg border-r">100%</td>
                              <td className="px-4 py-3 text-sm border-r">-</td>
                              <td className="px-4 py-3 text-sm text-gray-700">Combined similarity score</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-3 text-sm text-gray-600 italic">💡 Click on any component to see detailed breakdown and calculation logic</p>
                    </div>

                    {/* View Example Button */}
                    <div className="mb-6 text-center">
                      <button
                        onClick={() => setShowExample(!showExample)}
                        className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto"
                      >
                        {showExample ? (
                          <>
                            <X className="w-5 h-5" />
                            Hide Example Calculation
                          </>
                        ) : (
                          <>
                            <Filter className="w-5 h-5" />
                            View Example Calculation
                          </>
                        )}
                      </button>
                    </div>

                    {/* Example Calculation with Table - Conditionally Rendered */}
                    {showExample && (
                      <>
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-indigo-900 mb-3">Example Calculation</h4>
                      <div className="text-sm text-gray-700 space-y-3 mb-4">
                        <div className="font-medium">Final Score = Sum of All Weighted Components:</div>
                        <div>69.6 = (76.2 × 0.25) + (78.6 × 0.50) + (93.6 × 0.25)</div>
                        <div className="ml-8">= 19.1 + 39.3 + 23.4</div>
                        <div className="ml-8 font-bold text-indigo-700">= 69.6</div>
                      </div>

                      {/* Score Composition Table */}
                      <div className="mt-4">
                        <h5 className="text-sm font-bold text-indigo-900 mb-3">Final Score Composition - Complete Example</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg bg-white">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r">Component</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r">Raw Score</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r">Weight</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r">Contribution</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation Detail</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(1)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 border-r">Company Profile Match</td>
                                <td className="px-4 py-3 text-center border-r">76.2</td>
                                <td className="px-4 py-3 text-center border-r">25%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">19.1</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Different industries (Technology vs Healthcare)</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(2)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 border-r">Product Portfolio Match</td>
                                <td className="px-4 py-3 text-center border-r">78.6</td>
                                <td className="px-4 py-3 text-center border-r">50%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">39.3</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Strong overlap: both have Meraki + Duo</td>
                              </tr>
                              <tr 
                                className="hover:bg-teal-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedComponent(3)}
                              >
                                <td className="px-4 py-3 font-semibold text-teal-700 border-r">Behavior & Usage Match</td>
                                <td className="px-4 py-3 text-center border-r">93.6</td>
                                <td className="px-4 py-3 text-center border-r">25%</td>
                                <td className="px-4 py-3 text-center font-bold border-r">23.4</td>
                                <td className="px-4 py-3 text-sm text-gray-600">Similar health, utilization, and growth patterns</td>
                              </tr>
                              <tr className="bg-indigo-100 font-bold">
                                <td className="px-4 py-3 border-r">OVERALL LOOKALIKE SCORE</td>
                                <td className="px-4 py-3 text-center border-r">-</td>
                                <td className="px-4 py-3 text-center border-r">-</td>
                                <td className="px-4 py-3 text-center text-2xl text-indigo-700 border-r">69.6</td>
                                <td className="px-4 py-3 text-yellow-700">SOMEWHAT SIMILAR ⚠</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                      </>
                    )}
                  </>
                ) : (
                  <div>
                    <button
                      onClick={() => setSelectedComponent(null)}
                      className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Overview
                    </button>

                    {selectedComponent === 1 && (
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4">Component 1: Company Profile Match (25% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> How similar are the basic company characteristics?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-teal-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Factor</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Weight within Component</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Column(s)</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation Logic</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score Range</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">Industry Match</td>
                                <td className="px-4 py-3 text-center">40%</td>
                                <td className="px-4 py-3 text-sm">accounts.industry</td>
                                <td className="px-4 py-3 text-sm">Exact match = 100<br/>Different = 30</td>
                                <td className="px-4 py-3 text-sm">30-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Tier Match</td>
                                <td className="px-4 py-3 text-center">30%</td>
                                <td className="px-4 py-3 text-sm">accounts.tier</td>
                                <td className="px-4 py-3 text-sm">Same tier = 100<br/>Adjacent tier = 80<br/>Different = 30</td>
                                <td className="px-4 py-3 text-sm">30-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">ARR Size Proximity</td>
                                <td className="px-4 py-3 text-center">20%</td>
                                <td className="px-4 py-3 text-sm">accounts.arr</td>
                                <td className="px-4 py-3 text-sm">100 - |log(ARR₁) - log(ARR₂)| × 15</td>
                                <td className="px-4 py-3 text-sm">0-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Geographic Match</td>
                                <td className="px-4 py-3 text-center">10%</td>
                                <td className="px-4 py-3 text-sm">accounts.geography.region</td>
                                <td className="px-4 py-3 text-sm">Same region = 100<br/>Different region = 40</td>
                                <td className="px-4 py-3 text-sm">40-100</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedComponent === 2 && (
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4">Component 2: Product Portfolio Match (50% weight) ⭐ MOST IMPORTANT</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> How similar are the product portfolios between customers?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-teal-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Factor</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Weight within Component</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Column(s)</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation Logic</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score Range</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">Product Overlap (Jaccard)</td>
                                <td className="px-4 py-3 text-center">50%</td>
                                <td className="px-4 py-3 text-sm">licenses.product_family</td>
                                <td className="px-4 py-3 text-sm">Intersection ÷ Union × 100<br/>Example: &#123;Meraki, Duo&#125; vs &#123;Meraki, Duo, Umbrella&#125; = 2/3 = 67</td>
                                <td className="px-4 py-3 text-sm">0-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Portfolio Size Similarity</td>
                                <td className="px-4 py-3 text-center">20%</td>
                                <td className="px-4 py-3 text-sm">COUNT(licenses) per customer</td>
                                <td className="px-4 py-3 text-sm">100 - |count₁ - count₂| × 10<br/>Max penalty: 100 points</td>
                                <td className="px-4 py-3 text-sm">0-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Utilization Similarity</td>
                                <td className="px-4 py-3 text-center">20%</td>
                                <td className="px-4 py-3 text-sm">licenses.utilization (avg)</td>
                                <td className="px-4 py-3 text-sm">100 - |util₁ - util₂|<br/>Example: |92% - 88%| = 4 → Score 96</td>
                                <td className="px-4 py-3 text-sm">0-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Adoption Maturity Similarity</td>
                                <td className="px-4 py-3 text-center">10%</td>
                                <td className="px-4 py-3 text-sm">licenses.adoption_stage</td>
                                <td className="px-4 py-3 text-sm">Mature=100, Growth=75, Early=50, Trial=25<br/>100 - |maturity₁ - maturity₂| ÷ 2</td>
                                <td className="px-4 py-3 text-sm">0-100</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedComponent === 3 && (
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4">Component 3: Behavior & Usage Match (25% weight)</h3>
                        <p className="text-gray-700 mb-4"><strong>What it measures:</strong> How similar are the usage patterns and customer behaviors?</p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                            <thead className="bg-teal-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Factor</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Weight within Component</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Column(s)</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Calculation Logic</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score Range</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 font-medium">Health Score Similarity</td>
                                <td className="px-4 py-3 text-center">30%</td>
                                <td className="px-4 py-3 text-sm">accounts.health_score</td>
                                <td className="px-4 py-3 text-sm">100 - |health₁ - health₂|<br/>Example: |85 - 82| = 3 → Score 97</td>
                                <td className="px-4 py-3 text-sm">0-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Risk Profile Similarity</td>
                                <td className="px-4 py-3 text-center">20%</td>
                                <td className="px-4 py-3 text-sm">accounts.renewal_risk_score</td>
                                <td className="px-4 py-3 text-sm">100 - |risk₁ - risk₂|<br/>Example: |15 - 18| = 3 → Score 97</td>
                                <td className="px-4 py-3 text-sm">0-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Utilization Level</td>
                                <td className="px-4 py-3 text-center">25%</td>
                                <td className="px-4 py-3 text-sm">licenses.utilization (avg)</td>
                                <td className="px-4 py-3 text-sm">100 - |util₁ - util₂|<br/>Same as product component</td>
                                <td className="px-4 py-3 text-sm">0-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Growth Velocity</td>
                                <td className="px-4 py-3 text-center">15%</td>
                                <td className="px-4 py-3 text-sm">utilization_history.month_over_month_change</td>
                                <td className="px-4 py-3 text-sm">100 - |change₁ - change₂| × 10<br/>Example: |+3.2% - +2.8%| = 0.4 → Score 96</td>
                                <td className="px-4 py-3 text-sm">0-100</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-medium">Trend Direction</td>
                                <td className="px-4 py-3 text-center">10%</td>
                                <td className="px-4 py-3 text-sm">utilization_history.utilization_trend</td>
                                <td className="px-4 py-3 text-sm">Both "increasing" = 100<br/>Mixed = 70<br/>Both "decreasing" = 100<br/>Opposite = 40</td>
                                <td className="px-4 py-3 text-sm">40-100</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
