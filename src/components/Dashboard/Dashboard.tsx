'use client';

import { useState } from 'react';
import { colors, personaColors } from '@/config/theme';
import { Persona, getPersonaData, getPersonaName } from '@/data/dummyData';
import PersonaDropdowns from './PersonaDropdowns';
import DashboardStats from './DashboardStats';
import ChatInterface from '../Chat/ChatInterface';

interface DashboardProps {
  persona: Persona;
}

export default function Dashboard({ persona }: DashboardProps) {
  const personaColor = personaColors[persona];
  const data = getPersonaData(persona);

  // If AI_CHAT persona is selected, render the ChatInterface
  if (persona === 'AI_CHAT') {
    return <ChatInterface />;
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Dashboard Header */}
      <div
        className="px-8 py-6 border-b bg-white"
        style={{
          borderColor: colors.neutral[200],
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
              {getPersonaName(persona)} Dashboard
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
              {persona === 'CSM' && 'Monitor customer health, engagement, and product adoption'}
              {persona === 'CO' && 'Track quotes, orders, invoices, and revenue operations'}
              {persona === 'SE' && 'Identify expansion opportunities and manage sales pipeline'}
            </p>
          </div>

          <div
            className="px-5 py-2 rounded-lg font-semibold text-white transition-all duration-200"
            style={{ backgroundColor: colors.primary.DEFAULT }}
          >
            {persona}
          </div>
        </div>
      </div>

      {/* Dropdowns Section */}
      <div className="px-8 py-6 border-b" style={{ backgroundColor: colors.background.secondary, borderColor: colors.neutral[200] }}>
        <PersonaDropdowns persona={persona} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6" style={{ backgroundColor: colors.background.primary }}>
        <DashboardStats persona={persona} />
      </div>
    </div>
  );
}
