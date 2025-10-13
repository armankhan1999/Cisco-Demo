'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Users, TrendingUp, AlertCircle, Heart, BarChart3, Target, MessageSquare, ChevronRight, Menu } from 'lucide-react';
import { Persona, getPersonaName, getPersonaDescription } from '@/data/dummyData';
import { useSidebar } from '@/contexts/SidebarContext';

// Utility function for conditional classes
const cn = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface SidebarProps {
  currentPersona: Persona;
  onPersonaChange: (persona: Persona) => void;
  currentLevel?: number;
  onLevelChange?: (level: number) => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  description?: string;
  onClick: () => void;
}

export default function Sidebar({ currentPersona, onPersonaChange, currentLevel = 1, onLevelChange }: SidebarProps) {
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [expandedMenu, setExpandedMenu] = useState<Persona | null>('CSM');
  const [expandedPersona, setExpandedPersona] = useState<Persona | null>(currentPersona);

  const personas: Persona[] = ['CSM', 'CO', 'SE', 'AI_CHAT'];

  const handlePersonaClick = (persona: Persona) => {
    // First call the onPersonaChange callback if provided
    if (onPersonaChange) {
      onPersonaChange(persona);
    }

    // Store the selected persona in localStorage so the main page can pick it up
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPersona', persona);
    }

    // Navigate to the main page with the selected persona
    // The main page will handle showing the correct dashboard
    router.push('/');
  };

  // Define main navigation sections
  const mainSections = [
    {
      id: 'cisco-analytics',
      label: 'Cisco Analytics',
      icon: TrendingUp,
      description: 'Enterprise analytics platform',
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/analytics';
        }
      }
    },
    {
      id: 'customer-success',
      label: 'Customer Success Manager',
      icon: Users,
      description: 'CSM dashboard & tools',
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/csm';
        }
      }
    },
    {
      id: 'health-dashboard',
      label: 'Health Dashboard',
      icon: Activity,
      description: 'Customer health monitoring',
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/csm/health';
        }
      }
    }
  ];

  // Define submenus for each persona
  const subMenus: Record<Persona, SubMenuItem[]> = {
    CSM: [
      {
        id: 'portfolio',
        label: 'Portfolio Dashboard',
        description: 'Strategic overview & KPIs',
        onClick: () => {
          onPersonaChange('CSM');
          if (typeof window !== 'undefined') {
            window.location.href = '/csm';
          }
        }
      },
      {
        id: 'health-score',
        label: 'Health Score',
        description: 'Customer health metrics',
        onClick: () => {
          onPersonaChange('CSM');
          if (typeof window !== 'undefined') {
            window.location.href = '/csm/kpi/portfolio-health';
          }
        }
      },
      {
        id: 'renewal-rate',
        label: 'Renewal Rate',
        description: 'Renewal tracking & analysis',
        onClick: () => {
          onPersonaChange('CSM');
          if (typeof window !== 'undefined') {
            window.location.href = '/csm/kpi/renewal-rate';
          }
        }
      },
      {
        id: 'at-risk-arr',
        label: 'At-Risk ARR',
        description: 'Revenue at risk analysis',
        onClick: () => {
          onPersonaChange('CSM');
          if (typeof window !== 'undefined') {
            window.location.href = '/csm/kpi/at-risk-arr';
          }
        }
      },
      {
        id: 'portfolio-utilization',
        label: 'Portfolio Utilization',
        description: 'License utilization metrics',
        onClick: () => {
          onPersonaChange('CSM');
          if (typeof window !== 'undefined') {
            window.location.href = '/csm/kpi/portfolio-utilization';
          }
        }
      }
    ],
    CO: [],
    SE: [],
    AI_CHAT: []
  };

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
              onClick={toggleSidebar}
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
                    <div className="flex-1 text-left">
                      <div className="font-normal">{getPersonaName(persona)}</div>
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
