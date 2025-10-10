'use client';

import { BarChart3, Search, Download, RefreshCw, ArrowRight, Filter, TrendingUp, AlertTriangle } from 'lucide-react';

export default function StrategicActionButtons() {
  const handleDrillDown = () => {
    console.log('Navigate to Process Analytics (Level 2)');
    // TODO: Implement navigation to Level 2
  };

  const handleBottleneckAnalysis = () => {
    console.log('Navigate to Bottleneck Details');
    // TODO: Implement bottleneck analysis
  };

  const handleExportSummary = () => {
    console.log('Export Executive Summary');
    // TODO: Implement export functionality
  };

  const handleRefreshData = () => {
    console.log('Refresh Data');
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart3 className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Strategic Navigation</span>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Drill to Process Analysis */}
        <button
          onClick={handleDrillDown}
          className="group flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">Process Analysis</div>
              <div className="text-sm opacity-90">Drill down to Level 2</div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* View Bottleneck Details */}
        <button
          onClick={handleBottleneckAnalysis}
          className="group flex items-center justify-between p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Search className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">Bottleneck Details</div>
              <div className="text-sm opacity-90">Root cause analysis</div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Export Executive Summary */}
        <button
          onClick={handleExportSummary}
          className="group flex items-center justify-between p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Download className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">Export Summary</div>
              <div className="text-sm opacity-90">Executive report</div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Quick Filters */}
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Quick Filters</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-200 transition-all duration-200 text-sm font-medium">
              Current Quarter
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-200 transition-all duration-200 text-sm font-medium">
              All Regions
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-200 transition-all duration-200 text-sm font-medium">
              All Products
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-200 transition-all duration-200 text-sm font-medium">
              All Tiers
            </button>
          </div>
        </div>

        {/* System Actions */}
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">System Actions</h3>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleRefreshData}
              className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-gray-200 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </button>
            <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-700 hover:border-green-200 border border-gray-200 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="pt-8 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          System Performance Indicators
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
            <div className="text-xs text-green-700 font-medium">SLA Compliance</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">92%</div>
            <div className="text-xs text-blue-700 font-medium">Process Efficiency</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
            <div className="text-xs text-purple-700 font-medium">Data Quality</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div className="text-2xl font-bold text-orange-600 mb-1">15min</div>
            <div className="text-xs text-orange-700 font-medium">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="font-semibold text-red-800">Action Required</span>
        </div>
        <p className="text-sm text-red-700">
          <span className="font-semibold">42 items</span> require immediate attention across quotes, invoices, and accounts. 
          Total business impact: <span className="font-semibold">$5.4M ARR</span>. 
          Review exception alerts above for detailed breakdown.
        </p>
      </div>
    </div>
  );
}
