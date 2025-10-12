'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { loadAccounts, loadUtilizationHistory } from '../../../../lib/data/csmDataLoader';
import { loadAccountDeepDive } from '../../../../lib/data/accountDeepDiveLoader';
import { useSidebar } from '../../../../contexts/SidebarContext';
import AccountHeader from '../../../../components/AccountDeepDive/AccountHeader';
import AccountOverview from '../../../../components/AccountDeepDive/AccountOverview';
import HealthRiskAssessment from '../../../../components/AccountDeepDive/HealthRiskAssessment';
import UtilizationMetrics from '../../../../components/AccountDeepDive/UtilizationMetrics';
import UserActivityBreakdown from '../../../../components/AccountDeepDive/UserActivityBreakdown';
import FeatureAdoptionAnalysis from '../../../../components/AccountDeepDive/FeatureAdoptionAnalysis';
import TrainingEnablement from '../../../../components/AccountDeepDive/TrainingEnablement';
import AlertsRecommendations from '../../../../components/AccountDeepDive/AlertsRecommendations';
import SuccessPlan from '../../../../components/AccountDeepDive/SuccessPlan';
import AccountHistory from '../../../../components/AccountDeepDive/AccountHistory';

interface Alert {
  id: number;
  severity: 'high' | 'medium' | 'low';
  title: string;
  triggered: string;
  details: string;
  impact: string;
  action: string;
  status: string;
}

function AccountDeepDiveContent() {
  const router = useRouter();
  const params = useParams();
  const accountId = params?.id as string;
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [accountData, setAccountData] = useState<any>(null);

  useEffect(() => {
    try {
      const accounts = loadAccounts();
      const utilizationData = loadUtilizationHistory() as any[];
      
      // Find the specific account
      const account = accounts.find((acc: any) => 
        (acc.account?.id === accountId || acc.id === accountId)
      ) as any;
      
      if (!account) {
        setLoading(false);
        return;
      }

      // Get utilization data for this account
      const accountUtilization = utilizationData.filter((util: any) => 
        util.customer_id === accountId
      );

      // Calculate metrics
      const latestDate = utilizationData.map((d: any) => d.snapshot_date).sort().pop();
      const latestUtil = accountUtilization.filter((d: any) => d.snapshot_date === latestDate);
      
      const totalLicenses = latestUtil.reduce((sum: number, u: any) => sum + u.total_licenses, 0);
      const activeUsers = latestUtil.reduce((sum: number, u: any) => sum + u.active_users, 0);
      const utilizationRate = totalLicenses > 0 ? (activeUsers / totalLicenses) * 100 : 0;
      const unusedLicenses = totalLicenses - activeUsers;

      const utilization = {
        rate: utilizationRate,
        totalLicenses,
        activeUsers,
        unusedLicenses,
        trend: 'Declining',
        history: accountUtilization
      };

      // Load real data from JSON files
      const deepDiveData = loadAccountDeepDive(accountId, utilization);

      // Get real users and products from the account data
      const accountUsers = account.users || [];
      const accountProducts = account.products || [];
      
      const enrichedAccount = {
        ...account,
        utilization,
        healthTrend: deepDiveData.healthTrend,
        deepDiveData,
        users: accountUsers,
        products: accountProducts
      };

      setAccountData(enrichedAccount);
      setLoading(false);
    } catch (error) {
      console.error('Error loading account details:', error);
      setLoading(false);
    }
  }, [accountId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-gray-600">Loading account details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-red-600">Account not found</div>
          </div>
        </div>
      </div>
    );
  }

  const accountInfo = accountData.account || accountData;
  const deepDiveData = accountData.deepDiveData;
  const healthScore = deepDiveData.healthScore;
  const churnRisk = deepDiveData.churnRisk;
  const npsScore = deepDiveData.npsScore;
  
  // Calculate days to renewal
  const renewalDate = new Date(accountInfo.next_renewal_date || '2025-11-27');
  const today = new Date();
  const daysToRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Use real alerts from data
  const alerts = deepDiveData.alerts;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} p-8`}>
        <AccountHeader 
          accountName={accountInfo.name}
          accountId={accountInfo.id}
          csmName={accountInfo.csm_name || 'Sarah Chen'}
          onBack={() => router.back()}
        />
        
        <AccountOverview 
          account={accountInfo}
          daysToRenewal={daysToRenewal}
        />
        
        <HealthRiskAssessment 
          healthScore={healthScore}
          churnRisk={churnRisk}
          npsScore={npsScore}
          healthTrend={accountData.healthTrend}
        />
        
        <UtilizationMetrics 
          utilization={accountData.utilization}
        />
        
        <UserActivityBreakdown 
          totalLicenses={accountData.utilization.totalLicenses}
          activeUsers={accountData.utilization.activeUsers}
          users={accountData.users || []}
        />
        
        <FeatureAdoptionAnalysis 
          products={accountData.products || []}
          users={accountData.users || []}
        />
        
        <TrainingEnablement />
        
        <AlertsRecommendations 
          alerts={alerts}
          potentialARR={accountInfo.arr || 180000}
        />
        
        <SuccessPlan />
        
        <AccountHistory />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            ← Back to Portfolio
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📧 Email Account Summary
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            📅 Schedule Meeting
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            📞 Log Call
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            📝 Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountDeepDivePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <AccountDeepDiveContent />
    </Suspense>
  );
}
