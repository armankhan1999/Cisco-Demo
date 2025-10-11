'use client';

import { useState } from 'react';
import { Persona, getPersonaName } from '@/data/dummyData';
import DashboardTabs from './DashboardTabs';
import DashboardStats from './DashboardStats';

interface DashboardProps {
  persona: Persona;
}

export default function Dashboard({ persona }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'deep'>('overview');

  // Map tabs to levels for backward compatibility
  const levelMap = {
    'overview': 1,
    'analysis': 2,
    'deep': 3
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {persona === 'CSM' && '👥'}
                  {persona === 'CO' && '💼'}
                  {persona === 'SE' && '📈'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {getPersonaName(persona)}
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {persona === 'CSM' && 'Strategic oversight of customer health, engagement, and product adoption'}
                    {persona === 'CO' && 'Strategic oversight of quote-to-cash process efficiency, pricing accuracy, and revenue realization'}
                    {persona === 'SE' && 'Strategic oversight of expansion opportunities and pipeline management'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-500 font-medium">Current Quarter</div>
                <div className="text-lg font-bold text-gray-900">Q2 2025</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 font-medium">Health Status</div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-lg font-bold text-green-600">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <DashboardTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          persona={persona}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <DashboardStats persona={persona} level={levelMap[activeTab]} />
      </div>
    </div>
  );
}
