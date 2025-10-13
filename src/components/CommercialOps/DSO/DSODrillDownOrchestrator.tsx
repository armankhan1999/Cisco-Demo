'use client';

import { useState } from 'react';
import NewDSOLevel1ProductComparison from './NewDSOLevel1ProductComparison';
import NewDSOLevel2SegmentBreakdown from './NewDSOLevel2SegmentBreakdown';
import NewDSOLevel3InvoiceDetail from './NewDSOLevel3InvoiceDetail';

interface DSODrillDownOrchestratorProps {
  onBack: () => void;
}

type DrillDownLevel = 'level1' | 'level2' | 'level3';

interface DrillDownState {
  level: DrillDownLevel;
  productFamily?: string;
  segment?: string;
  geography?: string;
}

/**
 * DSO Drill-Down Orchestrator
 *
 * Implements 3-level drill-down per DSO.md documentation:
 * - Level 1: Product-Line DSO Comparison with AR Aging Matrix
 * - Level 2: Customer Segment & Geography Breakdown
 * - Level 3: Transactional Invoice Detail & Action View
 */
export default function DSODrillDownOrchestrator({ onBack }: DSODrillDownOrchestratorProps) {
  const [drillDownState, setDrillDownState] = useState<DrillDownState>({
    level: 'level1'
  });

  // Level 1 → Level 2: Product Family selected
  const handleDrillToLevel2 = (productFamily: string) => {
    setDrillDownState({
      level: 'level2',
      productFamily
    });
  };

  // Level 2 → Level 3: Segment and Geography selected
  const handleDrillToLevel3 = (segment: string, geography: string, productFamily: string) => {
    setDrillDownState({
      level: 'level3',
      productFamily,
      segment,
      geography
    });
  };

  // Back to Level 1 from Level 2
  const handleBackToLevel1 = () => {
    setDrillDownState({
      level: 'level1'
    });
  };

  // Back to Level 2 from Level 3
  const handleBackToLevel2 = () => {
    setDrillDownState({
      level: 'level2',
      productFamily: drillDownState.productFamily
    });
  };

  // Render appropriate level based on current state
  switch (drillDownState.level) {
    case 'level1':
      return (
        <NewDSOLevel1ProductComparison
          onBack={onBack}
          onDrillToLevel2={handleDrillToLevel2}
        />
      );

    case 'level2':
      return (
        <NewDSOLevel2SegmentBreakdown
          productFamily={drillDownState.productFamily || ''}
          onBack={handleBackToLevel1}
          onDrillToLevel3={handleDrillToLevel3}
        />
      );

    case 'level3':
      return (
        <NewDSOLevel3InvoiceDetail
          segment={drillDownState.segment || ''}
          geography={drillDownState.geography || ''}
          productFamily={drillDownState.productFamily || ''}
          onBack={handleBackToLevel2}
        />
      );

    default:
      return (
        <NewDSOLevel1ProductComparison
          onBack={onBack}
          onDrillToLevel2={handleDrillToLevel2}
        />
      );
  }
}
