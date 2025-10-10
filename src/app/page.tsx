'use client';

import { useState } from 'react';
import EnhancedSidebar from '@/components/Sidebar/EnhancedSidebar';
import Dashboard from '@/components/Dashboard/Dashboard';
import DrillDownDashboard from '@/components/CommercialOps/DrillDownDashboard';
import { Persona } from '@/data/dummyData';

export default function Home() {
  const [currentPersona, setCurrentPersona] = useState<Persona>('CO');
  const [currentView, setCurrentView] = useState<string>('command-center');

  const renderMainContent = () => {
    if (currentPersona === 'CO' && currentView === 'command-center') {
      return <DrillDownDashboard />;
    }
    
    // Default to original dashboard for other personas/views
    return <Dashboard persona={currentPersona} />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Enhanced Sidebar */}
      <EnhancedSidebar 
        currentPersona={currentPersona} 
        onPersonaChange={setCurrentPersona}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderMainContent()}
      </div>
    </div>
  );
}
