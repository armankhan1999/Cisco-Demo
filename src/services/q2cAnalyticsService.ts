/**
 * Enhanced Q2C Analytics Service
 * Comprehensive analysis of Quote-to-Cash cycle with multi-dimensional insights
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import quoteTrackingData from '@/source_data/commercial_operations/quote_to_cash_tracking.json';
import quotesData from '@/source_data/commercial_operations/quotes.json';
import accountsData from '@/source_data/commercial_operations/accounts.json';
import utilizationHistoryData from '@/source_data/commercial_operations/utilization_history.json';
import licensesData from '@/source_data/commercial_operations/licenses.json';
import amendmentsData from '@/source_data/commercial_operations/amendments.json';
import ordersData from '@/source_data/commercial_operations/orders.json';
import invoicesData from '@/source_data/commercial_operations/invoices.json';
import paymentsData from '@/source_data/commercial_operations/payments.json';

export interface Q2CStageBreakdown {
  stage: string;
  avgDays: number;
  target: number;
  variance: number;
  slaCompliance: number;
  bottleneckScore: number;
  impactLevel: 'high' | 'medium' | 'low';
}

export interface Q2CBottleneckHeatmap {
  stage: string;
  customerTier: string;
  avgDays: number;
  volume: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  rootCause: string;
}

export interface Q2CDealSizeCorrelation {
  dealSize: string;
  avgCycleDays: number;
  volume: number;
  efficiency: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Q2CProductFamilyImpact {
  productFamily: string;
  avgCycleDays: number;
  complexity: number;
  volume: number;
  bottleneckStages: string[];
  improvementOpportunity: number;
}

export interface Q2CGeographicPerformance {
  region: string;
  avgCycleDays: number;
  volume: number;
  performance: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  keyFactors: string[];
}

export interface Q2CSeasonalTrend {
  period: string;
  avgCycleDays: number;
  volume: number;
  seasonalFactor: number;
  businessContext: string;
}

export interface Q2CCapacityInsight {
  customerId: string;
  customerName: string;
  currentCycleDays: number;
  utilizationLevel: number;
  expansionPotential: number;
  renewalRisk: 'high' | 'medium' | 'low';
  recommendedAction: string;
}

export interface Q2CProcessImprovement {
  area: string;
  currentPerformance: number;
  targetPerformance: number;
  potentialSavings: number;
  implementationEffort: 'low' | 'medium' | 'high';
  recommendations: string[];
}

/**
 * Get detailed stage breakdown with bottleneck analysis
 */
export function getQ2CStageBreakdown(): Q2CStageBreakdown[] {
  const stages = [
    { stage: 'Quote Creation → Send', target: 1.0, weight: 0.1 },
    { stage: 'Quote Send → Acceptance', target: 10.0, weight: 0.3 },
    { stage: 'Acceptance → Order', target: 0.5, weight: 0.1 },
    { stage: 'Order → Fulfillment', target: 2.0, weight: 0.2 },
    { stage: 'Fulfillment → Invoice', target: 1.0, weight: 0.1 },
    { stage: 'Invoice → Payment', target: 30.0, weight: 0.2 }
  ];

  return stages.map(stageInfo => {
    // Calculate actual performance from tracking data
    let totalDays = 0;
    let count = 0;
    let slaCompliant = 0;

    quoteTrackingData.forEach(tracking => {
      if (tracking.is_complete) {
        let stageDays = 0;
        switch (stageInfo.stage) {
          case 'Quote Creation → Send':
            stageDays = new Date(tracking.quote_sent_date).getTime() - new Date(tracking.quote_created_date).getTime();
            stageDays = stageDays / (1000 * 60 * 60 * 24);
            break;
          case 'Quote Send → Acceptance':
            if (tracking.quote_accepted_date) {
              stageDays = new Date(tracking.quote_accepted_date).getTime() - new Date(tracking.quote_sent_date).getTime();
              stageDays = stageDays / (1000 * 60 * 60 * 24);
            }
            break;
          case 'Acceptance → Order':
            if (tracking.quote_accepted_date && tracking.order_placed_date) {
              stageDays = new Date(tracking.order_placed_date).getTime() - new Date(tracking.quote_accepted_date).getTime();
              stageDays = stageDays / (1000 * 60 * 60 * 24);
            }
            break;
          case 'Order → Fulfillment':
            if (tracking.order_placed_date && tracking.order_fulfilled_date) {
              stageDays = new Date(tracking.order_fulfilled_date).getTime() - new Date(tracking.order_placed_date).getTime();
              stageDays = stageDays / (1000 * 60 * 60 * 24);
            }
            break;
          case 'Fulfillment → Invoice':
            if (tracking.order_fulfilled_date && tracking.invoice_generated_date) {
              stageDays = new Date(tracking.invoice_generated_date).getTime() - new Date(tracking.order_fulfilled_date).getTime();
              stageDays = stageDays / (1000 * 60 * 60 * 24);
            }
            break;
          case 'Invoice → Payment':
            if (tracking.invoice_sent_date && tracking.payment_received_date) {
              stageDays = new Date(tracking.payment_received_date).getTime() - new Date(tracking.invoice_sent_date).getTime();
              stageDays = stageDays / (1000 * 60 * 60 * 24);
            }
            break;
        }

        if (stageDays > 0) {
          totalDays += stageDays;
          count++;
          if (stageDays <= stageInfo.target) {
            slaCompliant++;
          }
        }
      }
    });

    const avgDays = count > 0 ? totalDays / count : 0;
    const variance = avgDays - stageInfo.target;
    const slaCompliance = count > 0 ? (slaCompliant / count) * 100 : 0;
    const bottleneckScore = Math.max(0, (variance / stageInfo.target) * 100);

    return {
      stage: stageInfo.stage,
      avgDays: Math.round(avgDays * 100) / 100,
      target: stageInfo.target,
      variance: Math.round(variance * 100) / 100,
      slaCompliance: Math.round(slaCompliance),
      bottleneckScore: Math.round(bottleneckScore),
      impactLevel: bottleneckScore > 50 ? 'high' : bottleneckScore > 25 ? 'medium' : 'low'
    };
  });
}

