'use client';

import { useState } from 'react';
import { Menu, Heart, BarChart3, Target, ChevronRight } from 'lucide-react';
import { Persona, getPersonaName, getPersonaDescription } from '@/data/dummyData';

// Utility function for conditional classes
const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface SidebarProps {
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export default function Sidebar({ currentPersona, onPersonaChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const personas: Persona[] = ['CSM', 'CO', 'SE', 'AI_CHAT'];

  const getPersonaIcon = (persona: Persona) => {
    const icons = {
<<<<<<< HEAD
      CSM: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      CO: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      SE: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      AI_CHAT: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
=======
      CSM: Heart,
      CO: BarChart3,
      SE: Target,
>>>>>>> f5bbb29ee15fc17ed62efe509c3a4c066fe44a43
    };
    const IconComponent = icons[persona];
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out",
      isCollapsed ? "w-14" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-sm font-semibold text-gray-900">Cisco Analytics</h2>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              ) : (
                <Menu className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="space-y-1 px-2">
            {personas.map((persona) => {
              const isActive = currentPersona === persona;

              return (
                <button
                  key={persona}
                  onClick={() => onPersonaChange(persona)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-normal rounded-md transition-colors",
                    "hover:text-gray-700 hover:bg-gray-50",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                      : "text-gray-500"
                  )}
                  title={isCollapsed ? getPersonaName(persona) : undefined}
                >
                  <div className="flex-shrink-0">
                    {getPersonaIcon(persona)}
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{persona}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {getPersonaName(persona)}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs space-y-1">
                <p className="text-gray-500 font-medium">Current View</p>
                <p className="font-semibold text-gray-900">{getPersonaName(currentPersona)}</p>
                <p className="text-gray-600 leading-relaxed text-xs">
                  {getPersonaDescription(currentPersona)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
