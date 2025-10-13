'use client';

import Sidebar from '@/components/Sidebar/Sidebar';
import { CSMPortfolioDashboard } from '@/components/CSM/CSMPortfolioDashboard';
import { useSidebar } from '@/contexts/SidebarContext';

export default function CSMPortfolioPage() {
  const { isCollapsed } = useSidebar();
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPersona="CSM"
        onPersonaChange={() => {}} 
      />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
        <CSMPortfolioDashboard />
      </div>
    </div>
  );
}

