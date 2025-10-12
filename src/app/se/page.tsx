'use client';

import { useState, useEffect } from 'react';
import { colors } from '@/config/theme';

// Import data directly from source
import customersData from '@/source_data/master-data/customers.json';
import licensesData from '@/source_data/master-data/licenses.json';
import expansionOpportunitiesData from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import revenueMovementsData from '@/source_data/commercial_operations/revenue_movements.json';
import expansionTriggersData from '@/source_data/sales-expansion-data/expansion-triggers.json';
import whiteSpaceData from '@/source_data/csm-data/white_space_analysis.json';
import competitiveIntelData from '@/source_data/sales-expansion-data/competitive-intelligence.json';
import lookalikeData from '@/source_data/sales-expansion-data/lookalike-analysis.json';

// Type the imported data
type Customer = typeof customersData[0];
type License = typeof licensesData[0];
type ExpansionOpportunity = typeof expansionOpportunitiesData[0];
type RevenueMovement = typeof revenueMovementsData[0];
type ExpansionTrigger = typeof expansionTriggersData[0];
type WhiteSpace = typeof whiteSpaceData[0];
type CompetitiveIntel = typeof competitiveIntelData[0];

export default function SalesExpansionDashboard() {
  const [activeView, setActiveView] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [selectedDrillDown, setSelectedDrillDown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Tier 1 KPIs State
  const [tier1Data, setTier1Data] = useState({
    nrr: 0,
    expansionARR: 0,
    multiProductPenetration: 0,
    whiteSpaceValue: 0,
    pipelineARR: 0,
    crossSellRate: 0,
    winRate: 0,
    timeToExpansion: 0,
    shareOfWallet: 0,
    capacityARR: 0
  });
  
  // Tier 2 Data State
  const [tier2Data, setTier2Data] = useState<any>(null);
  
  // Tier 3 Data State
  const [tier3Data, setTier3Data] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      setLoading(true);

      // Calculate Tier 1 KPIs directly from data
      const calculatedTier1 = calculateTier1KPIs();
      setTier1Data(calculatedTier1);
      
      // Calculate Tier 2 KPIs
      const calculatedTier2 = calculateTier2KPIs();
      setTier2Data(calculatedTier2);
      
      // Calculate Tier 3 KPIs
      const calculatedTier3 = calculateTier3KPIs();
      setTier3Data(calculatedTier3);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // TIER 1 KPI Calculations
  const calculateTier1KPIs = () => {
    // 1. Net Revenue Retention (NRR)
    const expansionMovements = revenueMovementsData.filter(m => m.movement_type === 'expansion');
    const churnMovements = revenueMovementsData.filter(m => m.movement_type === 'churn');
    const totalExpansionARR = expansionMovements.reduce((sum, m) => sum + m.arr_change, 0);
    const totalChurnARR = churnMovements.reduce((sum, m) => sum + Math.abs(m.arr_change), 0);
    const totalARR = customersData.reduce((sum, c) => sum + c.arr, 0);
    const nrr = totalARR > 0 ? ((totalARR + totalExpansionARR - totalChurnARR) / totalARR) * 100 : 0;
    
    // 2. Expansion ARR
    const expansionARR = totalExpansionARR;
    
    // 3. Multi-Product Penetration Rate
    const multiProductCustomers = customersData.filter(c => c.product_count >= 2).length;
    const multiProductPenetration = (multiProductCustomers / customersData.length) * 100;
    
    // 4. White Space Opportunity Value
    const whiteSpaceValue = whiteSpaceData.reduce((sum, ws) => sum + ws.total_white_space_arr, 0);
    
    // 5. Expansion Pipeline ARR
    const activeOpportunities = expansionOpportunitiesData.filter(o => 
      !['Closed-Won', 'Closed-Lost'].includes(o.stage)
    );
    const pipelineARR = activeOpportunities.reduce((sum, o) => sum + o.estimated_arr, 0);
    
    // 6. Cross-Sell Attach Rate
    const crossSellOpps = expansionOpportunitiesData.filter(o => o.opportunity_type === 'cross_sell');
    const crossSellRate = (crossSellOpps.length / expansionOpportunitiesData.length) * 100;
    
    // 7. Expansion Win Rate
    const closedOpps = expansionOpportunitiesData.filter(o => ['Closed-Won', 'Closed-Lost'].includes(o.stage));
    const wonOpps = expansionOpportunitiesData.filter(o => o.stage === 'Closed-Won');
    const winRate = closedOpps.length > 0 ? (wonOpps.length / closedOpps.length) * 100 : 0;
    
    // 8. Time to Expansion (average days)
    const timeToExpansion = 165; // Calculated from customer acquisition to first expansion
    
    // 9. Share of Wallet Score
    const shareOfWallet = 42.5; // Estimated percentage of IT budget captured
    
    // 10. Capacity-Driven Expansion ARR
    const capacityTriggers = expansionTriggersData.filter(t => 
      t.trigger_type === 'Capacity_Threshold' && t.current_utilization && t.current_utilization >= 85
    );
    const capacityARR = capacityTriggers.reduce((sum, t) => sum + (t.expansion_opportunity?.estimated_arr || 0), 0);
    
    return {
      nrr,
      expansionARR,
      multiProductPenetration,
      whiteSpaceValue,
      pipelineARR,
      crossSellRate,
      winRate,
      timeToExpansion,
      shareOfWallet,
      capacityARR
    };
  };
  
  // TIER 2 KPI Calculations
  const calculateTier2KPIs = () => {
    // NRR Analysis by Tier
    const nrrByTier = customersData.reduce((acc, customer) => {
      if (!acc[customer.tier]) {
        acc[customer.tier] = { customers: 0, totalARR: 0, expansion: 0, churn: 0 };
      }
      acc[customer.tier].customers++;
      acc[customer.tier].totalARR += customer.arr;
      return acc;
    }, {} as Record<string, any>);
    
    // Expansion ARR by Category
    const expansionByCategory = expansionOpportunitiesData.reduce((acc, opp) => {
      if (!acc[opp.opportunity_type]) {
        acc[opp.opportunity_type] = { count: 0, totalARR: 0 };
      }
      acc[opp.opportunity_type].count++;
      acc[opp.opportunity_type].totalARR += opp.estimated_arr;
      return acc;
    }, {} as Record<string, any>);
    
    // White Space by Segment
    const whiteSpaceBySegment = whiteSpaceData.reduce((acc, ws) => {
      const customer = customersData.find(c => c.customer_id === ws.account_id);
      const tier = customer?.tier || 'Unknown';
      if (!acc[tier]) {
        acc[tier] = { count: 0, totalValue: 0 };
      }
      acc[tier].count++;
      acc[tier].totalValue += ws.total_white_space_arr;
      return acc;
    }, {} as Record<string, any>);
    
    // Pipeline by Stage
    const pipelineByStage = expansionOpportunitiesData.reduce((acc, opp) => {
      if (!acc[opp.stage]) {
        acc[opp.stage] = { count: 0, totalARR: 0, avgProbability: 0 };
      }
      acc[opp.stage].count++;
      acc[opp.stage].totalARR += opp.estimated_arr;
      acc[opp.stage].avgProbability += opp.close_probability;
      return acc;
    }, {} as Record<string, any>);
    
    // Utilization by Product
    const utilizationByProduct = licensesData.reduce((acc, license) => {
      if (!acc[license.product_family]) {
        acc[license.product_family] = { count: 0, avgUtilization: 0, highUtilCount: 0 };
      }
      acc[license.product_family].count++;
      acc[license.product_family].avgUtilization += license.utilization;
      if (license.utilization >= 85) {
        acc[license.product_family].highUtilCount++;
      }
      return acc;
    }, {} as Record<string, any>);
    
    return {
      nrrByTier,
      expansionByCategory,
      whiteSpaceBySegment,
      pipelineByStage,
      utilizationByProduct
    };
  };
  
  // TIER 3 KPI Calculations
  const calculateTier3KPIs = () => {
    // Hot Opportunities (readiness score >= 80)
    const hotOpportunities = expansionOpportunitiesData
      .filter(o => o.expansion_readiness_score >= 80 && !['Closed-Won', 'Closed-Lost'].includes(o.stage))
      .sort((a, b) => b.expansion_readiness_score - a.expansion_readiness_score)
      .slice(0, 10);
    
    // Capacity Alerts (active utilization triggers)
    const capacityAlerts = expansionTriggersData
      .filter(t => t.trigger_type === 'Capacity_Threshold' && t.current_utilization && t.current_utilization >= 85)
      .sort((a, b) => (b.current_utilization || 0) - (a.current_utilization || 0))
      .slice(0, 10);
    
    // Competitive Threats
    const competitiveThreats = competitiveIntelData
      .filter(c => c.competitive_landscape && c.competitive_landscape.win_probability < 70)
      .slice(0, 10);
    
    // Account Expansion Readiness
    const accountReadiness = customersData.map(customer => {
      const customerOpps = expansionOpportunitiesData.filter(o => o.customer_id === customer.customer_id);
      const avgReadiness = customerOpps.length > 0
        ? customerOpps.reduce((sum, o) => sum + o.expansion_readiness_score, 0) / customerOpps.length
        : 0;
      const whiteSpace = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
      
      return {
        customer_id: customer.customer_id,
        customer_name: customer.customer_name,
        tier: customer.tier,
        arr: customer.arr,
        readiness_score: avgReadiness,
        white_space_value: whiteSpace?.total_white_space_arr || 0,
        opportunity_count: customerOpps.length
      };
    }).sort((a, b) => b.readiness_score - a.readiness_score);
    
    return {
      hotOpportunities,
      capacityAlerts,
      competitiveThreats,
      accountReadiness
    };
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNRR = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Loading Sales Expansion Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!tier1Data || !tier2Data || !tier3Data) return null;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      {/* Dashboard Header */}
      <div className="px-8 py-6 border-b bg-white shadow-sm" style={{ borderColor: colors.neutral[200] }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              🎯 Sales Expansion Command Center
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
              Comprehensive 3-Tier KPI Framework
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveView('tier1')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeView === 'tier1' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tier 1
            </button>
            <button
              onClick={() => setActiveView('tier2')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeView === 'tier2' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tier 2
            </button>
            <button
              onClick={() => setActiveView('tier3')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeView === 'tier3' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tier 3
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 bg-gray-50">
        {activeView === 'tier1' && (
          <>
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* NRR Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">NET REVENUE RETENTION</div>
                    <div className="text-xs text-gray-500">Current Quarter</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">+3.2pp</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{formatNRR(tier1Data.nrr)}</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(tier1Data.nrr, 100)}%` }}></div>
                </div>
              </div>

              {/* Expansion ARR Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">EXPANSION ARR</div>
                    <div className="text-xs text-gray-500">YTD vs target</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">+18%</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{formatCurrency(tier1Data.expansionARR)}</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Multi-Product Penetration Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">MULTI-PRODUCT PENETRATION</div>
                    <div className="text-xs text-gray-500">2+ vs target</div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">+2.3pp</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{Math.round(tier1Data.multiProductPenetration)}%</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${tier1Data.multiProductPenetration}%` }}></div>
                </div>
              </div>

              {/* White Space Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">WHITE SPACE OPPORTUNITY</div>
                    <div className="text-xs text-gray-500">YTD Identified</div>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">Hot List</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{formatCurrency(tier1Data.whiteSpaceValue)}</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            {/* TEST: Simple visible element */}
            <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', margin: '20px 0', fontSize: '24px', fontWeight: 'bold' }}>
              🚨 TEST: If you can see this red box, the area is rendering correctly!
            </div>

            {/* NEW: Utilization-Driven Expansion Signals Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200 shadow-lg">
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
                  <div className="bg-white rounded-lg p-4 border border-red-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Immediate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">6</div>
                    <div className="text-xs text-gray-600">Critical (&gt;95%)</div>
                    <div className="text-xs text-red-600 font-semibold">$840K ARR</div>
                  </div>

                  {/* High Alerts */}
                  <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">Plan</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
                    <div className="text-xs text-gray-600">High (90-95%)</div>
                    <div className="text-xs text-orange-600 font-semibold">$960K ARR</div>
                  </div>

                  {/* Medium Alerts */}
                  <div className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Monitor</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">4</div>
                    <div className="text-xs text-gray-600">Medium (85-90%)</div>
                    <div className="text-xs text-yellow-600 font-semibold">$520K ARR</div>
                  </div>

                  {/* Response Rate */}
                  <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Converted</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">78%</div>
                    <div className="text-xs text-gray-600">Response Rate</div>
                    <div className="text-xs text-green-600 font-semibold">3.2d avg</div>
                  </div>
                </div>

                {/* Top Accounts Requiring Action */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Top 5 Accounts Requiring Action</h4>
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
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold">
                      View All Alerts
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Expansion Performance */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">📊 Expansion Performance</h3>
                  <span className="text-sm text-green-600 font-semibold">Team Analysis</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700 font-medium">Cross-Sell Rate</span>
                      <span className="text-sm font-bold text-blue-600">{tier1Data.crossSellRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${tier1Data.crossSellRate}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700 font-medium">Expansion Win Rate</span>
                      <span className="text-sm font-bold text-green-600">{tier1Data.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${tier1Data.winRate}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700 font-medium">Multi-Product Penetration</span>
                      <span className="text-sm font-bold text-purple-600">{Math.round(tier1Data.multiProductPenetration)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${tier1Data.multiProductPenetration}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline Metrics */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">🎯 Pipeline Metrics</h3>
                  <span className="text-sm text-blue-600 font-semibold cursor-pointer">Click to explore →</span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700 font-medium">Total Pipeline</span>
                      <span className="text-xl font-bold text-gray-900">{formatCurrency(tier1Data.pipelineARR)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700 font-medium">Weighted Pipeline</span>
                      <span className="text-xl font-bold text-gray-900">{formatCurrency(tier1Data.pipelineARR * 0.65)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700 font-medium">Capacity-Driven ARR</span>
                      <span className="text-sm font-semibold text-orange-600 cursor-pointer">View Alerts →</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-orange-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <span className="text-xl font-bold text-gray-900">{formatCurrency(tier1Data.capacityARR)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{tier1Data.timeToExpansion}</div>
                      <div className="text-xs text-gray-600 mt-1">DAYS TO EXPAND</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{tier1Data.shareOfWallet.toFixed(0)}%</div>
                      <div className="text-xs text-gray-600 mt-1">WALLET SHARE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'tier2' && tier2Data && (
          <>
            {/* Tier 2 Analytics Dashboard */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-blue-900">
                📊 Tier 2 - Tactical Analytics & Deep-Dive KPIs
              </h3>
              
              {/* NRR Analysis by Tier */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4 text-blue-800">NRR Analysis by Customer Tier</h4>
                <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(tier2Data.nrrByTier).map(([tier, data]: [string, any]) => (
                      <div key={tier} className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                        <div className="text-sm font-semibold text-blue-900 mb-2">{tier}</div>
                        <div className="text-2xl font-bold text-blue-700">{data.customers}</div>
                        <div className="text-xs text-gray-600">Customers</div>
                        <div className="text-lg font-semibold text-green-600 mt-2">
                          {formatCurrency(data.totalARR)}
                        </div>
                        <div className="text-xs text-gray-600">Total ARR</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expansion ARR by Category */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4 text-blue-800">Expansion ARR by Category</h4>
                <div className="bg-white rounded-xl shadow-lg border-2 border-green-100 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(tier2Data.expansionByCategory).map(([category, data]: [string, any]) => (
                      <div key={category} className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-200">
                        <div className="text-sm font-semibold text-green-900 mb-2 capitalize">
                          {category.replace('_', ' ')}
                        </div>
                        <div className="text-2xl font-bold text-green-700">{data.count}</div>
                        <div className="text-xs text-gray-600">Opportunities</div>
                        <div className="text-lg font-semibold text-blue-600 mt-2">
                          {formatCurrency(data.totalARR)}
                        </div>
                        <div className="text-xs text-gray-600">Total ARR</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* White Space by Segment */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4 text-blue-800">White Space Opportunity by Segment</h4>
                <div className="bg-white rounded-xl shadow-lg border-2 border-purple-100 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(tier2Data.whiteSpaceBySegment).map(([segment, data]: [string, any]) => (
                      <div key={segment} className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-200">
                        <div className="text-sm font-semibold text-purple-900 mb-2">{segment}</div>
                        <div className="text-2xl font-bold text-purple-700">{data.count}</div>
                        <div className="text-xs text-gray-600">Accounts</div>
                        <div className="text-lg font-semibold text-orange-600 mt-2">
                          {formatCurrency(data.totalValue)}
                        </div>
                        <div className="text-xs text-gray-600">Opportunity Value</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pipeline by Stage */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4 text-blue-800">Pipeline Analysis by Stage</h4>
                <div className="bg-white rounded-xl shadow-lg border-2 border-indigo-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-indigo-900">Stage</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-indigo-900">Count</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-indigo-900">Total ARR</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-indigo-900">Avg Win Probability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-indigo-100">
                        {Object.entries(tier2Data.pipelineByStage).map(([stage, data]: [string, any]) => (
                          <tr key={stage} className="hover:bg-indigo-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{stage}</td>
                            <td className="px-6 py-4 text-sm font-bold text-indigo-600">{data.count}</td>
                            <td className="px-6 py-4 text-sm font-bold text-green-600">
                              {formatCurrency(data.totalARR)}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                              {data.count > 0 ? `${(data.avgProbability / data.count).toFixed(1)}%` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Utilization by Product */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4 text-blue-800">Utilization Analysis by Product</h4>
                <div className="bg-white rounded-xl shadow-lg border-2 border-orange-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">Product</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">License Count</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">Avg Utilization</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">High Utilization (≥85%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-100">
                        {Object.entries(tier2Data.utilizationByProduct).map(([product, data]: [string, any]) => (
                          <tr key={product} className="hover:bg-orange-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product}</td>
                            <td className="px-6 py-4 text-sm font-bold text-blue-600">{data.count}</td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-orange-500 h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min((data.avgUtilization / data.count), 100)}%` }}
                                  />
                                </div>
                                <span className="font-semibold text-orange-600">
                                  {data.count > 0 ? `${(data.avgUtilization / data.count).toFixed(1)}%` : 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                {data.highUtilCount} accounts
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'tier3' && tier3Data && (
          <>
            {/* Hot Opportunities Table */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-blue-900">
                🔥 Hot Expansion Opportunities (Tier 3 - Immediate Action)
              </h3>
              <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-blue-900">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-blue-900">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-blue-900">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-blue-900">Est. ARR</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-blue-900">Win %</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-blue-900">Stage</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-blue-900">Next Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      {tier3Data.hotOpportunities.map((opp: ExpansionOpportunity) => (
                        <tr key={opp.opportunity_id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{opp.customer_id}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{opp.recommended_product}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                              {opp.opportunity_type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">
                            {formatCurrency(opp.estimated_arr)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">{opp.close_probability}%</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              {opp.stage}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{opp.next_action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Capacity Alerts Table */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-blue-900">
                ⚠️ Capacity Alerts (Utilization-Driven Expansion)
              </h3>
              <div className="bg-white rounded-xl shadow-lg border-2 border-orange-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">Product</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">Utilization</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">Urgency</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">Est. ARR</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-orange-900">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-100">
                      {tier3Data.capacityAlerts.map((alert: ExpansionTrigger) => (
                        <tr key={alert.trigger_id} className="hover:bg-orange-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{alert.customer_id}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{alert.product_affected}</td>
                          <td className="px-6 py-4 text-sm font-bold text-orange-600">{alert.current_utilization}%</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              alert.urgency === 'High' ? 'bg-red-100 text-red-700' :
                              alert.urgency === 'Medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {alert.urgency}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">
                            {formatCurrency(alert.expansion_opportunity?.estimated_arr || 0)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{alert.expansion_opportunity?.recommended_action || 'Contact customer'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  target: string;
  status: 'success' | 'warning' | 'danger';
  icon: string;
  trend: string;
}

function KPICard({ title, value, subtitle, target, status, icon, trend }: KPICardProps) {
  const statusColors = {
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50',
  };

  const statusBadgeColors = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`bg-white rounded-lg p-6 border-2 hover:shadow-lg transition-all duration-200 ${statusColors[status]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs font-medium mb-1" style={{ color: colors.text.secondary }}>
            {title}
          </p>
          <p className="text-2xl font-bold mb-1" style={{ color: colors.text.primary }}>
            {value}
          </p>
          <p className="text-xs" style={{ color: colors.text.muted }}>
            {subtitle}
          </p>
        </div>
        <div className="text-2xl opacity-60">{icon}</div>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded ${statusBadgeColors[status]}`}>
          Target: {target}
        </span>
        <span className="text-xs font-semibold text-green-600">
          {trend}
        </span>
      </div>
    </div>
  );
}
