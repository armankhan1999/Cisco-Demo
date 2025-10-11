'use client';

import { useState } from 'react';
import EnhancedSidebar from '@/components/Sidebar/EnhancedSidebar';
import Dashboard from '@/components/Dashboard/Dashboard';
import DrillDownDashboard from '@/components/CommercialOps/DrillDownDashboard';
import { Persona } from '@/data/dummyData';

export default function Home() {

  const [currentPersona, setCurrentPersona] = useState<Persona>('CSM');
  const [currentView, setCurrentView] = useState<string>('command-center');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderMainContent = () => {
    if (currentPersona === 'CO' && currentView === 'command-center') {
      return <DrillDownDashboard />;
    }
    
    // Default to original dashboard for other personas/views
    return <Dashboard persona={currentPersona} />;
  };

  const [currentLevel, setCurrentLevel] = useState(1);


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar 
        currentPersona={currentPersona} 
        onPersonaChange={setCurrentPersona}
        currentView={currentView}
        onViewChange={setCurrentView}
        onCollapseChange={setSidebarCollapsed}
      />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'ml-14' : 'ml-64'
      }`}>
        {renderMainContent()}
      </div>
        currentLevel={currentLevel}
        onLevelChange={setCurrentLevel}
      />
      
      {/* Main Content */}
      <Dashboard persona={currentPersona} level={currentLevel} />
    </div>
  );
}
