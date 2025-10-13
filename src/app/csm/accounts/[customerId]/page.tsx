'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { loadAccounts, loadSubscriptions, loadUtilizationHistory } from '../../../../lib/data/csmDataLoader';
import { useSidebar } from '../../../../contexts/SidebarContext';
// Icons replaced with emoji for simplicity

interface ContractInfo {
  contract_id: string;
  start_date: string;
  end_date: string;
  arr: number;
  payment_terms: string;
  auto_renewal: boolean;
  contract_type: string;
  status: string;
}

interface LicenseInfo {
  license_id: string;
  product_family: string;
  license_count: number;
  utilization: number;
  adoption_stage: string;
  implementation_date: string;
  renewal_date: string;
  license_type: string;
  tier: string;
  unit_price: number;
  annual_value: number;
  billing_frequency: string;
  contract_start_date: string;
  contract_end_date: string;
  contract_term_months: number;
  auto_renew: boolean;
  utilization_trend: string;
}

interface StakeholderInfo {
  id: string;
  name: string;
  role: string;
  email: string;
  influence_level: string;
  engagement_score: number;
  last_contact: string;
  champion_strength: string;
}

interface CSMInfo {
  csm_id: string;
  name: string;
  expertise: string[];
  portfolio_size: number;
  specialization: string[];
  hire_date: string;
  performance_score: number;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  last_login: string;
  activity_level: string;
  features_used: number;
  created_date: string;
}

interface AccountDetail {
  // Basic Account Info
  customerId: string;
  customerName: string;
  industry: string;
  region: string;
  tier: string;
  arr: number;
  healthScore: number;
  createdDate: string;
  isHeroAccount: boolean;
  storyType: string;
  
  // Contract Information
  contracts: ContractInfo[];
  primaryContract: ContractInfo | null;
  
  // License Information
  licenses: LicenseInfo[];
  totalLicenses: number;
  totalUsers: number;
  activeUsers: number;
  productCount: number;
  
  // User Information
  users: UserInfo[];
  userCount: number;
  
  // CSM Information
  csm: CSMInfo | null;
  
  // Stakeholders
  stakeholders: StakeholderInfo[];
  keyStakeholders: StakeholderInfo[];
  
  // Utilization Data
  utilizationPercentage: number;
  licensesUsed: number;
  licensesAvailable: number;
  utilizationTrend: string;
  momChange: number;
  hasValidTrend: boolean;
  annualWasteCost: number;
  priorityScore: number;
  recommendedAction: string;
  
  // Churn Risk Information (Predictive)
  isAtChurnRisk: boolean;
  churnRiskLevel: string | null;
  churnProbability: number;
  estimatedChurnDate: string | null;
  churnPrediction: any | null;
  
  // Comprehensive Churn Analysis
  championDepartures: any[];
  historicalChurnEvents: any[];
  churnReasons: any[];
  preventionStrategies: string[];
  churnAlerts: any[];
  riskFactors: any[];
  interventionWindow: number;
  lastChurnEvent: any | null;
  churnTrend: string;
  competitorThreats: any[];
}

