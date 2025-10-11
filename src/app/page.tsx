'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Dashboard from '@/components/Dashboard/Dashboard';
import { Persona } from '@/data/dummyData';

export default function Home() {
  const [currentPersona, setCurrentPersona] = useState<Persona>('CSM');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPersona={currentPersona} 
        onPersonaChange={setCurrentPersona}
      />
      
      {/* Main Content */}
      <Dashboard persona={currentPersona} />
    </div>
  );
}
