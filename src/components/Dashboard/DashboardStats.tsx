'use client';

import { useState } from 'react';
import { colors, personaColors } from '@/config/theme';
import { Persona, getPersonaData } from '@/data/dummyData';
import NRRDrillDownModal from './NRRDrillDownModal';
import ExpansionARRDrillDownModal from './ExpansionARRDrillDownModal';
import MultiProductDrillDownModal from './MultiProductDrillDownModal_Simple'; // Multi-product modal
import PremiumKPICard from '@/components/shared/PremiumKPICard';

// Import master data for calculations
import expansionOpportunities from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
import whiteSpaceAnalysis from '@/source_data/csm-data/white_space_analysis.json';
import WhiteSpaceDrillDownModal from './WhiteSpaceDrillDownModal';
import { renderExpansionPipelineLevel2, renderExpansionPipelineLevel3 } from './ExpansionPipelineDrillDown';
import { CrossSellDrillDown, WinRateDrillDown } from './CrossSellWinRateDrillDown';
import { TimeExpansionDrillDown } from './TimeExpansionDrillDown';
import { ShareWalletDrillDown } from './ShareWalletDrillDown';
import { CrossProductDrillDown } from './CrossProductDrillDown';
import { UtilizationDrillDown } from './UtilizationDrillDown';
import { AccountDetailModal } from './AccountDetailModal';

interface DashboardStatsProps {
  persona: Persona;
}

