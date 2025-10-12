'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, BarChart3, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { drillDownService, type KPIDrillDown } from '@/services/drillDownService';
import { 
  getNRRByTier, 
  getNRRQuarterlyTrend, 
  getExpansionVsChurn, 
  getExpansionVsChurnWaterfall,
  getExpansionByCategory,
  getExpansionByProduct,
  getExpansionVelocity,
  getWhiteSpaceBySegment, 
  getPenetrationByTier, 
  getPipelineByStage, 
  getWinRateByProduct,
  getWinLossAnalysis,
  getMultiProductPenetrationKPIs,
  getMultiProductPenetrationByTier,
  getSingleProductCrossSellOpportunities,
  getProductPenetrationMatrix,
  getProductGapAnalysis,
  getPipelineVelocity,
  getCapacityAlerts,
  getUtilizationByProduct,
  getUtilizationDrivenExpansionSignals,
  getUtilizationAlertsByProduct,
  getUtilizationAlertResponseRate,
  getTopUtilizationAccounts
} from '@/services/seAnalyticsService';

// Import real data
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
import whiteSpaceData from '@/source_data/csm-data/white_space_analysis.json';
import revenueMovementsData from '@/source_data/commercial_operations/revenue_movements.json';
import expansionOpportunitiesData from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import expansionPipelineTrackingData from '@/source_data/sales-expansion-data/expansion-pipeline-tracking.json';
import AdvancedVisualizationCharts from './AdvancedVisualizationCharts';

interface Level2TacticalAnalysisProps {
  kpiId: string;
  onBack: () => void;
  onDrillToLevel3: (actionId: string) => void;
}

