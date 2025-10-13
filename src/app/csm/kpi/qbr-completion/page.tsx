'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import CSMKPIWrapper from '@/components/CSM/CSMKPIWrapper';
import { QBRCompletionAnalysis } from '@/components/CSM/KPI/QBRCompletionAnalysis';

export default function QBRCompletionDrillDown() {
  const router = useRouter();
  
  return (
    <CSMKPIWrapper 
      title="QBR Completion Analysis"
      subtitle="Quarterly Business Review completion tracking | Real-time synthetic data analysis | Updated: 13/10/2025"
      showBackButton={false}
    >
      <div className="space-y-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Portfolio Dashboard</span>
          </button>
        </div>

        {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QBR Completion Rate Analysis</h1>
              <p className="text-gray-600 mt-1">
                Quarterly Business Review performance tracking and insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                📊 Export Report
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
          </div>
        </div>

        <QBRCompletionAnalysis />
      </div>
    </CSMKPIWrapper>
  );
}