/**
 * Get bottleneck heatmap by stage and customer tier using real stage-specific data
 */
export function getQ2CBottleneckHeatmap(): Q2CBottleneckHeatmap[] {
  const stages = ['Quote Approval', 'Legal Review', 'Order Processing', 'Fulfillment', 'Billing', 'Collection'];
  const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
  const heatmapData: Q2CBottleneckHeatmap[] = [];

  stages.forEach(stage => {
    tiers.forEach(tier => {
      // Get tracking data filtered by customer tier
      const tierTracking = quoteTrackingData.filter(tracking => {
        const account = accountsData.find(acc => acc.account?.id === tracking.customer_id);
        return account?.account?.tier?.toLowerCase() === tier.toLowerCase();
      });

      let stageDays = 0;
      let stageCount = 0;

      // Calculate stage-specific performance from real data
      tierTracking.forEach(tracking => {
        let currentStageDays = 0;
        
        switch (stage) {
          case 'Quote Approval':
            if (tracking.quote_sent_date && tracking.quote_accepted_date) {
              currentStageDays = (new Date(tracking.quote_accepted_date).getTime() - new Date(tracking.quote_sent_date).getTime()) / (1000 * 60 * 60 * 24);
            }
            break;
          case 'Legal Review':
            // Simulate legal review as part of quote acceptance for complex deals
            if (tracking.arr_value > 200000 && tracking.quote_accepted_date && tracking.quote_sent_date) {
              const totalQuoteDays = (new Date(tracking.quote_accepted_date).getTime() - new Date(tracking.quote_sent_date).getTime()) / (1000 * 60 * 60 * 24);
              currentStageDays = totalQuoteDays * 0.6; // Legal review is typically 60% of quote approval time for large deals
            }
            break;
          case 'Order Processing':
            if (tracking.quote_accepted_date && tracking.order_placed_date) {
              currentStageDays = (new Date(tracking.order_placed_date).getTime() - new Date(tracking.quote_accepted_date).getTime()) / (1000 * 60 * 60 * 24);
            }
            break;
          case 'Fulfillment':
            if (tracking.order_placed_date && tracking.order_fulfilled_date) {
              currentStageDays = (new Date(tracking.order_fulfilled_date).getTime() - new Date(tracking.order_placed_date).getTime()) / (1000 * 60 * 60 * 24);
            }
            break;
          case 'Billing':
            if (tracking.order_fulfilled_date && tracking.invoice_sent_date) {
              currentStageDays = (new Date(tracking.invoice_sent_date).getTime() - new Date(tracking.order_fulfilled_date).getTime()) / (1000 * 60 * 60 * 24);
            }
            break;
          case 'Collection':
            if (tracking.invoice_sent_date && tracking.payment_received_date) {
              currentStageDays = (new Date(tracking.payment_received_date).getTime() - new Date(tracking.invoice_sent_date).getTime()) / (1000 * 60 * 60 * 24);
            }
            break;
        }

        if (currentStageDays > 0) {
          stageDays += currentStageDays;
          stageCount++;
        }
      });

      const avgDays = stageCount > 0 ? stageDays / stageCount : 0;

      // Determine severity based on stage-specific targets
      const stageTargets = {
        'Quote Approval': 7,
        'Legal Review': 5,
        'Order Processing': 1,
        'Fulfillment': 3,
        'Billing': 2,
        'Collection': 30
      };

      const target = stageTargets[stage as keyof typeof stageTargets] || 5;
      let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
      let rootCause = 'Process running smoothly';

      const variance = avgDays - target;
      if (variance > target * 1.5) {
        severity = 'critical';
        rootCause = `${stage} taking ${variance.toFixed(1)} days above target - immediate action required`;
      } else if (variance > target * 0.5) {
        severity = 'high';
        rootCause = `${stage} delays impacting ${tier} customers - optimization needed`;
      } else if (variance > 0) {
        severity = 'medium';
        rootCause = `Minor ${stage.toLowerCase()} delays for ${tier} tier`;
      } else {
        rootCause = `${stage} performing within target for ${tier} customers`;
      }

      heatmapData.push({
        stage,
        customerTier: tier,
        avgDays: Math.round(avgDays * 10) / 10,
        volume: stageCount,
        severity,
        rootCause
      });
    });
  });

  return heatmapData;
}

