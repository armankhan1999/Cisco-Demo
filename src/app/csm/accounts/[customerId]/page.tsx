'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { loadAccounts, loadSubscriptions, loadUtilizationHistory } from '../../../../lib/data/csmDataLoader';
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
  annualWasteCost: number;
  priorityScore: number;
  recommendedAction: string;
  
  // Churn Risk Information (Predictive)
  isAtChurnRisk: boolean;
  churnRiskLevel: string | null;
  churnProbability: number;
  estimatedChurnDate: string | null;
  churnPrediction: any | null;
}

export default function AccountDetailPage({ params }: { params: Promise<{ customerId: string }> }) {
  const router = useRouter();
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

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
      
      // Load churn prediction data (predictive risk model)
      const churnPredictions = require('../../../../source_data/csm-data/churn_predictions.json');

      const accountData = accounts.find((acc: any) => acc.account?.id === resolvedParams.customerId || acc.id === resolvedParams.customerId);
      const subscription = subscriptions.find((sub: any) => sub.customer_id === resolvedParams.customerId);
      
      if (!accountData || !subscription) {
        setLoading(false);
        return;
      }

      // Get current utilization data
      const currentDate = new Date().toISOString().split('T')[0];
      let currentUtilization = utilizationHistory.filter((util: any) => 
        util.customer_id === resolvedParams.customerId && util.snapshot_date === currentDate
      );
      
      if (currentUtilization.length === 0) {
        const latestDate = utilizationHistory
          .filter((util: any) => util.customer_id === resolvedParams.customerId)
          .map((u: any) => u.snapshot_date)
          .sort()
          .pop();
        currentUtilization = utilizationHistory.filter((util: any) => 
          util.customer_id === resolvedParams.customerId && util.snapshot_date === latestDate
        );
      }

      if (currentUtilization.length === 0) {
        setLoading(false);
        return;
      }

      const util = currentUtilization[0];

      // Get contract information
      const accountContracts = contracts.filter((contract: any) => contract.customer_id === resolvedParams.customerId);
      const primaryContract = accountContracts.find((contract: any) => contract.status === 'Active') || accountContracts[0];

      // Get license information from licenses.json
      const accountLicenses = licenses.filter((license: any) => license.customer_id === resolvedParams.customerId);
      const totalLicensesFromProducts = accountLicenses.reduce((sum: number, license: any) => sum + license.license_count, 0);
      const productCount = new Set(accountLicenses.map((license: any) => license.product_family)).size;
      
      // Calculate REAL active users by summing across ALL products
      // Each product has: license_count × (utilization / 100) = active users for that product
      const totalActiveUsers = accountLicenses.reduce((sum: number, license: any) => {
        const productActiveUsers = Math.round(license.license_count * (license.utilization / 100));
        return sum + productActiveUsers;
      }, 0);
      
      // Calculate account-level totals (sum across all products)
      const totalLicenses = totalLicensesFromProducts;
      const licensesUsed = totalActiveUsers;  // Use calculated sum, not util.licenses_used
      const licensesAvailable = totalLicenses - licensesUsed;
      const utilizationPercentage = totalLicenses > 0 ? (licensesUsed / totalLicenses) * 100 : 0;

      // Get user information
      const accountUsers = users.filter((user: any) => user.customer_id === resolvedParams.customerId);
      const activeUsers = licensesUsed; // Use calculated active users (sum across all products)
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

      // Calculate month-over-month change
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];
      
      const previousUtilization = utilizationHistory.filter((util: any) => 
        util.customer_id === resolvedParams.customerId && util.snapshot_date === oneMonthAgoStr
      );
      
      let momChange = 0;
      if (previousUtilization.length > 0) {
        const prevUtil = previousUtilization[0];
        const prevUtilizationPercentage = prevUtil.utilization_percentage || 0;
        momChange = utilizationPercentage - prevUtilizationPercentage;
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
        arr: subscription.arr || 0,
        healthScore: accountData.account?.health_score || (accountData as any).health_score || 70,
        createdDate: accountData.account?.created_date || (accountData as any).created_date || 'N/A',
        isHeroAccount: accountData.account?.is_hero_account || (accountData as any).is_hero_account || false,
        storyType: accountData.account?.story_type || (accountData as any).story_type || 'N/A',
        
        // Contract Information
        contracts: accountContracts,
        primaryContract: primaryContract,
        
        // License Information
        licenses: accountLicenses,
        totalLicenses: totalLicenses,
        totalUsers: totalLicensesFromProducts,
        activeUsers: activeUsers,
        
        // Churn Risk Information (predictive, not actual churn)
        isAtChurnRisk: churnPrediction && churnPrediction.churn_probability > 0.5,
        churnRiskLevel: churnPrediction?.churn_probability_tier || null,
        churnProbability: churnPrediction?.churn_probability || 0,
        estimatedChurnDate: churnPrediction?.estimated_churn_date || null,
        churnPrediction: churnPrediction || null,
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
        utilizationTrend: momChange > 0 ? 'increasing' : momChange < 0 ? 'decreasing' : 'stable',
        momChange: momChange,
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
        <div className="flex-1 ml-[280px] p-6">
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
        <div className="flex-1 ml-[280px] p-6">
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
    <div className="flex h-screen">
      <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
      <div className="flex-1 ml-[280px] p-6 overflow-y-auto">
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
              
              {/* Churn Risk Banner (Predictive) */}
              {account.isAtChurnRisk && account.churnPrediction && (
                <div className="mt-4 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-lg font-bold text-orange-900">
                        ⚠️ HIGH CHURN RISK - PREDICTIVE ALERT
                      </h3>
                      <div className="mt-2 text-sm text-orange-800 space-y-1">
                        <p><strong>Risk Level:</strong> <span className={`px-2 py-1 rounded font-bold ${account.churnRiskLevel === 'High' ? 'bg-red-200 text-red-900' : 'bg-orange-200 text-orange-900'}`}>{account.churnRiskLevel}</span></p>
                        <p><strong>Churn Probability:</strong> <span className="text-lg font-bold">{(account.churnProbability * 100).toFixed(1)}%</span></p>
                        {account.estimatedChurnDate && (
                          <p><strong>Estimated Churn Date:</strong> {new Date(account.estimatedChurnDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        )}
                        <p><strong>ARR at Risk:</strong> <span className="text-lg font-bold">${(account.churnPrediction.arr_at_risk || account.arr).toLocaleString()}</span></p>
                        <p><strong>Intervention Window:</strong> {account.churnPrediction.intervention_window_days || 'N/A'} days</p>
                        <p><strong>Recommended Action:</strong> <span className="font-semibold">{account.churnPrediction.recommended_action}</span></p>
                      </div>
                      
                      {/* Churn Risk Factors */}
                      {account.churnPrediction.risk_factors && account.churnPrediction.risk_factors.length > 0 && (
                        <div className="mt-4 p-3 bg-orange-100 rounded border border-orange-200">
                          <h4 className="font-bold text-orange-900 mb-2">📉 AI-Detected Risk Factors:</h4>
                          <div className="space-y-2">
                            {account.churnPrediction.risk_factors.map((factor: any, idx: number) => (
                              <div key={idx} className="flex items-start">
                                <span className="text-orange-600 mr-2">•</span>
                                <div className="flex-1">
                                  <p className="font-medium text-orange-900">{factor.factor} <span className="text-xs px-2 py-0.5 bg-orange-200 rounded">{factor.severity}</span></p>
                                  <p className="text-xs text-orange-700">{factor.description}</p>
                                  <p className="text-xs text-orange-600 mt-1">Risk Contribution: {(factor.contribution_to_risk * 100).toFixed(0)}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Data Source */}
                      <div className="mt-3 px-3 py-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-xs text-green-800">
                          ✅ <strong>Predictive Model:</strong> <code className="bg-green-100 px-1 rounded">{account.churnPrediction.model_type}</code> (v{account.churnPrediction.model_version})
                          <br/>
                          📊 <strong>Data Source:</strong> <code className="bg-green-100 px-1 rounded">churn_predictions.json</code>
                          <br/>
                          🎯 <strong>Confidence:</strong> {account.churnPrediction.confidence_level} ({(account.churnPrediction.confidence_score * 100).toFixed(0)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
              <div className="flex items-center">
                {getTrendIcon(account.utilizationTrend)}
                <span className="ml-1 text-sm text-gray-600">
                  {account.momChange > 0 ? '+' : ''}{account.momChange.toFixed(1)}%
                </span>
              </div>
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