export default function AccountDetailPage({ params }: { params: Promise<{ customerId: string }> }) {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  const resolvedParams = use(params);
  const customerId = resolvedParams.customerId;
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  // Unwrap the params Promise using React.use()
  useEffect(() => {
    try {
      // Load all related data
      const accounts = loadAccounts();
      const subscriptions = loadSubscriptions();
      const utilizationHistory = loadUtilizationHistory() as any[];
      
      // Load additional data files
      const contracts = require('../../../../source_data/master-data/contracts.json');
      const licenses = require('../../../../source_data/master-data/licenses.json');
      const stakeholders = require('../../../../source_data/master-data/stakeholders.json');
      const csms = require('../../../../source_data/master-data/csms.json');
      const users = require('../../../../source_data/master-data/users.json');
      const customers = require('../../../../source_data/master-data/customers.json');
      
      // Load churn prediction and risk data
      const churnPredictions = require('../../../../source_data/csm-data/churn_predictions.json');
      const championDepartureAlerts = require('../../../../source_data/csm-data/champion_departure_alerts.json');
      const revenueMovements = require('../../../../source_data/commercial_operations/revenue_movements.json');

      const accountData = accounts.find((acc: any) => acc.account?.id === resolvedParams.customerId || acc.id === resolvedParams.customerId);
      const subscription = subscriptions.find((sub: any) => sub.customer_id === resolvedParams.customerId);
      
      if (!accountData || !subscription) {
        setLoading(false);
        return;
      }

      // Get current utilization data from utilization_history.json (SAME AS ALL OTHER PAGES)
      // Find the latest snapshot date globally
      const allSnapshots = utilizationHistory.map((d: any) => d.snapshot_date).sort();
      const latestDate = allSnapshots[allSnapshots.length - 1];
      
      // Get all products for this customer at the latest date
      const currentUtilization = utilizationHistory.filter((util: any) => 
        util.customer_id === resolvedParams.customerId && util.snapshot_date === latestDate
      );

      if (currentUtilization.length === 0) {
        setLoading(false);
        return;
      }

      // Get contract information
      const accountContracts = contracts.filter((contract: any) => contract.customer_id === resolvedParams.customerId);
      const primaryContract = accountContracts.find((contract: any) => contract.status === 'Active') || accountContracts[0];

      // Calculate totals from utilization_history.json (SAME METHOD AS ALL OTHER PAGES)
      const totalLicenses = currentUtilization.reduce((sum: number, u: any) => sum + (u.total_licenses || 0), 0);
      const licensesUsed = currentUtilization.reduce((sum: number, u: any) => sum + (u.active_users || 0), 0);
      const licensesAvailable = totalLicenses - licensesUsed;
      const utilizationPercentage = totalLicenses > 0 ? (licensesUsed / totalLicenses) * 100 : 0;
      
      // Count unique products from utilization data
      const productCount = new Set(currentUtilization.map((u: any) => u.product_family)).size;
      
      // Get license information from licenses.json (for additional details like renewal dates, annual value)
      const accountLicenses = licenses.filter((license: any) => license.customer_id === resolvedParams.customerId);
      
      // Create enhanced product details by merging utilization_history (for accurate counts) with licenses.json (for metadata)
      const productDetails = currentUtilization.map((util: any) => {
        const licenseMetadata = accountLicenses.find((lic: any) => lic.product_family === util.product_family);
        return {
          product_family: util.product_family,
          license_count: util.total_licenses,
          active_users: util.active_users,
          utilization: util.total_licenses > 0 ? ((util.active_users / util.total_licenses) * 100).toFixed(1) : 0,
          adoption_stage: licenseMetadata?.adoption_stage || 'Unknown',
          annual_value: licenseMetadata?.annual_value || 0,
          renewal_date: licenseMetadata?.renewal_date || 'N/A',
          license_type: licenseMetadata?.license_type || 'N/A',
          tier: licenseMetadata?.tier || 'N/A'
        };
      });

      // Get user information
      const accountUsers = users.filter((user: any) => user.customer_id === resolvedParams.customerId);
      const activeUsers = licensesUsed; // Use active users from utilization_history.json
      const userCount = accountUsers.length;

      // Get CSM information
      const csmId = accountData.account?.csm_id || (accountData as any).csm_id;
      const csm = csms.find((c: any) => c.csm_id === csmId);

      // Get stakeholders
      const accountStakeholders = stakeholders.filter((stakeholder: any) => 
        stakeholder.customer_id === resolvedParams.customerId || 
        stakeholder.account_id === resolvedParams.customerId
      );
      const keyStakeholders = accountStakeholders.filter((stakeholder: any) => 
        stakeholder.influence_level === 'High' || stakeholder.champion_strength === 'Strong'
      );
      
      // Get churn prediction data (predictive risk assessment, not actual churn status)
      const churnPrediction = churnPredictions.find((p: any) => 
        p.account_id === resolvedParams.customerId
      );
      
      // Get champion departure alerts for this account
      const championDepartures = championDepartureAlerts.filter((alert: any) => 
        alert.account_id === resolvedParams.customerId
      ).map((departure: any) => ({
        ...departure,
        daysSinceDeparture: Math.ceil((new Date().getTime() - new Date(departure.departure_date).getTime()) / (1000 * 60 * 60 * 24))
      }));
      
      // Get historical churn events for this account
      const historicalChurnEvents = revenueMovements.filter((movement: any) => 
        movement.customer_id === resolvedParams.customerId && movement.movement_type === 'churn'
      ).map((movement: any) => ({
        ...movement,
        churnDate: movement.effective_date,
        arrLost: Math.abs(movement.arr_change),
        reason: movement.reason_code,
        preventable: ['not_using', 'competitor', 'product_fit', 'support_issues', 'feature_gaps'].includes(movement.reason_code)
      }));
      
      // Get customer data for additional context
      const customerData = customers.find((c: any) => c.customer_id === resolvedParams.customerId);
      
      // Analyze churn reasons and generate prevention strategies
      const churnReasons = historicalChurnEvents.reduce((acc: any, event: any) => {
        const reason = event.reason;
        if (!acc[reason]) {
          acc[reason] = { count: 0, arr: 0, preventable: false };
        }
        acc[reason].count += 1;
        acc[reason].arr += event.arrLost;
        acc[reason].preventable = event.preventable;
        return acc;
      }, {});
      
      // Generate prevention strategies based on risk factors
      const preventionStrategies = [];
      if (churnPrediction) {
        if (churnPrediction.risk_factors?.includes('low_usage')) {
          preventionStrategies.push('Increase product adoption through training and feature discovery');
        }
        if (churnPrediction.risk_factors?.includes('support_issues')) {
          preventionStrategies.push('Improve support response time and quality');
        }
        if (churnPrediction.risk_factors?.includes('competitor_mentions')) {
          preventionStrategies.push('Conduct competitive analysis and value demonstration');
        }
        if (churnPrediction.risk_factors?.includes('contract_renewal_risk')) {
          preventionStrategies.push('Schedule early renewal discussions and QBRs');
        }
        if (championDepartures.length > 0) {
          preventionStrategies.push('Develop relationships with new stakeholders and champions');
        }
      }
      
      // Generate churn alerts
      const churnAlerts = [];
      if (churnPrediction && churnPrediction.churn_probability > 0.7) {
        churnAlerts.push({
          type: 'critical',
          title: 'High Churn Risk',
          description: `Account has ${(churnPrediction.churn_probability * 100).toFixed(1)}% churn probability`,
          priority: 'critical'
        });
      }
      if (championDepartures.length > 0) {
        churnAlerts.push({
          type: 'warning',
          title: 'Champion Departure',
          description: `${championDepartures.length} key stakeholder(s) have departed`,
          priority: 'high'
        });
      }
      if (historicalChurnEvents.length > 0) {
        churnAlerts.push({
          type: 'info',
          title: 'Historical Churn',
          description: `Account has churned ${historicalChurnEvents.length} time(s) in the past`,
          priority: 'medium'
        });
      }
      
      // Calculate churn trend
      const recentChurnEvents = historicalChurnEvents.filter((event: any) => {
        const churnDate = new Date(event.churnDate);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return churnDate >= sixMonthsAgo;
      });
      
      const churnTrend = recentChurnEvents.length === 0 ? 'stable' : 
                        recentChurnEvents.length >= 2 ? 'increasing' : 'moderate';
      
      // Extract real competitor threats from account timeline
      const competitorMentions: any[] = [];
      if (accountData.timeline) {
        accountData.timeline.forEach((timelineItem: any) => {
          // Check expansion signals for competitor mentions
          if (timelineItem.expansion_signals) {
            const hasCompetitorMention = timelineItem.expansion_signals.some((signal: string) => 
              signal.toLowerCase().includes('competitor')
            );
            if (hasCompetitorMention) {
              competitorMentions.push({
                date: timelineItem.date,
                month: timelineItem.month,
                signals: timelineItem.expansion_signals.filter((s: string) => 
                  s.toLowerCase().includes('competitor')
                )
              });
            }
          }
          
          // Check engagement events for competitor mentions
          if (timelineItem.engagement_events) {
            timelineItem.engagement_events.forEach((event: any) => {
              if (event.notes && event.notes.toLowerCase().includes('competitor')) {
                competitorMentions.push({
                  date: event.date,
                  type: event.type,
                  notes: event.notes,
                  outcome: event.outcome
                });
              }
            });
          }
        });
      }
      
      // Determine threat level based on frequency and recency
      const recentCompetitorMentions = competitorMentions.filter((mention: any) => {
        const mentionDate = new Date(mention.date);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return mentionDate >= threeMonthsAgo;
      });
      
      const competitorThreats = competitorMentions.length > 0 ? [{
        competitor: 'Competitive Activity Detected',
        threat_level: recentCompetitorMentions.length >= 2 ? 'high' : 
                     recentCompetitorMentions.length === 1 ? 'medium' : 'low',
        last_mention: competitorMentions.length > 0 ? 
          new Date(competitorMentions[competitorMentions.length - 1].date).toLocaleDateString() : 'N/A',
        mention_count: competitorMentions.length,
        recent_mentions: recentCompetitorMentions.length
      }] : [];

      // Calculate month-over-month change
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];
      
      const previousUtilization = utilizationHistory.filter((util: any) => 
        util.customer_id === resolvedParams.customerId && util.snapshot_date === oneMonthAgoStr
      );
      
      let momChange = 0;
      let hasValidTrend = false;
      if (previousUtilization.length > 0) {
        // Calculate average utilization for previous month (same method as current)
        const prevTotalLicenses = previousUtilization.reduce((sum: number, u: any) => sum + (u.total_licenses || 0), 0);
        const prevLicensesUsed = previousUtilization.reduce((sum: number, u: any) => sum + (u.active_users || 0), 0);
        const prevUtilizationPercentage = prevTotalLicenses > 0 ? (prevLicensesUsed / prevTotalLicenses) * 100 : 0;
        momChange = utilizationPercentage - prevUtilizationPercentage;
        hasValidTrend = true;
        
        console.log(`📊 Utilization Trend for ${resolvedParams.customerId}:`, {
          current: utilizationPercentage.toFixed(1),
          previous: prevUtilizationPercentage.toFixed(1),
          change: momChange.toFixed(1),
          currentDate: latestDate,
          previousDate: oneMonthAgoStr
        });
      } else {
        console.log(`⚠️ No previous month data for ${resolvedParams.customerId} on ${oneMonthAgoStr}`);
      }

      // Calculate annual waste cost (using real available licenses)
      const annualWasteCost = licensesAvailable * 100; // $100 per unused license per year

      // Calculate priority score (using real utilization percentage)
      const priorityScore = Math.round((accountData.account?.health_score || 0) * 0.7 + utilizationPercentage * 0.3);

      // Determine recommended action (using real utilization percentage)
      let recommendedAction = 'MONITOR: Continue current engagement strategy';
      if (utilizationPercentage < 30) {
        recommendedAction = 'CRITICAL: Immediate intervention required - Low utilization';
      } else if (utilizationPercentage < 50) {
        recommendedAction = 'HIGH: Schedule adoption review and training';
      } else if (utilizationPercentage < 70) {
        recommendedAction = 'MEDIUM: Increase engagement and feature adoption';
      }

      const accountDetail: AccountDetail = {
        // Basic Account Info
        customerId: resolvedParams.customerId,
        customerName: accountData.account?.name || (accountData as any).customer_name || (accountData as any).name || 'Unknown',
        industry: accountData.account?.industry || (accountData as any).industry || 'Technology',
        region: accountData.account?.geography?.region || (accountData as any).region || 'Americas',
        tier: accountData.account?.tier || (accountData as any).tier || 'Mid-Market',
        arr: accountData.account?.arr || (accountData as any).arr || 0,  // Use account-level ARR from accounts.json
        healthScore: accountData.account?.health_score || (accountData as any).health_score || 70,
        createdDate: accountData.account?.created_date || (accountData as any).created_date || 'N/A',
        isHeroAccount: accountData.account?.is_hero_account || (accountData as any).is_hero_account || false,
        storyType: accountData.account?.story_type || (accountData as any).story_type || 'N/A',
        
        // Contract Information
        contracts: accountContracts,
        primaryContract: primaryContract,
        
        // License Information
        licenses: productDetails,  // Use enhanced product details from utilization_history
        totalLicenses: totalLicenses,
        totalUsers: totalLicenses,  // Total license capacity
        activeUsers: activeUsers,
        
        // Churn Risk Information (predictive, not actual churn)
        isAtChurnRisk: churnPrediction && churnPrediction.churn_probability > 0.5,
        churnRiskLevel: churnPrediction?.churn_probability_tier || null,
        churnProbability: churnPrediction?.churn_probability || 0,
        estimatedChurnDate: churnPrediction?.estimated_churn_date || null,
        churnPrediction: churnPrediction || null,
        
        // Comprehensive Churn Analysis
        championDepartures: championDepartures,
        historicalChurnEvents: historicalChurnEvents,
        churnReasons: Object.entries(churnReasons).map(([reason, data]: [string, any]) => ({
          reason,
          ...data
        })),
        preventionStrategies: preventionStrategies,
        churnAlerts: churnAlerts,
        riskFactors: churnPrediction?.risk_factors || [],
        interventionWindow: churnPrediction?.intervention_window_days || 0,
        lastChurnEvent: historicalChurnEvents.length > 0 ? historicalChurnEvents[0] : null,
        churnTrend: churnTrend,
        competitorThreats: competitorThreats,
        productCount: productCount,
        
        // User Information
        users: accountUsers,
        userCount: userCount,
        
        // CSM Information
        csm: csm || null,
        
        // Stakeholders
        stakeholders: accountStakeholders,
        keyStakeholders: keyStakeholders,
        
        // Utilization Data
        utilizationPercentage: utilizationPercentage,
        licensesUsed: licensesUsed,
        licensesAvailable: licensesAvailable,
        utilizationTrend: hasValidTrend ? (momChange > 0 ? 'increasing' : momChange < 0 ? 'decreasing' : 'stable') : 'no-data',
        momChange: hasValidTrend ? momChange : 0,
        hasValidTrend: hasValidTrend,
        annualWasteCost: annualWasteCost,
        priorityScore: priorityScore,
        recommendedAction: recommendedAction
      };

      setAccount(accountDetail);
      setLoading(false);
    } catch (error) {
      console.error('Error loading account details:', error);
      setLoading(false);
    }
  }, [resolvedParams.customerId]);

  const getHealthColor = (healthScore: number) => {
    if (healthScore < 60) return 'bg-red-100 text-red-800';
    if (healthScore < 75) return 'bg-orange-100 text-orange-800';
    if (healthScore < 90) return 'bg-green-100 text-green-800';
    return 'bg-green-100 text-green-800';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 30) return 'text-red-600';
    if (utilization < 50) return 'text-orange-600';
    if (utilization < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <span className="text-green-500">↗</span>;
      case 'decreasing': return <span className="text-red-500">↘</span>;
      default: return <span className="text-gray-500">→</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading account details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex h-screen">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h1>
            <p className="text-gray-600 mb-4">The requested account could not be found.</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
      <div className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{account.customerName}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(account.healthScore)}`}>
                  Health Score: {account.healthScore}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {account.tier}
                </span>
                {account.isHeroAccount && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Hero Account
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.arr)}</p>
              <p className="text-sm text-gray-600">Annual Recurring Revenue</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                <p className={`text-2xl font-bold ${getUtilizationColor(account.utilizationPercentage)}`}>
                  {account.utilizationPercentage.toFixed(1)}%
                </p>
              </div>
              {account.hasValidTrend && (
                <div className="flex items-center">
                  {getTrendIcon(account.utilizationTrend)}
                  <span className="ml-1 text-sm text-gray-600">
                    {account.momChange > 0 ? '+' : ''}{account.momChange.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Licenses</p>
                <p className="text-2xl font-bold text-gray-900">{account.totalLicenses.toLocaleString()}</p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{account.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500">of {account.totalUsers.toLocaleString()} total</p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">{account.productCount}</p>
              </div>
              <span className="text-4xl">📦</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contract Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                🏢 Contract Information
              </h2>
              {account.primaryContract ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contract ID</p>
                      <p className="text-lg font-semibold text-gray-900">{account.primaryContract.contract_id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        account.primaryContract.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {account.primaryContract.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Start Date</p>
                      <p className="text-lg text-gray-900">{formatDate(account.primaryContract.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">End Date</p>
                      <p className="text-lg text-gray-900">{formatDate(account.primaryContract.end_date)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Terms</p>
                      <p className="text-lg text-gray-900">{account.primaryContract.payment_terms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Auto Renewal</p>
                      <div className="flex items-center">
                        {account.primaryContract.auto_renewal ? (
                          <span className="text-green-500 mr-2">✅</span>
                        ) : (
                          <span className="text-red-500 mr-2">❌</span>
                        )}
                        <span className="text-lg text-gray-900">
                          {account.primaryContract.auto_renewal ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contract Type</p>
                    <p className="text-lg text-gray-900">{account.primaryContract.contract_type}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No contract information available</p>
              )}
            </div>

            {/* License Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                📦 License Details
              </h2>
              {account.licenses.length > 0 ? (
                <div className="space-y-4">
                  {account.licenses.map((license, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{license.product_family}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          license.adoption_stage === 'Mature' ? 'bg-green-100 text-green-800' :
                          license.adoption_stage === 'Advanced' ? 'bg-blue-100 text-blue-800' :
                          license.adoption_stage === 'Developing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {license.adoption_stage}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Licenses</p>
                          <p className="font-semibold">{license.license_count.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Utilization</p>
                          <p className={`font-semibold ${getUtilizationColor(license.utilization)}`}>
                            {license.utilization}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Annual Value</p>
                          <p className="font-semibold">{formatCurrency(license.annual_value)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Renewal Date</p>
                          <p className="font-semibold">{formatDate(license.renewal_date)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No license information available</p>
              )}
            </div>

            {/* User List */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  👥 Users ({account.userCount})
                </h2>
                <div className="text-sm text-gray-600">
                  Showing {Math.min((currentPage - 1) * usersPerPage + 1, account.userCount)}-{Math.min(currentPage * usersPerPage, account.userCount)} of {account.userCount}
                </div>
              </div>
              
              {account.users.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {account.users
                          .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
                          .map((user, index) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.department}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.activity_level === 'High' ? 'bg-green-100 text-green-800' :
                                user.activity_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.activity_level}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.features_used}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(user.last_login)}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {account.userCount > usersPerPage && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <div className="px-4 py-2 text-sm text-gray-700 bg-white border-t border-b border-gray-300">
                          Page {currentPage} of {Math.ceil(account.userCount / usersPerPage)}
                        </div>
                        <button
                          onClick={() => setCurrentPage(Math.min(Math.ceil(account.userCount / usersPerPage), currentPage + 1))}
                          disabled={currentPage === Math.ceil(account.userCount / usersPerPage)}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="text-sm text-gray-700">
                        {account.userCount} total users
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-600">No user information available</p>
              )}
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Churn Risk Alert (Predictive) */}
            {account.isAtChurnRisk && account.churnPrediction && (
              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg shadow-sm p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-base font-bold text-orange-900">
                      ⚠️ HIGH CHURN RISK
                    </h3>
                    <p className="text-xs text-orange-700 mt-1">Predictive Alert</p>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2 text-sm text-orange-800">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Risk Level:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${account.churnRiskLevel === 'High' ? 'bg-red-200 text-red-900' : 'bg-orange-200 text-orange-900'}`}>
                      {account.churnRiskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Probability:</span>
                    <span className="font-bold text-base">{(account.churnProbability * 100).toFixed(1)}%</span>
                  </div>
                  {account.estimatedChurnDate && (
                    <div className="pt-2 border-t border-orange-200">
                      <p className="text-xs font-medium">Estimated Churn:</p>
                      <p className="text-sm font-semibold">{new Date(account.estimatedChurnDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-orange-200">
                    <p className="text-xs font-medium">ARR at Risk:</p>
                    <p className="text-base font-bold">${(account.churnPrediction.arr_at_risk || account.arr).toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Intervention Window:</span>
                    <span className="font-semibold">{account.churnPrediction.intervention_window_days || 'N/A'} days</span>
                  </div>
                </div>
                
                {/* Recommended Action */}
                <div className="mt-3 p-2 bg-orange-100 rounded border border-orange-200">
                  <p className="text-xs font-medium text-orange-900">Recommended Action:</p>
                  <p className="text-sm font-semibold text-orange-900 mt-1">{account.churnPrediction.recommended_action}</p>
                </div>
                
                {/* Risk Factors */}
                {account.churnPrediction.risk_factors && account.churnPrediction.risk_factors.length > 0 && (
                  <div className="mt-3 p-2 bg-orange-100 rounded border border-orange-200">
                    <h4 className="text-xs font-bold text-orange-900 mb-2">📉 AI-Detected Risk Factors:</h4>
                    <div className="space-y-2">
                      {account.churnPrediction.risk_factors.map((factor: any, idx: number) => (
                        <div key={idx} className="text-xs">
                          <p className="font-medium text-orange-900">
                            {factor.factor} <span className="px-1.5 py-0.5 bg-orange-200 rounded">{factor.severity}</span>
                          </p>
                          <p className="text-orange-700 mt-0.5">{factor.description}</p>
                          <p className="text-orange-600 mt-0.5">Risk: {(factor.contribution_to_risk * 100).toFixed(0)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Model Info */}
                <div className="mt-3 px-2 py-1.5 bg-green-50 border border-green-200 rounded">
                  <p className="text-xs text-green-800">
                    ✅ <strong>Model:</strong> {account.churnPrediction.model_type} (v{account.churnPrediction.model_version})
                    <br/>
                    🎯 <strong>Confidence:</strong> {account.churnPrediction.confidence_level} ({(account.churnPrediction.confidence_score * 100).toFixed(0)}%)
                  </p>
                </div>
              </div>
            )}

            {/* Comprehensive Churn Analysis */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                📊 Comprehensive Churn Analysis
              </h2>
              
              {/* Churn Alerts */}
              {account.churnAlerts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">🚨 Active Churn Alerts</h3>
                  <div className="space-y-2">
                    {account.churnAlerts.map((alert: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-lg border ${
                        alert.type === 'critical' ? 'bg-red-50 border-red-200' :
                        alert.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-medium ${
                              alert.type === 'critical' ? 'text-red-900' :
                              alert.type === 'warning' ? 'text-orange-900' :
                              'text-blue-900'
                            }`}>
                              {alert.title}
                            </h4>
                            <p className={`text-sm ${
                              alert.type === 'critical' ? 'text-red-700' :
                              alert.type === 'warning' ? 'text-orange-700' :
                              'text-blue-700'
                            }`}>
                              {alert.description}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            alert.priority === 'critical' ? 'bg-red-200 text-red-800' :
                            alert.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                            'bg-blue-200 text-blue-800'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Champion Departures */}
              {account.championDepartures.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">👥 Champion Departures</h3>
                  <div className="space-y-3">
                    {account.championDepartures.map((departure: any, idx: number) => (
                      <div key={idx} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-orange-900">{departure.champion_name}</h4>
                          <span className="text-sm text-orange-700">{departure.daysSinceDeparture} days ago</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-orange-600">Role:</span>
                            <span className="ml-1 text-orange-900">{departure.champion_role}</span>
                          </div>
                          <div>
                            <span className="text-orange-600">Impact Score:</span>
                            <span className="ml-1 text-orange-900">{departure.impact_score}/100</span>
                          </div>
                          <div>
                            <span className="text-orange-600">New Company:</span>
                            <span className="ml-1 text-orange-900">{departure.new_company}</span>
                          </div>
                          <div>
                            <span className="text-orange-600">New Role:</span>
                            <span className="ml-1 text-orange-900">{departure.new_role}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical Churn Events */}
              {account.historicalChurnEvents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">📈 Historical Churn Events</h3>
                  <div className="space-y-3">
                    {account.historicalChurnEvents.map((event: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Churn Event #{idx + 1}</h4>
                          <span className="text-sm text-gray-600">{new Date(event.churnDate).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Reason:</span>
                            <span className="ml-1 text-gray-900">{event.reason}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">ARR Lost:</span>
                            <span className="ml-1 text-gray-900">${(event.arrLost / 1000).toFixed(0)}K</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Preventable:</span>
                            <span className={`ml-1 ${event.preventable ? 'text-green-600' : 'text-red-600'}`}>
                              {event.preventable ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Trend:</span>
                            <span className={`ml-1 ${
                              account.churnTrend === 'increasing' ? 'text-red-600' :
                              account.churnTrend === 'stable' ? 'text-green-600' :
                              'text-orange-600'
                            }`}>
                              {account.churnTrend}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Churn Reasons Analysis */}
              {account.churnReasons.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">🔍 Churn Reasons Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {account.churnReasons.map((reason: any, idx: number) => (
                      <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 capitalize">{reason.reason}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            reason.preventable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {reason.preventable ? 'Preventable' : 'Not Preventable'}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>Occurrences: {reason.count}</div>
                          <div>Total ARR Lost: ${(reason.arr / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prevention Strategies */}
              {account.preventionStrategies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">🛡️ Prevention Strategies</h3>
                  <div className="space-y-2">
                    {account.preventionStrategies.map((strategy: string, idx: number) => (
                      <div key={idx} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Factors */}
              {account.riskFactors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">⚠️ Current Risk Factors</h3>
                  <div className="space-y-2">
                    {account.riskFactors.map((factor: any, idx: number) => {
                      // Handle both object format {factor: "...", severity: "..."} and string format
                      const factorText = typeof factor === 'string' ? factor : factor.factor || 'Unknown';
                      const severity = typeof factor === 'object' && factor.severity ? factor.severity : null;
                      const description = typeof factor === 'object' && factor.description ? factor.description : null;
                      
                      return (
                        <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start">
                            <span className="text-red-600 mr-2 mt-1">•</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-gray-900 font-medium">{factorText}</span>
                                {severity && (
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    severity === 'High' ? 'bg-red-200 text-red-800' :
                                    severity === 'Medium' ? 'bg-orange-200 text-orange-800' :
                                    'bg-yellow-200 text-yellow-800'
                                  }`}>
                                    {severity}
                                  </span>
                                )}
                              </div>
                              {description && (
                                <p className="text-sm text-gray-600">{description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Competitor Threats */}
              {account.competitorThreats.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">🏢 Competitor Threats</h3>
                  <div className="space-y-2">
                    {account.competitorThreats.map((threat: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-700">{threat.competitor}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            threat.threat_level === 'high' ? 'bg-red-100 text-red-800' :
                            threat.threat_level === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {threat.threat_level}
                          </span>
                          <span className="text-xs text-gray-500">{threat.last_mention}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Intervention Window */}
              {account.interventionWindow > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">⏰ Intervention Window</h3>
                  <p className="text-blue-700">
                    You have <strong>{account.interventionWindow} days</strong> to implement prevention strategies before the risk increases significantly.
                  </p>
                </div>
              )}
            </div>

            {/* CSM Information */}
            {account.csm && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  👤 Customer Success Manager
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-lg font-semibold text-gray-900">{account.csm.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Performance Score</p>
                    <p className="text-lg text-gray-900">{account.csm.performance_score}/100</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Specialization</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {account.csm.specialization.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Stakeholders */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                👥 Key Stakeholders
              </h2>
              {account.keyStakeholders.length > 0 ? (
                <div className="space-y-3">
                  {account.keyStakeholders.slice(0, 5).map((stakeholder, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{stakeholder.name}</p>
                          <p className="text-sm text-gray-600">{stakeholder.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Engagement</p>
                          <p className="font-semibold text-gray-900">{stakeholder.engagement_score}/10</p>
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          stakeholder.influence_level === 'High' ? 'bg-red-100 text-red-800' :
                          stakeholder.influence_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {stakeholder.influence_level} Influence
                        </span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          stakeholder.champion_strength === 'Strong' ? 'bg-green-100 text-green-800' :
                          stakeholder.champion_strength === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {stakeholder.champion_strength} Champion
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No stakeholder information available</p>
              )}
            </div>

            {/* Recommended Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                ⚠️ Recommended Actions
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">{account.recommendedAction}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Priority Score:</strong> {account.priorityScore}/100</p>
                  <p><strong>Annual Waste Cost:</strong> {formatCurrency(account.annualWasteCost)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}