/**
 * Get deal size vs cycle time correlation using real ARR values
 */
export function getQ2CDealSizeCorrelation(): Q2CDealSizeCorrelation[] {
  const dealSizeBands = [
    { band: '<$50K', min: 0, max: 50000 },
    { band: '$50K-$100K', min: 50000, max: 100000 },
    { band: '$100K-$250K', min: 100000, max: 250000 },
    { band: '$250K-$500K', min: 250000, max: 500000 },
    { band: '$500K+', min: 500000, max: Infinity }
  ];

  return dealSizeBands.map(band => {
    // Filter deals by ARR value within the band
    const relevantDeals = quoteTrackingData.filter(tracking => 
      tracking.arr_value >= band.min && tracking.arr_value < band.max && tracking.is_complete
    );

    if (relevantDeals.length === 0) {
      return {
        dealSize: band.band,
        avgCycleDays: 0,
        volume: 0,
        efficiency: 0,
        trend: 'stable' as const
      };
    }

    // Calculate actual average cycle days for this deal size band
    const totalCycleDays = relevantDeals.reduce((sum, deal) => sum + (deal.quote_to_cash_days || 0), 0);
    const avgCycleDays = totalCycleDays / relevantDeals.length;

    // Calculate efficiency based on target of 45 days
    const targetDays = 45;
    const efficiency = Math.max(0, Math.min(100, ((targetDays - avgCycleDays + targetDays) / targetDays) * 100));

    // Determine trend based on SLA compliance
    const slaCompliant = relevantDeals.filter(deal => deal.meets_sla).length;
    const complianceRate = (slaCompliant / relevantDeals.length) * 100;
    
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (complianceRate > 80) {
      trend = 'improving';
    } else if (complianceRate < 60) {
      trend = 'declining';
    }

    return {
      dealSize: band.band,
      avgCycleDays: Math.round(avgCycleDays * 10) / 10,
      volume: relevantDeals.length,
      efficiency: Math.round(efficiency),
      trend
    };
  }).filter(item => item.volume > 0); // Only return bands with actual data
}

/**
 * Get product family impact analysis
 */
export function getQ2CProductFamilyImpact(): Q2CProductFamilyImpact[] {
  const productFamilies = ['Meraki', 'Duo', 'Umbrella', 'ThousandEyes', 'Splunk'];

  return productFamilies.map(family => {
    // Find quotes for this product family
    const familyQuotes = quotesData.filter((quote: any) => 
      quote.product_families?.includes(family) || quote.product_family?.toLowerCase() === family.toLowerCase()
    );

    const familyTracking = quoteTrackingData.filter(tracking =>
      familyQuotes.some(quote => quote.quote_id === tracking.quote_id)
    );

    const avgCycleDays = familyTracking.length > 0
      ? familyTracking.reduce((sum, t) => sum + (t.quote_to_cash_days || 0), 0) / familyTracking.length
      : 0;

    // Calculate complexity score based on product characteristics
    const complexityFactors = {
      'Meraki': 3, // Hardware + software
      'Duo': 2, // Software with integrations
      'Umbrella': 2, // Cloud service
      'ThousandEyes': 4, // Complex monitoring setup
      'Splunk': 5 // Most complex data platform
    };

    const complexity = complexityFactors[family as keyof typeof complexityFactors] || 3;
    const improvementOpportunity = Math.max(0, avgCycleDays - 35) * 2;

    return {
      productFamily: family,
      avgCycleDays: Math.round(avgCycleDays * 10) / 10,
      complexity,
      volume: familyTracking.length,
      bottleneckStages: complexity > 3 ? ['Legal Review', 'Technical Setup'] : ['Quote Approval'],
      improvementOpportunity: Math.round(improvementOpportunity)
    };
  });
}

