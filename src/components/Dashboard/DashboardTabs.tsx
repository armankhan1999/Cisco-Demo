'use client';

import React from 'react';

interface DashboardTabsProps {
  activeTab: 'overview' | 'analysis' | 'deep';
  onTabChange: (tab: 'overview' | 'analysis' | 'deep') => void;
  persona: 'CSM' | 'CO' | 'SE';
}

export default function DashboardTabs({ activeTab, onTabChange, persona }: DashboardTabsProps) {
  const tabs = [
    { id: 'overview' as const, label: 'Strategic Overview', icon: '📊' },
    { id: 'analysis' as const, label: 'Process Breakdown', icon: '⚡' },
    { id: 'deep' as const, label: 'Deep Analysis', icon: '🔍' },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-gray-200 px-6 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center gap-2 px-1 py-3 text-sm font-medium transition-all duration-200
            border-b-2 -mb-px
            ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
