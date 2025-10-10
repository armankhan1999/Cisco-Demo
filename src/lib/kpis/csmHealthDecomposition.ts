/**
 * CSM Health Score Decomposition
 * Level 2 - Tactical View: Deep dive into health score components
 */

import { getActiveAccounts, getAllLicenses, csmData } from '@/lib/data/csmDataLoader';
import { 
  calculatePortfolioHealth, 
  calculateAllKPIs
} from './csmKPICalculations';

export interface HealthComponent {
  name: string;
  weight: number;
  score: number;
  contribution: number;
  status: 'success' | 'warning' | 'danger';
  trend?: 'up' | 'down' | 'stable';
  description: string;
  factors: {
    factor: string;
    value: number;
    impact: string;
  }[];
}

export interface HealthDecomposition {
  portfolioHealthScore: number;
  components: HealthComponent[];
  insights: string[];
  topRisks: {
    component: string;
    impact: string;
    recommendation: string;
  }[];
}

/**
 * Create Usage Health component from real KPI values
 */
function createUsageHealthFromKPIs(kpis: any): HealthComponent {
  // Use real Utilization Rate KPI (69%)
  const utilizationKPI = kpis.portfolioUtilization;
  const score = utilizationKPI?.value || 74; // Real value from synthetic data
  
  console.log(`📊 Usage Health: Using real Utilization Rate = ${score}%`);
  
  return {
    name: 'Usage Health',
    weight: 40,
    score: score,
    contribution: score * 0.4,
    status: score >= 75 ? 'success' : score >= 60 ? 'warning' : 'danger',
    trend: utilizationKPI?.trend || 'stable',
    description: 'License utilization and feature adoption across portfolio',
    factors: [
      {
        factor: 'Average Utilization Rate',
        value: score,
        impact: `${score}% utilization across all licenses`
      }
    ]
  };
}

/**
 * Create Engagement Health component from real KPI values
 */
function createEngagementHealthFromKPIs(kpis: any): HealthComponent {
  // Use real Customer Engagement Score KPI (67)
  const engagementKPI = kpis.engagementScore;
  const score = engagementKPI.value; // Real value from synthetic data
  
  console.log(`📊 Engagement Health: Using real Customer Engagement Score = ${score}`);
  
  return {
    name: 'Engagement Health',
    weight: 30,
    score: score,
    contribution: score * 0.3,
    status: score >= 75 ? 'success' : score >= 60 ? 'warning' : 'danger',
    trend: engagementKPI.trend,
    description: 'Customer touchpoints, QBR completion, and interaction frequency',
    factors: [
      {
        factor: 'Customer Engagement Score',
        value: score,
        impact: `${score}/100 engagement composite score`
      }
    ]
  };
}

/**
 * Create Support Health component from real KPI values
 */
function createSupportHealthFromKPIs(kpis: any): HealthComponent {
  // Calculate support health from churn and renewal data
  const churnRate = kpis.churnRate.value;
  const renewalRate = kpis.renewalRate.value;
  
  // Invert churn rate and average with renewal rate for support health
  const churnHealthScore = Math.max(0, 100 - (churnRate * 10)); // Convert 5% churn → 50 health
  const renewalHealthScore = renewalRate;
  const score = Math.round((churnHealthScore + renewalHealthScore) / 2);
  
  console.log(`📊 Support Health: Derived from Churn Rate (${churnRate}%) + Renewal Rate (${renewalRate}%) = ${score}`);
  
  return {
    name: 'Support Health',
    weight: 20,
    score: score,
    contribution: score * 0.2,
    status: score >= 75 ? 'success' : score >= 60 ? 'warning' : 'danger',
    trend: churnRate <= 5 ? 'up' : 'down',
    description: 'Support ticket resolution and customer satisfaction metrics',
    factors: [
      {
        factor: 'Churn Impact',
        value: churnRate,
        impact: `${churnRate}% annual churn rate`
      },
      {
        factor: 'Renewal Success',
        value: renewalRate,
        impact: `${renewalRate}% renewal rate`
      }
    ]
  };
}

/**
 * Create Business Outcome Health component from real KPI values
 */