/**
 * Get capacity-driven insights connecting Q2C to utilization
 */
export function getQ2CCapacityInsights(): Q2CCapacityInsight[] {
  const insights: Q2CCapacityInsight[] = [];

  // Get recent utilization data
  const recentUtilization = (utilizationHistoryData as any[]).slice(-100);
  
  recentUtilization.forEach((util: any) => {
    const account = accountsData.find(acc => acc.account?.id === util.customer_id);
    const recentTracking = quoteTrackingData.find(t => t.customer_id === util.customer_id);

    if (account && recentTracking) {
      const utilizationLevel = util.utilization_percentage || 0;
      const cycleDays = recentTracking.quote_to_cash_days || 0;

      let renewalRisk: 'high' | 'medium' | 'low' = 'low';
      let recommendedAction = 'Monitor standard renewal process';

      if (utilizationLevel > 90) {
        renewalRisk = 'low';
        recommendedAction = 'Proactive expansion opportunity - customer at capacity';
      } else if (utilizationLevel < 50) {
        renewalRisk = 'high';
        recommendedAction = 'Risk of downsizing - investigate usage patterns';
      } else if (cycleDays > 50) {
        renewalRisk = 'medium';
        recommendedAction = 'Long cycle time may indicate customer hesitation';
      }

      insights.push({
        customerId: util.customer_id,
        customerName: account.account?.name || 'Unknown',
        currentCycleDays: cycleDays,
        utilizationLevel,
        expansionPotential: utilizationLevel > 85 ? Math.round((100 - utilizationLevel) * 10) : 0,
        renewalRisk,
        recommendedAction
      });
    }
  });

  return insights.slice(0, 20); // Return top 20 insights
}

/**
 * Get process improvement recommendations
 */
export function getQ2CProcessImprovements(): Q2CProcessImprovement[] {
  const stageBreakdown = getQ2CStageBreakdown();
  const improvements: Q2CProcessImprovement[] = [];

  stageBreakdown.forEach(stage => {
    if (stage.impactLevel === 'high' || stage.impactLevel === 'medium') {
      const potentialSavings = Math.round(stage.variance * 1000); // Estimate in dollars per day saved

      let recommendations: string[] = [];
      let implementationEffort: 'low' | 'medium' | 'high' = 'medium';

      switch (stage.stage) {
        case 'Quote Send → Acceptance':
          recommendations = [
            'Implement automated quote follow-up sequences',
            'Provide customer self-service quote acceptance portal',
            'Add quote expiration urgency messaging'
          ];
          implementationEffort = 'medium';
          break;
        case 'Order → Fulfillment':
          recommendations = [
            'Automate order processing workflows',
            'Implement real-time inventory checking',
            'Add fulfillment status notifications'
          ];
          implementationEffort = 'high';
          break;
        case 'Invoice → Payment':
          recommendations = [
            'Enable automated payment reminders',
            'Offer multiple payment methods',
            'Implement early payment discounts'
          ];
          implementationEffort = 'low';
          break;
        default:
          recommendations = [
            'Review and optimize current process',
            'Implement automation where possible',
            'Add performance monitoring'
          ];
      }

      improvements.push({
        area: stage.stage,
        currentPerformance: stage.avgDays,
        targetPerformance: stage.target,
        potentialSavings,
        implementationEffort,
        recommendations
      });
    }
  });

  return improvements;
}

/**
 * Get quotes requiring immediate action (>5 days pending)
 */
