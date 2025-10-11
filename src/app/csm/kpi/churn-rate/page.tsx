'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { useSidebar } from '../../../../contexts/SidebarContext';

export default function ChurnRateDrillDown() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading churn rate data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
      
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
        isCollapsed ? 'ml-14' : 'ml-64'
      }`}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Churn Rate Analysis</h1>
            <p className="text-gray-600 mt-2">Detailed analysis of customer churn patterns and trends</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Churn Rate Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">3.2%</div>
                <div className="text-sm text-gray-600">Current Churn Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">5.0%</div>
                <div className="text-sm text-gray-600">Target Churn Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">$1.2M</div>
                <div className="text-sm text-gray-600">Churned ARR</div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Churn rate is below target, indicating good customer retention</li>
              <li>• Main churn reasons include product fit and competitive pressure</li>
              <li>• Early warning signals help predict potential churn</li>
              <li>• Proactive engagement reduces churn by 40%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
