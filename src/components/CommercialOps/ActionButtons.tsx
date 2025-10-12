'use client';

import { BarChart3, Search, Download, Settings, ArrowRight, Filter, RefreshCw } from 'lucide-react';

export default function ActionButtons() {
  const handleDrillDown = () => {
    // TODO: Navigate to Level 2 dashboard
    console.log('Navigate to Process Analytics');
  };

  const handleBottleneckAnalysis = () => {
    // TODO: Navigate to bottleneck details
    console.log('Navigate to Bottleneck Details');
  };

  const handleExportSummary = () => {
    // TODO: Export executive summary
    console.log('Export Executive Summary');
  };

  const handleRefreshData = () => {
    // TODO: Refresh dashboard data
    console.log('Refresh Data');
    window.location.reload();
  };

  return (
    <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Drill to Process Analysis */}
        <button
          onClick={handleDrillDown}
          className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Process Analysis</div>
              <div className="text-xs opacity-90">Drill down to Level 2</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* View Bottleneck Details */}
        <button
          onClick={handleBottleneckAnalysis}
          className="group flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Bottleneck Details</div>
              <div className="text-xs opacity-90">Root cause analysis</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Export Executive Summary */}
        <button
          onClick={handleExportSummary}
          className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Export Summary</div>
              <div className="text-xs opacity-90">Executive report</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Refresh Data */}
        <button
          onClick={handleRefreshData}
          className="group flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Refresh Data</div>
              <div className="text-xs opacity-90">Update metrics</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Additional Filters */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Quick Filters</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Current Quarter
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            All Regions
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            All Products
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            All Tiers
          </button>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">85%</div>
            <div className="text-xs text-gray-500">SLA Compliance</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">92%</div>
            <div className="text-xs text-gray-500">Process Efficiency</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">98%</div>
            <div className="text-xs text-gray-500">Data Quality</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">15min</div>
            <div className="text-xs text-gray-500">Avg Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
