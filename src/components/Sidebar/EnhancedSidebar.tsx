'use client';

import { useState } from 'react';
import { Persona, getPersonaName, getPersonaDescription } from '@/data/dummyData';
import { ChevronRight, Heart, BarChart3, Target, Menu, MessageSquare } from 'lucide-react';

// Utility function for conditional classes
const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface SidebarProps {
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  currentView?: string;
  onViewChange?: (view: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function EnhancedSidebar({ currentPersona, onPersonaChange, currentView, onViewChange, onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedPersona, setExpandedPersona] = useState<Persona | null>(currentPersona);

  const personas: Persona[] = ['CSM', 'CO', 'SE', 'AI_CHAT'];

  const getPersonaIcon = (persona: Persona) => {
    const icons = {
      CSM: Heart,
      CO: BarChart3,
      SE: Target,
      AI_CHAT: MessageSquare,
    };
    const IconComponent = icons[persona];
    return <IconComponent className="h-4 w-4" />;
  };

  const getPersonaDashboards = (persona: Persona) => {
    switch (persona) {
      case 'CO':
        return [
          {
            id: 'command-center',
            name: 'Command Center',
            description: 'Strategic KPI Overview',
            icon: BarChart3
          },
          // {
          //   id: 'revenue-operations',
          //   name: 'Revenue Operations',
          //   description: 'Revenue tracking and analysis',
          //   icon: BarChart3
          // }
        ];
      case 'CSM':
        return [
          {
            id: 'health-dashboard',
            name: 'Health Dashboard',
            description: 'Customer health monitoring',
            icon: Heart
          }
        ];
      case 'SE':
        return [
          {
            id: 'expansion-dashboard',
            name: 'Expansion Dashboard',
            description: 'Sales expansion opportunities',
            icon: Target
          }
        ];
      case 'AI_CHAT':
        return []; // No sub-dashboards for AI Chat
      default:
        return [];
    }
  };

  const handlePersonaClick = (persona: Persona) => {
    onPersonaChange(persona);
    setExpandedPersona(expandedPersona === persona ? null : persona);
    
    // Auto-select default dashboard for CO persona
    if (persona === 'CO' && onViewChange) {
      onViewChange('command-center');
    }
  };

  const handleDashboardClick = (dashboardId: string) => {
    if (onViewChange) {
      onViewChange(dashboardId);
    }
  };

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
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
              onClick={handleCollapseToggle}
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
              const isExpanded = expandedPersona === persona;
              const dashboards = getPersonaDashboards(persona);

              return (
                <div key={persona}>
                  {/* Main Persona Button */}
                  <button
                    onClick={() => handlePersonaClick(persona)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm font-normal rounded-md transition-colors",
                      "hover:text-gray-700 hover:bg-gray-50",
                      isActive 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-gray-500"
                    )}
                    title={isCollapsed ? getPersonaName(persona) : undefined}
                  >
                    <div className="flex-shrink-0">
                      {getPersonaIcon(persona)}
                    </div>

                    {!isCollapsed && (
                      <>
                        <div className="flex-1 text-left">
                          <div className="font-normal">{getPersonaName(persona)}</div>
                        </div>
                        {dashboards.length > 0 && (
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )} />
                        )}
                      </>
                    )}
                  </button>

                  {/* Sub-dashboards */}
                  {!isCollapsed && isExpanded && dashboards.length > 0 && (
                    <div className="ml-6 mt-1 space-y-1">
                      {dashboards.map((dashboard) => {
                        const isDashboardActive = currentView === dashboard.id;
                        const IconComponent = dashboard.icon;
                        
                        return (
                          <button
                            key={dashboard.id}
                            onClick={() => handleDashboardClick(dashboard.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-1.5 text-xs rounded-md transition-colors",
                              "hover:text-gray-700 hover:bg-gray-50",
                              isDashboardActive
                                ? "bg-blue-100 text-blue-800 border-r-2 border-blue-600"
                                : "text-gray-600"
                            )}
                          >
                            <IconComponent className="h-3 w-3" />
                            <div className="text-left">
                              <div className="font-normal">{dashboard.name}</div>
                              {/* <div className="text-gray-400 mt-0.5">{dashboard.description}</div> */}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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
