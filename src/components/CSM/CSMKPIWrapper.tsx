'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedSidebar from '@/components/Sidebar/EnhancedSidebar';
import { Persona } from '@/data/dummyData';

interface CSMKPIWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export default function CSMKPIWrapper({ 
  children, 
  title, 
  subtitle, 
  showBackButton = true 
}: CSMKPIWrapperProps) {
  const router = useRouter();
  const [currentPersona, setCurrentPersona] = useState<Persona>('CSM');
  const [currentView, setCurrentView] = useState<string>('health-dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handlePersonaChange = (persona: Persona) => {
    setCurrentPersona(persona);
    
    // Redirect to root page when switching personas
    if (persona !== 'CSM') {
      router.push('/');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar 
        currentPersona={currentPersona} 
        onPersonaChange={handlePersonaChange}
        currentView={currentView}
        onViewChange={setCurrentView}
        onCollapseChange={setSidebarCollapsed}
      />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'ml-14' : 'ml-64'
      }`}>
        {/* Header - only show when showBackButton is true */}
        {showBackButton && (
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium transition-colors"
            >
              ← Back to Portfolio Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* KPI Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
