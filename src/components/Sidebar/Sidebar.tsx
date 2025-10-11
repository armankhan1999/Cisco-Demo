'use client';

import { useState } from 'react';
import { Persona, getPersonaName, getPersonaDescription } from '@/data/dummyData';

interface SidebarProps {
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export default function Sidebar({ currentPersona, onPersonaChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const personas: Persona[] = ['CSM', 'CO', 'SE'];

  const getPersonaIcon = (persona: Persona) => {
    const icons = {
      CSM: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      CO: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      SE: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    };
    return icons[persona];
  };

  return (
    <div
      className={`flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-sm font-semibold text-gray-900">Cisco Analytics</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Persona Navigation */}
      <div className="flex-1 overflow-y-auto py-3">
        <div className="space-y-1 px-2">
          {personas.map((persona) => {
            const isActive = currentPersona === persona;

            return (
              <div key={persona}>
                <button
                  onClick={() => onPersonaChange(persona)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <div className="flex-shrink-0">
                    {getPersonaIcon(persona)}
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <h3 className="text-sm font-medium">
                        {getPersonaName(persona)}
                      </h3>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            <p className="font-medium text-gray-900 mb-0.5">{getPersonaName(currentPersona)}</p>
            <p className="text-gray-500 leading-relaxed">{getPersonaDescription(currentPersona)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