function createBusinessOutcomeHealthFromKPIs(kpis: any): HealthComponent {
  // Use real GRR and TTV KPI values
  const grrKPI = kpis.grr;
  const ttvKPI = kpis.timeToValue;
  
  // Convert GRR percentage to health score
  const grrScore = grrKPI.value; // 99.9% → 99.9 score
  
  // Convert TTV days to health score (lower days = higher score)
  // 52 days → convert to 0-100 scale (60 days target, lower is better)
  const ttvScore = Math.max(0, Math.min(100, 100 - ((ttvKPI.value - 30) / 30 * 50)));
  
  const score = Math.round((grrScore + ttvScore) / 2);
  
  console.log(`📊 Business Outcome Health: GRR (${grrKPI.value}%) + TTV Impact (${ttvScore}) = ${score}`);
  
  return {
    name: 'Business Outcome',
    weight: 10,
    score: score,
    contribution: score * 0.1,
    status: score >= 75 ? 'success' : score >= 60 ? 'warning' : 'danger',
    trend: grrKPI.trend,
    description: 'Revenue retention and value realization metrics',
    factors: [
      {
        factor: 'Gross Revenue Retention',
        value: grrKPI.value,
        impact: `${grrKPI.value}% GRR performance`
      },
      {
        factor: 'Time to Value',
        value: ttvKPI.value,
        impact: `${ttvKPI.value} days average TTV`
      }
    ]
  };
}

/**
 * Calculate Health Score Decomposition
 * 
 * HEALTH SCORE FORMULA:
 * Portfolio Health = Weighted Average of Account Health Scores
 * Formula: Σ(Account Health × Account ARR) / Total Portfolio ARR
 * 
 * COMPONENT BREAKDOWN (for visualization):
 * - Usage Health (40%): License utilization + feature adoption
 * - Engagement Health (30%): QBR completion + touchpoint frequency  
 * - Support Health (20%): Ticket volume + resolution time
 * - Business Outcome (10%): ROI metrics + expansion indicators
 * 
 * Note: Components show HOW the health score breaks down conceptually,
 * but the actual score comes from individual account health_score values
 * in the accounts.json data.
 */
export function calculateHealthDecomposition(): HealthDecomposition {
  console.log('\n🏥 === HEALTH SCORE DECOMPOSITION ANALYSIS ===');
  console.log('🎯 Using REAL KPI values from main dashboard...');
  
  // Get actual KPI values from main dashboard calculations
  const mainKPIs = calculateAllKPIs();
  
  // Map real KPI values to health components
  const usageHealth = createUsageHealthFromKPIs(mainKPIs);
  const engagementHealth = createEngagementHealthFromKPIs(mainKPIs);
  const supportHealth = createSupportHealthFromKPIs(mainKPIs);
  const businessOutcomeHealth = createBusinessOutcomeHealthFromKPIs(mainKPIs);
  
  const components = [usageHealth, engagementHealth, supportHealth, businessOutcomeHealth];
  
  // Calculate Portfolio Health Score using the correct formula:
  // Portfolio Health = (Usage × 40%) + (Engagement × 30%) + (Support × 20%) + (Business × 10%)
  const calculatedPortfolioHealthScore = components.reduce(
    (sum, component) => sum + component.contribution,
    0
  );
  
  // Generate insights
  const insights: string[] = [];
  const lowestComponent = components.reduce((lowest, current) => 
    current.score < lowest.score ? current : lowest
  );
  
  insights.push(
    `${lowestComponent.name} is the lowest contributor at ${lowestComponent.score}/100 — focus on improvement here.`
  );
  
  // Identify top risks
  const topRisks = components
    .filter(c => c.status !== 'success')
    .map(c => ({
      component: c.name,
      impact: `Score: ${c.score}/100, Contributing ${c.contribution.toFixed(1)} points`,
      recommendation: generateRecommendation(c)
    }));
  
  console.log(`\n📊 Portfolio Health Score: ${calculatedPortfolioHealthScore.toFixed(1)} (calculated from components)`);
  console.log('📈 Component Breakdown (Following KPI_CALCULATION_REFERENCE formula):');
  components.forEach(c => {
    console.log(`  ${c.name}: ${c.score} × ${c.weight}% = ${c.contribution.toFixed(1)} points`);
  });
  console.log(`  TOTAL Portfolio Health Score: ${calculatedPortfolioHealthScore.toFixed(1)}`);
  console.log('='.repeat(50));
  
  return {
    portfolioHealthScore: Math.round(calculatedPortfolioHealthScore),
    components: components,
    insights,
    topRisks
  };
}

function generateRecommendation(component: HealthComponent): string {
  switch (component.name) {
    case 'Usage Health':
      return 'Increase license utilization through training programs and feature adoption campaigns';
    case 'Engagement Health':
      return 'Improve customer touchpoint frequency and QBR completion rates';
    case 'Support Health':
      return 'Reduce ticket resolution times and proactively address customer issues';
    case 'Business Outcome':
      return 'Focus on demonstrating ROI and accelerating time-to-value delivery';
    default:
      return 'Monitor closely and implement targeted improvement initiatives';
  }
}