'use client';

import { useState } from 'react';
import Q2CLevel1ProcessBreakdown from './Q2CLevel1ProcessBreakdown';
import Q2CLevel2SegmentDeepDive from './Q2CLevel2SegmentDeepDive';
import Q2CLevel3TransactionDetail from './Q2CLevel3TransactionDetail';
import Q2CLevel4RootCauseAnalysis from './Q2CLevel4RootCauseAnalysis';

interface Q2CDrillDownOrchestratorProps {
  onBack: () => void;
}

type DrillDownLevel = {
  level: 1 | 2 | 3 | 4;
  stage?: string;
  segment?: string;
  productFamily?: string;
  customerId?: string;
};

export default function Q2CDrillDownOrchestrator({ onBack }: Q2CDrillDownOrchestratorProps) {
  const [currentLevel, setCurrentLevel] = useState<DrillDownLevel>({ level: 1 });

  const handleDrillToLevel2 = (stage: string) => {
    setCurrentLevel({ level: 2, stage });
  };

  const handleDrillToLevel3 = (segment: string, productFamily: string) => {
    setCurrentLevel({ 
      level: 3, 
      stage: currentLevel.stage, 
      segment, 
      productFamily 
    });
  };

  const handleDrillToLevel4 = (customerId: string) => {
    setCurrentLevel({ 
      level: 4, 
      stage: currentLevel.stage,
      segment: currentLevel.segment,
      productFamily: currentLevel.productFamily,
      customerId 
    });
  };

  const handleBackToLevel1 = () => {
    setCurrentLevel({ level: 1 });
  };

  const handleBackToLevel2 = () => {
    setCurrentLevel({ 
      level: 2, 
      stage: currentLevel.stage 
    });
  };

  const handleBackToLevel3 = () => {
    setCurrentLevel({ 
      level: 3, 
      stage: currentLevel.stage,
      segment: currentLevel.segment,
      productFamily: currentLevel.productFamily
    });
  };

  // Render appropriate level component
  switch (currentLevel.level) {
    case 1:
      return (
        <Q2CLevel1ProcessBreakdown
          onBack={onBack}
          onDrillToLevel2={handleDrillToLevel2}
        />
      );
    
    case 2:
      return (
        <Q2CLevel2SegmentDeepDive
          stage={currentLevel.stage!}
          onBack={handleBackToLevel1}
          onDrillToLevel3={handleDrillToLevel3}
        />
      );
    
    case 3:
      return (
        <Q2CLevel3TransactionDetail
          segment={currentLevel.segment!}
          productFamily={currentLevel.productFamily!}
          onBack={handleBackToLevel2}
          onDrillToLevel4={handleDrillToLevel4}
        />
      );
    
    case 4:
      return (
        <Q2CLevel4RootCauseAnalysis
          customerId={currentLevel.customerId!}
          onBack={handleBackToLevel3}
        />
      );
    
    default:
      return (
        <Q2CLevel1ProcessBreakdown
          onBack={onBack}
          onDrillToLevel2={handleDrillToLevel2}
        />
      );
  }
}
