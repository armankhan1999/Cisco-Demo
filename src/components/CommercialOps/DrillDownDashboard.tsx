'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { 
  getCommercialOpsKPIs, 
  getTrendData, 
  getExceptionAlerts,
  type CommercialOpsKPIs,
  type TrendData,
  type ExceptionAlert
} from '@/services/commercialOpsService';
import { enhancedDrillDownService, type DrillDownLevel } from '@/services/enhancedDrillDownService';
import { validateCommercialOpsData } from '@/utils/dataValidation';
import DrillDownKPICard from './DrillDownKPICard';
import StrategicTrendChart from './StrategicTrendChart';
import EnhancedExceptionAlerts from './EnhancedExceptionAlerts';
import StrategicActionButtons from './StrategicActionButtons';
import QuoteToCashBreakdown from './QuoteToCashBreakdown';
import ProductPerformanceMatrix from './ProductPerformanceMatrix';
import DSOAgingAnalysis from './DSOAgingAnalysis';
import RevenueVarianceAnalysis from './RevenueVarianceAnalysis';
import Q2CDrillDownOrchestrator from './Q2C/Q2CDrillDownOrchestrator';
import Q2CActionItems from './Q2C/Q2CActionItems';
import QuoteApprovalDrillDownOrchestrator from './QuoteApproval/QuoteApprovalDrillDownOrchestrator';
import DSODrillDownOrchestrator from './DSO/DSODrillDownOrchestrator';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, DollarSign, FileText, Target, BarChart3, PieChart, Activity, ChevronRight } from '@/utils/iconMapping';
import { HelpCircle, X } from 'lucide-react';

