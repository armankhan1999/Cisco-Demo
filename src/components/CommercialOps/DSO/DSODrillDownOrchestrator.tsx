'use client';

import { useState } from 'react';
import DSOLevel0ProductComparison from './DSOLevel0ProductComparison';
import DSOLevel1TrendAging from './DSOLevel1TrendAging';
import DSOLevel2SegmentMatrix from './DSOLevel2SegmentMatrix';
import DSOLevel3CustomerAging from './DSOLevel3CustomerAging';
import DSOLevel4CustomerProfile from './DSOLevel4CustomerProfile';

interface DSODrillDownOrchestratorProps {
  onBack: () => void;
}

type DrillDownLevel = 'level0' | 'level1' | 'level2' | 'level3' | 'level4';

interface DrillDownState {
  level: DrillDownLevel;
  segment?: string;
  productFamily?: string;
  customerId?: string;
}

export default function DSODrillDownOrchestrator({ onBack }: DSODrillDownOrchestratorProps) {
  const [drillDownState, setDrillDownState] = useState<DrillDownState>({
    level: 'level0'
  });

  const handleDrillToLevel1 = (productFamily: string) => {
    setDrillDownState({
      level: 'level1',
      productFamily
    });
  };

  const handleDrillToLevel2 = (segment: string, productFamily: string) => {
    setDrillDownState({
      level: 'level2',
      segment,
      productFamily
    });
  };

  const handleDrillToLevel3 = (segment: string, productFamily: string) => {
    setDrillDownState({
      level: 'level3',
      segment,
      productFamily
    });
  };

  const handleDrillToLevel4 = (customerId: string) => {
    setDrillDownState({
      level: 'level4',
      segment: drillDownState.segment,
      productFamily: drillDownState.productFamily,
      customerId
    });
  };

  const handleBackToLevel0 = () => {
    setDrillDownState({
      level: 'level0'
    });
  };

  const handleBackToLevel1 = () => {
    setDrillDownState({
      level: 'level1',
      productFamily: drillDownState.productFamily
    });
  };

  const handleBackToLevel2 = () => {
    setDrillDownState({
      level: 'level2',
      segment: drillDownState.segment,
      productFamily: drillDownState.productFamily
    });
  };

  const handleBackToLevel3 = () => {
    setDrillDownState({
      level: 'level3',
      segment: drillDownState.segment,
      productFamily: drillDownState.productFamily
    });
  };

  // Render appropriate level based on current state
  switch (drillDownState.level) {
    case 'level0':
      return (
        <DSOLevel0ProductComparison
          onBack={onBack}
          onDrillToLevel1={handleDrillToLevel1}
        />
      );

    case 'level1':
      return (
        <DSOLevel1TrendAging
          productFamily={drillDownState.productFamily}
          onBack={handleBackToLevel0}
          onDrillToLevel2={handleDrillToLevel2}
        />
      );

    case 'level2':
      return (
        <DSOLevel2SegmentMatrix
          segment={drillDownState.segment}
          productFamily={drillDownState.productFamily}
          onBack={handleBackToLevel1}
          onDrillToLevel3={handleDrillToLevel3}
        />
      );

    case 'level3':
      return (
        <DSOLevel3CustomerAging
          segment={drillDownState.segment || ''}
          productFamily={drillDownState.productFamily || ''}
          onBack={handleBackToLevel2}
          onDrillToLevel4={handleDrillToLevel4}
        />
      );

    case 'level4':
      return (
        <DSOLevel4CustomerProfile
          customerId={drillDownState.customerId || ''}
          onBack={handleBackToLevel3}
        />
      );

    default:
      return (
        <DSOLevel0ProductComparison
          onBack={onBack}
          onDrillToLevel1={handleDrillToLevel1}
        />
      );
  }
}
