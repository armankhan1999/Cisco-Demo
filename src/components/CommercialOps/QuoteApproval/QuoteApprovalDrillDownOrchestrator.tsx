'use client';

import { useState } from 'react';
import QuoteApprovalLevel1ApprovalFunnel from './QuoteApprovalLevel1ApprovalFunnel';
import QuoteApprovalLevel2BottleneckAnalysis from './QuoteApprovalLevel2BottleneckAnalysis';
import QuoteApprovalLevel3PendingQueue from './QuoteApprovalLevel3PendingQueue';
import QuoteApprovalLevel4QuoteDetail from './QuoteApprovalLevel4QuoteDetail';

interface QuoteApprovalDrillDownOrchestratorProps {
  onBack: () => void;
}

type DrillDownLevel = 'level1' | 'level2' | 'level3' | 'level4';

interface DrillDownState {
  level: DrillDownLevel;
  stage?: string;
  dealSize?: string;
  complexity?: string;
  quoteId?: string;
}

export default function QuoteApprovalDrillDownOrchestrator({ onBack }: QuoteApprovalDrillDownOrchestratorProps) {
  const [drillDownState, setDrillDownState] = useState<DrillDownState>({
    level: 'level1'
  });

  const handleDrillToLevel2 = (stage: string) => {
    setDrillDownState({
      level: 'level2',
      stage
    });
  };

  const handleDrillToLevel3 = (dealSize: string, complexity: string) => {
    setDrillDownState({
      level: 'level3',
      dealSize,
      complexity
    });
  };

  const handleDrillToLevel4 = (quoteId: string) => {
    setDrillDownState({
      level: 'level4',
      quoteId
    });
  };

  const handleBackToLevel1 = () => {
    setDrillDownState({
      level: 'level1'
    });
  };

  const handleBackToLevel2 = () => {
    setDrillDownState({
      level: 'level2',
      stage: drillDownState.stage
    });
  };

  const handleBackToLevel3 = () => {
    setDrillDownState({
      level: 'level3',
      dealSize: drillDownState.dealSize,
      complexity: drillDownState.complexity
    });
  };

  // Render appropriate level based on current state
  switch (drillDownState.level) {
    case 'level1':
      return (
        <QuoteApprovalLevel1ApprovalFunnel
          onBack={onBack}
          onDrillToLevel2={handleDrillToLevel2}
        />
      );

    case 'level2':
      return (
        <QuoteApprovalLevel2BottleneckAnalysis
          stage={drillDownState.stage || ''}
          onBack={handleBackToLevel1}
          onDrillToLevel3={handleDrillToLevel3}
        />
      );

    case 'level3':
      return (
        <QuoteApprovalLevel3PendingQueue
          dealSize={drillDownState.dealSize || ''}
          complexity={drillDownState.complexity || ''}
          onBack={handleBackToLevel2}
          onDrillToLevel4={handleDrillToLevel4}
        />
      );

    case 'level4':
      return (
        <QuoteApprovalLevel4QuoteDetail
          quoteId={drillDownState.quoteId || ''}
          onBack={handleBackToLevel3}
        />
      );

    default:
      return (
        <QuoteApprovalLevel1ApprovalFunnel
          onBack={onBack}
          onDrillToLevel2={handleDrillToLevel2}
        />
      );
  }
}
