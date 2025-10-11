'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActiveUsersKPI } from '../../../../components/CSM/LicenseUtilization/ActiveUsersKPI';
import { SeatWasteKPI } from '../../../../components/CSM/LicenseUtilization/SeatWasteKPI';
import { FeatureAdoptionKPI } from '../../../../components/CSM/LicenseUtilization/FeatureAdoptionKPI';
import { TotalLicensedSeatsKPI } from '../../../../components/CSM/LicenseUtilization/TotalLicensedSeatsKPI';
import { UtilizationDistribution } from '../../../../components/CSM/LicenseUtilization/UtilizationDistribution';
import { UtilizationByProduct } from '../../../../components/CSM/LicenseUtilization/UtilizationByProduct';
import { UtilizationTrendAnalysis } from '../../../../components/CSM/LicenseUtilization/UtilizationTrendAnalysis';
import { AccountUtilizationTable } from '../../../../components/CSM/LicenseUtilization/AccountUtilizationTable';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { useSidebar } from '../../../../contexts/SidebarContext';

export default function PortfolioUtilizationPage() {
  const router = useRouter();
  const [selectedBucket, setSelectedBucket] = useState<string | undefined>();
  const { isCollapsed } = useSidebar();

  const handleBucketClick = (bucket: string) => {
    setSelectedBucket(bucket);
  };

  const handleAccountClick = (customerId: string) => {
    router.push(`/csm/accounts/${customerId}`);
  };

  const handleBackToOverview = () => {
    router.push('/csm/portfolio');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar 
        currentPersona="CSM"
        onPersonaChange={() => {}} 
      />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <button
              onClick={handleBackToOverview}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium transition-colors"
            >
              ← Back to Portfolio Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                  📊 Portfolio License Utilization
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Comprehensive analysis of license usage, optimization opportunities, and cost efficiency
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">
                  📊 Export Report
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          
          {/* KPI Cards Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
              <span className="text-sm text-gray-500">Real-time metrics</span>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <TotalLicensedSeatsKPI drillDownUrl="/csm/kpi/license-details?focus=all" />
               <ActiveUsersKPI drillDownUrl="/csm/kpi/license-details?focus=active" />
               <SeatWasteKPI drillDownUrl="/csm/kpi/license-details?focus=waste" />
               <FeatureAdoptionKPI />
             </div>
          </section>

          {/* Distribution Analysis Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">📊</span>
                Utilization Distribution Analysis
              </h2>
              <p className="text-gray-600 mt-2">Portfolio segmentation by utilization ranges</p>
            </div>
            <UtilizationDistribution onBucketClick={handleBucketClick} />
          </section>

          {/* Product Family Analysis Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">🏭</span>
                Utilization by Product Family
              </h2>
              <p className="text-gray-600 mt-2">Product-level performance and benchmark comparison</p>
            </div>
            <UtilizationByProduct onProductClick={(product) => console.log('Product clicked:', product)} />
          </section>

          {/* Trend Analysis Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">📈</span>
                90-Day Utilization Trend Analysis
              </h2>
              <p className="text-gray-600 mt-2">Historical patterns and trajectory insights</p>
            </div>
            <UtilizationTrendAnalysis onDateClick={(date) => console.log('Date clicked:', date)} />
          </section>

          {/* Account Details Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="text-3xl">👥</span>
                Account-Level Utilization Details
              </h2>
              <p className="text-gray-600 mt-2">
                Detailed breakdown by account
                {selectedBucket && (
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Filtered: {selectedBucket}
                  </span>
                )}
              </p>
            </div>
            <AccountUtilizationTable 
              utilizationBucket={selectedBucket}
              onAccountClick={handleAccountClick}
            />
          </section>

          {/* Footer Spacer */}
          <div className="pb-8"></div>
        </div>
      </div>
    </div>
  );
}