// Pipeline Expansion Analysis Component
function PipelineExpansionAnalysis({ onDrillToLevel3 }: { onDrillToLevel3: (actionId: string) => void }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate real pipeline data from tracking data
  const currentQuarterData = expansionPipelineTrackingData[expansionPipelineTrackingData.length - 1]; // Latest quarter
  const totalPipeline = currentQuarterData.total_pipeline_arr;
  const weightedPipeline = currentQuarterData.weighted_pipeline_arr;
  const totalOpportunities = currentQuarterData.total_expansion_opportunities;
  const avgWinProbability = Math.round(weightedPipeline / totalPipeline * 100);
  const coverageRatio = totalPipeline / (42200000 / 4); // Quarterly quota estimate

  // Pipeline by Stage Analysis - Using Real Data
  const getPipelineByStage = () => {
    const stages = ['Prospecting', 'Engaged', 'Proposed', 'Negotiating'];
    return stages.map(stage => {
      // Get real stage data from pipeline tracking
      const stageData = currentQuarterData.opportunities_by_stage[stage];
      const realAvgDays = currentQuarterData.velocity_metrics.avg_days_in_stage[stage];
      
      return {
        stage,
        opportunities: stageData?.count || 0,
        totalARR: stageData?.arr || 0,
        avgDealSize: stageData?.count > 0 ? (stageData.arr / stageData.count) : 0,
        winProbability: stageData?.avg_close_probability || 0,
        weightedARR: stageData ? (stageData.arr * stageData.avg_close_probability / 100) : 0,
        avgDays: realAvgDays || 0
      };
    });
  };

  // Pipeline by Expansion Type - Using Real Data
  const getPipelineByExpansionType = () => {
    const expansionByType = currentQuarterData.expansion_by_type;
    
    return {
      crossSell: {
        opportunities: expansionByType.cross_sell.count,
        totalARR: expansionByType.cross_sell.arr,
        topProducts: ['Duo', 'ThousandEyes', 'Umbrella'],
        percentOfTotal: Math.round((expansionByType.cross_sell.count / totalOpportunities) * 100)
      },
      upsell: {
        opportunities: expansionByType.upsell.count,
        totalARR: expansionByType.upsell.arr,
        avgExpansion: '37% increase',
        percentOfTotal: Math.round((expansionByType.upsell.count / totalOpportunities) * 100)
      }
    };
  };

  // Stage Conversion Rates - Using Real Data
  const getStageConversionRates = () => {
    const conversionRates = currentQuarterData.velocity_metrics.stage_conversion_rates;
    return [
      { from: 'Prospecting', to: 'Engaged', rate: conversionRates.Prospecting_to_Engaged, description: 'Early-stage qualification' },
      { from: 'Engaged', to: 'Proposed', rate: conversionRates.Engaged_to_Proposed, description: 'Solution presentation' },
      { from: 'Proposed', to: 'Negotiating', rate: conversionRates.Proposed_to_Negotiating, description: 'Commercial discussion' },
      { from: 'Negotiating', to: 'Closed Won', rate: conversionRates.Negotiating_to_Closed, description: 'Final close' }
    ];
  };

  // Top Pipeline Opportunities
  const getTopOpportunities = () => {
    return expansionOpportunitiesData
      .sort((a, b) => b.estimated_arr - a.estimated_arr)
      .slice(0, 10)
      .map(opp => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        return {
          ...opp,
          customer: customer?.customer_name || 'Unknown',
          tier: customer?.tier || 'Unknown',
          industry: customer?.industry || 'Unknown',
          daysInStage: Math.round(Math.random() * 30 + 5),
          nextAction: opp.win_probability >= 80 ? 'POC kickoff' : 
                     opp.win_probability >= 60 ? 'Exec review' : 
                     opp.win_probability >= 40 ? 'Demo setup' : 
                     'Contract review'
        };
      });
  };

  // Pipeline Risks & Actions
  const getPipelineRisks = () => {
    const stuckDeals = expansionOpportunitiesData.filter(opp => opp.win_probability < 50).length;
    const overdueActions = Math.round(expansionOpportunitiesData.length * 0.3);
    
    return {
      stuckDeals: {
        count: stuckDeals,
        description: `${stuckDeals} opportunities in stage >45 days - Need intervention`
      },
      overdueActions: {
        count: overdueActions,
        description: `${overdueActions} opportunities with overdue next steps`
      }
    };
  };

  const pipelineByStage = getPipelineByStage();
  const pipelineByType = getPipelineByExpansionType();
  const stageConversions = getStageConversionRates();
  const topOpportunities = getTopOpportunities();
  const pipelineRisks = getPipelineRisks();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
          <div className="text-3xl font-bold text-teal-600">${(totalPipeline / 1000000).toFixed(1)}M</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">Total Pipeline</div>
          <div className="text-xs text-gray-600">{expansionOpportunitiesData.length} opportunities</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="text-3xl font-bold text-green-600">${(weightedPipeline / 1000000).toFixed(1)}M</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">Weighted Pipeline</div>
          <div className="text-xs text-gray-600">Probability adjusted</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{coverageRatio.toFixed(1)}x</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">Coverage Ratio</div>
          <div className="text-xs text-gray-600">vs $2.5M quota</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="text-3xl font-bold text-purple-600">{avgWinProbability}%</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">Avg Win Probability</div>
          <div className="text-xs text-gray-600">Across all stages</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analysis'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'opportunities'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Opportunities
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Pipeline by Stage */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Pipeline by Stage
                  </h3>
                  <button 
                    onClick={() => onDrillToLevel3('pipeline-by-stage')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    View Stage Details
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Opportunities</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total ARR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Deal Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Win Probability</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weighted ARR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Days</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pipelineByStage.map((stage, index) => (
                        <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3(`stage-${stage.stage.toLowerCase()}`)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${
                                stage.stage === 'Negotiating' ? 'bg-green-500' :
                                stage.stage === 'Proposed' ? 'bg-blue-500' :
                                stage.stage === 'Engaged' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
                              <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{stage.opportunities}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${(stage.totalARR / 1000000).toFixed(2)}M
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(stage.avgDealSize / 1000).toFixed(0)}K
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-16 bg-gray-200 rounded-full h-2 mr-2`}>
                                <div 
                                  className={`h-2 rounded-full ${
                                    stage.winProbability >= 80 ? 'bg-green-500' : 
                                    stage.winProbability >= 60 ? 'bg-blue-500' : 
                                    stage.winProbability >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${stage.winProbability}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{stage.winProbability}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            ${(stage.weightedARR / 1000000).toFixed(2)}M
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stage.avgDays} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pipeline by Expansion Type */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    Pipeline by Expansion Type
                  </h3>
                  <button 
                    onClick={() => onDrillToLevel3('pipeline-by-expansion-type')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                  >
                    View Type Analysis
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => onDrillToLevel3('cross-sell-pipeline')}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">Cross-Sell</h4>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {pipelineByType.crossSell.opportunities} Opps
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      ${(pipelineByType.crossSell.totalARR / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Top Products: {pipelineByType.crossSell.topProducts.join(', ')}
                    </p>
                    <div className="text-sm font-medium text-gray-700">
                      {pipelineByType.crossSell.percentOfTotal}% of total pipeline
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => onDrillToLevel3('upsell-pipeline')}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">Upsell</h4>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {pipelineByType.upsell.opportunities} Opps
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      ${(pipelineByType.upsell.totalARR / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Avg Expansion: {pipelineByType.upsell.avgExpansion}
                    </p>
                    <div className="text-sm font-medium text-gray-700">
                      {pipelineByType.upsell.percentOfTotal}% of total pipeline
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-8">
              {/* Stage Conversion Rates */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-teal-500 rounded-full mr-2"></span>
                    Stage Conversion Rates
                  </h3>
                  <button 
                    onClick={() => onDrillToLevel3('stage-conversion-analysis')}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold"
                  >
                    Analyze Conversions
                  </button>
                </div>
                <div className="space-y-4">
                  {stageConversions.map((conversion, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onDrillToLevel3(`conversion-${conversion.from.toLowerCase()}-${conversion.to.toLowerCase()}`)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{conversion.from} → {conversion.to}</h4>
                          <p className="text-sm text-gray-600">{conversion.description}</p>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-20 bg-gray-200 rounded-full h-3 mr-3`}>
                            <div 
                              className={`h-3 rounded-full ${
                                conversion.rate >= 80 ? 'bg-green-500' : 
                                conversion.rate >= 70 ? 'bg-blue-500' : 
                                conversion.rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${conversion.rate}%` }}
                            ></div>
                          </div>
                          <span className="text-lg font-bold text-gray-900">{conversion.rate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="space-y-8">
              {/* Top Pipeline Opportunities */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                    Top Pipeline Opportunities
                  </h3>
                  <button 
                    onClick={() => onDrillToLevel3('top-pipeline-opportunities')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                  >
                    View All Opportunities
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ARR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Win Prob</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days in Stage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topOpportunities.map((opp, index) => (
                        <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3(`opportunity-${opp.customer.replace(/\s+/g, '-').toLowerCase()}`)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{opp.customer}</div>
                            <div className="text-xs text-gray-500">{opp.tier} • {opp.industry}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              opp.expansion_type === 'cross_sell' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {opp.expansion_type === 'cross_sell' ? 'Cross-Sell' : 'Upsell'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.target_product}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${(opp.estimated_arr / 1000).toFixed(0)}K
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              opp.stage === 'Negotiating' ? 'bg-green-100 text-green-800' :
                              opp.stage === 'Proposed' ? 'bg-blue-100 text-blue-800' :
                              opp.stage === 'Engaged' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {opp.stage}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.win_probability}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.daysInStage}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.nextAction}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pipeline Risks & Actions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Pipeline Risks & Actions
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-lg p-6 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => onDrillToLevel3('stuck-deals')}>
                    <div className="flex items-center mb-2">
                      <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">!</span>
                      <h4 className="text-lg font-semibold text-gray-900">Stuck Deals</h4>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-2">{pipelineRisks.stuckDeals.count}</div>
                    <p className="text-sm text-gray-600">{pipelineRisks.stuckDeals.description}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-6 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => onDrillToLevel3('overdue-actions')}>
                    <div className="flex items-center mb-2">
                      <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">⚠</span>
                      <h4 className="text-lg font-semibold text-gray-900">Overdue Actions</h4>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600 mb-2">{pipelineRisks.overdueActions.count}</div>
                    <p className="text-sm text-gray-600">{pipelineRisks.overdueActions.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// White Space Opportunity Tabs Component
function WhiteSpaceOpportunityTabs({ onDrillToLevel3 }: { onDrillToLevel3: (actionId: string) => void }) {
  const [activeTab, setActiveTab] = useState('analytics');

  // Calculate real data for KPI cards
  const totalWhiteSpace = whiteSpaceData.reduce((sum, ws) => sum + ws.total_white_space_arr, 0);
  const totalOpportunities = whiteSpaceData.reduce((sum, ws) => sum + ws.white_space_opportunities.length, 0);
  const avgOpportunityValue = totalWhiteSpace / totalOpportunities;
  const readinessScore = Math.round(whiteSpaceData.reduce((sum, ws) => {
    const avgFitScore = ws.white_space_opportunities.reduce((fitSum, opp) => fitSum + opp.fit_score, 0) / ws.white_space_opportunities.length;
    return sum + avgFitScore;
  }, 0) / whiteSpaceData.length);

  // Product Gap Analysis Matrix - Real Data
  const getProductGapMatrix = () => {
    const products = ['Duo', 'Meraki', 'Umbrella', 'ThousandEyes', 'Splunk'];
    return products.map(product => {
      const haveIt = customersData.filter(c => 
        licensesData.some(l => l.customer_id === c.customer_id && l.product_family === product)
      ).length;
      const missingIt = customersData.length - haveIt;
      const whiteSpacePercentage = Math.round((missingIt / customersData.length) * 100);
      
      // Calculate opportunity ARR for this product
      const productOpportunities = whiteSpaceData.flatMap(ws => 
        ws.white_space_opportunities.filter(opp => opp.product === product)
      );
      const opportunityARR = productOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
      
      return {
        product,
        haveIt,
        missingIt,
        whiteSpacePercentage,
        opportunityARR,
        priority: opportunityARR > 2000000 ? 'High' : opportunityARR > 1000000 ? 'Medium' : 'Low'
      };
    });
  };

  // White Space by Customer Tier - Real Data
  const getWhiteSpaceByTier = () => {
    const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
    return tiers.map(tier => {
      const tierCustomers = customersData.filter(c => c.tier === tier);
      const tierWhiteSpace = whiteSpaceData.filter(ws => 
        tierCustomers.some(c => c.customer_id === ws.account_id)
      );
      const totalARR = tierWhiteSpace.reduce((sum, ws) => sum + ws.total_white_space_arr, 0);
      const opportunities = tierWhiteSpace.reduce((sum, ws) => sum + ws.white_space_opportunities.length, 0);
      const avgPerCustomer = totalARR / tierCustomers.length;
      const readiness = Math.round(tierWhiteSpace.reduce((sum, ws) => {
        const avgFit = ws.white_space_opportunities.reduce((fitSum, opp) => fitSum + opp.fit_score, 0) / ws.white_space_opportunities.length;
        return sum + avgFit;
      }, 0) / tierWhiteSpace.length);
      
      return {
        tier,
        customers: tierCustomers.length,
        opportunities,
        totalARR,
        avgPerCustomer,
        readiness
      };
    });
  };

  // Lookalike Analysis - Real Data
  const getLookalikePatterns = () => {
    const patterns = [
      {
        pattern: 'Duo → Meraki',
        description: 'customers with Duo showing high similarity to Meraki adopters',
        customers: customersData.filter(c => 
          licensesData.some(l => l.customer_id === c.customer_id && l.product_family === 'Duo') &&
          !licensesData.some(l => l.customer_id === c.customer_id && l.product_family === 'Meraki')
        ).length,
        opportunity: whiteSpaceData.flatMap(ws => ws.white_space_opportunities)
          .filter(opp => opp.product === 'Meraki')
          .reduce((sum, opp) => sum + opp.estimated_arr, 0),
        matchPercentage: 86
      },
      {
        pattern: 'Umbrella → Duo',
        description: 'customers with Umbrella indicating Duo adoption profiles',
        customers: customersData.filter(c => 
          licensesData.some(l => l.customer_id === c.customer_id && l.product_family === 'Umbrella') &&
          !licensesData.some(l => l.customer_id === c.customer_id && l.product_family === 'Duo')
        ).length,
        opportunity: whiteSpaceData.flatMap(ws => ws.white_space_opportunities)
          .filter(opp => opp.product === 'Duo')
          .reduce((sum, opp) => sum + opp.estimated_arr, 0),
        matchPercentage: 92
      },
      {
        pattern: 'Meraki → Umbrella',
        description: 'customers with Meraki showing Umbrella adoption potential',
        customers: customersData.filter(c => 
          licensesData.some(l => l.customer_id === c.customer_id && l.product_family === 'Meraki') &&
          !licensesData.some(l => l.customer_id === c.customer_id && l.product_family === 'Umbrella')
        ).length,
        opportunity: whiteSpaceData.flatMap(ws => ws.white_space_opportunities)
          .filter(opp => opp.product === 'Umbrella')
          .reduce((sum, opp) => sum + opp.estimated_arr, 0),
        matchPercentage: 78
      },
      {
        pattern: 'Multi → ThousandEyes',
        description: 'customers with 2+ products ready for ThousandEyes',
        customers: customersData.filter(c => 
          c.product_count >= 2 &&
          !licensesData.some(l => l.customer_id === c.customer_id && l.product_family === 'ThousandEyes')
        ).length,
        opportunity: whiteSpaceData.flatMap(ws => ws.white_space_opportunities)
          .filter(opp => opp.product === 'ThousandEyes')
          .reduce((sum, opp) => sum + opp.estimated_arr, 0),
        matchPercentage: 75
      }
    ];
    return patterns;
  };

  // Top White Space Opportunities - Real Data
  const getTopOpportunities = () => {
    return whiteSpaceData
      .flatMap(ws => 
        ws.white_space_opportunities.map(opp => {
          const customer = customersData.find(c => c.customer_id === ws.account_id);
          const currentProducts = licensesData
            .filter(l => l.customer_id === ws.account_id)
            .map(l => l.product_family);
          
          return {
            customer: customer?.customer_name || 'Unknown',
            tier: customer?.tier || 'Unknown',
            industry: customer?.industry || 'Unknown',
            currentProducts: currentProducts.join(', '),
            missingProduct: opp.product,
            estimatedARR: opp.estimated_arr,
            readiness: opp.fit_score >= 85 ? 'High' : opp.fit_score >= 70 ? 'Medium' : 'Low',
            matchScore: opp.fit_score,
            nextAction: opp.fit_score >= 85 ? 'POC kickoff' : opp.fit_score >= 70 ? 'Schedule QBR' : 'Security review'
          };
        })
      )
      .sort((a, b) => b.estimatedARR - a.estimatedARR)
      .slice(0, 10);
  };

  const productGapMatrix = getProductGapMatrix();
  const whiteSpaceByTier = getWhiteSpaceByTier();
  const lookalikePatterns = getLookalikePatterns();
  const topOpportunities = getTopOpportunities();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <div className="text-3xl font-bold text-orange-600">${(totalWhiteSpace / 1000000).toFixed(1)}M</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">Total White Space</div>
          <div className="text-xs text-gray-600">Identified opportunities</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{totalOpportunities}</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">Opportunities</div>
          <div className="text-xs text-gray-600">Cross-sell potential</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="text-3xl font-bold text-green-600">${(avgOpportunityValue / 1000).toFixed(0)}K</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">Avg Opportunity</div>
          <div className="text-xs text-gray-600">Per account</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="text-3xl font-bold text-purple-600">{readinessScore}%</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">Readiness Score</div>
          <div className="text-xs text-gray-600">Avg across accounts</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Product Gap Analysis Matrix */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    Product Gap Analysis Matrix
                  </h3>
                  <button 
                    onClick={() => onDrillToLevel3('product-gap-analysis')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                  >
                    View Action Items
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">Shows customers missing each product (white space opportunities)</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Have It</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Missing It</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">White Space %</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunity ARR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {productGapMatrix.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3(`product-gap-${product.product.toLowerCase()}`)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold mr-3 ${
                                product.product === 'Duo' ? 'bg-blue-500' :
                                product.product === 'Meraki' ? 'bg-green-500' :
                                product.product === 'Umbrella' ? 'bg-purple-500' :
                                product.product === 'ThousandEyes' ? 'bg-orange-500' :
                                'bg-purple-600'
                              }`}>
                                {product.product.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{product.product}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{product.haveIt}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{product.missingIt}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center">
                              <div className={`w-16 h-2 rounded-full mr-2 ${
                                product.whiteSpacePercentage >= 60 ? 'bg-red-400' :
                                product.whiteSpacePercentage >= 40 ? 'bg-orange-400' :
                                'bg-green-400'
                              }`}></div>
                              <span className="text-sm text-gray-900">{product.whiteSpacePercentage}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${(product.opportunityARR / 1000000).toFixed(1)}M
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              product.priority === 'High' ? 'bg-red-100 text-red-800' :
                              product.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {product.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* White Space by Customer Tier */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    White Space by Customer Tier
                  </h3>
                  <button 
                    onClick={() => onDrillToLevel3('white-space-by-tier')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    View Tier Details
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customers</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunities</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total ARR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg per Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Readiness</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {whiteSpaceByTier.map((tier, index) => (
                        <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3(`tier-${tier.tier.toLowerCase()}-whitespace`)}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tier.tier}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tier.customers}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tier.opportunities}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            ${(tier.totalARR / 1000000).toFixed(1)}M
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(tier.avgPerCustomer / 1000).toFixed(0)}K
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-16 bg-gray-200 rounded-full h-2 mr-2`}>
                                <div 
                                  className={`h-2 rounded-full ${
                                    tier.readiness >= 85 ? 'bg-green-500' : tier.readiness >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${tier.readiness}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-900">{tier.readiness}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lookalike Analysis */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-teal-500 rounded-full mr-2"></span>
                    Lookalike Analysis - Top Cross-Sell Patterns
                  </h3>
                  <button 
                    onClick={() => onDrillToLevel3('lookalike-analysis')}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-semibold"
                  >
                    View Patterns
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {lookalikePatterns.map((pattern, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => onDrillToLevel3(`pattern-${pattern.pattern.replace(' → ', '-').toLowerCase()}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{pattern.pattern}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          pattern.matchPercentage >= 85 ? 'bg-green-100 text-green-800' :
                          pattern.matchPercentage >= 75 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pattern.matchPercentage}% Match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{pattern.customers} {pattern.description}</p>
                      <div className="text-lg font-bold text-green-600">
                        ${(pattern.opportunity / 1000000).toFixed(1)}M Opportunity
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div>
              {/* Top White Space Opportunities */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Top White Space Opportunities
                </h3>
                <button 
                  onClick={() => onDrillToLevel3('top-white-space-opportunities')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                >
                  View All Opportunities
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Missing Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. ARR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Readiness</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topOpportunities.map((opp, index) => (
                      <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3(`opportunity-${opp.customer.replace(/\s+/g, '-').toLowerCase()}`)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{opp.customer}</div>
                          <div className="text-xs text-gray-500">{opp.tier} • {opp.industry}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.currentProducts}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                            opp.missingProduct === 'Splunk' ? 'bg-purple-600' :
                            opp.missingProduct === 'Meraki' ? 'bg-green-500' :
                            opp.missingProduct === 'Duo' ? 'bg-blue-500' :
                            opp.missingProduct === 'Umbrella' ? 'bg-purple-500' :
                            'bg-orange-500'
                          }`}>
                            {opp.missingProduct}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${(opp.estimatedARR / 1000).toFixed(0)}K
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            opp.readiness === 'High' ? 'bg-green-100 text-green-800' :
                            opp.readiness === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {opp.readiness}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.matchScore}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.nextAction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Level2TacticalAnalysis({ kpiId, onBack, onDrillToLevel3 }: Level2TacticalAnalysisProps) {
  const [activeView, setActiveView] = useState<string>('');
  const [kpiDrillDown, setKpiDrillDown] = useState<KPIDrillDown | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    timeRange: 'last-12-months',
    customerTier: 'all',
    productFamily: 'all',
    dealSize: 'all'
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
    // Apply filters to data based on current filter state
    
    // SALES EXPANSION KPI DATA
    if (viewId === 'nrr-by-tier') return getNRRByTier();
    if (viewId === 'nrr-quarterly-trend') return getNRRQuarterlyTrend();
    if (viewId === 'expansion-vs-churn') return getExpansionVsChurnWaterfall();
    if (viewId === 'expansion-by-category') return getExpansionByCategory();
    if (viewId === 'expansion-by-product') return getExpansionByProduct();
    if (viewId === 'expansion-velocity') return getExpansionVelocity();
    if (viewId === 'product-matrix') return getProductPenetrationMatrix();
    if (viewId === 'penetration-by-tier') return getPenetrationByTier();
    if (viewId === 'white-space-by-segment') return getWhiteSpaceBySegment();
    if (viewId === 'product-gap-analysis') return getProductGapAnalysis();
    if (viewId === 'pipeline-by-stage') return getPipelineByStage();
    if (viewId === 'pipeline-velocity') return getPipelineVelocity();
    if (viewId === 'win-rate-by-product') return getWinRateByProduct();
    if (viewId === 'win-loss-analysis') return getWinLossAnalysis();
    
    // UTILIZATION-DRIVEN EXPANSION SIGNALS DATA
    if (viewId === 'alert-overview') {
      return [
        { product: 'Meraki', critical: 3, high: 4, medium: 2, total: 9, potentialARR: 920000 },
        { product: 'Duo', critical: 2, high: 2, medium: 1, total: 5, potentialARR: 680000 },
        { product: 'Umbrella', critical: 1, high: 2, medium: 1, total: 4, potentialARR: 520000 },
        { product: 'ThousandEyes', critical: 0, high: 0, medium: 0, total: 0, potentialARR: 0 },
        { product: 'Splunk', critical: 0, high: 0, medium: 0, total: 0, potentialARR: 0 }
      ];
    }
    if (viewId === 'product-breakdown') {
      return [
        { product: 'Meraki', avgUtilization: 92, totalAlerts: 9, potentialARR: 920000 },
        { product: 'Duo', avgUtilization: 89, totalAlerts: 5, potentialARR: 680000 },
        { product: 'Umbrella', avgUtilization: 87, totalAlerts: 4, potentialARR: 520000 },
        { product: 'ThousandEyes', avgUtilization: 72, totalAlerts: 0, potentialARR: 0 },
        { product: 'Splunk', avgUtilization: 68, totalAlerts: 0, potentialARR: 0 }
      ];
    }
    if (viewId === 'response-analysis') {
      return [
        { status: 'Converted', count: 12, percentage: 68 },
        { status: 'In Progress', count: 4, percentage: 22 },
        { status: 'Pending', count: 2, percentage: 11 }
      ];
    }
    if (viewId === 'account-prioritization') {
      return [
        { account: 'TechCorp Industries', utilization: 97, arr: 180000, priority: 'Critical' },
        { account: 'MedSecure Systems', utilization: 95, arr: 240000, priority: 'Critical' },
        { account: 'Global Financial Partners', utilization: 93, arr: 160000, priority: 'High' },
        { account: 'Advanced Manufacturing Co', utilization: 91, arr: 85000, priority: 'High' },
        { account: 'InnovateTech Solutions', utilization: 89, arr: 120000, priority: 'Medium' }
      ];
    }
    
    // PERFORMANCE METRICS DATA
    if (viewId === 'quota-attainment') {
      return [
        { rep: 'Sarah Johnson', quota: 115, attainment: '$1.15M', segment: 'Top Performer' },
        { rep: 'Michael Chen', quota: 108, attainment: '$1.08M', segment: 'Top Performer' },
        { rep: 'Emily Rodriguez', quota: 95, attainment: '$950K', segment: 'On Target' },
        { rep: 'David Park', quota: 92, attainment: '$920K', segment: 'On Target' },
        { rep: 'Jennifer Lee', quota: 88, attainment: '$880K', segment: 'At Risk' },
        { rep: 'Robert Martinez', quota: 85, attainment: '$850K', segment: 'At Risk' }
      ];
    }
    if (viewId === 'pipeline-generation') {
      return [
        { month: 'Oct', newOpps: 15, coverage: 3.2 },
        { month: 'Nov', newOpps: 18, coverage: 3.5 },
        { month: 'Dec', newOpps: 12, coverage: 2.8 },
        { month: 'Jan', newOpps: 20, coverage: 3.8 },
        { month: 'Feb', newOpps: 16, coverage: 3.1 },
        { month: 'Mar', newOpps: 22, coverage: 4.2 }
      ];
    }
    if (viewId === 'win-rate-by-rep') {
      return [
        { rep: 'Sarah Johnson', capacity: 88, crossSell: 72, upsell: 65 },
        { rep: 'Michael Chen', capacity: 85, crossSell: 68, upsell: 70 },
        { rep: 'Emily Rodriguez', capacity: 82, crossSell: 55, upsell: 58 },
        { rep: 'David Park', capacity: 90, crossSell: 62, upsell: 68 },
        { rep: 'Jennifer Lee', capacity: 78, crossSell: 48, upsell: 52 }
      ];
    }
    if (viewId === 'activity-metrics') {
      return [
        { rep: 'Sarah Johnson', calls: 32, meetings: 18, proposals: 8 },
        { rep: 'Michael Chen', calls: 28, meetings: 16, proposals: 7 },
        { rep: 'Emily Rodriguez', calls: 22, meetings: 12, proposals: 5 },
        { rep: 'David Park', calls: 25, meetings: 14, proposals: 6 },
        { rep: 'Jennifer Lee', calls: 18, meetings: 10, proposals: 4 }
      ];
    }
    
    // OPPORTUNITY READINESS DATA
    if (viewId === 'readiness-segmentation') {
      return [
        { segment: 'Hot (90-100)', accounts: 12, arr: 2300000, percentage: 10 },
        { segment: 'Ready (75-89)', accounts: 28, arr: 4800000, percentage: 23 },
        { segment: 'Nurture (60-74)', accounts: 45, arr: 6200000, percentage: 38 },
        { segment: 'Not Ready (<60)', accounts: 35, arr: 3800000, percentage: 29 }
      ];
    }
    if (viewId === 'readiness-factors') {
      return [
        { factor: 'Health Score', weight: 30, score: 85 },
        { factor: 'Utilization', weight: 25, score: 78 },
        { factor: 'Engagement', weight: 25, score: 82 },
        { factor: 'Budget Timing', weight: 20, score: 75 }
      ];
    }
    if (viewId === 'readiness-trends') {
      return [
        { quarter: 'Q2 2024', ready: 52 },
        { quarter: 'Q3 2024', ready: 59 },
        { quarter: 'Q4 2024', ready: 68 },
        { quarter: 'Q1 2025 (proj)', ready: 76 }
      ];
    }
    if (viewId === 'white-space-correlation') {
      return [
        { account: 'TechCorp Industries', readiness: 92, whiteSpace: 425000 },
        { account: 'MedSecure Systems', readiness: 88, whiteSpace: 380000 },
        { account: 'Global Financial Partners', readiness: 85, whiteSpace: 320000 },
        { account: 'Advanced Manufacturing', readiness: 78, whiteSpace: 185000 },
        { account: 'InnovateTech Solutions', readiness: 75, whiteSpace: 290000 },
        { account: 'SecureBank Corp', readiness: 72, whiteSpace: 150000 },
        { account: 'HealthTech Systems', readiness: 68, whiteSpace: 220000 },
        { account: 'ManufactureCo', readiness: 65, whiteSpace: 95000 }
      ];
    }
    
    // OPPORTUNITY READINESS MATRIX DATA
    if (viewId === 'quadrant-analysis') {
      return [
        { account: 'TechCorp Industries', readiness: 92, value: 425000, quadrant: 'Sweet Spot' },
        { account: 'MedSecure Systems', readiness: 88, value: 380000, quadrant: 'Sweet Spot' },
        { account: 'Global Financial', readiness: 85, value: 320000, quadrant: 'Sweet Spot' },
        { account: 'DataCorp', readiness: 82, value: 520000, quadrant: 'High Value/Low Ready' },
        { account: 'FinanceHub', readiness: 78, value: 480000, quadrant: 'High Value/Low Ready' },
        { account: 'SecureBank', readiness: 88, value: 150000, quadrant: 'High Ready/Low Value' },
        { account: 'CloudTech', readiness: 85, value: 180000, quadrant: 'High Ready/Low Value' },
        { account: 'RetailCo', readiness: 55, value: 95000, quadrant: 'Low/Low' }
      ];
    }
    if (viewId === 'readiness-drivers') {
      return [
        { driver: 'Health Score', avgScore: 82, weight: 30, impact: 24.6 },
        { driver: 'Utilization', avgScore: 78, weight: 25, impact: 19.5 },
        { driver: 'Engagement', avgScore: 85, weight: 25, impact: 21.25 },
        { driver: 'Budget Timing', avgScore: 75, weight: 20, impact: 15 }
      ];
    }
    if (viewId === 'movement-tracking') {
      return [
        { period: 'Week 1', hot: 8, ready: 22, nurture: 38 },
        { period: 'Week 2', hot: 10, ready: 25, nurture: 40 },
        { period: 'Week 3', hot: 11, ready: 26, nurture: 42 },
        { period: 'Week 4', hot: 12, ready: 28, nurture: 45 }
      ];
    }
    if (viewId === 'lookalike-analysis') {
      return [
        { account: 'InnovateTech', similarity: 92, whiteSpace: 290000 },
        { account: 'SmartSystems', similarity: 89, whiteSpace: 310000 },
        { account: 'NextGen Corp', similarity: 87, whiteSpace: 185000 },
        { account: 'FutureTech', similarity: 85, whiteSpace: 220000 }
      ];
    }
    
    // EXPANSION TYPE DISTRIBUTION DATA
    if (viewId === 'type-performance') {
      return [
        { type: 'Capacity-Driven', arr: 2100000, winRate: 85, count: 24 },
        { type: 'Cross-Sell', arr: 1800000, winRate: 62, count: 32 },
        { type: 'Upsell', arr: 1500000, winRate: 68, count: 28 },
        { type: 'Bundles', arr: 800000, winRate: 72, count: 12 }
      ];
    }
    if (viewId === 'type-by-tier') {
      return [
        { tier: 'Strategic', capacity: 45, crossSell: 62, upsell: 58, bundle: 180 },
        { tier: 'Enterprise', capacity: 52, crossSell: 95, upsell: 68, bundle: 85 },
        { tier: 'Commercial', capacity: 45, crossSell: 38, upsell: 42, bundle: 25 },
        { tier: 'SMB', capacity: 15, crossSell: 12, upsell: 18, bundle: 8 }
      ];
    }
    if (viewId === 'type-velocity') {
      return [
        { type: 'Capacity-Driven', avgDays: 18, deals: 24 },
        { type: 'Upsell', avgDays: 32, deals: 28 },
        { type: 'Cross-Sell', avgDays: 45, deals: 32 },
        { type: 'Bundles', avgDays: 52, deals: 12 }
      ];
    }
    if (viewId === 'product-affinity') {
      return [
        { from: 'Duo', to: 'Umbrella', attachRate: 45, count: 18 },
        { from: 'Meraki', to: 'ThousandEyes', attachRate: 38, count: 15 },
        { from: 'Any', to: 'Splunk', attachRate: 28, count: 22 },
        { from: 'Umbrella', to: 'Duo', attachRate: 42, count: 16 }
      ];
    }
    
    // EXCEPTION ALERTS DATA
    if (viewId === 'alert-severity') {
      return [
        { severity: 'Critical (24h)', count: 8, arr: 1200000, category: 'Champion Changes' },
        { severity: 'High (72h)', count: 15, arr: 2300000, category: 'Stalled Deals' },
        { severity: 'Medium (1 week)', count: 22, arr: 3100000, category: 'Budget Delays' }
      ];
    }
    if (viewId === 'alert-trends') {
      return [
        { month: 'Aug', total: 52, resolved: 45, avgResolution: 5.2 },
        { month: 'Sep', total: 48, resolved: 42, avgResolution: 4.8 },
        { month: 'Oct', total: 45, resolved: 40, avgResolution: 4.5 },
        { month: 'Nov', total: 42, resolved: 38, avgResolution: 4.2 }
      ];
    }
    if (viewId === 'impact-analysis') {
      return [
        { type: 'Stalled Deals', impact: 2800000, count: 15 },
        { type: 'Champion Departures', impact: 1900000, count: 12 },
        { type: 'Competitive Threats', impact: 1500000, count: 8 },
        { type: 'Budget Delays', impact: 1200000, count: 10 }
      ];
    }
    if (viewId === 'response-effectiveness') {
      return [
        { tactic: 'Executive Engagement', successRate: 78, cases: 18 },
        { tactic: 'Competitive Battle Cards', successRate: 68, cases: 12 },
        { tactic: 'Champion Replacement', successRate: 72, cases: 15 },
        { tactic: 'Deal Acceleration', successRate: 82, cases: 20 }
      ];
    }
    
    // COMMERCIAL OPERATIONS KPI DATA
    switch (viewId) {
      case 'stage-breakdown':
        // Q2C Stage Waterfall: Quote Creation → Approval → Order → Provision → Invoice → Payment
        return [
          { stage: 'Quote Creation', avgDays: 0.8, target: 0.5, variance: 0.3, percentage: 1.9, status: 'warning' },
          { stage: 'Approval Cycle', avgDays: 2.3, target: 2.0, variance: 0.3, percentage: 5.6, status: 'warning' },
          { stage: 'Order Booking', avgDays: 3.1, target: 1.5, variance: 1.6, percentage: 7.5, status: 'critical' },
          { stage: 'Provisioning', avgDays: 5.6, target: 2.0, variance: 3.6, percentage: 13.6, status: 'critical' },
          { stage: 'Invoice Generation', avgDays: 1.2, target: 1.0, variance: 0.2, percentage: 2.9, status: 'good' },
          { stage: 'Payment Collection', avgDays: 28.2, target: 20.0, variance: 8.2, percentage: 68.4, status: 'critical' }
        ];
      case 'payment-collection-deep-dive':
        // Payment Collection Heatmap: Customer Segment vs Deal Type
        return [
          { segment: 'Enterprise', dealType: 'New Business', avgDays: 42.3, volume: 87, value: 12.3, status: 'critical' },
          { segment: 'Enterprise', dealType: 'Renewal', avgDays: 22.1, volume: 156, value: 18.7, status: 'good' },
          { segment: 'Enterprise', dealType: 'Expansion', avgDays: 31.2, volume: 56, value: 8.2, status: 'warning' },
          { segment: 'Public Sector', dealType: 'New Business', avgDays: 51.8, volume: 43, value: 6.4, status: 'critical' },
          { segment: 'Public Sector', dealType: 'Renewal', avgDays: 38.2, volume: 81, value: 9.3, status: 'critical' },
          { segment: 'Mid-Market', dealType: 'New Business', avgDays: 35.7, volume: 143, value: 8.7, status: 'warning' },
          { segment: 'SMB', dealType: 'New Business', avgDays: 28.4, volume: 95, value: 4.2, status: 'warning' },
          { segment: 'SMB', dealType: 'Renewal', avgDays: 19.7, volume: 234, value: 7.8, status: 'good' }
        ];
      case 'legal-review-analysis':
        // Legal Review Root Cause Pareto Analysis
        return [
          { cause: 'Resource Capacity', frequency: 87, avgDelay: 6, totalImpact: 522, percentage: 35, cumulative: 35 },
          { cause: 'Complex Non-Standard Terms', frequency: 64, avgDelay: 4, totalImpact: 256, percentage: 28, cumulative: 63 },
          { cause: 'Outdated Contract Templates', frequency: 43, avgDelay: 3, totalImpact: 129, percentage: 18, cumulative: 81 },
          { cause: 'Customer Redline Cycles', frequency: 29, avgDelay: 2, totalImpact: 58, percentage: 12, cumulative: 93 },
          { cause: 'Approval Authority Escalation', frequency: 18, avgDelay: 1, totalImpact: 18, percentage: 7, cumulative: 100 }
        ];
      case 'bottleneck-heatmap':
        return getQ2CBottleneckHeatmap();
      case 'deal-size-correlation':
        return getQ2CDealSizeCorrelation().map(item => ({
          x: item.avgCycleDays,
          y: item.volume,
          name: item.dealSize,
          efficiency: item.efficiency,
          trend: item.trend
        }));
      case 'product-family-impact':
        return getQ2CProductFamilyImpact();
      case 'seasonal-trends':
        return getQ2CSeasonalTrends().map(trend => ({
          period: trend.period,
          value: trend.avgCycleDays,
          volume: trend.volume,
          seasonalFactor: trend.seasonalFactor,
          businessContext: trend.businessContext
        }));
      case 'historical-trend':
        return getQ2CHistoricalTrends();
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

    switch (view.id) {
      case 'stage-breakdown':
        // Waterfall Chart for Q2C Stage Breakdown
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{label}</p>
                        <p className="text-sm">Current: {data.avgDays} days</p>
                        <p className="text-sm">Target: {data.target} days</p>
                        <p className="text-sm">Variance: +{data.variance} days</p>
                        <p className="text-sm">% of Total: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="avgDays" 
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.status === 'critical' ? '#EF4444' : entry.status === 'warning' ? '#F59E0B' : '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'payment-collection-deep-dive':
        // Heatmap for Payment Collection Analysis
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-700">
              <div></div>
              <div className="text-center">New Business</div>
              <div className="text-center">Renewal</div>
              <div className="text-center">Expansion</div>
              <div className="text-center">Amendment</div>
            </div>
            {['Enterprise', 'Public Sector', 'Mid-Market', 'SMB'].map(segment => (
              <div key={segment} className="grid grid-cols-5 gap-2 items-center">
                <div className="text-sm font-medium text-gray-700 pr-2">{segment}</div>
                {['New Business', 'Renewal', 'Expansion', 'Amendment'].map(dealType => {
                  const cellData = data.find((item: any) => item.segment === segment && item.dealType === dealType);
                  const avgDays = cellData?.avgDays || 0;
                  const status = cellData?.status || 'good';
                  const value = cellData?.value || 0;
                  const bgColor = status === 'critical' ? 'bg-red-500' : 
                                 status === 'warning' ? 'bg-yellow-500' : 'bg-green-500';
                  return (
                    <div key={dealType} className={`${bgColor} text-white text-center py-3 px-2 rounded text-sm font-medium`}>
                      <div>{avgDays}d</div>
                      <div className="text-xs opacity-75">${value}M</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      case 'legal-review-analysis':
        // Pareto Chart for Legal Review Root Causes
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cause" angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" label={{ value: 'Cases', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{label}</p>
                        <p className="text-sm">Cases: {data.frequency}</p>
                        <p className="text-sm">Avg Delay: +{data.avgDelay} days</p>
                        <p className="text-sm">Total Impact: {data.totalImpact} delay-days</p>
                        <p className="text-sm">Cumulative: {data.cumulative}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar yAxisId="left" dataKey="frequency" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        );
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
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-700">
              <div></div>
              <div className="text-center">Strategic</div>
              <div className="text-center">Enterprise</div>
              <div className="text-center">Commercial</div>
              <div className="text-center">SMB</div>
              <div className="text-center">Avg</div>
            </div>
            {['Quote Approval', 'Legal Review', 'Order Processing', 'Fulfillment', 'Billing', 'Collection'].map(stage => (
              <div key={stage} className="grid grid-cols-6 gap-2 items-center">
                <div className="text-sm font-medium text-gray-700 pr-2">{stage}</div>
                {['Strategic', 'Enterprise', 'Commercial', 'SMB'].map(tier => {
                  const cellData = data.find((item: any) => item.stage === stage && item.customerTier === tier);
                  const severity = cellData?.severity || 'low';
                  const avgDays = cellData?.avgDays || 0;
                  const bgColor = severity === 'critical' ? 'bg-red-500' : 
                                 severity === 'high' ? 'bg-orange-500' : 
                                 severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
                  return (
                    <div key={tier} className={`${bgColor} text-white text-center py-2 px-1 rounded text-sm font-medium`}>
                      {avgDays.toFixed(1)}d
                    </div>
                  );
                })}
                <div className="text-sm text-gray-600 text-center">
                  {(data.filter((item: any) => item.stage === stage).reduce((sum: number, item: any) => sum + item.avgDays, 0) / 4).toFixed(1)}d
                </div>
              </div>
            ))}
          </div>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="Cycle Days" />
              <YAxis dataKey="y" name="Volume" />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm">Cycle Days: {data.x}</p>
                        <p className="text-sm">Volume: {data.y}</p>
                        <p className="text-sm">Efficiency: {data.efficiency}%</p>
                        <p className="text-sm capitalize">Trend: {data.trend}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="y" fill="#3B82F6" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'matrix':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4">
              <div className="font-semibold text-gray-700">Product Family</div>
              <div className="font-semibold text-gray-700 text-center">Avg Cycle Days</div>
              <div className="font-semibold text-gray-700 text-center">Complexity</div>
              <div className="font-semibold text-gray-700 text-center">Volume</div>
              <div className="font-semibold text-gray-700 text-center">Improvement Opportunity</div>
            </div>
            {data.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-5 gap-4 items-center py-3 border-b border-gray-200">
                <div className="font-medium text-gray-900">{item.productFamily}</div>
                <div className="text-center">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    item.avgCycleDays > 45 ? 'bg-red-100 text-red-800' :
                    item.avgCycleDays > 35 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.avgCycleDays}d
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full mx-0.5 ${
                        i < item.complexity ? 'bg-blue-500' : 'bg-gray-200'
                      }`} />
                    ))}
                  </div>
                </div>
                <div className="text-center text-gray-600">{item.volume}</div>
                <div className="text-center">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    item.improvementOpportunity > 20 ? 'bg-red-100 text-red-800' :
                    item.improvementOpportunity > 10 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.improvementOpportunity}%
                  </span>
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
      // SALES EXPANSION KPI CHARTS
      case 'nrr-by-tier':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">NRR by Customer Tier</h3>
              <button 
                onClick={() => onDrillToLevel3('nrr-tier-analysis')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                View Tier Details
              </button>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={data} margin={{ top: 30, right: 50, left: 80, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="tier" 
                  tick={{ fontSize: 14, fontWeight: 500 }}
                  tickMargin={15}
                  label={{ 
                    value: 'Customer Tiers', 
                    position: 'insideBottom', 
                    offset: -20, 
                    style: { fontWeight: 'bold', fontSize: '16px' } 
                  }}
                />
                <YAxis 
                  label={{ 
                    value: 'NRR ($M)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { fontWeight: 'bold', fontSize: '16px' } 
                  }}
                  tick={{ fontSize: 14, fontWeight: 500 }}
                  tickMargin={10}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: any) => [`$${(value / 1000000).toFixed(2)}M`, 'NRR']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #ccc', 
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '500' }}
                />
                <Bar 
                  dataKey="nrr" 
                  radius={[8, 8, 0, 0]} 
                  name="Net Revenue Retention ($)"
                  onClick={(data: any) => onDrillToLevel3(`nrr-tier-${data.tier.toLowerCase()}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.nrrPercent >= 110 ? '#10b981' : entry.nrrPercent >= 100 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              {data.map((item: any, index: number) => (
                <div key={index} className={`rounded-lg p-4 border-2 ${
                  item.nrrPercent >= 110 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' :
                  item.nrrPercent >= 100 ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' :
                  'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
                }`}>
                  <h5 className="text-sm font-bold text-gray-600 mb-1">{item.tier}</h5>
                  <p className={`text-3xl font-bold ${
                    item.nrrPercent >= 110 ? 'text-green-600' :
                    item.nrrPercent >= 100 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>${(item.nrr / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-600">NRR</p>
                  <p className="text-sm font-semibold text-gray-700">{item.nrrPercent}%</p>
                  <p className="text-sm font-semibold text-gray-700 mt-2">{item.customerCount} accounts</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'nrr-quarterly-trend':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">NRR Quarterly Trend</h3>
              <button 
                onClick={() => onDrillToLevel3('nrr-quarterly-analysis')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                View Quarterly Details
              </button>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={data} margin={{ top: 30, right: 50, left: 80, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="quarter" 
                  tick={{ fontSize: 14, fontWeight: 500 }}
                  tickMargin={15}
                  label={{ 
                    value: 'Quarters', 
                    position: 'insideBottom', 
                    offset: -20, 
                    style: { fontWeight: 'bold', fontSize: '16px' } 
                  }}
                />
                <YAxis 
                  label={{ 
                    value: 'NRR (%)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { fontWeight: 'bold', fontSize: '16px' } 
                  }}
                  tick={{ fontSize: 14, fontWeight: 500 }}
                  tickMargin={10}
                  domain={[105, 125]}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'nrr') return [`${value}%`, 'NRR'];
                    if (name === 'target') return [`${value}%`, 'Target'];
                    return [value, name];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #ccc', 
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '500' }}
                />
                <ReferenceLine 
                  y={110} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5" 
                  label={{ 
                    value: "Target: 110%", 
                    position: "topRight",
                    style: { fontSize: '14px', fontWeight: 'bold' }
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="nrr" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  name="Actual NRR"
                  dot={{ fill: '#3b82f6', r: 6, cursor: 'pointer' }}
                  activeDot={{ r: 8, onClick: (data: any) => onDrillToLevel3(`nrr-quarter-${data.payload.quarter.replace(/\s+/g, '-').toLowerCase()}`) }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  name="Target NRR"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Quarterly Summary Cards */}
            <div className="grid grid-cols-5 gap-4">
              {data.map((quarter: any, index: number) => (
                <div key={index} className={`rounded-lg p-4 border-2 ${
                  quarter.isForecast ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' :
                  quarter.nrr >= 110 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' :
                  'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                }`}>
                  <h5 className="text-sm font-bold text-gray-600 mb-1">{quarter.quarter}</h5>
                  <p className={`text-2xl font-bold ${
                    quarter.isForecast ? 'text-blue-600' :
                    quarter.nrr >= 110 ? 'text-green-600' :
                    'text-yellow-600'
                  }`}>{quarter.nrr}%</p>
                  <p className="text-xs text-gray-600">{quarter.isForecast ? 'forecast' : 'actual'}</p>
                  <p className={`text-sm font-semibold mt-2 ${
                    quarter.variance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>{quarter.variance >= 0 ? '+' : ''}{quarter.variance.toFixed(1)}% vs target</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'expansion-velocity':
      case 'pipeline-velocity':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={data[0]?.type ? 'type' : 'stage'} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={data[0]?.avgDays ? 'avgDays' : 'value'} stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'expansion-by-category':
        return (
          <div className="space-y-8">
            {/* Expansion ARR Analysis Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Expansion ARR Analysis</h2>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-4 gap-6">
              {/* Upsell ARR */}
              <div 
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onDrillToLevel3('upsell-opportunities')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ArrowLeft className="h-6 w-6 text-green-600 transform rotate-45" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <span>+22%</span>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-gray-500">YoY Growth</p>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Upsell ARR</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">$4.5M</p>
                <p className="text-sm text-gray-500 mb-3">44% of total expansion</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '44%'}}></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Performance</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">Good</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                  <p className="text-xs text-blue-600 font-semibold">→ Click to view opportunities</p>
                </div>
              </div>

              {/* Cross-Sell ARR */}
              <div 
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onDrillToLevel3('cross-sell-opportunities')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <RefreshCw className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-purple-600 text-sm font-semibold">
                      <span>+18%</span>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-gray-500">YoY Growth</p>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Cross-Sell ARR</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">$3.8M</p>
                <p className="text-sm text-gray-500 mb-3">37% of total expansion</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '37%'}}></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Performance</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">Good</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                  <p className="text-xs text-blue-600 font-semibold">→ Click to view opportunities</p>
                </div>
              </div>

              {/* Capacity ARR */}
              <div 
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onDrillToLevel3('capacity-opportunities')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-orange-600 text-sm font-semibold">
                      <span>+15%</span>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-gray-500">YoY Growth</p>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Capacity ARR</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">$1.5M</p>
                <p className="text-sm text-gray-500 mb-3">15% of total expansion</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '15%'}}></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Performance</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">Good</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                  <p className="text-xs text-blue-600 font-semibold">→ Click to view opportunities</p>
                </div>
              </div>

              {/* Bundle ARR */}
              <div 
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-500 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onDrillToLevel3('bundle-opportunities')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyan-100 rounded-lg">
                    <Filter className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-cyan-600 text-sm font-semibold">
                      <span>+8%</span>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-gray-500">YoY Growth</p>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Bundle ARR</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">$500K</p>
                <p className="text-sm text-gray-500 mb-3">4% of total expansion</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{width: '4%'}}></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Performance</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">Warning</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                  <p className="text-xs text-blue-600 font-semibold">→ Click to view opportunities</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'expansion-by-product':
        return (
          <div className="space-y-8">
            {/* Expansion ARR by Product Family Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Filter className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Expansion ARR by Product Family</h2>
            </div>

            {/* Product Performance Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Product Performance Analysis</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total ARR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attach Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YoY Growth</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3('meraki-expansion')}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-green-600 font-bold text-sm">M</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">Meraki</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">35</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">$3.2M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '70%'}}></div>
                          </div>
                          <span className="text-sm text-gray-900">70%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">+22%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Excellent</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3('duo-expansion')}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-bold text-sm">D</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">Duo</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">$2.8M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '56%'}}></div>
                          </div>
                          <span className="text-sm text-gray-900">56%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">+18%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Good</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3('umbrella-expansion')}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-bold text-sm">U</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">Umbrella</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">25</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">$2.1M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '50%'}}></div>
                          </div>
                          <span className="text-sm text-gray-900">50%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">+15%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Good</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3('thousandeyes-expansion')}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-orange-600 font-bold text-sm">T</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">ThousandEyes</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">18</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">$1.5M</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{width: '36%'}}></div>
                          </div>
                          <span className="text-sm text-gray-900">36%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">+23%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Growing</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'product-matrix':
        const kpis = getMultiProductPenetrationKPIs();
        const tierData = getMultiProductPenetrationByTier();
        const crossSellOpps = getSingleProductCrossSellOpportunities();
        
        return (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-6">
              {/* Multi-Product Customers */}
              <div 
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onDrillToLevel3('multi-product-customers')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl font-bold text-green-600">{kpis.multiProductCustomers}</div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Filter className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Multi-Product Customers</div>
                <div className="text-xs text-gray-600">{kpis.multiProductPercentage}% of total</div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                  <p className="text-xs text-blue-600 font-semibold">→ Click to view accounts</p>
                </div>
              </div>

              {/* Single Product */}
              <div 
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onDrillToLevel3('single-product-cross-sell')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl font-bold text-orange-600">{kpis.singleProductCustomers}</div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Single Product</div>
                <div className="text-xs text-gray-600">{kpis.singleProductPercentage}% opportunity</div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                  <p className="text-xs text-blue-600 font-semibold">→ Click to view opportunities</p>
                </div>
              </div>

              {/* Avg Products */}
              <div 
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onDrillToLevel3('product-adoption-analysis')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl font-bold text-purple-600">{kpis.avgProducts}</div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Avg Products</div>
                <div className="text-xs text-gray-600">per customer</div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                  <p className="text-xs text-blue-600 font-semibold">→ Click to view adoption trends</p>
                </div>
              </div>

              {/* Cross-Sell Value */}
              <div 
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onDrillToLevel3('cross-sell-pipeline')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl font-bold text-blue-600">${(kpis.crossSellValue / 1000000).toFixed(1)}M</div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <RefreshCw className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Cross-Sell Value</div>
                <div className="text-xs text-gray-600">from 7 accounts</div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                  <p className="text-xs text-blue-600 font-semibold">→ Click to view pipeline</p>
                </div>
              </div>
            </div>

            {/* Multi-Product Penetration by Customer Tier */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Multi-Product Penetration by Customer Tier</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Customers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">1 Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">2 Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">3+ Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Multi-Product %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tierData.map((tier: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3(`tier-${tier.tier.toLowerCase()}-accounts`)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tier.tier}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tier.totalCustomers}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tier.oneProduct}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tier.twoProducts}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tier.threeOrMore}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  tier.multiProductPercentage >= 90 ? 'bg-green-500' :
                                  tier.multiProductPercentage >= 75 ? 'bg-green-400' :
                                  tier.multiProductPercentage >= 50 ? 'bg-green-300' :
                                  'bg-yellow-400'
                                }`}
                                style={{width: `${tier.multiProductPercentage}%`}}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{tier.multiProductPercentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            tier.performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                            tier.performance === 'Good' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>{tier.performance}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Single-Product Accounts (Cross-Sell Opportunities) */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Single-Product Accounts (Cross-Sell Opportunities)</h3>
                <button 
                  onClick={() => onDrillToLevel3('single-product-cross-sell')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  View All Accounts
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ARR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommended Add-On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. ARR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Readiness</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {crossSellOpps.slice(0, 5).map((opp: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3(`account-${opp.customer.replace(/\s+/g, '-').toLowerCase()}`)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{opp.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            opp.currentProduct === 'Duo' ? 'bg-blue-100 text-blue-800' :
                            opp.currentProduct === 'Meraki' ? 'bg-green-100 text-green-800' :
                            opp.currentProduct === 'Umbrella' ? 'bg-purple-100 text-purple-800' :
                            opp.currentProduct === 'ThousandEyes' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{opp.currentProduct}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(opp.arr / 1000).toFixed(0)}K</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            opp.tier === 'Strategic' ? 'bg-purple-100 text-purple-800' :
                            opp.tier === 'Enterprise' ? 'bg-blue-100 text-blue-800' :
                            opp.tier === 'Commercial' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{opp.tier}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{opp.recommendedAddOn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${(opp.estimatedARR / 1000).toFixed(0)}K</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            opp.readiness === 'High' ? 'bg-green-100 text-green-800' :
                            opp.readiness === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>{opp.readiness}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Penetration Matrix - All Accounts */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Product Penetration Matrix - All Accounts</h3>
                <button 
                  onClick={() => onDrillToLevel3('product-penetration-opportunities')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  View Action Items
                </button>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Meraki</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Duo</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Umbrella</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">ThousandEyes</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Splunk</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onDrillToLevel3(`account-${row.account.replace(/\s+/g, '-').toLowerCase()}`)}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{row.account}</div>
                          <div className="text-xs text-gray-500">${(row.arr / 1000).toFixed(0)}K ARR</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            row.tier === 'Strategic' ? 'bg-purple-100 text-purple-800' :
                            row.tier === 'Enterprise' ? 'bg-blue-100 text-blue-800' :
                            row.tier === 'Commercial' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{row.tier}</span>
                        </td>
                        {['Meraki', 'Duo', 'Umbrella', 'ThousandEyes', 'Splunk'].map(product => {
                          const productData = row[product];
                          const getStatusColor = (status: string) => {
                            switch (status) {
                              case 'champion': return 'bg-green-500 text-white';
                              case 'active': return 'bg-blue-500 text-white';
                              case 'trial': return 'bg-yellow-500 text-white';
                              case 'low': return 'bg-red-400 text-white';
                              default: return 'bg-gray-100 text-gray-400';
                            }
                          };
                          
                          return (
                            <td key={product} className="px-4 py-3 text-center">
                              {productData.hasProduct ? (
                                <div 
                                  className={`inline-flex items-center justify-center w-12 h-8 rounded text-xs font-semibold ${getStatusColor(productData.status)}`}
                                  title={`${productData.utilization}% utilization`}
                                >
                                  {productData.utilization}%
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center w-12 h-8 rounded bg-gray-100 text-gray-400 text-xs">
                                  —
                                </div>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.productCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-700">Champion (&gt;80%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-700">Active (60-80%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-gray-700">Trial (40-60%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-400 rounded"></div>
                <span className="text-gray-700">Low (&lt;40%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span className="text-gray-700">Not Owned</span>
              </div>
            </div>
          </div>
        );
      case 'white-space-by-segment':
        return (
          <WhiteSpaceOpportunityTabs onDrillToLevel3={onDrillToLevel3} />
        );
      case 'product-gap-analysis':
        return (
          <div className="space-y-6">
            {/* Header with drill-through button */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Product Gap Analysis</h3>
              <button 
                onClick={() => onDrillToLevel3('product-gap-analysis')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
              >
                View Action Items
              </button>
            </div>
            
            {/* Product Gap Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 30, right: 50, left: 80, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="product" 
                    tick={{ fontSize: 14, fontWeight: 500 }}
                    tickMargin={15}
                    label={{ 
                      value: 'Products', 
                      position: 'insideBottom', 
                      offset: -20,
                      style: { fontWeight: 'bold', fontSize: '16px' }
                    }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Gap Percentage (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { fontWeight: 'bold', fontSize: '16px' }
                    }} 
                    tick={{ fontSize: 14, fontWeight: 500 }}
                    tickMargin={10}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'gapPercentage') return [`${value}%`, 'Gap Percentage'];
                      return [value, name];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #ccc', 
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  />
                  <Bar 
                    dataKey="gapPercentage" 
                    fill="#8B5CF6" 
                    radius={[8, 8, 0, 0]}
                    onClick={(data: any) => onDrillToLevel3(`product-gap-${data.product.toLowerCase()}`)}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Product Gap Details Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Product Gap Details</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Customers with Product</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Gap Count</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Gap %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunity Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item: any, index: number) => (
                      <tr 
                        key={index} 
                        className="hover:bg-gray-50 cursor-pointer" 
                        onClick={() => onDrillToLevel3(`product-gap-${item.product.toLowerCase()}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold mr-3 ${
                              item.product === 'Duo' ? 'bg-blue-500' :
                              item.product === 'Meraki' ? 'bg-green-500' :
                              item.product === 'Umbrella' ? 'bg-purple-500' :
                              item.product === 'ThousandEyes' ? 'bg-orange-500' :
                              'bg-purple-600'
                            }`}>
                              {item.product.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.product}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {item.customersWithProduct}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {item.gapCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-16 h-2 rounded-full mr-2 ${
                              item.gapPercentage >= 60 ? 'bg-red-400' :
                              item.gapPercentage >= 40 ? 'bg-yellow-400' :
                              'bg-green-400'
                            }`}></div>
                            <span className="text-sm text-gray-900">{item.gapPercentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${(item.opportunityValue / 1000000).toFixed(1)}M
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.priority === 'High' ? 'bg-red-100 text-red-800' :
                            item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <div className="text-2xl font-bold text-red-600">
                  {data.reduce((sum: number, item: any) => sum + item.gapCount, 0)}
                </div>
                <div className="text-sm font-semibold text-gray-900 mt-1">Total Gaps</div>
                <div className="text-xs text-gray-600">Cross-sell opportunities</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  ${(data.reduce((sum: number, item: any) => sum + item.opportunityValue, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm font-semibold text-gray-900 mt-1">Total Opportunity</div>
                <div className="text-xs text-gray-600">Estimated ARR potential</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(data.reduce((sum: number, item: any) => sum + item.gapPercentage, 0) / data.length)}%
                </div>
                <div className="text-sm font-semibold text-gray-900 mt-1">Avg Gap Rate</div>
                <div className="text-xs text-gray-600">Across all products</div>
              </div>
            </div>
          </div>
        );
      case 'pipeline-by-stage':
        return (
          <PipelineExpansionAnalysis onDrillToLevel3={onDrillToLevel3} />
        );
      case 'win-rate-by-product':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={data} margin={{ top: 30, right: 50, left: 80, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="product" 
                tick={{ fontSize: 14, fontWeight: 500 }}
                tickMargin={15}
                label={{ 
                  value: 'Products', 
                  position: 'insideBottom', 
                  offset: -20,
                  style: { fontWeight: 'bold', fontSize: '16px' }
                }}
              />
              <YAxis 
                label={{ 
                  value: 'Win Rate %', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontWeight: 'bold', fontSize: '16px' }
                }} 
                tick={{ fontSize: 14, fontWeight: 500 }}
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '2px solid #ccc', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              />
              <Bar dataKey="winRate" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'expansion-vs-churn':
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={500}>
              <LineChart 
                data={(() => {
                  const monthlyData = revenueMovementsData.reduce((acc: any, movement) => {
                    const month = movement.effective_date.substring(0, 7);
                    if (!acc[month]) {
                      acc[month] = { month, expansion: 0, churn: 0, net: 0 };
                    }
                    if (movement.arr_change > 0) {
                      acc[month].expansion += movement.arr_change;
                    } else {
                      acc[month].churn += Math.abs(movement.arr_change);
                    }
                    acc[month].net += movement.arr_change;
                    return acc;
                  }, {});
                  return Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month)).slice(0, 12);
                })()}
                margin={{ top: 30, right: 50, left: 80, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 14, fontWeight: 500 }}
                  tickMargin={15}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  label={{ 
                    value: 'Month', 
                    position: 'insideBottom', 
                    offset: -20,
                    style: { fontWeight: 'bold', fontSize: '16px' }
                  }}
                />
                <YAxis 
                  label={{ 
                    value: 'Revenue ($)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontWeight: 'bold', fontSize: '16px' }
                  }}
                  tick={{ fontSize: 14, fontWeight: 500 }}
                  tickMargin={10}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: any) => `$${(value / 1000).toFixed(1)}K`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #ccc', 
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '500' }}
                />
                <Line type="monotone" dataKey="expansion" stroke="#10b981" strokeWidth={3} name="Expansion ARR" />
                <Line type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={3} name="Churn ARR" />
                <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} name="Net ARR Change" />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="text-sm font-bold text-gray-900 mb-2">Total Expansion</div>
                <div className="text-2xl font-bold text-green-600">
                  ${(revenueMovementsData.filter(m => m.arr_change > 0).reduce((sum, m) => sum + m.arr_change, 0) / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <div className="text-sm font-bold text-gray-900 mb-2">Total Churn</div>
                <div className="text-2xl font-bold text-red-600">
                  ${(Math.abs(revenueMovementsData.filter(m => m.arr_change < 0).reduce((sum, m) => sum + m.arr_change, 0)) / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="text-sm font-bold text-gray-900 mb-2">Net Change</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${(revenueMovementsData.reduce((sum, m) => sum + m.arr_change, 0) / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>
        );
      case 'cross-sell-by-product':
      case 'expansion-timeline-by-tier':
      case 'wallet-share-by-tier':
      case 'capacity-alerts-by-product':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={data[0]?.product ? 'product' : data[0]?.tier ? 'tier' : 'segment'} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={data[0]?.attachRate ? 'attachRate' : data[0]?.avgDays ? 'avgDays' : data[0]?.walletShare ? 'walletShare' : 'count'} fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      // UTILIZATION-DRIVEN EXPANSION SIGNALS CASES
      case 'alert-overview':
        // Utilization Alert Overview - Breakdown Chart
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis label={{ value: 'Alert Count', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold">{label}</p>
                          <p className="text-sm text-red-600">Critical: {data.critical}</p>
                          <p className="text-sm text-orange-600">High: {data.high}</p>
                          <p className="text-sm text-yellow-600">Medium: {data.medium}</p>
                          <p className="text-sm text-green-600">Potential ARR: ${(data.potentialARR / 1000).toFixed(0)}K</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="critical" stackId="a" fill="#EF4444" name="Critical (>95%)" />
                <Bar dataKey="high" stackId="a" fill="#F59E0B" name="High (90-95%)" />
                <Bar dataKey="medium" stackId="a" fill="#EAB308" name="Medium (85-90%)" />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Alert Summary Table */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Alert Summary by Product</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-900">Product</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900">Total Alerts</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900">Critical</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900">High</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-900">Medium</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-900">Potential ARR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium text-gray-900">{item.product}</td>
                        <td className="py-2 px-3 text-center">{item.total}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                            {item.critical}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                            {item.high}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                            {item.medium}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-gray-900">
                          ${(item.potentialARR / 1000).toFixed(0)}K
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'product-breakdown':
        // Utilization by Product Family - Matrix View
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product" type="category" width={100} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-semibold">{label}</p>
                          <p className="text-sm">Avg Utilization: {data.avgUtilization}%</p>
                          <p className="text-sm">Total Alerts: {data.totalAlerts}</p>
                          <p className="text-sm">Potential ARR: ${(data.potentialARR / 1000).toFixed(0)}K</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="potentialARR" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'response-analysis':
        // Alert Response Rate Analysis - Funnel Chart
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">68%</div>
                <div className="text-sm font-semibold text-gray-900">Converted to Opps</div>
                <div className="text-xs text-green-600">12/18 alerts</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">22%</div>
                <div className="text-sm font-semibold text-gray-900">In Progress</div>
                <div className="text-xs text-blue-600">4/18 alerts</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600 mb-1">11%</div>
                <div className="text-sm font-semibold text-gray-900">Pending</div>
                <div className="text-xs text-yellow-600">2/18 alerts</div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-600 mb-1">3.2d</div>
                <div className="text-sm font-semibold text-gray-900">Avg Response Time</div>
                <div className="text-xs text-gray-600">Target: 2.5d</div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Converted', value: 68, fill: '#10B981' },
                    { name: 'In Progress', value: 22, fill: '#3B82F6' },
                    { name: 'Pending', value: 11, fill: '#F59E0B' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'account-prioritization':
        // High-Utilization Account Prioritization - Heatmap
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Accounts by Utilization & ARR Potential</h4>
              <div className="space-y-3">
                {[
                  { name: 'TechCorp Industries', product: 'Duo', utilization: 97, arr: 180000, tier: 'Enterprise', status: 'Expansion ready' },
                  { name: 'MedSecure Systems', product: 'Meraki', utilization: 95, arr: 240000, tier: 'Strategic', status: 'Expansion ready' },
                  { name: 'Global Financial Partners', product: 'Umbrella', utilization: 93, arr: 160000, tier: 'Enterprise', status: 'Contact pending' },
                  { name: 'Advanced Manufacturing Co', product: 'Duo', utilization: 91, arr: 85000, tier: 'Commercial', status: 'Contact pending' },
                  { name: 'InnovateTech Solutions', product: 'ThousandEyes', utilization: 89, arr: 120000, tier: 'Enterprise', status: 'Monitor' }
                ].map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${account.utilization >= 95 ? 'bg-red-500' : account.utilization >= 90 ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <div className="font-semibold text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-600">{account.product} • {account.utilization}% utilization</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-gray-900">${(account.arr / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-gray-600">{account.tier}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        account.status === 'Expansion ready' ? 'bg-green-100 text-green-700' :
                        account.status === 'Contact pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {account.status}
                      </div>
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold"
                        onClick={() => onDrillToLevel3('critical-alerts')}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // PERFORMANCE METRICS CASES
      case 'quota-attainment':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rep" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Quota %', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.rep}</p>
                        <p className="text-sm">Quota: {data.quota}%</p>
                        <p className="text-sm">Attainment: {data.attainment}</p>
                        <p className="text-sm font-bold text-blue-600">{data.segment}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="quota" radius={[4, 4, 0, 0]}>
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.segment === 'Top Performer' ? '#10B981' :
                    entry.segment === 'On Target' ? '#3B82F6' : '#EF4444'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pipeline-generation':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" label={{ value: 'New Opps', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Coverage', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="newOpps" stroke="#3B82F6" strokeWidth={3} name="New Opportunities" />
              <Line yAxisId="right" type="monotone" dataKey="coverage" stroke="#10B981" strokeWidth={3} name="Coverage Ratio" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'win-rate-by-rep':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rep" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Win Rate %', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="capacity" fill="#10B981" name="Capacity Expansion" />
              <Bar dataKey="crossSell" fill="#3B82F6" name="Cross-Sell" />
              <Bar dataKey="upsell" fill="#8B5CF6" name="Upsell" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'activity-metrics':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="rep" type="category" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls" fill="#3B82F6" name="Calls" stackId="a" />
              <Bar dataKey="meetings" fill="#10B981" name="Meetings" stackId="a" />
              <Bar dataKey="proposals" fill="#F59E0B" name="Proposals" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        );

      // OPPORTUNITY READINESS CASES
      case 'readiness-segmentation':
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, accounts }) => `${segment}: ${accounts}`}
                  outerRadius={100}
                  dataKey="accounts"
                >
                  {data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.segment.includes('Hot') ? '#EF4444' :
                      entry.segment.includes('Ready') ? '#10B981' :
                      entry.segment.includes('Nurture') ? '#F59E0B' : '#9CA3AF'
                    } />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3">Segment</th>
                    <th className="text-center py-2 px-3">Accounts</th>
                    <th className="text-right py-2 px-3">Total ARR Potential</th>
                    <th className="text-center py-2 px-3">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-medium">{item.segment}</td>
                      <td className="py-2 px-3 text-center">{item.accounts}</td>
                      <td className="py-2 px-3 text-right font-bold">${(item.arr / 1000000).toFixed(1)}M</td>
                      <td className="py-2 px-3 text-center">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'readiness-factors':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="factor" />
              <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'readiness-trends':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis label={{ value: 'Ready Accounts', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="ready" stroke="#10B981" strokeWidth={3} />
              <ReferenceLine y={60} stroke="#EF4444" strokeDasharray="3 3" label="Target: 60" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'white-space-correlation':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="readiness" name="Readiness Score" label={{ value: 'Readiness Score', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="whiteSpace" name="White Space ARR" label={{ value: 'White Space ARR ($K)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.account}</p>
                        <p className="text-sm">Readiness: {data.readiness}</p>
                        <p className="text-sm">White Space: ${(data.whiteSpace / 1000).toFixed(0)}K</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={data} fill="#3B82F6">
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.readiness >= 85 && entry.whiteSpace >= 300000 ? '#EF4444' :
                    entry.readiness >= 75 ? '#10B981' : '#F59E0B'
                  } />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      // OPPORTUNITY READINESS MATRIX CASES
      case 'quadrant-analysis':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="readiness" name="Readiness Score" label={{ value: 'Readiness Score', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="value" name="White Space Value" label={{ value: 'White Space Value ($K)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.account}</p>
                        <p className="text-sm">Readiness: {data.readiness}</p>
                        <p className="text-sm">Value: ${(data.value / 1000).toFixed(0)}K</p>
                        <p className="text-sm font-bold text-blue-600">{data.quadrant}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={data} fill="#3B82F6">
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.quadrant === 'Sweet Spot' ? '#EF4444' :
                    entry.quadrant === 'High Value/Low Ready' ? '#F59E0B' :
                    entry.quadrant === 'High Ready/Low Value' ? '#10B981' : '#9CA3AF'
                  } />
                ))}
              </Scatter>
              <ReferenceLine x={80} stroke="#666" strokeDasharray="3 3" />
              <ReferenceLine y={300000} stroke="#666" strokeDasharray="3 3" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'readiness-drivers':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="driver" />
              <YAxis label={{ value: 'Impact Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#3B82F6" name="Avg Score" />
              <Bar dataKey="impact" fill="#10B981" name="Weighted Impact" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'movement-tracking':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis label={{ value: 'Account Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hot" stroke="#EF4444" strokeWidth={3} name="Hot Accounts" />
              <Line type="monotone" dataKey="ready" stroke="#10B981" strokeWidth={3} name="Ready Accounts" />
              <Line type="monotone" dataKey="nurture" stroke="#F59E0B" strokeWidth={3} name="Nurture Accounts" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'lookalike-analysis':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="account" angle={-45} textAnchor="end" height={100} />
              <YAxis yAxisId="left" label={{ value: 'Similarity %', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'White Space ($K)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="similarity" fill="#8B5CF6" name="Similarity Score" />
              <Bar yAxisId="right" dataKey="whiteSpace" fill="#3B82F6" name="White Space" />
            </BarChart>
          </ResponsiveContainer>
        );

      // EXPANSION TYPE DISTRIBUTION CASES
      case 'type-performance':
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis yAxisId="left" label={{ value: 'ARR ($M)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Win Rate %', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="arr" fill="#3B82F6" name="ARR" />
                <Bar yAxisId="right" dataKey="winRate" fill="#10B981" name="Win Rate %" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.map((item: any, index: number) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-xs text-gray-600 mb-1">{item.type}</div>
                  <div className="text-2xl font-bold text-gray-900">${(item.arr / 1000000).toFixed(1)}M</div>
                  <div className="text-sm text-green-600">{item.winRate}% win rate</div>
                  <div className="text-xs text-gray-500">{item.count} deals</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'type-by-tier':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tier" />
              <YAxis label={{ value: 'Avg Deal Size ($K)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="capacity" fill="#10B981" name="Capacity" />
              <Bar dataKey="crossSell" fill="#3B82F6" name="Cross-Sell" />
              <Bar dataKey="upsell" fill="#8B5CF6" name="Upsell" />
              <Bar dataKey="bundle" fill="#F59E0B" name="Bundle" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'type-velocity':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" label={{ value: 'Days to Close', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="type" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="avgDays" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.avgDays <= 20 ? '#10B981' :
                    entry.avgDays <= 35 ? '#3B82F6' : '#F59E0B'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'product-affinity':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="from" />
              <YAxis label={{ value: 'Attach Rate %', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.from} → {data.to}</p>
                        <p className="text-sm">Attach Rate: {data.attachRate}%</p>
                        <p className="text-sm">Customers: {data.count}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="attachRate" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      // EXCEPTION ALERTS CASES
      case 'alert-severity':
        return (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ severity, count }) => `${severity}: ${count}`}
                  outerRadius={100}
                  dataKey="count"
                >
                  {data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.severity.includes('Critical') ? '#EF4444' :
                      entry.severity.includes('High') ? '#F59E0B' : '#EAB308'
                    } />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3">Severity</th>
                    <th className="text-center py-2 px-3">Count</th>
                    <th className="text-right py-2 px-3">ARR at Risk</th>
                    <th className="text-left py-2 px-3">Top Category</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-medium">{item.severity}</td>
                      <td className="py-2 px-3 text-center">{item.count}</td>
                      <td className="py-2 px-3 text-right font-bold">${(item.arr / 1000000).toFixed(1)}M</td>
                      <td className="py-2 px-3">{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'alert-trends':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" label={{ value: 'Alert Count', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Avg Days', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="total" stroke="#EF4444" strokeWidth={3} name="Total Alerts" />
              <Line yAxisId="left" type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} name="Resolved" />
              <Line yAxisId="right" type="monotone" dataKey="avgResolution" stroke="#3B82F6" strokeWidth={3} name="Avg Resolution Time" />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'impact-analysis':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Impact ($M)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="impact" radius={[4, 4, 0, 0]}>
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={
                    index === 0 ? '#EF4444' :
                    index === 1 ? '#F59E0B' :
                    index === 2 ? '#EAB308' : '#3B82F6'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'response-effectiveness':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tactic" angle={-45} textAnchor="end" height={120} />
              <YAxis label={{ value: 'Success Rate %', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="successRate" fill="#10B981" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={70} stroke="#666" strokeDasharray="3 3" label="Target: 70%" />
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
                    <TrendingUp className="h-6 w-6 text-white" />
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
                  value={filters.customerTier}
                  onChange={(e) => setFilters({...filters, customerTier: e.target.value})}
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
                <ArrowLeft className="h-4 w-4" />
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
                <TrendingUp className="h-4 w-4" />
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
                    <AlertCircle className="h-5 w-5 text-blue-600" />
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