export default function DashboardStats({ persona }: DashboardStatsProps) {
  const data = getPersonaData(persona) as any;
  const [nrrDrillLevel, setNrrDrillLevel] = useState<1 | 2 | 3 | null>(null);
  const [expansionDrillLevel, setExpansionDrillLevel] = useState<1 | 2 | 3 | null>(null);
  const [multiProductDrillLevel, setMultiProductDrillLevel] = useState<1 | 2 | 3 | null>(null);
  const [whiteSpaceDrillLevel, setWhiteSpaceDrillLevel] = useState<1 | 2 | 3 | null>(null);
  const [whiteSpaceInitialFilter, setWhiteSpaceInitialFilter] = useState<{
    type: 'product' | 'tier' | 'readiness' | 'all';
    value: string;
  } | null>(null);
  const [pipelineDrillLevel, setPipelineDrillLevel] = useState<number | null>(null);
  const [crossSellDrillLevel, setCrossSellDrillLevel] = useState<number | null>(null);
  const [winRateDrillLevel, setWinRateDrillLevel] = useState<number | null>(null);
  const [timeExpansionDrillLevel, setTimeExpansionDrillLevel] = useState<number | null>(null);
  const [shareWalletDrillLevel, setShareWalletDrillLevel] = useState<number | null>(null);
  const [crossProductDrillLevel, setCrossProductDrillLevel] = useState<number | null>(null);
  const [utilizationDrillLevel, setUtilizationDrillLevel] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // ===== REAL MASTER DATA CALCULATIONS =====
  
  // 1. NRR Calculation
  const baseARR = customersData.reduce((sum, customer) => sum + customer.arr, 0);
  const totalExpansionARR = expansionOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const churnARR = 1440000; // From churn predictions
  const netNRR = baseARR + totalExpansionARR - churnARR;
  const nrrPercentage = ((netNRR / baseARR) * 100).toFixed(1);

  // 2. Expansion ARR Calculation
  const expansionARRValue = (totalExpansionARR / 1000000).toFixed(2);

  // 3. Multi-Product Penetration
  const customerProductCounts = customersData.map(customer => {
    const customerLicenses = licensesData.filter(license => license.customer_id === customer.customer_id);
    const uniqueProducts = [...new Set(customerLicenses.map(license => license.product_family))];
    return { customerId: customer.customer_id, productCount: uniqueProducts.length };
  });
  const multiProductCustomers = customerProductCounts.filter(c => c.productCount >= 2).length;
  const multiProductPercentage = Math.round((multiProductCustomers / customersData.length) * 100);

  // 4. White Space Calculation
  const allWhiteSpaceOpps = whiteSpaceAnalysis.flatMap(ws => ws.white_space_opportunities);
  const totalWhiteSpaceValue = allWhiteSpaceOpps.reduce((sum, opp) => sum + opp.estimated_arr, 0);
  const whiteSpaceValueM = (totalWhiteSpaceValue / 1000000).toFixed(1);

  // 5. Pipeline Stage Calculations - REAL STAGES FROM DATA
  const stages = ['Prospecting', 'Qualified', 'Engaged', 'Proposed', 'Negotiating'];
  const stageData = stages.map(stage => ({
    stage,
    count: expansionOpportunities.filter(o => o.stage === stage).length,
    arr: expansionOpportunities.filter(o => o.stage === stage).reduce((sum, o) => sum + o.estimated_arr, 0),
    avgProbability: expansionOpportunities.filter(o => o.stage === stage).length > 0 
      ? Math.round(expansionOpportunities.filter(o => o.stage === stage).reduce((sum, o) => sum + o.close_probability, 0) / expansionOpportunities.filter(o => o.stage === stage).length)
      : 0
  }));

  const totalPipeline = totalExpansionARR;
  const weightedPipeline = expansionOpportunities.reduce((sum, opp) => sum + (opp.estimated_arr * (opp.close_probability / 100)), 0);
  const quota = 2500000; // $2.5M quota
  const coverageRatio = totalPipeline / quota;

  // 6. Cross-Sell Attach Rate Calculation
  const crossSellOpportunities = expansionOpportunities.filter(opp => opp.opportunity_type === 'cross_sell');
  const totalRenewals = customersData.length; // Assuming all customers have renewals
  const crossSellAttachRate = Math.round((crossSellOpportunities.length / totalRenewals) * 100);
  const crossSellCount = crossSellOpportunities.length;
  const renewalOnlyCount = totalRenewals - crossSellCount;

  // 7. Expansion Win Rate Calculation
  const closedWonOpportunities = expansionOpportunities.filter(opp => opp.stage === 'Negotiating' && opp.close_probability > 80);
  const totalClosedOpportunities = expansionOpportunities.filter(opp => 
    opp.stage === 'Negotiating' || opp.close_probability > 70
  );
  const expansionWinRate = totalClosedOpportunities.length > 0 
    ? Math.round((closedWonOpportunities.length / totalClosedOpportunities.length) * 100)
    : 0;

  // 8. Time to Expansion Calculation (average days in pipeline)
  const avgTimeToExpansion = Math.round(
    expansionOpportunities.reduce((sum, opp) => sum + opp.days_in_stage, 0) / expansionOpportunities.length
  );

  // 9. Share of Wallet Calculation (based on customer ARR vs estimated potential)
  const totalCustomerARR = customersData.reduce((sum, c) => sum + c.arr, 0);
  const totalWhiteSpacePotential = totalWhiteSpaceValue;
  const shareOfWallet = Math.round((totalCustomerARR / (totalCustomerARR + totalWhiteSpacePotential)) * 100);

  // 10. Utilization-Driven Expansion Calculations
  const highUtilizationLicenses = licensesData.filter(license => license.utilization >= 85);
  const criticalAlerts = highUtilizationLicenses.filter(license => license.utilization >= 95).length;
  const highAlerts = highUtilizationLicenses.filter(license => license.utilization >= 90 && license.utilization < 95).length;
  const mediumAlerts = highUtilizationLicenses.filter(license => license.utilization >= 85 && license.utilization < 90).length;
  const totalUtilizationAlerts = criticalAlerts + highAlerts + mediumAlerts;

  const renderCSMStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Accounts"
        value={data.accounts?.length.toString() || '0'}
        subtitle="Active customers"
        color={colors.primary.DEFAULT}
        icon="👥"
      />
      <StatCard
        title="Avg Health Score"
        value="89"
        subtitle="Across all accounts"
        color={colors.primary.DEFAULT}
        icon="💚"
      />
      <StatCard
        title="Total ARR"
        value="$8.5M"
        subtitle="Annual recurring revenue"
        color={colors.primary.DEFAULT}
        icon="💰"
      />
      <StatCard
        title="Products"
        value={data.products?.length.toString() || '0'}
        subtitle="In portfolio"
        color={colors.primary.DEFAULT}
        icon="📦"
      />
    </div>
  );

  const renderCOStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Active Quotes"
        value={data.quotes?.length.toString() || '0'}
        subtitle="Pending & accepted"
        color={colors.primary.DEFAULT}
        icon="📋"
      />
      <StatCard
        title="NRR"
        value="114.8%"
        subtitle="Net revenue retention"
        color={colors.primary.DEFAULT}
        icon="📈"
      />
      <StatCard
        title="DSO"
        value="45 days"
        subtitle="Days sales outstanding"
        color={colors.primary.DEFAULT}
        icon="⏱️"
      />
      <StatCard
        title="Active Subscriptions"
        value={data.subscriptions?.length.toString() || '0'}
        subtitle="Current period"
        color={colors.primary.DEFAULT}
        icon="🔄"
      />
    </div>
  );

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const renderSELevel1 = () => (
    <>
      {/* First Row - Standard KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* NRR Card - Clickable */}
        <PremiumKPICard
          title="Net Revenue Retention"
          subtitle="Current Quarter"
          value={`$${(netNRR / 1000000).toFixed(1)}M`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          iconBgColor="bg-blue-500"
          gradientFrom="from-blue-50"
          gradientTo="to-blue-100/50"
          borderColor="border-blue-200/50"
          trend="+3.2pp"
          trendDirection="up"
          trendLabel="On Target"
          progressPercent={100}
          progressBgColor="bg-blue-200"
          progressFillColor="bg-blue-600"
          performance="Good"
          showDrillDown={true}
          onTacticalAnalysis={() => setNrrDrillLevel(1)}
          onActionItems={() => setNrrDrillLevel(3)}
        />

        {/* Expansion ARR Card - Clickable */}
        <PremiumKPICard
          title="Expansion ARR"
          subtitle="YTD vs target"
          value={`$${(totalExpansionARR / 1000000).toFixed(2)}M`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-green-500"
          gradientFrom="from-green-50"
          gradientTo="to-green-100/50"
          borderColor="border-green-200/50"
          trend="+18%"
          trendDirection="up"
          trendLabel="On Target"
          progressPercent={75}
          progressBgColor="bg-green-200"
          progressFillColor="bg-green-600"
          performance="Good"
          showDrillDown={true}
          onTacticalAnalysis={() => setExpansionDrillLevel(1)}
          onActionItems={() => setExpansionDrillLevel(3)}
        />

        {/* Multi-Product Card - Clickable */}
        <PremiumKPICard
          title="Multi-Product Penetration"
          subtitle="Customers with 2+ products"
          value={`${multiProductPercentage}%`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-purple-500"
          gradientFrom="from-purple-50"
          gradientTo="to-purple-100/50"
          borderColor="border-purple-200/50"
          trend="+2.3pp"
          trendDirection="up"
          trendLabel="Above Target (40%)"
          progressPercent={86}
          progressBgColor="bg-purple-200"
          progressFillColor="bg-purple-600"
          performance="Good"
          showDrillDown={true}
          onTacticalAnalysis={() => setMultiProductDrillLevel(1)}
          onActionItems={() => setMultiProductDrillLevel(3)}
        />

        {/* White Space Card */}
        <PremiumKPICard
          title="White Space Opportunity"
          subtitle="YTD Identified"
          value={`$${whiteSpaceValueM}M`}
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          }
          iconBgColor="bg-orange-500"
          gradientFrom="from-orange-50"
          gradientTo="to-orange-100/50"
          borderColor="border-orange-200/50"
          trend="+12%"
          trendDirection="up"
          trendLabel="127 Opportunities"
          progressPercent={85}
          progressBgColor="bg-orange-200"
          progressFillColor="bg-orange-600"
          performance="Good"
          showDrillDown={true}
          onTacticalAnalysis={() => {
            setWhiteSpaceInitialFilter(null);
            setWhiteSpaceDrillLevel(1);
          }}
          onActionItems={() => {
            setWhiteSpaceInitialFilter({ type: 'readiness', value: 'high' });
            setWhiteSpaceDrillLevel(1);
          }}
        />

      </div>

      {/* Second Section - Large Premium Chart KPIs */}
      <div className="space-y-6">
        {/* Row 1: Expansion Pipeline (Full Width) */}
        <div className="grid grid-cols-1 gap-6">
          {/* Expansion Pipeline ARR - FUNNEL CHART */}
          <div className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {/* Hover overlay for drill-through options */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 z-20">
              <div className="flex gap-4">
                <button
                  onClick={() => setPipelineDrillLevel(2)}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-lg"
                >
                  View Analytics
                </button>
                <button
                  onClick={() => setPipelineDrillLevel(3)}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg"
                >
                  Action Items
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">Expansion Pipeline ARR</div>
                <div className="text-sm text-gray-500">Q4 2025 • {expansionOpportunities.length} Opportunities</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-teal-600">${(totalPipeline / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-green-600 font-bold">↑ +18% • {coverageRatio.toFixed(1)}x Coverage</div>
              </div>
            </div>

            {/* Funnel Chart - REAL DATA */}
            <div className="relative h-64 flex flex-col justify-center gap-3 mt-4">
              {stageData.slice().reverse().map((stage, index) => {
                const colors = [
                  { from: 'from-green-500', via: 'via-green-600', to: 'to-green-500' },
                  { from: 'from-blue-500', via: 'via-blue-600', to: 'to-blue-500' },
                  { from: 'from-yellow-500', via: 'via-yellow-600', to: 'to-yellow-500' },
                  { from: 'from-orange-500', via: 'via-orange-600', to: 'to-orange-500' },
                  { from: 'from-red-500', via: 'via-red-600', to: 'to-red-500' }
                ][index] || { from: 'from-gray-500', via: 'via-gray-600', to: 'to-gray-500' };
                
                const widthPercent = Math.max(60, 100 - (index * 15)); // Decreasing width for funnel effect
                
                return (
                  <div key={stage.stage} className="relative">
                    <div 
                      className={`mx-auto bg-gradient-to-r ${colors.from} ${colors.via} ${colors.to} rounded-lg shadow-lg`}
                      style={{ width: `${widthPercent}%`, height: '48px' }}
                    >
                      <div className="flex items-center justify-between px-6 h-full">
                        <span className="text-white font-bold text-base">{stage.stage}</span>
                        <div className="text-right">
                          <div className="text-white font-bold text-lg">${(stage.arr / 1000000).toFixed(2)}M</div>
                          <div className="text-white/90 text-sm">{stage.count} opps • {stage.avgProbability}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">Weighted Pipeline: <span className="text-teal-600">${(weightedPipeline / 1000000).toFixed(1)}M</span></span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Healthy</span>
            </div>
          </div>
        </div>

        {/* Row 2: Cross-Sell & Win Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cross-Sell Attach Rate - LARGE PIE CHART */}
          <div 
            className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setCrossSellDrillLevel(2)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">Cross-Sell Attach Rate</div>
                <div className="text-sm text-gray-500">YTD Renewals</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-indigo-600">{crossSellAttachRate}%</div>
                <div className="text-xs text-green-600 font-bold">↑ +3pp vs Target</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              {/* Large Pie Chart SVG */}
              <div className="relative w-72 h-72">
                <svg className="w-72 h-72 transform -rotate-90" viewBox="0 0 320 320">
                  {/* Background circle */}
                  <circle cx="160" cy="160" r="140" fill="#f3f4f6" />
                  
                  {/* Cross-Sell slice - Dynamic based on real data */}
                  <path d={`M 160 160 L 160 20 A 140 140 0 ${crossSellAttachRate > 50 ? 1 : 0} 1 ${160 + 140 * Math.sin(2 * Math.PI * crossSellAttachRate / 100)} ${160 - 140 * Math.cos(2 * Math.PI * crossSellAttachRate / 100)} Z`} fill="url(#indigoGradient)" />
                  
                  {/* No Cross-Sell slice - Dynamic based on real data */}
                  <path d={`M 160 160 L ${160 + 140 * Math.sin(2 * Math.PI * crossSellAttachRate / 100)} ${160 - 140 * Math.cos(2 * Math.PI * crossSellAttachRate / 100)} A 140 140 0 ${crossSellAttachRate < 50 ? 1 : 0} 1 160 20 Z`} fill="#e0e7ff" />
                  
                  {/* Center hole for donut effect */}
                  <circle cx="160" cy="160" r="90" fill="white" />
                  
                  <defs>
                    <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-indigo-600">{crossSellAttachRate}%</div>
                  <div className="text-base text-gray-600 mt-2">Attach Rate</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                  <span className="text-base font-semibold text-gray-700">With Cross-Sell</span>
                </div>
                <span className="text-lg font-bold text-indigo-600">{crossSellCount} ({crossSellAttachRate}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-indigo-200"></div>
                  <span className="text-base font-semibold text-gray-700">Renewal Only</span>
                </div>
                <span className="text-lg font-bold text-gray-600">{renewalOnlyCount} ({100 - crossSellAttachRate}%)</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target: 25%</span>
                <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">Above Target</span>
              </div>
            </div>
          </div>

          {/* Expansion Win Rate - LARGE RADIAL GAUGE */}
          <div 
            className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setWinRateDrillLevel(2)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">Expansion Win Rate</div>
                <div className="text-sm text-gray-500">Last 90 Days</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-emerald-600">{expansionWinRate}%</div>
                <div className="text-xs text-green-600 font-bold">↑ +4% vs Last Quarter</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              {/* Large Radial Gauge */}
              <div className="relative w-72 h-72">
                <svg className="w-72 h-72" viewBox="0 0 320 320">
                  {/* Background arc */}
                  <path d="M 53 160 A 107 107 0 1 1 267 160" 
                    stroke="#e5e7eb" strokeWidth="35" fill="none" strokeLinecap="round" />
                  
                  {/* Progress arc - Dynamic based on real data */}
                  <path d={`M 53 160 A 107 107 0 ${expansionWinRate > 50 ? 1 : 0} 1 ${160 + 107 * Math.cos(Math.PI * (1 - expansionWinRate / 100))} ${160 - 107 * Math.sin(Math.PI * (1 - expansionWinRate / 100))}`} 
                    stroke="url(#emeraldGradient2)" strokeWidth="35" fill="none" strokeLinecap="round" />
                  
                  <defs>
                    <linearGradient id="emeraldGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  
                  {/* Center circle */}
                  <circle cx="160" cy="160" r="80" fill="white" stroke="#d1fae5" strokeWidth="4" />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-emerald-600">{expansionWinRate}%</div>
                  <div className="text-base text-gray-600 mt-2">Win Rate</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-4">
              <div className="bg-green-100 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{closedWonOpportunities.length}</div>
                <div className="text-sm font-semibold text-gray-600 mt-1">Won</div>
              </div>
              <div className="bg-red-100 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-600">{totalClosedOpportunities.length - closedWonOpportunities.length}</div>
                <div className="text-sm font-semibold text-gray-600 mt-1">Lost</div>
              </div>
              <div className="bg-gray-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-600">{totalClosedOpportunities.length}</div>
                <div className="text-sm font-semibold text-gray-600 mt-1">Total</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target: 60%</span>
                <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">Above Target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Time to Expansion & Cross-Product Correlation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time to Expansion - LARGE HISTOGRAM */}
          <div 
            className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setTimeExpansionDrillLevel(2)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">Time to Expansion</div>
                <div className="text-sm text-gray-500">Distribution (Days)</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-amber-600">{avgTimeToExpansion}</div>
                <div className="text-xs text-green-600 font-bold">↓ 38 days vs target</div>
              </div>
            </div>
            
            {/* Large Histogram */}
            <div className="flex items-end justify-between h-64 gap-3 mb-4 bg-gradient-to-b from-gray-50 to-white rounded-lg p-4">
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg shadow-lg" style={{ height: '45%' }}>
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-bold text-xl">12</span>
                  </div>
                </div>
                <span className="text-sm text-gray-700 font-semibold">0-60</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg shadow-lg" style={{ height: '70%' }}>
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-bold text-3xl">11</span>
                  </div>
                </div>
                <span className="text-lg text-gray-700 font-semibold">61-120</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-lg shadow-xl" style={{ height: '100%' }}>
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-bold text-4xl">6</span>
                  </div>
                </div>
                <span className="text-lg text-gray-700 font-semibold">121-180</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg shadow-lg" style={{ height: '55%' }}>
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-bold text-3xl">8</span>
                  </div>
                </div>
                <span className="text-lg text-gray-700 font-semibold">181-240</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg shadow-lg" style={{ height: '35%' }}>
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white font-bold text-3xl">5</span>
                  </div>
                </div>
                <span className="text-lg text-gray-700 font-semibold">240+</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-xs text-gray-700 font-semibold mt-1">Fast (&lt;120d)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">11</div>
                <div className="text-xs text-gray-700 font-semibold mt-1">Medium (121-180d)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">5</div>
                <div className="text-xs text-gray-700 font-semibold mt-1">Slow (&gt;180d)</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{expansionOpportunities.length} Total Expansions</span>
                <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700">Fast</span>
              </div>
            </div>
          </div>

          {/* Cross-Product Correlation - NEW KPI */}
          <div 
            className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setCrossProductDrillLevel(2)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">Cross-Product Correlation</div>
                <div className="text-sm text-gray-500">Product Affinity Matrix</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-purple-600">0.78</div>
                <div className="text-xs text-green-600 font-bold">Strong Correlation</div>
              </div>
            </div>
            
            {/* Correlation Heatmap */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-6 gap-2 text-base text-gray-700 mb-3">
                <div></div>
                <div className="text-center font-bold">Duo</div>
                <div className="text-center font-bold">Meraki</div>
                <div className="text-center font-bold">Umbrella</div>
                <div className="text-center font-bold">T.Eyes</div>
                <div className="text-center font-bold">Splunk</div>
              </div>
              
              {/* Duo */}
              <div className="grid grid-cols-6 gap-2">
                <div className="text-base text-gray-700 font-bold flex items-center">Duo</div>
                <div className="h-20 bg-gray-200 rounded-lg flex items-center justify-center text-lg font-bold">1.0</div>
                <div className="h-20 bg-purple-400 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.72</div>
                <div className="h-20 bg-purple-500 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.85</div>
                <div className="h-20 bg-purple-300 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.68</div>
                <div className="h-20 bg-purple-200 rounded-lg flex items-center justify-center text-lg font-bold">0.54</div>
              </div>
              
              {/* Meraki */}
              <div className="grid grid-cols-6 gap-2">
                <div className="text-base text-gray-700 font-bold flex items-center">Meraki</div>
                <div className="h-20 bg-purple-400 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.72</div>
                <div className="h-20 bg-gray-200 rounded-lg flex items-center justify-center text-lg font-bold">1.0</div>
                <div className="h-20 bg-purple-500 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.81</div>
                <div className="h-20 bg-purple-600 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.92</div>
                <div className="h-20 bg-purple-300 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.65</div>
              </div>
              
              {/* Umbrella */}
              <div className="grid grid-cols-6 gap-2">
                <div className="text-base text-gray-700 font-bold flex items-center">Umbrella</div>
                <div className="h-20 bg-purple-500 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.85</div>
                <div className="h-20 bg-purple-500 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.81</div>
                <div className="h-20 bg-gray-200 rounded-lg flex items-center justify-center text-lg font-bold">1.0</div>
                <div className="h-20 bg-purple-400 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.76</div>
                <div className="h-20 bg-purple-300 rounded-lg flex items-center justify-center text-lg font-bold text-white">0.61</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-base bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span>High (0.8-1.0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-400 rounded"></div>
                <span>Medium (0.6-0.8)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-200 rounded"></div>
                <span>Low (&lt;0.6)</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Best Pair: Meraki + ThousandEyes (0.92)</span>
                <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-purple-100 text-purple-700">Insight</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Share-of-Wallet (Full Width) */}
        <div className="grid grid-cols-1 gap-6">
          {/* Share-of-Wallet - LARGE SCATTER PLOT */}
          <div 
            className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setShareWalletDrillLevel(2)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">Share-of-Wallet Score</div>
                <div className="text-sm text-gray-500">By Customer Tier</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-violet-600">{shareOfWallet}%</div>
                <div className="text-xs text-green-600 font-bold">↑ +2% QoQ</div>
              </div>
            </div>

            {/* Large Scatter Plot */}
            <div className="relative h-80 bg-gradient-to-b from-gray-50 to-white rounded-lg p-4 mb-4">
                <svg className="w-full h-full" viewBox="0 0 700 350">
                {/* Grid lines */}
                <line x1="70" y1="25" x2="70" y2="305" stroke="#e5e7eb" strokeWidth="4" />
                <line x1="70" y1="305" x2="680" y2="305" stroke="#e5e7eb" strokeWidth="4" />
                
                {/* Y-axis labels */}
                <text x="30" y="35" fontSize="18" fill="#374151" fontWeight="700">100%</text>
                <text x="35" y="170" fontSize="18" fill="#374151" fontWeight="700">50%</text>
                <text x="40" y="310" fontSize="18" fill="#374151" fontWeight="700">0%</text>
                
                {/* X-axis labels */}
                <text x="140" y="335" fontSize="18" fill="#374151" fontWeight="700">SMB</text>
                <text x="290" y="335" fontSize="18" fill="#374151" fontWeight="700">Commercial</text>
                <text x="440" y="335" fontSize="18" fill="#374151" fontWeight="700">Enterprise</text>
                <text x="590" y="335" fontSize="18" fill="#374151" fontWeight="700">Strategic</text>
                
                {/* Scatter points - SMB (18%) */}
                <circle cx="175" cy="258" r="14" fill="#8b5cf6" opacity="0.85" />
                <circle cx="192" cy="246" r="12" fill="#8b5cf6" opacity="0.75" />
                <circle cx="163" cy="270" r="11" fill="#8b5cf6" opacity="0.65" />
                
                {/* Commercial (28%) */}
                <circle cx="325" cy="205" r="16" fill="#a78bfa" opacity="0.85" />
                <circle cx="343" cy="193" r="14" fill="#a78bfa" opacity="0.75" />
                <circle cx="308" cy="217" r="13" fill="#a78bfa" opacity="0.75" />
                <circle cx="348" cy="211" r="12" fill="#a78bfa" opacity="0.65" />
                
                {/* Enterprise (42%) */}
                <circle cx="475" cy="140" r="18" fill="#c4b5fd" opacity="0.9" />
                <circle cx="493" cy="128" r="16" fill="#c4b5fd" opacity="0.85" />
                <circle cx="458" cy="158" r="15" fill="#c4b5fd" opacity="0.75" />
                <circle cx="498" cy="146" r="14" fill="#c4b5fd" opacity="0.75" />
                <circle cx="463" cy="170" r="13" fill="#c4b5fd" opacity="0.65" />
                
                {/* Strategic (58%) */}
                <circle cx="625" cy="82" r="20" fill="#7c3aed" opacity="0.95" />
                <circle cx="643" cy="70" r="18" fill="#7c3aed" opacity="0.9" />
                <circle cx="608" cy="94" r="17" fill="#7c3aed" opacity="0.85" />
                <circle cx="648" cy="100" r="15" fill="#7c3aed" opacity="0.75" />
              </svg>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-4 gap-6 bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-400"></div>
                <div>
                  <div className="text-lg font-bold text-gray-900">SMB: 18%</div>
                  <div className="text-sm text-gray-600">3 accounts</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-500"></div>
                <div>
                  <div className="text-lg font-bold text-gray-900">Com: 28%</div>
                  <div className="text-sm text-gray-600">10 accounts</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600"></div>
                <div>
                  <div className="text-lg font-bold text-gray-900">Ent: 42%</div>
                  <div className="text-sm text-gray-600">19 accounts</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-700"></div>
                <div>
                  <div className="text-lg font-bold text-gray-900">Str: 58%</div>
                  <div className="text-sm text-gray-600">18 accounts</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">50 Accounts • 66% Avg Potential</span>
                <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700">Opportunity</span>
              </div>
            </div>
          </div>

          {/* Utilization-Driven Expansion Signals - NEW KPI */}
          <div 
            className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setUtilizationDrillLevel(2)}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-2xl font-bold text-gray-900">Utilization-Driven Expansion Signals</div>
                <div className="text-sm text-gray-500">Real-time capacity alerts</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-orange-600">{totalUtilizationAlerts}</div>
                <div className="text-xs text-red-600 font-bold">{criticalAlerts} Critical Alerts</div>
              </div>
            </div>

            {/* Alert Priority Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <div className="text-3xl font-bold text-red-600">{criticalAlerts}</div>
                <div className="text-sm text-gray-800 font-bold mt-1">Critical (&gt;95%)</div>
                <div className="text-xs text-gray-600 mt-1">$840K ARR</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
                <div className="text-5xl font-bold text-orange-600">{highAlerts}</div>
                <div className="text-lg text-gray-800 font-bold mt-2">High (90-95%)</div>
                <div className="text-base text-gray-600 mt-1">$960K ARR</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                <div className="text-5xl font-bold text-yellow-600">{mediumAlerts}</div>
                <div className="text-lg text-gray-800 font-bold mt-2">Medium (85-90%)</div>
                <div className="text-base text-gray-600 mt-1">$600K ARR</div>
              </div>
            </div>

            {/* Top Accounts Table */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-xl font-bold text-gray-900 mb-4">Top 5 Accounts Requiring Action</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">TechCorp Industries</div>
                      <div className="text-sm text-gray-600">Duo • 97% utilization</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">$180K</div>
                    <div className="text-sm text-green-600 font-semibold">Expansion ready</div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white rounded p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div>
                      <div className="font-semibold text-gray-900">MedSecure Systems</div>
                      <div className="text-xs text-gray-600">Meraki • 96% utilization</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">$240K</div>
                    <div className="text-xs text-green-600">Expansion ready</div>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white rounded p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div>
                      <div className="font-semibold text-gray-900">Global Financial Partners</div>
                      <div className="text-xs text-gray-600">Umbrella • 93% utilization</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">$160K</div>
                    <div className="text-xs text-yellow-600">Contact pending</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">$2.4M Total Expansion Potential • 78% Response Rate</span>
                <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-700">Action Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NRR Drill-Down Modal */}
      {nrrDrillLevel && (
        <NRRDrillDownModal 
          level={nrrDrillLevel} 
          onClose={() => setNrrDrillLevel(null)}
          onLevelChange={setNrrDrillLevel}
        />
      )}

      {/* Cross-Sell Attach Rate Drill-Down */}
      {(crossSellDrillLevel === 2 || crossSellDrillLevel === 3) && (
        <CrossSellDrillDown
          level={crossSellDrillLevel}
          onClose={() => setCrossSellDrillLevel(null)}
          onLevelChange={setCrossSellDrillLevel}
        />
      )}

      {/* Expansion Win Rate Drill-Down */}
      {(winRateDrillLevel === 2 || winRateDrillLevel === 3) && (
        <WinRateDrillDown
          level={winRateDrillLevel}
          onClose={() => setWinRateDrillLevel(null)}
          onLevelChange={setWinRateDrillLevel}
        />
      )}

      {/* Time to Expansion Drill-Down */}
      {(timeExpansionDrillLevel === 2 || timeExpansionDrillLevel === 3) && (
        <TimeExpansionDrillDown
          level={timeExpansionDrillLevel}
          onClose={() => setTimeExpansionDrillLevel(null)}
          onLevelChange={setTimeExpansionDrillLevel}
        />
      )}

      {/* Share-of-Wallet Drill-Down */}
      {(shareWalletDrillLevel === 2 || shareWalletDrillLevel === 3) && (
        <ShareWalletDrillDown
          level={shareWalletDrillLevel}
          onClose={() => setShareWalletDrillLevel(null)}
          onLevelChange={setShareWalletDrillLevel}
        />
      )}

      {/* Cross-Product Correlation Drill-Down */}
      {(crossProductDrillLevel === 2 || crossProductDrillLevel === 3) && (
        <CrossProductDrillDown
          level={crossProductDrillLevel}
          onClose={() => setCrossProductDrillLevel(null)}
          onLevelChange={setCrossProductDrillLevel}
        />
      )}

      {/* Utilization-Driven Expansion Drill-Down */}
      {(utilizationDrillLevel === 2 || utilizationDrillLevel === 3) && (
        <UtilizationDrillDown
          level={utilizationDrillLevel}
          onClose={() => setUtilizationDrillLevel(null)}
          onLevelChange={setUtilizationDrillLevel}
        />
      )}

      {/* Expansion ARR Drill-Down Modal */}
      {expansionDrillLevel && (
        <ExpansionARRDrillDownModal
          level={expansionDrillLevel}
          onClose={() => setExpansionDrillLevel(null)}
          onLevelChange={setExpansionDrillLevel}
        />
      )}

      {/* Multi-Product Penetration Drill-Down Modal */}
      {multiProductDrillLevel && (
        <MultiProductDrillDownModal
          level={multiProductDrillLevel}
          onClose={() => setMultiProductDrillLevel(null)}
          onLevelChange={setMultiProductDrillLevel}
        />
      )}

      {/* White Space Drill-Down Modal */}
      {whiteSpaceDrillLevel && (
        <WhiteSpaceDrillDownModal
          level={whiteSpaceDrillLevel}
          onClose={() => {
            setWhiteSpaceDrillLevel(null);
            setWhiteSpaceInitialFilter(null);
          }}
          onLevelChange={setWhiteSpaceDrillLevel}
          initialFilter={whiteSpaceInitialFilter}
        />
      )}

      {/* Expansion Pipeline Drill-Down */}
      {(pipelineDrillLevel === 2 || pipelineDrillLevel === 3) && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="min-h-screen">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-8 py-6 flex items-center justify-between shadow-sm z-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {pipelineDrillLevel === 2 ? 'Expansion Pipeline Analytics' : 'Pipeline Action Items'}
                </h2>
              </div>
              <button
                onClick={() => setPipelineDrillLevel(null)}
                className="text-gray-500 hover:text-gray-700 text-5xl font-bold leading-none px-4"
              >
                ×
              </button>
            </div>
            <div className="px-8 py-6">
              {pipelineDrillLevel === 2 && renderExpansionPipelineLevel2()}
              {pipelineDrillLevel === 3 && renderExpansionPipelineLevel3()}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderSELevel2 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Tactical Analytics</h2>
        <p className="text-lg text-gray-600 mt-2">NRR Analysis, Expansion Breakdown, White Space, Pipeline & Utilization</p>
      </div>

      {/* NRR Analysis by Tier */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 NRR by Customer Tier</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Tier</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customers</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total ARR</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">NRR %</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">NRR Value</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-blue-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">Strategic</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">8</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$18.5M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">122.3%</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">$22.6M</td>
                <td className="px-6 py-4 text-base font-semibold text-green-600">+12.3pp</td>
              </tr>
              <tr className="hover:bg-blue-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">Enterprise</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">15</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$15.2M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">118.5%</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">$18.0M</td>
                <td className="px-6 py-4 text-base font-semibold text-green-600">+8.5pp</td>
              </tr>
              <tr className="hover:bg-blue-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">Commercial</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$6.8M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">108.2%</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">$7.4M</td>
                <td className="px-6 py-4 text-base font-semibold text-yellow-600">-1.8pp</td>
              </tr>
              <tr className="hover:bg-blue-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">SMB</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">9</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$1.7M</td>
                <td className="px-6 py-4 text-lg font-bold text-yellow-600">102.5%</td>
                <td className="px-6 py-4 text-lg font-bold text-yellow-600">$1.7M</td>
                <td className="px-6 py-4 text-base font-semibold text-red-600">-7.5pp</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Analysis with Heatmap */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📈 NRR Cohort Heatmap</h4>
        
        {/* Visual Heatmap */}
        <div className="mb-6">
          <div className="flex items-end justify-between h-56 gap-3">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-green-400 to-green-600 rounded-t-lg" style={{ height: '220px' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-green-600">125.3%</div>
                <div className="text-sm font-bold text-gray-900">$15.7M</div>
                <div className="text-xs font-semibold text-gray-600">2024 Q1</div>
                <div className="text-xs text-gray-500">12 customers</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-green-300 to-green-500 rounded-t-lg" style={{ height: '200px' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-green-600">118.7%</div>
                <div className="text-sm font-bold text-gray-900">$17.8M</div>
                <div className="text-xs font-semibold text-gray-600">2023 Q4</div>
                <div className="text-xs text-gray-500">15 customers</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-yellow-300 to-yellow-500 rounded-t-lg" style={{ height: '160px' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-yellow-600">108.2%</div>
                <div className="text-sm font-bold text-gray-900">$7.4M</div>
                <div className="text-xs font-semibold text-gray-600">2023 Q3</div>
                <div className="text-xs text-gray-500">18 customers</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-yellow-200 to-yellow-400 rounded-t-lg" style={{ height: '140px' }}></div>
              <div className="text-center mt-2">
                <div className="text-2xl font-bold text-yellow-600">105.4%</div>
                <div className="text-sm font-bold text-gray-900">$5.3M</div>
                <div className="text-xs font-semibold text-gray-600">2023 Q2</div>
                <div className="text-xs text-gray-500">5 customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expansion vs Churn */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">⚖️ Expansion vs. Churn Ratio</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
            <div className="text-base font-bold text-gray-900 mb-3">Expansion Revenue</div>
            <div className="text-4xl font-bold text-green-600 mb-2">$7.68M</div>
            <div className="text-sm font-semibold text-gray-700">+18.2% of base ARR</div>
          </div>
          <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
            <div className="text-base font-bold text-gray-900 mb-3">Churn & Contraction</div>
            <div className="text-4xl font-bold text-red-600 mb-2">$1.44M</div>
            <div className="text-sm font-semibold text-gray-700">-3.4% of base ARR</div>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Expansion/Churn Ratio</span>
            <span className="text-3xl font-bold text-blue-600">5.3:1</span>
          </div>
        </div>
      </div>

      {/* EXPANSION ARR ANALYSIS SECTION */}
      <div className="mt-12 pt-8 border-t-4 border-gray-300">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">💰 Expansion ARR Analysis</h3>
        
        {/* Expansion ARR by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PremiumKPICard
            title="Upsell ARR"
            subtitle="44% of total expansion"
            value="$4.5M"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            iconBgColor="bg-green-500"
            gradientFrom="from-green-50"
            gradientTo="to-green-100/50"
            borderColor="border-green-200/50"
            trend="+22%"
            trendDirection="up"
            trendLabel="YoY Growth"
            progressPercent={44}
            progressBgColor="bg-green-200"
            progressFillColor="bg-green-600"
            performance="Good"
          />

          <PremiumKPICard
            title="Cross-Sell ARR"
            subtitle="37% of total expansion"
            value="$3.8M"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
            iconBgColor="bg-purple-500"
            gradientFrom="from-purple-50"
            gradientTo="to-purple-100/50"
            borderColor="border-purple-200/50"
            trend="+18%"
            trendDirection="up"
            trendLabel="YoY Growth"
            progressPercent={37}
            progressBgColor="bg-purple-200"
            progressFillColor="bg-purple-600"
            performance="Good"
          />

          <PremiumKPICard
            title="Capacity ARR"
            subtitle="15% of total expansion"
            value="$1.5M"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            iconBgColor="bg-orange-500"
            gradientFrom="from-orange-50"
            gradientTo="to-orange-100/50"
            borderColor="border-orange-200/50"
            trend="+15%"
            trendDirection="up"
            trendLabel="YoY Growth"
            progressPercent={15}
            progressBgColor="bg-orange-200"
            progressFillColor="bg-orange-600"
            performance="Good"
          />

          <PremiumKPICard
            title="Bundle ARR"
            subtitle="4% of total expansion"
            value="$500K"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            iconBgColor="bg-cyan-500"
            gradientFrom="from-cyan-50"
            gradientTo="to-cyan-100/50"
            borderColor="border-cyan-200/50"
            trend="+8%"
            trendDirection="up"
            trendLabel="YoY Growth"
            progressPercent={4}
            progressBgColor="bg-cyan-200"
            progressFillColor="bg-cyan-600"
            performance="Warning"
          />
        </div>

        {/* Expansion ARR by Product Family */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
          <h4 className="text-2xl font-bold mb-6 text-gray-900">📦 Expansion ARR by Product Family</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Product</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customers</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Total ARR</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Attach Rate</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">YoY Growth</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">Meraki</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">35</td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">$3.2M</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-base font-bold text-gray-900">70%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-green-600">+22%</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Excellent</span>
                  </td>
                </tr>
                <tr className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">Duo</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">28</td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">$2.8M</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '56%' }}></div>
                      </div>
                      <span className="text-base font-bold text-gray-900">56%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-green-600">+18%</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Good</span>
                  </td>
                </tr>
                <tr className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">Umbrella</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">25</td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">$2.1M</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                      <span className="text-base font-bold text-gray-900">50%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-green-600">+15%</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Good</span>
                  </td>
                </tr>
                <tr className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">ThousandEyes</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">18</td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">$1.5M</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '36%' }}></div>
                      </div>
                      <span className="text-base font-bold text-gray-900">36%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-green-600">+28%</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Growing</span>
                  </td>
                </tr>
                <tr className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">Splunk</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">12</td>
                  <td className="px-6 py-4 text-lg font-bold text-gray-900">$700K</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                      <span className="text-base font-bold text-gray-900">24%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-green-600">+12%</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Opportunity</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Deal Size Distribution */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h4 className="text-2xl font-bold mb-6 text-gray-900">📊 Expansion Deal Size Distribution</h4>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-full bg-blue-200 rounded-t-lg mx-auto" style={{ height: '120px', maxWidth: '80px' }}></div>
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">Small</div>
              <div className="text-xs text-gray-600 mb-2">&lt;$50K</div>
              <div className="text-2xl font-bold text-gray-900">45</div>
              <div className="text-sm font-semibold text-gray-700">deals</div>
              <div className="text-lg font-bold text-blue-600 mt-2">$1.2M</div>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-full bg-green-400 rounded-t-lg mx-auto" style={{ height: '180px', maxWidth: '80px' }}></div>
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">Medium</div>
              <div className="text-xs text-gray-600 mb-2">$50K-$200K</div>
              <div className="text-2xl font-bold text-gray-900">28</div>
              <div className="text-sm font-semibold text-gray-700">deals</div>
              <div className="text-lg font-bold text-green-600 mt-2">$3.5M</div>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-full bg-purple-500 rounded-t-lg mx-auto" style={{ height: '200px', maxWidth: '80px' }}></div>
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">Large</div>
              <div className="text-xs text-gray-600 mb-2">$200K-$500K</div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm font-semibold text-gray-700">deals</div>
              <div className="text-lg font-bold text-purple-600 mt-2">$3.8M</div>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-full bg-orange-600 rounded-t-lg mx-auto" style={{ height: '100px', maxWidth: '80px' }}></div>
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1">Enterprise</div>
              <div className="text-xs text-gray-600 mb-2">&gt;$500K</div>
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm font-semibold text-gray-700">deals</div>
              <div className="text-lg font-bold text-orange-600 mt-2">$1.8M</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSELevel3 = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Level 3 - Operational Details</h2>
        <p className="text-lg text-gray-600 mt-2">Individual Customer NRR Contributions & Expansion Transactions</p>
      </div>

      {/* NRR SECTION */}
      {/* Top NRR Contributors */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">🎯 Top NRR Contributors (Strategic Tier)</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Starting ARR</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Expansion</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Churn</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Ending ARR</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">NRR %</th>
                <th className="px-6 py-4 text-left text-base font-bold text-gray-900">NRR Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">MedSecure Systems</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$3.2M</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$850K</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-500">$0</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$4.05M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">126.6%</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">$4.05M</td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">TechCorp Industries</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$1.5M</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$420K</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-500">$0</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$1.92M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">128.0%</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">$1.92M</td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">Global Financial Partners</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$2.8M</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$650K</td>
                <td className="px-6 py-4 text-base font-semibold text-red-600">-$120K</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$3.33M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">118.9%</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">$3.33M</td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">InnovateTech Solutions</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$1.0M</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$285K</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-500">$0</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$1.29M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">128.5%</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">$1.29M</td>
              </tr>
              <tr className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 text-base font-bold text-gray-900">Advanced Manufacturing Co</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-800">$850K</td>
                <td className="px-6 py-4 text-base font-bold text-green-600">+$195K</td>
                <td className="px-6 py-4 text-base font-semibold text-gray-500">$0</td>
                <td className="px-6 py-4 text-base font-bold text-gray-900">$1.05M</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">122.9%</td>
                <td className="px-6 py-4 text-lg font-bold text-green-600">$1.05M</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Expansion Transaction Details */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 className="text-2xl font-bold mb-6 text-gray-900">📋 Expansion Transaction Details</h4>
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-bold text-gray-900">MedSecure Systems - ThousandEyes Expansion</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Closed: 2024-09-15</div>
              </div>
              <span className="text-2xl font-bold text-green-600">+$850K ARR</span>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Type: <span className="text-gray-900">Cross-sell</span> • 
              Product: <span className="text-gray-900">ThousandEyes Enterprise</span> • 
              Rep: <span className="text-gray-900">Sarah Johnson</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-bold text-gray-900">Global Financial Partners - Capacity Upsell</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Closed: 2024-08-22</div>
              </div>
              <span className="text-2xl font-bold text-green-600">+$650K ARR</span>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Type: <span className="text-gray-900">Upsell</span> • 
              Product: <span className="text-gray-900">Meraki Additional Licenses</span> • 
              Rep: <span className="text-gray-900">Michael Chen</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-bold text-gray-900">TechCorp Industries - Umbrella Add-on</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Closed: 2024-07-10</div>
              </div>
              <span className="text-2xl font-bold text-green-600">+$420K ARR</span>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Type: <span className="text-gray-900">Cross-sell</span> • 
              Product: <span className="text-gray-900">Umbrella DNS Security</span> • 
              Rep: <span className="text-gray-900">Emily Rodriguez</span>
            </div>
          </div>
        </div>
      </div>

      {/* EXPANSION ARR SECTION */}
      <div className="mt-12 pt-8 border-t-4 border-gray-300">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">💰 Expansion ARR - Deal Details</h3>

        {/* Category-Specific Deals */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
          <h4 className="text-2xl font-bold mb-6 text-gray-900">📈 Upsell Deals (Closed Won)</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Product</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">ARR</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Stage</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Close Date</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Sales Rep</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Days to Close</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">MedSecure Systems</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Meraki Licenses</td>
                  <td className="px-6 py-4 text-lg font-bold text-green-600">$850K</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Closed Won</span>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">2024-09-15</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Sarah Johnson</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-700">42 days</td>
                </tr>
                <tr className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">Global Financial Partners</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Meraki Additional</td>
                  <td className="px-6 py-4 text-lg font-bold text-green-600">$650K</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Closed Won</span>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">2024-08-22</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Michael Chen</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-700">38 days</td>
                </tr>
                <tr className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">InnovateTech Solutions</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Duo Expansion</td>
                  <td className="px-6 py-4 text-lg font-bold text-green-600">$285K</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Closed Won</span>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">2024-09-01</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Sarah Johnson</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-700">35 days</td>
                </tr>
                <tr className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">Advanced Manufacturing Co</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Umbrella Premium</td>
                  <td className="px-6 py-4 text-lg font-bold text-green-600">$195K</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Closed Won</span>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">2024-08-15</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Michael Chen</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-700">48 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cross-Sell Deals */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
          <h4 className="text-2xl font-bold mb-6 text-gray-900">🔄 Cross-Sell Deals (Closed Won)</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Product</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">ARR</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Stage</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Close Date</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Sales Rep</th>
                  <th className="px-6 py-4 text-left text-base font-bold text-gray-900">Days to Close</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">TechCorp Industries</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">ThousandEyes</td>
                  <td className="px-6 py-4 text-lg font-bold text-purple-600">$420K</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Closed Won</span>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">2024-07-10</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Emily Rodriguez</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-700">52 days</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">DataFlow Systems</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Umbrella DNS</td>
                  <td className="px-6 py-4 text-lg font-bold text-purple-600">$380K</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Closed Won</span>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">2024-08-05</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Sarah Johnson</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-700">45 days</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 text-base font-bold text-gray-900">SecureNet Corp</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Splunk</td>
                  <td className="px-6 py-4 text-lg font-bold text-purple-600">$325K</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Closed Won</span>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">2024-09-20</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-800">Michael Chen</td>
                  <td className="px-6 py-4 text-base font-semibold text-gray-700">58 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Rep Performance Deep Dive */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <h4 className="text-2xl font-bold mb-6 text-gray-900">👤 Sales Rep Performance - Detailed Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sarah Johnson */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                  SJ
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Top Performer</span>
              </div>
              <h5 className="text-xl font-bold text-gray-900 mb-4">Sarah Johnson</h5>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total Deals</span>
                  <span className="text-lg font-bold text-gray-900">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total ARR</span>
                  <span className="text-lg font-bold text-green-600">$3.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Quota</span>
                  <span className="text-lg font-bold text-gray-900">$3.0M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Attainment</span>
                  <span className="text-lg font-bold text-green-600">107%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Win Rate</span>
                  <span className="text-lg font-bold text-green-600">62%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Avg Deal Size</span>
                  <span className="text-lg font-bold text-gray-900">$178K</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="text-xs font-bold text-gray-700 mb-2">Product Mix</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">Meraki</span>
                    <span className="font-bold text-gray-900">$1.2M</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">ThousandEyes</span>
                    <span className="font-bold text-gray-900">$850K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">Duo</span>
                    <span className="font-bold text-gray-900">$680K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Michael Chen */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  MC
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Excellent</span>
              </div>
              <h5 className="text-xl font-bold text-gray-900 mb-4">Michael Chen</h5>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total Deals</span>
                  <span className="text-lg font-bold text-gray-900">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total ARR</span>
                  <span className="text-lg font-bold text-blue-600">$2.8M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Quota</span>
                  <span className="text-lg font-bold text-gray-900">$2.5M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Attainment</span>
                  <span className="text-lg font-bold text-blue-600">112%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Win Rate</span>
                  <span className="text-lg font-bold text-blue-600">58%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Avg Deal Size</span>
                  <span className="text-lg font-bold text-gray-900">$187K</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="text-xs font-bold text-gray-700 mb-2">Product Mix</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">Meraki</span>
                    <span className="font-bold text-gray-900">$980K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">Splunk</span>
                    <span className="font-bold text-gray-900">$720K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">Umbrella</span>
                    <span className="font-bold text-gray-900">$650K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emily Rodriguez */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border-2 border-purple-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  ER
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Good</span>
              </div>
              <h5 className="text-xl font-bold text-gray-900 mb-4">Emily Rodriguez</h5>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total Deals</span>
                  <span className="text-lg font-bold text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total ARR</span>
                  <span className="text-lg font-bold text-purple-600">$2.1M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Quota</span>
                  <span className="text-lg font-bold text-gray-900">$2.0M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Attainment</span>
                  <span className="text-lg font-bold text-purple-600">105%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Win Rate</span>
                  <span className="text-lg font-bold text-purple-600">55%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Avg Deal Size</span>
                  <span className="text-lg font-bold text-gray-900">$175K</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="text-xs font-bold text-gray-700 mb-2">Product Mix</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">ThousandEyes</span>
                    <span className="font-bold text-gray-900">$820K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">Umbrella</span>
                    <span className="font-bold text-gray-900">$680K</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700">Duo</span>
                    <span className="font-bold text-gray-900">$600K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSEStats = () => {
    return renderSELevel1();
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
          Key Metrics
        </h3>
        {persona === 'CSM' && renderCSMStats()}
        {persona === 'CO' && renderCOStats()}
        {persona === 'SE' && renderSEStats()}
      </div>

      {/* Sample Data Table */}
      {persona !== 'SE' && (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
            Recent Activity
          </h3>
          <div className="bg-white rounded-lg border" style={{ borderColor: colors.neutral[200] }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: colors.background.secondary }}>
                  <tr>
                    {persona === 'CSM' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Account</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Tier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>ARR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Health Score</th>
                      </>
                    )}
                    {persona === 'CO' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Quote ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: colors.neutral[200] }}>
                  {persona === 'CSM' && data.accounts?.map((account: any) => (
                    <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm" style={{ color: colors.text.primary }}>{account.name}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: colors.text.secondary }}>{account.tier}</td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: colors.text.primary }}>${(account.arr / 1000).toFixed(0)}K</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                          {account.healthScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {persona === 'CO' && data.quotes?.map((quote: any) => (
                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: colors.text.primary }}>{quote.id}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: colors.text.secondary }}>{quote.customer}</td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: colors.text.primary }}>${(quote.amount / 1000).toFixed(0)}K</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-blue-50 text-blue-600">
                          {quote.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: string;
}

function StatCard({ title, value, subtitle, color, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border hover:shadow-lg hover:border-blue-500 transition-all duration-200" style={{ borderColor: colors.neutral[200] }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
            {title}
          </p>
          <p className="text-3xl font-bold mb-1" style={{ color: colors.text.primary }}>
            {value}
          </p>
          <p className="text-xs" style={{ color: colors.text.muted }}>
            {subtitle}
          </p>
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-gray-100">
        <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: colors.primary.DEFAULT, width: '75%' }} />
      </div>
    </div>
  );
}
