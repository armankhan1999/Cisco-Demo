'use client';

import { useState } from 'react';
import { colors, personaColors, spacing } from '@/config/theme';
import { Persona, getPersonaName, getPersonaDescription } from '@/data/dummyData';

interface SidebarProps {
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  description?: string;
  onClick: () => void;
}

export default function Sidebar({ currentPersona, onPersonaChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<Persona | null>('CSM');

  const personas: Persona[] = ['CSM', 'CO', 'SE'];

  // Define submenus for each persona
  const subMenus: Record<Persona, SubMenuItem[]> = {
    CSM: [
      {
        id: 'portfolio',
        label: 'Portfolio Dashboard',
        description: 'Strategic overview & KPIs',
        onClick: () => {
          onPersonaChange('CSM');
          // Navigate to portfolio dashboard
          if (typeof window !== 'undefined') {
            window.location.href = '/csm/portfolio';
          }
        }
      },
      {
        id: 'deep-dive',
        label: 'Deep Dive Analytics',
        description: 'Tactical analysis & insights',
        onClick: () => {
          onPersonaChange('CSM');
          // Navigate to deep-dive page
          if (typeof window !== 'undefined') {
            window.location.href = '/csm/deep-dive';
          }
        }
      }
    ],
    CO: [],
    SE: []
  };

  const getPersonaIcon = (persona: Persona) => {
    const icons = {
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
    };
    return icons[persona];
  };

  return (
    <div
      className="flex flex-col h-screen transition-all duration-300 ease-in-out"
      style={{
        width: isCollapsed ? spacing.sidebar.collapsedWidth : spacing.sidebar.width,
        backgroundColor: colors.background.dark,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white">Analytics Hub</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className="w-5 h-5 text-white transition-transform duration-300"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Persona Panels */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="space-y-1 px-3">
          {personas.map((persona) => {
            const isActive = currentPersona === persona;
            const isExpanded = expandedMenu === persona;
            const hasSubMenu = subMenus[persona].length > 0;

            return (
              <div key={persona} className="space-y-1">
                {/* Main Persona Button */}
                <button
                  onClick={() => {
                    if (hasSubMenu) {
                      setExpandedMenu(isExpanded ? null : persona);
                    }
                    onPersonaChange(persona);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-white/10 border-l-4 border-[#049FD9]' 
                      : 'border-l-4 border-transparent hover:bg-white/5'
                    }
                  `}
                >
                  <div className={`flex-shrink-0 transition-all duration-200 ${isActive ? 'text-[#049FD9]' : 'text-white/60'}`}>
                    {getPersonaIcon(persona)}
                  </div>

                  {!isCollapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <h3 className={`text-sm font-semibold transition-all duration-200 ${isActive ? 'text-white' : 'text-white/80'}`}>
                          {persona}
                        </h3>
                        <p className={`text-xs mt-0.5 transition-all duration-200 ${isActive ? 'text-white/80' : 'text-white/50'}`}>
                          {getPersonaName(persona)}
                        </p>
                      </div>

                      {/* Expand/Collapse Icon */}
                      {hasSubMenu && (
                        <svg 
                          className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </>
                  )}
                </button>

                {/* Submenu Items */}
                {!isCollapsed && isExpanded && hasSubMenu && (
                  <div className="ml-4 space-y-1 py-1">
                    {subMenus[persona].map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={subItem.onClick}
                        className="w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/5 group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#049FD9]"></div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-white/90 group-hover:text-white">
                              {subItem.label}
                            </p>
                            {subItem.description && (
                              <p className="text-xs text-white/50 mt-0.5">
                                {subItem.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-6 border-t border-white/10">
          <div className="px-3 py-2 bg-white/5 rounded-lg">
            <div className="text-xs space-y-1.5">
              <p className="text-white/50 font-medium">Current View</p>
              <p className="font-semibold text-white text-sm">{getPersonaName(currentPersona)}</p>
              <p className="text-white/60 leading-relaxed">{getPersonaDescription(currentPersona)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
