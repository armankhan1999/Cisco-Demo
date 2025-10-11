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
      },
      {
        id: 'action-center',
        label: 'Action Center',
        description: 'Operational alerts & exceptions',
        onClick: () => {
          onPersonaChange('CSM');
          // Navigate to action center page
          if (typeof window !== 'undefined') {
            window.location.href = '/csm/action-center';
          }
        }
      }
    ],
    CO: [],
    SE: []
  };

  const getPersonaIcon = (persona: Persona) => {
    const icons = {
      CSM: Heart,
      CO: BarChart3,
      SE: Target,
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