export default function DrillDownDashboard() {
  const [kpis, setKPIs] = useState<CommercialOpsKPIs | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [alerts, setAlerts] = useState<ExceptionAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<DrillDownLevel>({ level: 0, title: 'Strategic Overview', description: 'High-level KPI dashboard' });
  const [activeSection, setActiveSection] = useState<'overview' | 'breakdown' | 'analysis'>('overview');
  const [activeKPI, setActiveKPI] = useState<string | null>(null);
  const [showActionItems, setShowActionItems] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Validate data sources in development
        if (process.env.NODE_ENV === 'development') {
          validateCommercialOpsData();
        }
        
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

  const handleDrillDown = (kpiId: string, level?: 2 | 3) => {
    setActiveKPI(kpiId);
    setCurrentLevel({ level: level || 1, title: `${kpiId} Drill-Down`, description: 'Detailed analysis' });
  };

  const handleViewActionItems = (kpiId: string) => {
    setActiveKPI(kpiId);
    setShowActionItems(true);
  };

  const handleBackToOverview = () => {
    setActiveKPI(null);
    setShowActionItems(false);
    setCurrentLevel({ level: 0, title: 'Strategic Overview', description: 'High-level KPI dashboard' });
    setActiveSection('overview');
  };

  const renderBreadcrumb = () => {
    const history = enhancedDrillDownService.getNavigationHistory();
    const allLevels = [...history, currentLevel];

    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <button 
          onClick={handleBackToOverview}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
          <span>Dashboard</span>
        </button>
        {currentLevel.level > 0 && (
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-blue-600 font-medium">{currentLevel.title}</span>
          </div>
        )}
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Commercial Operations data...</p>
        </div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Data Loading Error</div>
          <p className="text-gray-600 mb-4">Unable to load Commercial Operations KPIs</p>
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

  // Render Q2C Action Items
  if (showActionItems && activeKPI === 'quote-to-cash-cycle') {
    return (
      <Q2CActionItems onBack={handleBackToOverview} />
    );
  }

  // Render Q2C Drill-Down
  if (activeKPI === 'quote-to-cash-cycle' && currentLevel.level > 0) {
    return (
      <Q2CDrillDownOrchestrator onBack={handleBackToOverview} />
    );
  }

  // Render Quote Approval Drill-Down
  if (activeKPI === 'quote-approval-velocity' && currentLevel.level > 0) {
    return (
      <QuoteApprovalDrillDownOrchestrator onBack={handleBackToOverview} />
    );
  }

  // Render DSO Drill-Down
  if (activeKPI === 'days-sales-outstanding' && currentLevel.level > 0) {
    return (
      <DSODrillDownOrchestrator onBack={handleBackToOverview} />
    );
  }

  // Render Level 1 Strategic Overview
  const sections = [
    { id: 'overview', name: 'Strategic Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'breakdown', name: 'Process Breakdown', icon: <Activity className="h-4 w-4" /> },
    { id: 'analysis', name: 'Deep Analysis', icon: <PieChart className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2">
                {renderBreadcrumb()}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                Commercial Operations
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
              <div className="h-12 w-px bg-gray-300"></div>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors"
                title="Help & Guide"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="px-8">
          <nav className="flex space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.icon}
                {section.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="px-8 py-8 space-y-8">
        {/* Strategic Overview Section */}
        {activeSection === 'overview' && (
          <>
            {/* KPI Cards Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Target className="h-7 w-7 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Current Quarter</span>
                <div className="ml-auto text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Click any KPI to drill down for detailed analysis
                </div>
              </div>
              
              {/* First Row of KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <DrillDownKPICard
                  kpiId="quote-to-cash-cycle"
                  title="Q2C Cycle Time"
                  value={`${kpis.quoteToCashCycleTime.value}`}
                  unit="days"
                  target={`≤ ${kpis.quoteToCashCycleTime.target} days`}
                  trend={kpis.quoteToCashCycleTime.trend}
                  status={kpis.quoteToCashCycleTime.status}
                  icon={<Clock className="h-8 w-8" />}
                  description="Average days from quote creation to payment received"
                  color="blue"
                  onDrillDown={handleDrillDown}
                  customBgColor="#F3F3F3"
                  variant="q2c"
                />
                <DrillDownKPICard
                  kpiId="quote-approval-velocity"
                  title="Quote Approval"
                  value={`${kpis.quoteApprovalVelocity.value}`}
                  unit="days"
                  target={`≤ ${kpis.quoteApprovalVelocity.target} days`}
                  trend={kpis.quoteApprovalVelocity.trend}
                  status={kpis.quoteApprovalVelocity.status}
                  icon={<FileText className="h-8 w-8" />}
                  description="Average days from quote submission to approval"
                  color="green"
                  onDrillDown={handleDrillDown}
                  customBgColor="#F3F3F3"
                  variant="q2c"
                />
                <DrillDownKPICard
                  kpiId="invoice-accuracy"
                  title="Invoice Accuracy"
                  value={`${kpis.invoiceAccuracyRate.value}`}
                  unit="%"
                  target={`≥ ${kpis.invoiceAccuracyRate.target}%`}
                  trend={kpis.invoiceAccuracyRate.trend}
                  status={kpis.invoiceAccuracyRate.status}
                  icon={<CheckCircle className="h-8 w-8" />}
                  description="Percentage of invoices without billing errors"
                  color="emerald"
                  onDrillDown={handleDrillDown}
                  customBgColor="#F3F3F3"
                  variant="q2c"
                />
                <DrillDownKPICard
                  kpiId="days-sales-outstanding"
                  title="Days Sales Outstanding (DSO)"
                  value={`${kpis.daysSalesOutstanding.value}`}
                  unit="days"
                  target={`≤ ${kpis.daysSalesOutstanding.target} days`}
                  trend={kpis.daysSalesOutstanding.trend}
                  status={kpis.daysSalesOutstanding.status}
                  icon={<DollarSign className="h-8 w-8" />}
                  description="Average days to collect payment after invoice"
                  color="orange"
                  onDrillDown={handleDrillDown}
                  customBgColor="#F3F3F3"
                  variant="q2c"
                />
              </div>

              {/* Second Row of KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DrillDownKPICard
                  kpiId="revenue-recognition"
                  title="Revenue Recognition"
                  value={`${kpis.revenueRecognitionAccuracy.value}`}
                  unit="%"
                  target={`≥ ${kpis.revenueRecognitionAccuracy.target}%`}
                  trend={kpis.revenueRecognitionAccuracy.trend}
                  status={kpis.revenueRecognitionAccuracy.status}
                  icon={<Target className="h-8 w-8" />}
                  description="Accuracy of revenue recognition vs expected"
                  color="purple"
                  onDrillDown={handleDrillDown}
                  customBgColor="#F3F3F3"
                  variant="q2c"
                />
                <DrillDownKPICard
                  kpiId="deferred-revenue"
                  title="Deferred Revenue"
                  value={`$${kpis.deferredRevenueBalance.value}`}
                  unit="M"
                  target="Trend"
                  trend={kpis.deferredRevenueBalance.trend}
                  status={kpis.deferredRevenueBalance.status}
                  icon={<DollarSign className="h-8 w-8" />}
                  description="Total unearned revenue for future periods"
                  color="indigo"
                  onDrillDown={handleDrillDown}
                  customBgColor="#F3F3F3"
                  variant="q2c"
                />
                <DrillDownKPICard
                  kpiId="quote-win-rate"
                  title="Quote Win Rate"
                  value={`${kpis.quoteWinRate.value}`}
                  unit="%"
                  target={`≥ ${kpis.quoteWinRate.target}%`}
                  trend={kpis.quoteWinRate.trend}
                  status={kpis.quoteWinRate.status}
                  icon={<TrendingUp className="h-8 w-8" />}
                  description="Percentage of quotes accepted vs declined"
                  color="teal"
                  onDrillDown={handleDrillDown}
                  customBgColor="#F3F3F3"
                  variant="q2c"
                />
                <DrillDownKPICard
                  kpiId="renewal-quote-velocity"
                  title="Renewal Quote Velocity"
                  value={`${kpis.renewalQuoteVelocity.value}`}
                  unit="days"
                  target={`≤ ${kpis.renewalQuoteVelocity.target} days`}
                  trend={kpis.renewalQuoteVelocity.trend}
                  status={kpis.renewalQuoteVelocity.status}
                  icon={<Clock className="h-8 w-8" />}
                  description="Time from renewal trigger to quote delivery"
                  color="cyan"
                  onDrillDown={handleDrillDown}
                  customBgColor="#F3F3F3"
                  variant="q2c"
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
                <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
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
                <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: '#F3F3F3' }}>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Performance Summary</h3>
                  <div className="space-y-3 text-gray-900">
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
            <EnhancedExceptionAlerts onDrillDown={handleDrillDown} />

            {/* Action Buttons */}
            <StrategicActionButtons onViewActionItems={handleViewActionItems} />
          </>
        )}

        {/* Process Breakdown Section */}
        {activeSection === 'breakdown' && (
          <div className="space-y-8">
            <QuoteToCashBreakdown />
            <ProductPerformanceMatrix />
          </div>
        )}

        {/* Deep Analysis Section */}
        {activeSection === 'analysis' && (
          <div className="space-y-8">
            <DSOAgingAnalysis />
            <RevenueVarianceAnalysis />
          </div>
        )}
      </div>

      {/* Help Modal */}
      {isHelpOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300"
            onClick={() => setIsHelpOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Commercial Operations Overview</h2>
                    <p className="text-blue-100 text-sm">Complete guide and documentation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Content - iframe */}
              <div className="flex-1 overflow-hidden">
                <iframe
                  src="/commercial-operations/overview"
                  className="w-full h-full border-0"
                  title="Commercial Operations Overview"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
