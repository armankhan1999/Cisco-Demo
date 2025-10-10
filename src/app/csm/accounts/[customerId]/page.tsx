'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { loadAccounts, loadSubscriptions, loadUtilizationHistory } from '../../../../lib/data/csmDataLoader';

interface AccountDetail {
  customerId: string;
  customerName: string;
  industry: string;
  region: string;
  tier: string;
  arr: number;
  healthScore: number;
  renewalDate: string;
  daysToRenewal: number;
  utilizationPercentage: number;
  totalLicenses: number;
  licensesUsed: number;
  licensesAvailable: number;
  productFamily: string;
  utilizationTrend: string;
  momChange: number;
  annualWasteCost: number;
  priorityScore: number;
  recommendedAction: string;
}

export default function AccountDetailPage({ params }: { params: { customerId: string } }) {
  const router = useRouter();
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const accounts = loadAccounts();
      const subscriptions = loadSubscriptions();
      const utilizationHistory = loadUtilizationHistory();

      const accountData = accounts.find(acc => acc.account?.id === params.customerId || acc.id === params.customerId);
      const subscription = subscriptions.find(sub => sub.customer_id === params.customerId);
      
      if (!accountData || !subscription) {
        setLoading(false);
        return;
      }

      // Get current utilization data
      const currentDate = new Date().toISOString().split('T')[0];
      let currentUtilization = utilizationHistory.filter(util => 
        util.customer_id === params.customerId && util.snapshot_date === currentDate
      );
      
      if (currentUtilization.length === 0) {
        const latestDate = utilizationHistory
          .filter(util => util.customer_id === params.customerId)
          .map(u => u.snapshot_date)
          .sort()
          .pop();
        currentUtilization = utilizationHistory.filter(util => 
          util.customer_id === params.customerId && util.snapshot_date === latestDate
        );
      }

      if (currentUtilization.length === 0) {
        setLoading(false);
        return;
      }

      const util = currentUtilization[0];
      const renewalDate = subscription.next_renewal_date || '';
      const daysToRenewal = renewalDate 
        ? Math.ceil((new Date(renewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 365;

      // Calculate priority score
      let priorityScore = 0;
      if (util.utilization_percentage < 20) priorityScore += 40;
      if (accountData.health_score < 60) priorityScore += 30;
      if (daysToRenewal < 90) priorityScore += 20;
      if (subscription.arr > 100000) priorityScore += 10;

      // Determine recommended action
      let recommendedAction = 'Monitor + Quarterly Check-in';
      if (daysToRenewal < 60 && util.utilization_percentage < 20 && accountData.health_score < 60) {
        recommendedAction = 'URGENT: Emergency QBR + Exec Escalation';
      } else if (daysToRenewal < 90 && util.utilization_percentage < 30) {
        recommendedAction = 'HIGH: Pre-Renewal Intervention Required';
      } else if (util.utilization_percentage < 15) {
        recommendedAction = 'HIGH: Validate License Requirements + Right-Size';
      }

      const accountDetail: AccountDetail = {
        customerId: params.customerId,
        customerName: accountData.account?.name || accountData.customer_name || accountData.name || 'Unknown',
        industry: accountData.account?.industry || accountData.industry || 'Technology',
        region: accountData.account?.region || accountData.region || 'Americas',
        tier: accountData.account?.tier || accountData.tier || 'Mid-Market',
        arr: subscription.arr || 0,
        healthScore: accountData.account?.health_score || accountData.health_score || 70,
        renewalDate,
        daysToRenewal,
        utilizationPercentage: util.utilization_percentage,
        totalLicenses: util.total_licenses,
        licensesUsed: util.licenses_used,
        licensesAvailable: util.licenses_available,
        productFamily: util.product_family,
        utilizationTrend: util.utilization_trend || 'stable',
        momChange: util.month_over_month_change || 0,
        annualWasteCost: util.licenses_available * 50 * 12, // $50/month per seat average
        priorityScore,
        recommendedAction
      };

      setAccount(accountDetail);
      setLoading(false);
    } catch (error) {
      console.error('Error loading account details:', error);
      setLoading(false);
    }
  }, [params.customerId]);

  const getHealthColor = (healthScore: number) => {
    if (healthScore < 60) return 'bg-red-100 text-red-800';
    if (healthScore < 75) return 'bg-orange-100 text-orange-800';
    if (healthScore < 90) return 'bg-green-100 text-green-800';
    return 'bg-green-100 text-green-800';
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 20) return 'bg-red-100 text-red-800';
    if (utilization < 40) return 'bg-orange-100 text-orange-800';
    if (utilization < 60) return 'bg-yellow-100 text-yellow-800';
    if (utilization < 80) return 'bg-green-100 text-green-800';
    return 'bg-green-100 text-green-800';
  };

  const getRenewalColor = (daysToRenewal: number) => {
    if (daysToRenewal < 30) return 'bg-red-100 text-red-800';
    if (daysToRenewal < 60) return 'bg-orange-100 text-orange-800';
    if (daysToRenewal < 90) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗';
      case 'decreasing': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string, momChange: number) => {
    if (trend === 'stable') return 'text-gray-600';
    return momChange > 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-8 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-8 py-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h1>
              <p className="text-gray-600 mb-6">The requested account could not be found.</p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPersona="CSM"
        onPersonaChange={() => {}} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="px-8 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-900 mb-2 flex items-center"
                  >
                    ← Back to Portfolio
                  </button>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {account.customerName}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {account.customerId} • {account.industry} • {account.region}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    📊 Export Report
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    📅 Schedule Meeting
                  </button>
                </div>
              </div>
            </div>

            {/* Account Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tier:</span>
                    <span className="font-medium">{account.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ARR:</span>
                    <span className="font-bold text-green-600">{formatCurrency(account.arr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health Score:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getHealthColor(account.healthScore)}`}>
                      {account.healthScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renewal Date:</span>
                    <span className="text-sm">{formatDate(account.renewalDate)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilization Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilization:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getUtilizationColor(account.utilizationPercentage)}`}>
                      {account.utilizationPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Licenses:</span>
                    <span className="font-medium">{account.licensesUsed.toLocaleString()}/{account.totalLicenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unused:</span>
                    <span className="font-medium text-red-600">{account.licensesAvailable.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trend:</span>
                    <span className={`flex items-center space-x-1 ${getTrendColor(account.utilizationTrend, account.momChange)}`}>
                      <span>{getTrendIcon(account.utilizationTrend)}</span>
                      <span className="text-xs">
                        {account.momChange >= 0 ? '+' : ''}{account.momChange.toFixed(1)}%
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority & Actions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority Score:</span>
                    <span className="font-bold text-orange-600">{account.priorityScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days to Renewal:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRenewalColor(account.daysToRenewal)}`}>
                      {account.daysToRenewal} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Waste:</span>
                    <span className="font-medium text-red-600">{formatCurrency(account.annualWasteCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Action</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">{account.recommendedAction}</p>
              </div>
            </div>

            {/* Utilization Chart Placeholder */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilization Trend (Last 90 Days)</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-600">Utilization trend chart would be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Current: {account.utilizationPercentage.toFixed(1)}% | 
                    Trend: {getTrendIcon(account.utilizationTrend)} {account.momChange >= 0 ? '+' : ''}{account.momChange.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
