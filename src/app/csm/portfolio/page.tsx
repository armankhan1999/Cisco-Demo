'use client';

import Sidebar from '@/components/Sidebar/Sidebar';
import { CSMPortfolioDashboard } from '@/components/CSM/CSMPortfolioDashboard';

export default function CSMPortfolioPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPersona="CSM"
        onPersonaChange={() => {}} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <CSMPortfolioDashboard />
      </div>
    </div>
  );
}

