'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useSidebar } from '../../../../contexts/SidebarContext';
import { QBRCompletionAnalysis } from '@/components/CSM/KPI/QBRCompletionAnalysis';

export default function QBRCompletionDrillDown() {
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
      
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}> 
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <button
            onClick={() => router.push('/csm')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium transition-colors"
          >
            ← Back to Portfolio Dashboard
          </button>
          
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
        </div>

        <QBRCompletionAnalysis />
      </div>
    </div>
  );
}
