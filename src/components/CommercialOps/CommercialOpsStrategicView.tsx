'use client';

import { useState, useEffect } from 'react';
import { 
  getCommercialOpsKPIs, 
  getTrendData, 
  getExceptionAlerts,
  type CommercialOpsKPIs,
  type TrendData,
  type ExceptionAlert
} from '@/services/commercialOpsService';
import StrategicKPICard from './StrategicKPICard';
import StrategicTrendChart from './StrategicTrendChart';
import StrategicExceptionAlerts from './StrategicExceptionAlerts';
import StrategicActionButtons from './StrategicActionButtons';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign, FileText, Target, BarChart3 } from 'lucide-react';

export default function CommercialOpsStrategicView() {
  const [kpis, setKPIs] = useState<CommercialOpsKPIs | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [alerts, setAlerts] = useState<ExceptionAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const kpiData = getCommercialOpsKPIs();
        const trends = getTrendData();
        const exceptions = getExceptionAlerts();
        
        setKPIs(kpiData);
        setTrendData(trends);
        setAlerts(exceptions);
      } catch (error) {
        console.error('Error fetching Commercial Ops data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Loading Commercial Operations Dashboard...</p>
          <p className="text-sm text-gray-500">Analyzing quote-to-cash performance metrics</p>
        </div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Failed to load dashboard data</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                Commercial Operations Command Center
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Strategic oversight of quote-to-cash process efficiency, pricing accuracy, and revenue realization
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Current Quarter</p>
                <p className="text-xl font-bold text-gray-900">Q2 2025</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Health Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xl font-bold text-green-600">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="px-8 py-8 space-y-8">
        {/* KPI Cards Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Target className="h-7 w-7 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Current Quarter</span>
          </div>
          
          {/* First Row of KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StrategicKPICard
              title="Q2C Cycle Time"
              value={`${kpis.quoteToCashCycleTime.value}`}
              unit="days"
              target={`≤ ${kpis.quoteToCashCycleTime.target} days`}
              trend={kpis.quoteToCashCycleTime.trend}
              status={kpis.quoteToCashCycleTime.status}
              icon={<Clock className="h-8 w-8" />}
              description="Average days from quote creation to payment received"
              color="blue"
              customBgColor="#F3F3F3"
            />
            <StrategicKPICard
              title="Quote Approval"
              value={`${kpis.quoteApprovalVelocity.value}`}
              unit="days"
              target={`≤ ${kpis.quoteApprovalVelocity.target} days`}
              trend={kpis.quoteApprovalVelocity.trend}
              status={kpis.quoteApprovalVelocity.status}
              icon={<FileText className="h-8 w-8" />}
              description="Average days from quote submission to approval"
              color="green"
              customBgColor="#F3F3F3"
            />
            <StrategicKPICard
              title="Invoice Accuracy"
              value={`${kpis.invoiceAccuracyRate.value}`}
              unit="%"
              target={`≥ ${kpis.invoiceAccuracyRate.target}%`}
              trend={kpis.invoiceAccuracyRate.trend}
              status={kpis.invoiceAccuracyRate.status}
              icon={<CheckCircle className="h-8 w-8" />}
              description="Percentage of invoices without billing errors"
              color="emerald"
              customBgColor="#F3F3F3"
            />
            <StrategicKPICard
              title="DSO"
              value={`${kpis.daysSalesOutstanding.value}`}
              unit="days"
              target={`≤ ${kpis.daysSalesOutstanding.target} days`}
              trend={kpis.daysSalesOutstanding.trend}
              status={kpis.daysSalesOutstanding.status}
              icon={<DollarSign className="h-8 w-8" />}
              description="Average days to collect payment after invoice"
              color="orange"
              customBgColor="#F3F3F3"
            />
          </div>

          {/* Second Row of KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StrategicKPICard
              title="Revenue Recognition"
              value={`${kpis.revenueRecognitionAccuracy.value}`}
              unit="%"
              target={`≥ ${kpis.revenueRecognitionAccuracy.target}%`}
              trend={kpis.revenueRecognitionAccuracy.trend}
              status={kpis.revenueRecognitionAccuracy.status}
              icon={<Target className="h-8 w-8" />}
              description="Accuracy of revenue recognition vs expected"
              color="purple"
              customBgColor="#F3F3F3"
            />
            <StrategicKPICard
              title="Deferred Revenue"
              value={`$${kpis.deferredRevenueBalance.value}`}
              unit="M"
              target="Trend"
              trend={kpis.deferredRevenueBalance.trend}
              status={kpis.deferredRevenueBalance.status}
              icon={<DollarSign className="h-8 w-8" />}
              description="Total unearned revenue for future periods"
              color="indigo"
              customBgColor="#F3F3F3"
            />
            <StrategicKPICard
              title="Quote Win Rate"
              value={`${kpis.quoteWinRate.value}`}
              unit="%"
              target={`≥ ${kpis.quoteWinRate.target}%`}
              trend={kpis.quoteWinRate.trend}
              status={kpis.quoteWinRate.status}
              icon={<TrendingUp className="h-8 w-8" />}
              description="Percentage of quotes accepted vs declined"
              color="teal"
              customBgColor="#F3F3F3"
            />
            <StrategicKPICard
              title="Renewal Quote Velocity"
              value={`${kpis.renewalQuoteVelocity.value}`}
              unit="days"
              target={`≤ ${kpis.renewalQuoteVelocity.target} days`}
              trend={kpis.renewalQuoteVelocity.trend}
              status={kpis.renewalQuoteVelocity.status}
              icon={<Clock className="h-8 w-8" />}
              description="Time from renewal trigger to quote delivery"
              color="cyan"
              customBgColor="#F3F3F3"
            />
          </div>
        </div>

        {/* Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2">
            <StrategicTrendChart data={trendData} />
          </div>

          {/* Additional Metrics */}
          <div className="space-y-6">
            {/* Financial Health */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Financial Health
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overdue Invoices</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-red-600">
                      ${kpis.overdueInvoicesAmount.value}K
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingDown className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">
                        {Math.abs(kpis.overdueInvoicesAmount.trend)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expansion ARR</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">
                      {kpis.expansionARRContribution.value}%
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">
                        +{kpis.expansionARRContribution.trend}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Targets Met</span>
                  <span className="font-bold">8 of 10</span>
                </div>
                <div className="flex justify-between">
                  <span>Overall Health</span>
                  <span className="font-bold">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span>Trend Direction</span>
                  <span className="font-bold flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Improving
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exception Alerts */}
        <StrategicExceptionAlerts alerts={alerts} />

        {/* Action Buttons */}
        <StrategicActionButtons />
      </div>
    </div>
  );
}
