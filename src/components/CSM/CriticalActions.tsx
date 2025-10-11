'use client';

import React from 'react';

export interface CriticalAction {
  icon: string;
  message: string;
  severity: 'critical' | 'high' | 'medium';
  count: number;
  amount?: string;
}

interface CriticalActionsProps {
  actions: CriticalAction[];
  onActionClick?: (action: CriticalAction) => void;
}

export function CriticalActions({ actions, onActionClick }: CriticalActionsProps) {
  const severityColors = {
    critical: 'bg-red-50 border-red-300 text-red-800',
    high: 'bg-orange-50 border-orange-300 text-orange-800',
    medium: 'bg-yellow-50 border-yellow-300 text-yellow-800'
  };
  
  return (
    <div className="bg-white rounded-lg border-2 border-red-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-2xl mr-2">🚨</span>
        Critical Actions Required
      </h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <div
            key={index}
            className={`
              flex items-start p-4 rounded-lg border-2 transition-all
              ${severityColors[action.severity]}
              ${onActionClick ? 'cursor-pointer hover:shadow-md' : ''}
            `}
            onClick={() => onActionClick && onActionClick(action)}
          >
            <span className="text-2xl mr-3 flex-shrink-0">{action.icon}</span>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <span className="font-medium text-sm">
                  {action.message}
                </span>
                {onActionClick && (
                  <span className="text-xs ml-2 opacity-60">→</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