export function getQ2CQuotesRequiringAction(): any[] {
  const currentDate = new Date();
  const pendingQuotes: any[] = [];

  // Find quotes that are pending and overdue
  quoteTrackingData.forEach(tracking => {
    if (!tracking.is_complete) {
      const quoteCreatedDate = new Date(tracking.quote_created_date);
      const daysPending = Math.floor((currentDate.getTime() - quoteCreatedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysPending > 5) {
        const account = accountsData.find(acc => acc.account?.id === tracking.customer_id);
        const quote = quotesData.find(q => q.quote_id === tracking.quote_id);
        
        pendingQuotes.push({
          id: tracking.quote_id,
          trackingId: tracking.tracking_id,
          customerName: account?.account?.name || 'Unknown Customer',
          customerId: tracking.customer_id,
          arrValue: tracking.arr_value,
          daysPending,
          currentStage: tracking.current_stage,
          quoteCreatedDate: tracking.quote_created_date,
          quoteSentDate: tracking.quote_sent_date,
          targetCycleDays: tracking.target_cycle_days,
          customerTier: account?.account?.tier || 'Unknown',
          productFamily: quote?.product_families?.[0] || 'Mixed',
          riskLevel: daysPending > 15 ? 'critical' : daysPending > 10 ? 'high' : 'medium',
          estimatedLoss: Math.round(tracking.arr_value * (daysPending / 100)) // Estimate potential loss
        });
      }
    }
  });

  // Sort by ARR value and days pending (highest impact first)
  return pendingQuotes
    .sort((a, b) => (b.arrValue * b.daysPending) - (a.arrValue * a.daysPending))
    .slice(0, 20); // Return top 20 most critical
}

/**
 * Get historical trend data for Q2C performance
 */
export function getQ2CHistoricalTrends(): any[] {
  const monthlyData: { [key: string]: { totalDays: number; count: number; volume: number } } = {};

  // Group data by month
  quoteTrackingData.forEach(tracking => {
    if (tracking.is_complete && tracking.quote_to_cash_days) {
      const date = new Date(tracking.quote_created_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { totalDays: 0, count: 0, volume: 0 };
      }
      
      monthlyData[monthKey].totalDays += tracking.quote_to_cash_days;
      monthlyData[monthKey].count += 1;
      monthlyData[monthKey].volume += tracking.arr_value;
    }
  });

  // Convert to array and calculate averages
  const result = Object.entries(monthlyData)
    .map(([month, data]) => ({
      period: month,
      value: Math.round((data.totalDays / data.count) * 10) / 10, // Use 'value' for consistency with chart
      avgCycleDays: Math.round((data.totalDays / data.count) * 10) / 10,
      volume: data.count,
      totalARR: Math.round(data.volume / 1000), // In thousands
      target: 45,
      improvement: data.count > 0 ? Math.max(0, 45 - (data.totalDays / data.count)) : 0
    }))
    .sort((a, b) => a.period.localeCompare(b.period))
    .slice(-12); // Last 12 months

  console.log('Historical Trends Data:', result); // Debug log
  return result;
}

/**
 * Get seasonal trend analysis with business context
 */
export function getQ2CSeasonalTrends(): Q2CSeasonalTrend[] {
  const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'];
  
  return quarters.map(quarter => {
    // Filter tracking data by quarter
    const quarterData = quoteTrackingData.filter(tracking => {
      const date = new Date(tracking.quote_created_date);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      let targetQuarter = '';
      if (month < 3) targetQuarter = `Q1 ${year}`;
      else if (month < 6) targetQuarter = `Q2 ${year}`;
      else if (month < 9) targetQuarter = `Q3 ${year}`;
      else targetQuarter = `Q4 ${year}`;
      
      return targetQuarter === quarter;
    });

    const avgCycleDays = quarterData.length > 0
      ? quarterData.reduce((sum, t) => sum + (t.quote_to_cash_days || 0), 0) / quarterData.length
      : 0;

    // Add business context for seasonal patterns
    let businessContext = 'Standard business period';
    let seasonalFactor = 1.0;

    if (quarter.includes('Q4')) {
      businessContext = 'Year-end rush - customers accelerating purchases for budget reasons';
      seasonalFactor = 0.9; // Faster cycles
    } else if (quarter.includes('Q1')) {
      businessContext = 'New budget approvals - longer approval cycles expected';
      seasonalFactor = 1.1; // Slower cycles
    } else if (quarter.includes('Q2')) {
      businessContext = 'Mid-year optimization - balanced performance expected';
      seasonalFactor = 1.0;
    }

    return {
      period: quarter,
      avgCycleDays: Math.round(avgCycleDays * 10) / 10,
      volume: quarterData.length,
      seasonalFactor,
      businessContext
    };
  });
}
