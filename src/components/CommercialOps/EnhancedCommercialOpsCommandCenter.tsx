'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { colors } from '@/config/theme';
import { 
  getCommercialOpsKPIs, 
  getTrendData, 
  getExceptionAlerts,
  type CommercialOpsKPIs,
  type TrendData,
  type ExceptionAlert
} from '@/services/commercialOpsService';
import KPICard from './KPICard';
import TrendChart from './TrendChart';
import ExceptionAlertsPanel from './ExceptionAlertsPanel';
import ActionButtons from './ActionButtons';
import ProductPerformanceMatrix from './ProductPerformanceMatrix';
import DSOAgingAnalysis from './DSOAgingAnalysis';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign, FileText, Target, BarChart3, PieChart } from 'lucide-react';

export default function EnhancedCommercialOpsCommandCenter() {
  const [kpis, setKPIs] = useState<CommercialOpsKPIs | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [alerts, setAlerts] = useState<ExceptionAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'performance'>('overview');

  useEffect(() => {
    // Simulate loading and fetch data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">Loading Commercial Operations Dashboard...</p>
          <p className="text-sm text-gray-500">Analyzing quote-to-cash performance metrics</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="flex items-center justify-center h-screen">
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

  const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const tabs = [
    { id: 'overview', name: 'Strategic Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'analytics', name: 'Process Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'performance', name: 'Performance Matrix', icon: <PieChart className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                Commercial Operations Command Center
              </h1>
              <p className="text-gray-600 mt-2">
                Strategic oversight of quote-to-cash process efficiency, pricing accuracy, and revenue realization
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Quarter</p>
                <p className="text-lg font-semibold text-gray-900">Q2 2025</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">Just now</p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Health Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-lg font-semibold text-green-600">Excellent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Strategic Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* KPI Cards Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Target className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
                <span className="text-sm text-gray-500 ml-2">(Current Quarter)</span>
              </div>
              
              {/* First Row of KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <KPICard
                  title="Q2C Cycle Time"
                  value={`${kpis.quoteToCashCycleTime.value} days`}
                  target={`≤ ${kpis.quoteToCashCycleTime.target} days`}
                  trend={kpis.quoteToCashCycleTime.trend}
                  status={kpis.quoteToCashCycleTime.status}
                  icon={<Clock className="h-6 w-6" />}
                  description="Average days from quote creation to payment received"
                  customBgColor="#F3F3F3"
                />
                <KPICard
                  title="Quote Approval"
                  value={`${kpis.quoteApprovalVelocity.value} days`}
                  target={`≤ ${kpis.quoteApprovalVelocity.target} days`}
                  trend={kpis.quoteApprovalVelocity.trend}
                  status={kpis.quoteApprovalVelocity.status}
                  icon={<FileText className="h-6 w-6" />}
                  description="Average days from quote submission to approval"
                  customBgColor="#F3F3F3"
                />
                <KPICard
                  title="Invoice Accuracy"
                  value={`${kpis.invoiceAccuracyRate.value}%`}
                  target={`≥ ${kpis.invoiceAccuracyRate.target}%`}
                  trend={kpis.invoiceAccuracyRate.trend}
                  status={kpis.invoiceAccuracyRate.status}
                  icon={<CheckCircle className="h-6 w-6" />}
                  description="Percentage of invoices without billing errors"
                  customBgColor="#F3F3F3"
                />
                <KPICard
                  title="DSO"
                  value={`${kpis.daysSalesOutstanding.value} days`}
                  target={`≤ ${kpis.daysSalesOutstanding.target} days`}
                  trend={kpis.daysSalesOutstanding.trend}
                  status={kpis.daysSalesOutstanding.status}
                  icon={<DollarSign className="h-6 w-6" />}
                  description="Average days to collect payment after invoice"
                  customBgColor="#F3F3F3"
                />
              </div>

              {/* Second Row of KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="Revenue Recognition"
                  value={`${kpis.revenueRecognitionAccuracy.value}%`}
                  target={`≥ ${kpis.revenueRecognitionAccuracy.target}%`}
                  trend={kpis.revenueRecognitionAccuracy.trend}
                  status={kpis.revenueRecognitionAccuracy.status}
                  icon={<Target className="h-6 w-6" />}
                  description="Accuracy of revenue recognition vs expected"
                  customBgColor="#F3F3F3"
                />
                <KPICard
                  title="Deferred Revenue"
                  value={`$${kpis.deferredRevenueBalance.value}M`}
                  target="Trend"
                  trend={kpis.deferredRevenueBalance.trend}
                  status={kpis.deferredRevenueBalance.status}
                  icon={<DollarSign className="h-6 w-6" />}
                  description="Total unearned revenue for future periods"
                  customBgColor="#F3F3F3"
                />
                <KPICard
                  title="Quote Win Rate"
                  value={`${kpis.quoteWinRate.value}%`}
                  target={`≥ ${kpis.quoteWinRate.target}%`}
                  trend={kpis.quoteWinRate.trend}
                  status={kpis.quoteWinRate.status}
                  icon={<TrendingUp className="h-6 w-6" />}
                  description="Percentage of quotes accepted vs declined"
                  customBgColor="#F3F3F3"
                />
                <KPICard
                  title="Renewal Quote Velocity"
                  value={`${kpis.renewalQuoteVelocity.value} days`}
                  target={`≤ ${kpis.renewalQuoteVelocity.target} days`}
                  trend={kpis.renewalQuoteVelocity.trend}
                  status={kpis.renewalQuoteVelocity.status}
                  icon={<Clock className="h-6 w-6" />}
                  description="Time from renewal trigger to quote delivery"
                  customBgColor="#F3F3F3"
                />
              </div>
            </div>

            {/* Trends and Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Trend Chart */}
              <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Quote-to-Cash Cycle Time Trend
                </h3>
                <TrendChart data={trendData} />
              </div>

              {/* Additional Metrics */}
              <div className="space-y-6">
                {/* Overdue Invoices */}
                <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Health</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overdue Invoices</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-red-600">
                          ${kpis.overdueInvoicesAmount.value}K
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                          {getTrendIcon(kpis.overdueInvoicesAmount.trend)}
                          <span className={kpis.overdueInvoicesAmount.trend > 0 ? 'text-red-500' : 'text-green-500'}>
                            {Math.abs(kpis.overdueInvoicesAmount.trend)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expansion ARR Contribution</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">
                          {kpis.expansionARRContribution.value}%
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                          {getTrendIcon(kpis.expansionARRContribution.trend)}
                          <span className="text-green-500">
                            +{kpis.expansionARRContribution.trend}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="rounded-xl shadow-sm p-6 border border-blue-200" style={{ backgroundColor: '#F3F3F3' }}>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Performance Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Targets Met</span>
                      <span className="font-semibold text-gray-900">8 of 10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Overall Health</span>
                      <span className="font-semibold text-gray-900">Excellent</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Trend Direction</span>
                      <span className="font-semibold flex items-center gap-1 text-gray-900">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        Improving
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exception Alerts */}
            <ExceptionAlertsPanel alerts={alerts} />

            {/* Action Buttons */}
            <ActionButtons />
          </>
        )}

        {/* Process Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <TrendChart data={trendData} />
            <DSOAgingAnalysis />
          </div>
        )}

        {/* Performance Matrix Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-8">
            <ProductPerformanceMatrix />
            <DSOAgingAnalysis />
          </div>
        )}
      </div>
    </div>
  );
}
