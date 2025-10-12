'use client';

/* eslint-disable */
// @ts-nocheck

import { useState, useEffect } from 'react';
import { AlertCircle, Users, RefreshCw } from 'lucide-react';
import { drillDownService } from '@/services/drillDownService';
import { ArrowLeft, AlertTriangle, Clock, DollarSign, User, Phone, Mail, FileText, CheckCircle, XCircle, Filter, Search, Calendar, Bell, TrendingUp, Target, Zap } from '@/utils/iconMapping';
import { KPI_DRILL_DOWNS, type KPIDrillDown } from '@/services/drillDownService';
import { getQ2CProcessImprovements, getQ2CCapacityInsights, getQ2CBottleneckHeatmap, getQ2CQuotesRequiringAction } from '@/services/q2cAnalyticsService';
import expansionOpportunitiesData from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import customersData from '@/source_data/master-data/customers.json';
import whiteSpaceData from '@/source_data/csm-data/white_space_analysis.json';
import licensesData from '@/source_data/master-data/licenses.json';

interface Level3OperationalActionsProps {
  kpiId: string;
  actionId?: string;
  onBack: () => void;
}

interface ActionItem {
  id: string;
  type: 'quote' | 'invoice' | 'account' | 'contract' | 'opportunity' | 'analysis';
  title: string;
  customer: string;
  amount: number;
  daysOverdue: number;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  nextAction: string;
  businessImpact: string;
}

export default function Level3OperationalActions({ kpiId, actionId, onBack }: Level3OperationalActionsProps) {
  const [kpiDrillDown, setKpiDrillDown] = useState<KPIDrillDown | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    assignee: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showQuoteDetails, setShowQuoteDetails] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [quotesRequiringAction, setQuotesRequiringAction] = useState<any[]>([]);

  useEffect(() => {
    const drillDown = KPI_DRILL_DOWNS.find(kpi => kpi.kpiId === kpiId);
    if (drillDown) {
      setKpiDrillDown(drillDown);
      loadActionItems(kpiId, actionId);
      
      // Load real quotes requiring action for Q2C
      if (kpiId === 'quote-to-cash-cycle') {
        const realQuotes = getQ2CQuotesRequiringAction();
        setQuotesRequiringAction(realQuotes);
      }
    }
    setLoading(false);
  }, [kpiId, actionId]);

  const loadActionItems = (kpiId: string, actionId?: string) => {
    // Generate action items based on KPI and real data from master files
    const items: ActionItem[] = [];

    // MULTI-PRODUCT PENETRATION KPI
    if (kpiId === 'multi-product-penetration') {
      // Get ALL accounts with their penetration analysis
      const allAccountsAnalysis = customersData
        .map(customer => {
          const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
          const whiteSpaceRecord = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
          const expansionOpps = expansionOpportunitiesData.filter(o => o.customer_id === customer.customer_id);
          const currentProducts = customerLicenses.map(l => l.product_family);
          const missingProducts = ['Meraki', 'Duo', 'Umbrella', 'ThousandEyes', 'Splunk']
            .filter(product => !currentProducts.includes(product));
          const avgUtilization = customerLicenses.length > 0 ? 
            customerLicenses.reduce((sum, l) => sum + l.utilization, 0) / customerLicenses.length : 0;
          
          return {
            customer,
            currentProducts,
            missingProducts,
            whiteSpaceRecord,
            expansionOpps,
            avgUtilization,
            totalWhiteSpace: whiteSpaceRecord?.total_white_space_arr || 0
          };
        })
        .sort((a, b) => {
          // Sort by tier priority first, then by white space value
          const tierPriority = { 'Strategic': 4, 'Enterprise': 3, 'Commercial': 2, 'SMB': 1 };
          const aPriority = tierPriority[a.customer.tier as keyof typeof tierPriority] || 0;
          const bPriority = tierPriority[b.customer.tier as keyof typeof tierPriority] || 0;
          
          if (aPriority !== bPriority) return bPriority - aPriority;
          return b.totalWhiteSpace - a.totalWhiteSpace;
        });
      
      // Add action item for each account
      allAccountsAnalysis.forEach((analysis, index) => {
        const { customer, currentProducts, missingProducts, whiteSpaceRecord, expansionOpps, avgUtilization, totalWhiteSpace } = analysis;
        
        // Determine the best opportunity
        const bestOpportunity = whiteSpaceRecord?.white_space_opportunities
          ?.sort((a, b) => b.estimated_arr - a.estimated_arr)[0];
        const bestExpansionOpp = expansionOpps.sort((a, b) => b.estimated_arr - a.estimated_arr)[0];
        
        // Determine action type and priority
        let actionType = '';
        let nextAction = '';
        let priority: 'high' | 'medium' | 'low' = 'medium';
        let status: 'pending' | 'in_progress' | 'completed' = 'pending';
        let daysOverdue = 0;
        
        if (customer.product_count === 1) {
          actionType = 'Single-Product Cross-Sell';
          nextAction = avgUtilization >= 70 ? 
            `Schedule ${bestOpportunity?.product || missingProducts[0]} demo` :
            `Improve ${currentProducts[0]} adoption to 75%+ before cross-sell`;
          priority = customer.tier === 'Strategic' ? 'high' : customer.tier === 'Enterprise' ? 'medium' : 'low';
          status = avgUtilization >= 70 ? 'pending' : 'in_progress';
          daysOverdue = avgUtilization < 70 ? Math.floor(index / 3) + 2 : 0;
        } else if (customer.product_count === 2) {
          actionType = 'Multi-Product Expansion';
          nextAction = `Evaluate ${missingProducts.slice(0, 2).join(' or ')} for expansion`;
          priority = totalWhiteSpace > 200000 ? 'high' : 'medium';
          status = avgUtilization >= 75 ? 'pending' : 'in_progress';
          daysOverdue = avgUtilization < 75 ? Math.floor(index / 4) + 1 : 0;
        } else if (customer.product_count >= 3) {
          actionType = 'Portfolio Optimization';
          nextAction = avgUtilization >= 80 ? 
            'Monitor for additional expansion opportunities' :
            'Focus on improving utilization across products';
          priority = avgUtilization < 70 ? 'high' : 'low';
          status = avgUtilization >= 80 ? 'completed' : avgUtilization >= 70 ? 'in_progress' : 'pending';
          daysOverdue = avgUtilization < 70 ? Math.floor(index / 5) + 1 : 0;
        } else {
          actionType = 'New Customer Onboarding';
          nextAction = 'Complete product onboarding and establish baseline';
          priority = customer.tier === 'Strategic' ? 'high' : 'medium';
          status = 'in_progress';
          daysOverdue = Math.floor(index / 2) + 3;
        }
        
        items.push({
          id: `ACCOUNT-${customer.customer_id}`,
          type: 'account',
          title: `${actionType} - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: totalWhiteSpace > 0 ? totalWhiteSpace : (bestExpansionOpp?.estimated_arr || customer.arr * 0.25),
          daysOverdue,
          assignee: customer.csm_id || 'Account Manager',
          priority,
          status,
          nextAction,
          businessImpact: `${customer.tier} • ${customer.product_count} products: ${currentProducts.join(', ') || 'None'} • ${Math.round(avgUtilization)}% avg utilization • $${(customer.arr / 1000).toFixed(0)}K ARR • $${(totalWhiteSpace / 1000).toFixed(0)}K white space`
        });
      });
    }

    // SALES EXPANSION KPIs - Using Real Customer Data
    if (kpiId === 'nrr') {
      // Get ALL top performing accounts (expansion_success story type)
      const successAccounts = customersData.filter(c => c.story_type === 'expansion_success');
      successAccounts.forEach((customer, index) => {
        items.push({
          id: `NRR-SUCCESS-${customer.customer_id}`,
          type: 'account',
          title: `High NRR Success Pattern - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: customer.arr,
          daysOverdue: 0,
          assignee: customer.csm_id || 'Sales Strategy Team',
          priority: 'medium',
          status: 'pending',
          nextAction: 'Document success factors and create replication playbook',
          businessImpact: `${customer.tier} account with $${(customer.arr / 1000).toFixed(0)}K ARR. Multi-product adoption success.`
        });
      });
      
      // Get ALL at-risk accounts
      const atRiskAccounts = customersData.filter(c => c.story_type === 'at_risk');
      atRiskAccounts.forEach((customer, index) => {
        items.push({
          id: `NRR-RISK-${customer.customer_id}`,
          type: 'account',
          title: `At-Risk Account Intervention - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: customer.arr,
          daysOverdue: 30 + (index * 10),
          assignee: customer.csm_id || 'Account Manager',
          priority: 'high',
          status: 'pending',
          nextAction: 'Schedule executive QBR and develop retention plan',
          businessImpact: `${customer.tier} account at risk. $${(customer.arr / 1000).toFixed(0)}K ARR. Immediate engagement needed.`
        });
      });
    }
    
    if (kpiId === 'expansion-arr' && !actionId) {
      // Only show general expansion items if no specific actionId is provided
      const hotOpps = expansionOpportunitiesData
        .filter(o => o.expansion_readiness_score >= 70 && !['Closed-Won', 'Closed-Lost'].includes(o.stage));
      
      hotOpps.forEach((opp) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        items.push({
          id: `EXP-${opp.opportunity_id}`,
          type: 'account',
          title: `${opp.opportunity_type.replace('_', ' ')} - ${opp.recommended_product}`,
          customer: customer?.customer_name || opp.customer_id,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage > 30 ? opp.days_in_stage - 30 : 0,
          assignee: customer?.csm_id || 'Sales Rep',
          priority: opp.expansion_readiness_score >= 85 ? 'high' : 'medium',
          status: opp.days_in_stage > 45 ? 'in_progress' : 'pending',
          nextAction: `${opp.stage === 'Prospecting' ? 'Schedule discovery call' : opp.stage === 'Qualified' ? 'Schedule demo' : opp.stage === 'Engaged' ? 'Prepare proposal' : opp.stage === 'Proposed' ? 'Follow up on proposal' : 'Finalize contract'} for ${opp.recommended_product}`,
          businessImpact: `${opp.expansion_readiness_score}% readiness • ${opp.close_probability}% win probability • ${opp.stage} stage • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR`
        });
      });
      
      // Add stalled deals from real data (deals in stage > 60 days)
      const stalledDeals = expansionOpportunitiesData.filter(o => 
        o.days_in_stage > 60 && !['Closed-Won', 'Closed-Lost'].includes(o.stage)
      );
      
      stalledDeals.forEach((opp) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        items.push({
          id: `STALL-${opp.opportunity_id}`,
          type: 'account',
          title: `Stalled Deal - ${opp.days_in_stage} Days in ${opp.stage}`,
          customer: customer?.customer_name || opp.customer_id,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage - 30,
          assignee: customer?.csm_id || 'Senior Account Executive',
          priority: 'high',
          status: 'in_progress',
          nextAction: `Escalate ${opp.stage.toLowerCase()} stage - ${opp.recommended_product}`,
          businessImpact: `Stalled ${opp.days_in_stage} days • ${opp.close_probability}% win probability • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR at risk`
        });
      });
    }

    // UPSELL OPPORTUNITIES
    if (actionId === 'upsell-opportunities') {
      const upsellOpps = expansionOpportunitiesData.filter(o => o.opportunity_type === 'upsell');
      upsellOpps.forEach((opp) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        items.push({
          id: `UPSELL-${opp.opportunity_id}`,
          type: 'account',
          title: `Upsell Opportunity - ${opp.recommended_product}`,
          customer: customer?.customer_name || opp.customer_id,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage > 30 ? opp.days_in_stage - 30 : 0,
          assignee: customer?.csm_id || 'Account Manager',
          priority: opp.expansion_readiness_score >= 80 ? 'high' : 'medium',
          status: opp.stage === 'Prospecting' ? 'pending' : 'in_progress',
          nextAction: `${opp.stage} - ${opp.recommended_product} expansion`,
          businessImpact: `Upsell: $${(opp.estimated_arr / 1000).toFixed(0)}K ARR • ${opp.close_probability}% probability`
        });
      });
    }

    // CROSS-SELL OPPORTUNITIES  
    if (actionId === 'cross-sell-opportunities') {
      const crossSellOpps = expansionOpportunitiesData.filter(o => o.opportunity_type === 'cross_sell');
      crossSellOpps.forEach((opp) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        items.push({
          id: `CROSS-${opp.opportunity_id}`,
          type: 'account',
          title: `Cross-Sell Opportunity - ${opp.recommended_product}`,
          customer: customer?.customer_name || opp.customer_id,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage > 30 ? opp.days_in_stage - 30 : 0,
          assignee: customer?.csm_id || 'Sales Rep',
          priority: opp.expansion_readiness_score >= 80 ? 'high' : 'medium',
          status: opp.stage === 'Prospecting' ? 'pending' : 'in_progress',
          nextAction: `${opp.stage} - ${opp.recommended_product} cross-sell`,
          businessImpact: `Cross-sell: $${(opp.estimated_arr / 1000).toFixed(0)}K ARR • ${opp.close_probability}% probability`
        });
      });
    }

    // CAPACITY EXPANSION OPPORTUNITIES
    if (actionId === 'capacity-opportunities') {
      const capacityOpps = expansionOpportunitiesData.filter(o => o.opportunity_type === 'capacity_expansion');
      capacityOpps.forEach((opp) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        items.push({
          id: `CAPACITY-${opp.opportunity_id}`,
          type: 'account',
          title: `Capacity Expansion - ${opp.recommended_product}`,
          customer: customer?.customer_name || opp.customer_id,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage > 15 ? opp.days_in_stage - 15 : 0, // Faster cycle for capacity
          assignee: customer?.csm_id || 'Account Manager',
          priority: 'high', // Capacity is always high priority
          status: opp.stage === 'Prospecting' ? 'pending' : 'in_progress',
          nextAction: `${opp.stage} - Additional ${opp.recommended_product} licenses`,
          businessImpact: `Capacity: $${(opp.estimated_arr / 1000).toFixed(0)}K ARR • ${opp.close_probability}% probability • Fast close`
        });
      });
    }

    // BUNDLE OPPORTUNITIES
    if (actionId === 'bundle-opportunities') {
      // Create bundle opportunities from high-fit customers
      const bundleCustomers = customersData.filter(c => c.product_count >= 2 && c.arr >= 500000);
      bundleCustomers.slice(0, 8).forEach((customer, index) => {
        items.push({
          id: `BUNDLE-${customer.customer_id}`,
          type: 'account',
          title: `Bundle Opportunity - Multi-Product Discount`,
          customer: customer.customer_name,
          amount: Math.round(customer.arr * 0.15), // 15% bundle expansion
          daysOverdue: index * 5,
          assignee: customer.csm_id || 'Sales Manager',
          priority: customer.tier === 'Strategic' ? 'high' : 'medium',
          status: 'pending',
          nextAction: 'Present bundle pricing and multi-year contract',
          businessImpact: `Bundle: $${Math.round(customer.arr * 0.15 / 1000)}K ARR • Multi-product synergy`
        });
      });
    }

    // MULTI-PRODUCT CUSTOMERS - ALL ACCOUNTS LIST
    if (actionId === 'multi-product-customers') {
      const multiProductCustomers = customersData
        .filter(c => c.product_count >= 2)
        .sort((a, b) => {
          // Sort by tier first, then by product count, then by ARR
          const tierPriority = { 'Strategic': 4, 'Enterprise': 3, 'Commercial': 2, 'SMB': 1 };
          const aPriority = tierPriority[a.tier as keyof typeof tierPriority] || 0;
          const bPriority = tierPriority[b.tier as keyof typeof tierPriority] || 0;
          
          if (aPriority !== bPriority) return bPriority - aPriority;
          if (a.product_count !== b.product_count) return b.product_count - a.product_count;
          return b.arr - a.arr;
        });
      
      multiProductCustomers.forEach((customer, index) => {
        const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
        const products = customerLicenses.map(l => l.product_family).join(', ');
        const avgUtilization = customerLicenses.reduce((sum, l) => sum + l.utilization, 0) / customerLicenses.length;
        const whiteSpaceRecord = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        const totalWhiteSpace = whiteSpaceRecord?.total_white_space_arr || 0;
        const expansionOpps = expansionOpportunitiesData.filter(o => o.customer_id === customer.customer_id);
        
        // Determine action based on utilization and expansion potential
        let actionType = '';
        let nextAction = '';
        let priority: 'high' | 'medium' | 'low' = 'medium';
        let status: 'pending' | 'in_progress' | 'completed' = 'pending';
        
        if (avgUtilization >= 85 && totalWhiteSpace > 100000) {
          actionType = 'Expansion Ready';
          nextAction = `Pursue ${whiteSpaceRecord?.white_space_opportunities?.[0]?.product || 'additional'} expansion opportunity`;
          priority = customer.tier === 'Strategic' ? 'high' : 'medium';
          status = 'pending';
        } else if (avgUtilization >= 80) {
          actionType = 'Portfolio Optimization';
          nextAction = 'Monitor for additional expansion opportunities';
          priority = 'low';
          status = 'completed';
        } else if (avgUtilization >= 60) {
          actionType = 'Adoption Improvement';
          nextAction = 'Focus on improving utilization across all products';
          priority = 'medium';
          status = 'in_progress';
        } else {
          actionType = 'Urgent Adoption Review';
          nextAction = 'Schedule immediate adoption review and training';
          priority = 'high';
          status = 'pending';
        }
        
        items.push({
          id: `MULTI-PROD-${customer.customer_id}`,
          type: 'account',
          title: `${actionType} - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: customer.arr + totalWhiteSpace,
          daysOverdue: avgUtilization < 70 ? Math.floor(index / 2) + 1 : 0,
          assignee: customer.csm_id || 'Account Manager',
          priority,
          status,
          nextAction,
          businessImpact: `${customer.tier} • ${customer.product_count} products: ${products} • ${Math.round(avgUtilization)}% avg utilization • $${(customer.arr / 1000).toFixed(0)}K ARR • ${expansionOpps.length} expansion opps • $${(totalWhiteSpace / 1000).toFixed(0)}K white space`
        });
      });
    }

    // SINGLE PRODUCT CROSS-SELL OPPORTUNITIES
    if (actionId === 'single-product-cross-sell') {
      const singleProductCustomers = customersData.filter(c => c.product_count === 1);
      
      singleProductCustomers.forEach((customer, index) => {
        const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
        const currentProduct = customerLicenses[0]?.product_family || 'Unknown';
        const currentUtilization = customerLicenses[0]?.utilization || 0;
        const whiteSpaceRecord = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        const bestOpp = whiteSpaceRecord?.white_space_opportunities
          ?.sort((a, b) => b.estimated_arr - a.estimated_arr)[0];
        
        // Determine readiness based on current product utilization
        const readiness = currentUtilization >= 80 ? 'High' : currentUtilization >= 60 ? 'Medium' : 'Low';
        const isReady = currentUtilization >= 70;
        
        items.push({
          id: `CROSS-SELL-${customer.customer_id}`,
          type: 'account',
          title: `${isReady ? 'Ready for' : 'Prepare for'} ${bestOpp?.product || 'Multi-Product'} Cross-Sell - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: bestOpp?.estimated_arr || customer.arr * 0.35,
          daysOverdue: !isReady ? Math.floor(index / 2) + 5 : Math.floor(index / 3),
          assignee: customer.csm_id || 'Account Manager',
          priority: customer.tier === 'Strategic' && (bestOpp?.estimated_arr || customer.arr * 0.35) > 200000 ? 'high' : 
                   customer.tier === 'Enterprise' && isReady ? 'high' : 'medium',
          status: isReady ? 'pending' : 'in_progress',
          nextAction: isReady ? 
            `Schedule ${bestOpp?.product || 'multi-product'} demo and business case presentation` :
            `Improve ${currentProduct} adoption to ${Math.max(75, currentUtilization + 10)}% before cross-sell`,
          businessImpact: `${customer.tier} • ${currentProduct}: ${currentUtilization}% utilization • ${readiness} readiness • Target: ${bestOpp?.product || 'Multi-product'} • ${bestOpp?.fit_score || 75}% fit • $${((bestOpp?.estimated_arr || customer.arr * 0.35) / 1000).toFixed(0)}K opportunity`
        });
      });
    }

    // PRODUCT ADOPTION ANALYSIS
    if (actionId === 'product-adoption-analysis') {
      const lowAdoptionAccounts = customersData.filter(c => {
        const customerLicenses = licensesData.filter(l => l.customer_id === c.customer_id);
        const avgUtilization = customerLicenses.reduce((sum, l) => sum + l.utilization, 0) / customerLicenses.length;
        return avgUtilization < 75;
      });
      
      lowAdoptionAccounts.forEach((customer, index) => {
        const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
        const avgUtilization = customerLicenses.reduce((sum, l) => sum + l.utilization, 0) / customerLicenses.length;
        const lowUtilProducts = customerLicenses.filter(l => l.utilization < 60).map(l => l.product_family);
        
        items.push({
          id: `ADOPTION-${customer.customer_id}`,
          type: 'account',
          title: `Product Adoption Improvement - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: customer.arr,
          daysOverdue: avgUtilization < 50 ? Math.floor(index / 2) + 5 : Math.floor(index / 3),
          assignee: customer.csm_id || 'Customer Success Manager',
          priority: avgUtilization < 50 ? 'high' : 'medium',
          status: 'pending',
          nextAction: `Schedule adoption review and training for ${lowUtilProducts.join(', ') || 'underutilized products'}`,
          businessImpact: `${customer.tier} • ${Math.round(avgUtilization)}% avg utilization • Risk of churn if not improved`
        });
      });
    }

    // CROSS-SELL PIPELINE
    if (actionId === 'cross-sell-pipeline') {
      const crossSellOpportunities = customersData.filter(c => c.product_count < 3).slice(0, 15);
      
      crossSellOpportunities.forEach((customer, index) => {
        const whiteSpaceRecord = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        const opportunities = whiteSpaceRecord?.white_space_opportunities || [];
        const totalValue = opportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
        
        items.push({
          id: `PIPELINE-${customer.customer_id}`,
          type: 'account',
          title: `Cross-Sell Pipeline Development - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: totalValue || customer.arr * 0.4,
          daysOverdue: index * 3,
          assignee: customer.csm_id || 'Sales Development Rep',
          priority: customer.tier === 'Strategic' ? 'high' : customer.tier === 'Enterprise' ? 'medium' : 'low',
          status: 'pending',
          nextAction: `Qualify cross-sell opportunities and create pipeline`,
          businessImpact: `${customer.tier} • ${opportunities.length || 2} potential products • $${((totalValue || customer.arr * 0.4) / 1000).toFixed(0)}K pipeline value`
        });
      });
    }

    // NRR TIER ANALYSIS
    if (actionId === 'nrr-tier-analysis') {
      const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
      
      tiers.forEach((tier, index) => {
        const tierCustomers = customersData.filter(c => c.tier === tier);
        const avgARR = tierCustomers.reduce((sum, c) => sum + c.arr, 0) / tierCustomers.length;
        const expansionOpportunities = expansionOpportunitiesData.filter(o => 
          tierCustomers.some(c => c.customer_id === o.customer_id)
        );
        
        items.push({
          id: `NRR-TIER-${tier.toUpperCase()}`,
          type: 'account',
          title: `${tier} Tier NRR Analysis - ${tierCustomers.length} Accounts`,
          customer: `${tier} Tier Portfolio`,
          amount: avgARR,
          daysOverdue: index * 2,
          assignee: 'Revenue Operations',
          priority: tier === 'Strategic' ? 'high' : tier === 'Enterprise' ? 'medium' : 'low',
          status: 'pending',
          nextAction: `Review ${tier.toLowerCase()} tier NRR performance and expansion opportunities`,
          businessImpact: `${tierCustomers.length} customers • $${(avgARR / 1000).toFixed(0)}K avg ARR • ${expansionOpportunities.length} expansion opps`
        });
      });
    }

    // NRR TIER SPECIFIC (e.g., nrr-tier-strategic)
    if (actionId?.startsWith('nrr-tier-')) {
      const tier = actionId.replace('nrr-tier-', '').charAt(0).toUpperCase() + actionId.replace('nrr-tier-', '').slice(1);
      const tierCustomers = customersData.filter(c => c.tier === tier);
      
      tierCustomers.forEach((customer, index) => {
        const customerExpansions = expansionOpportunitiesData.filter(o => o.customer_id === customer.customer_id);
        const expansionValue = customerExpansions.reduce((sum, o) => sum + o.estimated_arr, 0);
        const nrr = ((customer.arr + expansionValue) / customer.arr) * 100;
        
        items.push({
          id: `NRR-${customer.customer_id}`,
          type: 'account',
          title: `NRR Review - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: customer.arr + expansionValue,
          daysOverdue: nrr < 110 ? Math.floor(index / 2) + 3 : 0,
          assignee: customer.csm_id || 'Account Manager',
          priority: nrr < 100 ? 'high' : nrr < 110 ? 'medium' : 'low',
          status: nrr >= 110 ? 'completed' : nrr >= 100 ? 'in_progress' : 'pending',
          nextAction: nrr < 110 ? 'Develop expansion strategy to improve NRR' : 'Monitor and maintain strong NRR performance',
          businessImpact: `${tier} • Current NRR: ${Math.round(nrr)}% • ${customerExpansions.length} expansion opportunities`
        });
      });
    }

    // PRODUCT PENETRATION OPPORTUNITIES - ALL ACCOUNTS LIST
    if (actionId === 'product-penetration-opportunities') {
      // Get ALL accounts with their penetration analysis
      const allAccountsAnalysis = customersData
        .map(customer => {
          const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
          const whiteSpaceRecord = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
          const expansionOpps = expansionOpportunitiesData.filter(o => o.customer_id === customer.customer_id);
          const currentProducts = customerLicenses.map(l => l.product_family);
          const missingProducts = ['Meraki', 'Duo', 'Umbrella', 'ThousandEyes', 'Splunk']
            .filter(product => !currentProducts.includes(product));
          const avgUtilization = customerLicenses.length > 0 ? 
            customerLicenses.reduce((sum, l) => sum + l.utilization, 0) / customerLicenses.length : 0;
          
          return {
            customer,
            currentProducts,
            missingProducts,
            whiteSpaceRecord,
            expansionOpps,
            avgUtilization,
            totalWhiteSpace: whiteSpaceRecord?.total_white_space_arr || 0
          };
        })
        .sort((a, b) => {
          // Sort by tier priority first, then by white space value
          const tierPriority = { 'Strategic': 4, 'Enterprise': 3, 'Commercial': 2, 'SMB': 1 };
          const aPriority = tierPriority[a.customer.tier as keyof typeof tierPriority] || 0;
          const bPriority = tierPriority[b.customer.tier as keyof typeof tierPriority] || 0;
          
          if (aPriority !== bPriority) return bPriority - aPriority;
          return b.totalWhiteSpace - a.totalWhiteSpace;
        });
      
      // Add action item for each account
      allAccountsAnalysis.forEach((analysis, index) => {
        const { customer, currentProducts, missingProducts, whiteSpaceRecord, expansionOpps, avgUtilization, totalWhiteSpace } = analysis;
        
        // Determine the best opportunity
        const bestOpportunity = whiteSpaceRecord?.white_space_opportunities
          ?.sort((a, b) => b.estimated_arr - a.estimated_arr)[0];
        const bestExpansionOpp = expansionOpps.sort((a, b) => b.estimated_arr - a.estimated_arr)[0];
        
        // Determine action type and priority
        let actionType = '';
        let nextAction = '';
        let priority: 'high' | 'medium' | 'low' = 'medium';
        let status: 'pending' | 'in_progress' | 'completed' = 'pending';
        let daysOverdue = 0;
        
        if (customer.product_count === 1) {
          actionType = 'Single-Product Cross-Sell';
          nextAction = avgUtilization >= 70 ? 
            `Schedule ${bestOpportunity?.product || missingProducts[0]} demo` :
            `Improve ${currentProducts[0]} adoption to 75%+ before cross-sell`;
          priority = customer.tier === 'Strategic' ? 'high' : customer.tier === 'Enterprise' ? 'medium' : 'low';
          status = avgUtilization >= 70 ? 'pending' : 'in_progress';
          daysOverdue = avgUtilization < 70 ? Math.floor(index / 3) + 2 : 0;
        } else if (customer.product_count === 2) {
          actionType = 'Multi-Product Expansion';
          nextAction = `Evaluate ${missingProducts.slice(0, 2).join(' or ')} for expansion`;
          priority = totalWhiteSpace > 200000 ? 'high' : 'medium';
          status = avgUtilization >= 75 ? 'pending' : 'in_progress';
          daysOverdue = avgUtilization < 75 ? Math.floor(index / 4) + 1 : 0;
        } else if (customer.product_count >= 3) {
          actionType = 'Portfolio Optimization';
          nextAction = avgUtilization >= 80 ? 
            'Monitor for additional expansion opportunities' :
            'Focus on improving utilization across products';
          priority = avgUtilization < 70 ? 'high' : 'low';
          status = avgUtilization >= 80 ? 'completed' : avgUtilization >= 70 ? 'in_progress' : 'pending';
          daysOverdue = avgUtilization < 70 ? Math.floor(index / 5) + 1 : 0;
        } else {
          actionType = 'New Customer Onboarding';
          nextAction = 'Complete product onboarding and establish baseline';
          priority = customer.tier === 'Strategic' ? 'high' : 'medium';
          status = 'in_progress';
          daysOverdue = Math.floor(index / 2) + 3;
        }
        
        items.push({
          id: `ACCOUNT-${customer.customer_id}`,
          type: 'account',
          title: `${actionType} - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: totalWhiteSpace > 0 ? totalWhiteSpace : (bestExpansionOpp?.estimated_arr || customer.arr * 0.25),
          daysOverdue,
          assignee: customer.csm_id || 'Account Manager',
          priority,
          status,
          nextAction,
          businessImpact: `${customer.tier} • ${customer.product_count} products: ${currentProducts.join(', ') || 'None'} • ${Math.round(avgUtilization)}% avg utilization • $${(customer.arr / 1000).toFixed(0)}K ARR • $${(totalWhiteSpace / 1000).toFixed(0)}K white space`
        });
      });
    }

    // NRR QUARTERLY ANALYSIS
    if (actionId === 'nrr-quarterly-analysis') {
      const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'];
      
      quarters.forEach((quarter, index) => {
        const quarterCustomers = customersData.slice(index * 10, (index + 1) * 10); // Simulate quarterly cohorts
        const totalARR = quarterCustomers.reduce((sum, c) => sum + c.arr, 0);
        const expansionValue = quarterCustomers.reduce((sum, c) => {
          const expansions = expansionOpportunitiesData.filter(o => o.customer_id === c.customer_id);
          return sum + expansions.reduce((expSum, o) => expSum + o.estimated_arr, 0);
        }, 0);
        const nrr = ((totalARR + expansionValue) / totalARR) * 100;
        
        items.push({
          id: `NRR-QUARTER-${quarter.replace(/\s+/g, '-')}`,
          type: 'account',
          title: `${quarter} NRR Performance Review`,
          customer: `${quarter} Cohort`,
          amount: totalARR + expansionValue,
          daysOverdue: nrr < 110 ? index + 1 : 0,
          assignee: 'Revenue Operations',
          priority: nrr < 100 ? 'high' : nrr < 110 ? 'medium' : 'low',
          status: nrr >= 110 ? 'completed' : nrr >= 100 ? 'in_progress' : 'pending',
          nextAction: `Analyze ${quarter} NRR drivers and improvement opportunities`,
          businessImpact: `${quarterCustomers.length} customers • NRR: ${Math.round(nrr)}% • $${(expansionValue / 1000).toFixed(0)}K expansion`
        });
      });
    }

    // SPECIFIC QUARTER ANALYSIS (e.g., nrr-quarter-q1-2024)
    if (actionId?.startsWith('nrr-quarter-')) {
      const quarter = actionId.replace('nrr-quarter-', '').replace(/-/g, ' ').toUpperCase();
      const quarterIndex = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'].indexOf(quarter);
      const quarterCustomers = customersData.slice(quarterIndex * 10, (quarterIndex + 1) * 10);
      
      quarterCustomers.forEach((customer, index) => {
        const customerExpansions = expansionOpportunitiesData.filter(o => o.customer_id === customer.customer_id);
        const expansionValue = customerExpansions.reduce((sum, o) => sum + o.estimated_arr, 0);
        const nrr = ((customer.arr + expansionValue) / customer.arr) * 100;
        
        items.push({
          id: `NRR-${quarter}-${customer.customer_id}`,
          type: 'account',
          title: `${quarter} NRR - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: customer.arr + expansionValue,
          daysOverdue: nrr < 110 ? Math.floor(index / 2) + 2 : 0,
          assignee: customer.csm_id || 'Account Manager',
          priority: nrr < 100 ? 'high' : nrr < 110 ? 'medium' : 'low',
          status: nrr >= 110 ? 'completed' : nrr >= 100 ? 'in_progress' : 'pending',
          nextAction: `Review ${quarter} performance and plan next quarter strategy`,
          businessImpact: `${quarter} NRR: ${Math.round(nrr)}% • ${customerExpansions.length} expansion opportunities`
        });
      });
    }

    // TIER-SPECIFIC ACCOUNT VIEWS (e.g., tier-strategic-accounts)
    if (actionId?.startsWith('tier-') && actionId?.endsWith('-accounts')) {
      const tierName = actionId.replace('tier-', '').replace('-accounts', '');
      const tier = tierName.charAt(0).toUpperCase() + tierName.slice(1);
      const tierCustomers = customersData.filter(c => c.tier === tier);
      
      tierCustomers.forEach((customer, index) => {
        const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
        const whiteSpaceRecord = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        const expansionOpps = expansionOpportunitiesData.filter(o => o.customer_id === customer.customer_id);
        const totalWhiteSpace = whiteSpaceRecord?.total_white_space_arr || 0;
        const avgUtilization = customerLicenses.reduce((sum, l) => sum + l.utilization, 0) / customerLicenses.length;
        
        items.push({
          id: `TIER-${tier.toUpperCase()}-${customer.customer_id}`,
          type: 'account',
          title: `${tier} Account Analysis - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: customer.arr + totalWhiteSpace,
          daysOverdue: customer.product_count === 1 ? Math.floor(index / 2) + 3 : avgUtilization < 70 ? Math.floor(index / 3) + 1 : 0,
          assignee: customer.csm_id || 'Account Manager',
          priority: customer.product_count === 1 && totalWhiteSpace > 200000 ? 'high' : 'medium',
          status: customer.product_count >= 3 && avgUtilization >= 80 ? 'completed' : customer.product_count >= 2 ? 'in_progress' : 'pending',
          nextAction: customer.product_count === 1 ? 'Develop multi-product expansion strategy' : avgUtilization < 70 ? 'Improve product adoption and utilization' : 'Monitor for additional expansion opportunities',
          businessImpact: `${tier} • ${customer.product_count} products • $${(customer.arr / 1000).toFixed(0)}K ARR • $${(totalWhiteSpace / 1000).toFixed(0)}K white space • ${Math.round(avgUtilization)}% avg utilization`
        });
      });
    }

    // INDIVIDUAL ACCOUNT DRILL-THROUGH (e.g., account-techcorp-industries)
    if (actionId?.startsWith('account-')) {
      const accountSlug = actionId.replace('account-', '');
      const customer = customersData.find(c => 
        c.customer_name.toLowerCase().replace(/\s+/g, '-') === accountSlug
      );
      
      if (customer) {
        const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
        const whiteSpaceRecord = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        const expansionOpps = expansionOpportunitiesData.filter(o => o.customer_id === customer.customer_id);
        
        // Add account overview
        items.push({
          id: `ACCOUNT-OVERVIEW-${customer.customer_id}`,
          type: 'account',
          title: `Account Overview - ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: customer.arr,
          daysOverdue: 0,
          assignee: customer.csm_id || 'Account Manager',
          priority: 'medium',
          status: 'completed',
          nextAction: 'Review account health and expansion opportunities',
          businessImpact: `${customer.tier} tier • ${customer.industry} • ${customer.product_count} products • $${(customer.arr / 1000).toFixed(0)}K ARR`
        });
        
        // Add product-specific actions
        customerLicenses.forEach((license, index) => {
          items.push({
            id: `PRODUCT-${license.license_id}`,
            type: 'account',
            title: `${license.product_family} Utilization Review`,
            customer: customer.customer_name,
            amount: license.annual_value,
            daysOverdue: license.utilization < 60 ? Math.floor(index / 2) + 5 : 0,
            assignee: customer.csm_id || 'Product Specialist',
            priority: license.utilization < 60 ? 'high' : license.utilization < 80 ? 'medium' : 'low',
            status: license.utilization >= 80 ? 'completed' : license.utilization >= 60 ? 'in_progress' : 'pending',
            nextAction: license.utilization < 60 ? `Improve ${license.product_family} adoption` : license.utilization < 80 ? `Optimize ${license.product_family} usage` : `Monitor ${license.product_family} for expansion`,
            businessImpact: `${license.product_family} • ${license.utilization}% utilization • ${license.adoption_stage} stage • $${(license.annual_value / 1000).toFixed(0)}K value`
          });
        });
        
        // Add expansion opportunities
        expansionOpps.forEach((opp) => {
          items.push({
            id: `EXP-${opp.opportunity_id}`,
            type: 'account',
            title: `${opp.opportunity_type.replace('_', ' ')} - ${opp.recommended_product}`,
            customer: customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue: opp.days_in_stage > 30 ? opp.days_in_stage - 30 : 0,
            assignee: customer.csm_id || 'Sales Rep',
            priority: opp.expansion_readiness_score >= 85 ? 'high' : 'medium',
            status: opp.days_in_stage > 45 ? 'in_progress' : 'pending',
            nextAction: `${opp.stage} - ${opp.recommended_product} ${opp.opportunity_type.replace('_', ' ')}`,
            businessImpact: `${opp.expansion_readiness_score}% readiness • ${opp.close_probability}% probability • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR`
          });
        });
      }
    }

    // PRODUCT-SPECIFIC EXPANSION OPPORTUNITIES
    if (actionId?.includes('-expansion')) {
      const productName = actionId.replace('-expansion', '');
      const productOpps = expansionOpportunitiesData.filter(o => 
        o.recommended_product.toLowerCase().includes(productName.toLowerCase())
      );
      
      productOpps.forEach((opp) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        items.push({
          id: `PROD-${opp.opportunity_id}`,
          type: 'account',
          title: `${opp.recommended_product} Expansion - ${opp.opportunity_type.replace('_', ' ')}`,
          customer: customer?.customer_name || opp.customer_id,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage > 30 ? opp.days_in_stage - 30 : 0,
          assignee: customer?.csm_id || 'Product Specialist',
          priority: opp.expansion_readiness_score >= 80 ? 'high' : 'medium',
          status: opp.stage === 'Prospecting' ? 'pending' : 'in_progress',
          nextAction: `${opp.stage} - ${opp.recommended_product} ${opp.opportunity_type.replace('_', ' ')}`,
          businessImpact: `${opp.recommended_product}: $${(opp.estimated_arr / 1000).toFixed(0)}K ARR • ${opp.close_probability}% probability`
        });
      });
    }
    
    if (kpiId === 'multi-product-penetration') {
      // Get ALL single-product accounts with white space opportunities
      const singleProductCustomers = customersData.filter(c => c.product_count === 1);
      
      singleProductCustomers.forEach((customer) => {
        // Get current product
        const customerLicenses = licensesData.filter(l => l.customer_id === customer.customer_id);
        const currentProduct = customerLicenses.length > 0 ? customerLicenses[0].product_family : 'Unknown';
        
        // Get white space recommendations for this customer
        const whiteSpace = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        const topOpportunity = whiteSpace?.white_space_opportunities?.[0];
        const recommendedProduct = topOpportunity?.product || 'Additional Products';
        const fitScore = topOpportunity?.fit_score || 75;
        const estimatedARR = topOpportunity?.estimated_arr || 150000;
        
        items.push({
          id: `CROSS-SELL-${customer.customer_id}`,
          type: 'account',
          title: `Cross-Sell ${recommendedProduct} to ${customer.customer_name}`,
          customer: customer.customer_name,
          amount: estimatedARR,
          daysOverdue: 0,
          assignee: customer.csm_id || 'Account Manager',
          priority: customer.tier === 'Strategic' || customer.tier === 'Enterprise' ? 'high' : 'medium',
          status: 'pending',
          nextAction: `Schedule product demo for ${recommendedProduct}. Current: ${currentProduct} only.`,
          businessImpact: `${customer.tier} tier • $${(customer.arr / 1000).toFixed(0)}K ARR • ${fitScore}% fit score • Single-product account ready for expansion`
        });
      });
    }
    
    if (kpiId === 'white-space-value') {
      // Get high-value white space opportunities from real data
      const highValueWhiteSpace = whiteSpaceData
        .filter(ws => ws.total_white_space_arr > 200000)
        .sort((a, b) => b.total_white_space_arr - a.total_white_space_arr)
        .slice(0, 10);
      
      highValueWhiteSpace.forEach((whiteSpace, index) => {
        const customer = customersData.find(c => c.customer_id === whiteSpace.account_id);
        const topOpportunity = whiteSpace.white_space_opportunities
          .sort((a, b) => b.estimated_arr - a.estimated_arr)[0];
        
        if (customer && topOpportunity) {
          items.push({
            id: `WS-${whiteSpace.analysis_id}`,
            type: 'account',
            title: `High-Value White Space: ${topOpportunity.product}`,
            customer: customer.customer_name,
            amount: topOpportunity.estimated_arr,
            daysOverdue: index * 5,
            assignee: customer.csm_id || 'Strategic Account Manager',
            priority: topOpportunity.fit_score >= 80 ? 'high' : 'medium',
            status: 'pending',
            nextAction: `Schedule ${topOpportunity.product} technical assessment`,
            businessImpact: `${topOpportunity.fit_score}% fit score • ${topOpportunity.product_category} gap • $${(topOpportunity.estimated_arr / 1000).toFixed(0)}K opportunity`
          });
        }
      });
    }

    // PRODUCT GAP ANALYSIS
    if (actionId === 'product-gap-analysis') {
      const products = ['Duo', 'Meraki', 'Umbrella', 'ThousandEyes', 'Splunk'];
      
      products.forEach((product, index) => {
        const productOpportunities = whiteSpaceData.flatMap(ws => 
          ws.white_space_opportunities.filter(opp => opp.product === product)
        );
        const totalOpportunityValue = productOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
        const avgFitScore = productOpportunities.reduce((sum, opp) => sum + opp.fit_score, 0) / productOpportunities.length;
        
        items.push({
          id: `PRODUCT-GAP-${product.toUpperCase()}`,
          type: 'account',
          title: `${product} Product Gap Campaign - ${productOpportunities.length} Opportunities`,
          customer: `${product} Gap Analysis`,
          amount: totalOpportunityValue,
          daysOverdue: 0,
          assignee: `${product} Product Specialist`,
          priority: totalOpportunityValue > 2000000 ? 'high' : totalOpportunityValue > 1000000 ? 'medium' : 'low',
          status: 'pending',
          nextAction: `Develop ${product} cross-sell campaign targeting ${productOpportunities.length} accounts`,
          businessImpact: `${productOpportunities.length} opportunities • ${Math.round(avgFitScore)}% avg fit score • $${(totalOpportunityValue / 1000000).toFixed(1)}M total opportunity`
        });
      });
    }

    // PRODUCT-SPECIFIC GAP ANALYSIS (e.g., product-gap-duo)
    if (actionId?.startsWith('product-gap-')) {
      const product = actionId.replace('product-gap-', '');
      const productName = product.charAt(0).toUpperCase() + product.slice(1);
      
      // Filter customers who DON'T have this specific product
      const customersWithoutProduct = customersData.filter(customer => {
        const hasProduct = licensesData.some(license => 
          license.customer_id === customer.customer_id && 
          license.product_family.toLowerCase() === productName.toLowerCase()
        );
        return !hasProduct; // Only customers who don't have this product
      });
      
      // Get white space opportunities for this specific product from customers who don't have it
      const productOpportunities = customersWithoutProduct
        .map(customer => {
          const whiteSpaceRecord = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
          const productOpportunity = whiteSpaceRecord?.white_space_opportunities
            .find(opp => opp.product.toLowerCase() === productName.toLowerCase());
          
          return productOpportunity ? {
            ...productOpportunity,
            customer,
            whiteSpaceId: whiteSpaceRecord.analysis_id
          } : null;
        })
        .filter(opp => opp !== null)
        .sort((a, b) => b.estimated_arr - a.estimated_arr);
      
      productOpportunities.forEach((opp, index) => {
        if (opp && opp.customer) {
          // Get current products for context
          const currentProducts = licensesData
            .filter(l => l.customer_id === opp.customer.customer_id)
            .map(l => l.product_family);
          
          items.push({
            id: `${productName.toUpperCase()}-GAP-${opp.customer.customer_id}`,
            type: 'account',
            title: `${productName} Gap Opportunity - ${opp.customer.customer_name}`,
            customer: opp.customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue: opp.fit_score < 70 ? Math.floor(index / 2) + 2 : 0,
            assignee: opp.customer.csm_id || `${productName} Specialist`,
            priority: opp.fit_score >= 85 ? 'high' : opp.fit_score >= 70 ? 'medium' : 'low',
            status: opp.fit_score >= 80 ? 'pending' : 'in_progress',
            nextAction: opp.fit_score >= 85 ? 
              `Initiate ${productName} POC with ${opp.customer.customer_name}` : 
              opp.fit_score >= 70 ? 
              `Schedule ${productName} technical demo` : 
              `Build business case for ${productName} adoption`,
            businessImpact: `${opp.customer.tier} tier • Missing ${productName} • Current: ${currentProducts.join(', ') || 'None'} • ${opp.fit_score}% fit • ${opp.product_category} gap • $${(opp.estimated_arr / 1000).toFixed(0)}K opportunity`
          });
        }
      });
      
      // If no specific opportunities found, create generic gap analysis for customers without the product
      if (productOpportunities.length === 0) {
        customersWithoutProduct.slice(0, 10).forEach((customer, index) => {
          const currentProducts = licensesData
            .filter(l => l.customer_id === customer.customer_id)
            .map(l => l.product_family);
          const estimatedValue = customer.arr * 0.25; // Estimate 25% of current ARR as opportunity
          
          items.push({
            id: `${productName.toUpperCase()}-PROSPECT-${customer.customer_id}`,
            type: 'account',
            title: `${productName} Prospect - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: estimatedValue,
            daysOverdue: Math.floor(index / 3) + 1,
            assignee: customer.csm_id || `${productName} Specialist`,
            priority: customer.tier === 'Strategic' ? 'high' : customer.tier === 'Enterprise' ? 'medium' : 'low',
            status: 'pending',
            nextAction: `Research ${productName} fit and initiate discovery conversation`,
            businessImpact: `${customer.tier} tier • No ${productName} • Current: ${currentProducts.join(', ') || 'None'} • $${(customer.arr / 1000).toFixed(0)}K ARR • Estimated $${(estimatedValue / 1000).toFixed(0)}K opportunity`
          });
        });
      }
    }

    // WHITE SPACE BY TIER
    if (actionId === 'white-space-by-tier') {
      const tiers = ['Strategic', 'Enterprise', 'Commercial', 'SMB'];
      
      tiers.forEach((tier, index) => {
        const tierCustomers = customersData.filter(c => c.tier === tier);
        const tierWhiteSpace = whiteSpaceData.filter(ws => 
          tierCustomers.some(c => c.customer_id === ws.account_id)
        );
        const totalARR = tierWhiteSpace.reduce((sum, ws) => sum + ws.total_white_space_arr, 0);
        const opportunities = tierWhiteSpace.reduce((sum, ws) => sum + ws.white_space_opportunities.length, 0);
        
        items.push({
          id: `TIER-WS-${tier.toUpperCase()}`,
          type: 'account',
          title: `${tier} Tier White Space Analysis - ${tierCustomers.length} Accounts`,
          customer: `${tier} Tier Portfolio`,
          amount: totalARR,
          daysOverdue: index,
          assignee: `${tier} Account Team`,
          priority: tier === 'Strategic' ? 'high' : tier === 'Enterprise' ? 'medium' : 'low',
          status: 'pending',
          nextAction: `Review ${tier.toLowerCase()} tier white space opportunities and prioritize outreach`,
          businessImpact: `${tierCustomers.length} customers • ${opportunities} opportunities • $${(totalARR / 1000000).toFixed(1)}M white space value`
        });
      });
    }

    // TIER-SPECIFIC WHITE SPACE (e.g., tier-strategic-whitespace)
    if (actionId?.startsWith('tier-') && actionId?.endsWith('-whitespace')) {
      const tier = actionId.replace('tier-', '').replace('-whitespace', '');
      const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
      
      // Filter customers by specific tier
      const tierCustomers = customersData.filter(c => c.tier === tierName);
      
      // Get white space data only for customers in this tier
      const tierWhiteSpaceData = whiteSpaceData.filter(ws => 
        tierCustomers.some(customer => customer.customer_id === ws.account_id)
      );
      
      tierCustomers.forEach((customer, index) => {
        const customerWhiteSpace = tierWhiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        const currentProducts = licensesData
          .filter(l => l.customer_id === customer.customer_id)
          .map(l => l.product_family);
        
        if (customerWhiteSpace && customerWhiteSpace.white_space_opportunities.length > 0) {
          const topOpportunity = customerWhiteSpace.white_space_opportunities
            .sort((a, b) => b.estimated_arr - a.estimated_arr)[0];
          
          items.push({
            id: `${tierName.toUpperCase()}-WS-${customer.customer_id}`,
            type: 'account',
            title: `${tierName} White Space - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: customerWhiteSpace.total_white_space_arr,
            daysOverdue: topOpportunity.fit_score < 70 ? Math.floor(index / 2) + 1 : 0,
            assignee: customer.csm_id || `${tierName} Account Manager`,
            priority: customerWhiteSpace.total_white_space_arr > 500000 ? 'high' : 
                     customerWhiteSpace.total_white_space_arr > 200000 ? 'medium' : 'low',
            status: topOpportunity.fit_score >= 80 ? 'pending' : 'in_progress',
            nextAction: `Pursue ${topOpportunity.product} cross-sell opportunity ($${(topOpportunity.estimated_arr / 1000).toFixed(0)}K)`,
            businessImpact: `${tierName} tier • Current: ${currentProducts.join(', ') || 'None'} • ${customerWhiteSpace.white_space_opportunities.length} opportunities • Top: ${topOpportunity.product} (${topOpportunity.fit_score}% fit) • $${(customerWhiteSpace.total_white_space_arr / 1000).toFixed(0)}K total value`
          });
        } else {
          // Create action item even for customers without white space data
          items.push({
            id: `${tierName.toUpperCase()}-PROSPECT-${customer.customer_id}`,
            type: 'account',
            title: `${tierName} Account Review - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: customer.arr * 0.2, // Estimate 20% expansion potential
            daysOverdue: Math.floor(index / 3) + 1,
            assignee: customer.csm_id || `${tierName} Account Manager`,
            priority: customer.tier === 'Strategic' ? 'high' : 'medium',
            status: 'pending',
            nextAction: `Conduct white space analysis and identify expansion opportunities`,
            businessImpact: `${tierName} tier • Current: ${currentProducts.join(', ') || 'None'} • $${(customer.arr / 1000).toFixed(0)}K ARR • Needs white space analysis`
          });
        }
      });
    }

    // LOOKALIKE ANALYSIS
    if (actionId === 'lookalike-analysis') {
      const patterns = [
        { from: 'Duo', to: 'Meraki', match: 86 },
        { from: 'Umbrella', to: 'Duo', match: 92 },
        { from: 'Meraki', to: 'Umbrella', match: 78 },
        { from: 'Multi', to: 'ThousandEyes', match: 75 }
      ];
      
      patterns.forEach((pattern, index) => {
        const patternOpportunities = whiteSpaceData.flatMap(ws => 
          ws.white_space_opportunities.filter(opp => opp.product === pattern.to)
        );
        const totalValue = patternOpportunities.reduce((sum, opp) => sum + opp.estimated_arr, 0);
        
        items.push({
          id: `PATTERN-${pattern.from.toUpperCase()}-${pattern.to.toUpperCase()}`,
          type: 'account',
          title: `${pattern.from} → ${pattern.to} Lookalike Pattern`,
          customer: `${pattern.from} to ${pattern.to} Pattern`,
          amount: totalValue,
          daysOverdue: 0,
          assignee: `${pattern.to} Product Specialist`,
          priority: pattern.match >= 85 ? 'high' : pattern.match >= 75 ? 'medium' : 'low',
          status: 'pending',
          nextAction: `Execute ${pattern.from} → ${pattern.to} cross-sell campaign`,
          businessImpact: `${pattern.match}% match score • ${patternOpportunities.length} opportunities • $${(totalValue / 1000000).toFixed(1)}M potential`
        });
      });
    }

    // PATTERN-SPECIFIC ANALYSIS (e.g., pattern-duo-meraki)
    if (actionId?.startsWith('pattern-')) {
      const patternParts = actionId.replace('pattern-', '').split('-');
      const fromProduct = patternParts[0];
      const toProduct = patternParts[1];
      
      // Find customers with fromProduct but not toProduct
      const patternCustomers = customersData.filter(c => {
        const hasFromProduct = licensesData.some(l => 
          l.customer_id === c.customer_id && l.product_family.toLowerCase() === fromProduct
        );
        const hasToProduct = licensesData.some(l => 
          l.customer_id === c.customer_id && l.product_family.toLowerCase() === toProduct
        );
        return hasFromProduct && !hasToProduct;
      });
      
      patternCustomers.forEach((customer, index) => {
        const customerWhiteSpace = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        const targetOpportunity = customerWhiteSpace?.white_space_opportunities
          .find(opp => opp.product.toLowerCase() === toProduct);
        
        if (targetOpportunity) {
          items.push({
            id: `PATTERN-${customer.customer_id}-${toProduct.toUpperCase()}`,
            type: 'account',
            title: `${fromProduct.charAt(0).toUpperCase() + fromProduct.slice(1)} → ${toProduct.charAt(0).toUpperCase() + toProduct.slice(1)} - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: targetOpportunity.estimated_arr,
            daysOverdue: targetOpportunity.fit_score < 75 ? Math.floor(index / 2) + 1 : 0,
            assignee: customer.csm_id || `${toProduct.charAt(0).toUpperCase() + toProduct.slice(1)} Specialist`,
            priority: targetOpportunity.fit_score >= 85 ? 'high' : 'medium',
            status: targetOpportunity.fit_score >= 80 ? 'pending' : 'in_progress',
            nextAction: `Leverage ${fromProduct} success to introduce ${toProduct}`,
            businessImpact: `${customer.tier} • Has ${fromProduct} • ${targetOpportunity.fit_score}% fit for ${toProduct} • $${(targetOpportunity.estimated_arr / 1000).toFixed(0)}K opportunity`
          });
        }
      });
    }

    // TOP WHITE SPACE OPPORTUNITIES
    if (actionId === 'top-white-space-opportunities') {
      const topOpportunities = whiteSpaceData
        .flatMap(ws => 
          ws.white_space_opportunities.map(opp => ({
            ...opp,
            customer: customersData.find(c => c.customer_id === ws.account_id),
            analysisId: ws.analysis_id
          }))
        )
        .filter(opp => opp.customer)
        .sort((a, b) => b.estimated_arr - a.estimated_arr)
        .slice(0, 15);
      
      topOpportunities.forEach((opp, index) => {
        if (opp.customer) {
          items.push({
            id: `TOP-WS-${opp.analysisId}-${opp.product}`,
            type: 'account',
            title: `Top Opportunity: ${opp.product} - ${opp.customer.customer_name}`,
            customer: opp.customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue: opp.fit_score < 80 ? Math.floor(index / 3) + 1 : 0,
            assignee: opp.customer.csm_id || `${opp.product} Specialist`,
            priority: opp.fit_score >= 85 && opp.estimated_arr > 300000 ? 'high' : 'medium',
            status: opp.fit_score >= 85 ? 'pending' : 'in_progress',
            nextAction: opp.fit_score >= 85 ? `Initiate ${opp.product} POC` : opp.fit_score >= 70 ? `Schedule ${opp.product} demo` : `Improve readiness for ${opp.product}`,
            businessImpact: `${opp.customer.tier} • ${opp.fit_score}% fit score • ${opp.product_category} category • $${(opp.estimated_arr / 1000).toFixed(0)}K opportunity`
          });
        }
      });
    }

    // INDIVIDUAL OPPORTUNITY DRILL-DOWN (e.g., opportunity-techcorp-industries)
    if (actionId?.startsWith('opportunity-')) {
      const customerSlug = actionId.replace('opportunity-', '');
      const customer = customersData.find(c => 
        c.customer_name.toLowerCase().replace(/\s+/g, '-') === customerSlug
      );
      
      if (customer) {
        const customerWhiteSpace = whiteSpaceData.find(ws => ws.account_id === customer.customer_id);
        if (customerWhiteSpace) {
          customerWhiteSpace.white_space_opportunities.forEach((opp, index) => {
            items.push({
              id: `OPP-${customer.customer_id}-${opp.product}`,
              type: 'account',
              title: `${opp.product} Opportunity - ${customer.customer_name}`,
              customer: customer.customer_name,
              amount: opp.estimated_arr,
              daysOverdue: opp.fit_score < 70 ? Math.floor(index / 2) + 2 : 0,
              assignee: customer.csm_id || `${opp.product} Specialist`,
              priority: opp.fit_score >= 85 ? 'high' : opp.fit_score >= 70 ? 'medium' : 'low',
              status: opp.fit_score >= 80 ? 'pending' : 'in_progress',
              nextAction: opp.fit_score >= 85 ? `Execute ${opp.product} POC` : opp.fit_score >= 70 ? `Schedule ${opp.product} technical review` : `Build ${opp.product} business case`,
              businessImpact: `${customer.tier} • ${opp.product_category} • ${opp.fit_score}% fit • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR • ${opp.fit_tier} fit tier`
            });
          });
        }
      }
    }
    
    // PIPELINE EXPANSION KPIs - Comprehensive Implementation
    if (kpiId === 'pipeline-arr') {
      // Get ALL pipeline opportunities from real expansion data
      const allPipelineOpps = expansionOpportunitiesData
        .sort((a, b) => b.estimated_arr - a.estimated_arr);
      
      allPipelineOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        
        if (customer) {
          const daysInStage = Math.round(Math.random() * 30 + 5);
          const isStuck = daysInStage > 20 && opp.close_probability < 60;
          const isHighValue = opp.estimated_arr > 200000;
          
          items.push({
            id: `PIPELINE-${opp.opportunity_id}`,
            type: 'opportunity',
            title: `${opp.opportunity_type === 'cross_sell' ? 'Cross-Sell' : 'Upsell'}: ${opp.recommended_product} - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue: isStuck ? daysInStage - 20 : 0,
            assignee: customer.csm_id || 'Sales Rep',
            priority: isHighValue && opp.close_probability >= 70 ? 'high' : 
                     isHighValue || opp.close_probability >= 60 ? 'medium' : 'low',
            status: opp.stage === 'Negotiating' ? 'in_progress' : 
                   opp.stage === 'Proposed' ? 'pending' : 
                   isStuck ? 'pending' : 'in_progress',
            nextAction: opp.stage === 'Negotiating' ? `Finalize ${opp.recommended_product} contract terms` :
                       opp.stage === 'Proposed' ? `Follow up on ${opp.recommended_product} proposal` :
                       opp.stage === 'Engaged' ? `Schedule ${opp.recommended_product} technical demo` :
                       `Qualify ${opp.recommended_product} opportunity`,
            businessImpact: `${customer.tier} • ${opp.opportunity_type} • ${opp.recommended_product} • ${opp.stage} stage • ${opp.close_probability}% win prob • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR • ${daysInStage} days in stage`
          });
        }
      });
    }

    // PIPELINE BY STAGE ANALYSIS
    if (actionId === 'pipeline-by-stage') {
      const stages = ['Prospecting', 'Engaged', 'Proposed', 'Negotiating'];
      
      stages.forEach((stage, index) => {
        const stageOpps = expansionOpportunitiesData.filter(opp => opp.stage === stage);
        const totalARR = stageOpps.reduce((sum, opp) => sum + opp.estimated_arr, 0);
        const avgWinProb = stageOpps.length > 0 ? Math.round(stageOpps.reduce((sum, opp) => sum + opp.close_probability, 0) / stageOpps.length) : 0;
        
        items.push({
          id: `STAGE-ANALYSIS-${stage.toUpperCase()}`,
          type: 'analysis',
          title: `${stage} Stage Analysis - ${stageOpps.length} Opportunities`,
          customer: `${stage} Pipeline`,
          amount: totalARR,
          daysOverdue: 0,
          assignee: 'Sales Operations',
          priority: stage === 'Negotiating' ? 'high' : stage === 'Proposed' ? 'medium' : 'low',
          status: 'pending',
          nextAction: `Review and optimize ${stage.toLowerCase()} stage processes`,
          businessImpact: `${stageOpps.length} opportunities • $${(totalARR / 1000000).toFixed(1)}M total ARR • ${avgWinProb}% avg win probability • Stage conversion optimization needed`
        });
      });
    }

    // STAGE-SPECIFIC ANALYSIS (e.g., stage-negotiating)
    if (actionId?.startsWith('stage-')) {
      const stage = actionId.replace('stage-', '');
      const stageName = stage.charAt(0).toUpperCase() + stage.slice(1);
      const stageOpps = expansionOpportunitiesData.filter(opp => opp.stage === stageName);
      
      stageOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        if (customer) {
          const daysInStage = Math.round(Math.random() * 30 + 5);
          const isOverdue = daysInStage > 25;
          
          items.push({
            id: `${stageName.toUpperCase()}-OPP-${opp.opportunity_id}`,
            type: 'opportunity',
            title: `${stageName} Stage: ${opp.recommended_product} - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue: isOverdue ? daysInStage - 25 : 0,
            assignee: customer.csm_id || 'Sales Rep',
            priority: opp.estimated_arr > 300000 ? 'high' : opp.estimated_arr > 150000 ? 'medium' : 'low',
            status: isOverdue ? 'pending' : 'in_progress',
            nextAction: stageName === 'Negotiating' ? `Close ${opp.recommended_product} deal` :
                       stageName === 'Proposed' ? `Address ${opp.recommended_product} proposal feedback` :
                       stageName === 'Engaged' ? `Advance ${opp.recommended_product} to proposal` :
                       `Qualify and engage ${opp.recommended_product} opportunity`,
            businessImpact: `${customer.tier} • ${opp.opportunity_type} • ${opp.recommended_product} • ${opp.close_probability}% win prob • ${daysInStage} days in ${stageName.toLowerCase()} • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR`
          });
        }
      });
    }

    // PIPELINE BY EXPANSION TYPE
    if (actionId === 'pipeline-by-expansion-type') {
      const expansionTypes = ['cross_sell', 'upsell'];
      
      expansionTypes.forEach((type, index) => {
        const typeOpps = expansionOpportunitiesData.filter(opp => opp.opportunity_type === type);
        const totalARR = typeOpps.reduce((sum, opp) => sum + opp.estimated_arr, 0);
        const avgWinProb = typeOpps.length > 0 ? Math.round(typeOpps.reduce((sum, opp) => sum + opp.close_probability, 0) / typeOpps.length) : 0;
        const typeName = type === 'cross_sell' ? 'Cross-Sell' : 'Upsell';
        
        items.push({
          id: `TYPE-ANALYSIS-${type.toUpperCase()}`,
          type: 'analysis',
          title: `${typeName} Pipeline Analysis - ${typeOpps.length} Opportunities`,
          customer: `${typeName} Pipeline`,
          amount: totalARR,
          daysOverdue: 0,
          assignee: `${typeName} Specialist`,
          priority: type === 'cross_sell' ? 'high' : 'medium',
          status: 'pending',
          nextAction: `Optimize ${typeName.toLowerCase()} processes and enablement`,
          businessImpact: `${typeOpps.length} opportunities • $${(totalARR / 1000000).toFixed(1)}M total ARR • ${avgWinProb}% avg win probability • ${Math.round((typeOpps.length / expansionOpportunitiesData.length) * 100)}% of total pipeline`
        });
      });
    }

    // CROSS-SELL PIPELINE SPECIFIC
    if (actionId === 'cross-sell-pipeline') {
      const crossSellOpps = expansionOpportunitiesData.filter(opp => opp.opportunity_type === 'cross_sell');
      
      crossSellOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        if (customer) {
          const currentProducts = licensesData
            .filter(l => l.customer_id === customer.customer_id)
            .map(l => l.product_family);
          
          items.push({
            id: `CROSS-SELL-${opp.opportunity_id}`,
            type: 'opportunity',
            title: `Cross-Sell ${opp.recommended_product} - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue: opp.close_probability < 50 ? Math.floor(index / 3) + 1 : 0,
            assignee: customer.csm_id || 'Cross-Sell Specialist',
            priority: opp.estimated_arr > 250000 ? 'high' : 'medium',
            status: opp.close_probability >= 70 ? 'in_progress' : 'pending',
            nextAction: `Leverage ${currentProducts[0] || 'existing'} success to introduce ${opp.recommended_product}`,
            businessImpact: `${customer.tier} • Current: ${currentProducts.join(', ') || 'None'} • Target: ${opp.recommended_product} • ${opp.stage} stage • ${opp.close_probability}% win prob • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR`
          });
        }
      });
    }

    // UPSELL PIPELINE SPECIFIC
    if (actionId === 'upsell-pipeline') {
      const upsellOpps = expansionOpportunitiesData.filter(opp => opp.opportunity_type === 'upsell');
      
      upsellOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        if (customer) {
          const currentLicenses = licensesData.filter(l => 
            l.customer_id === customer.customer_id && 
            l.product_family === opp.recommended_product
          );
          const avgUtilization = currentLicenses.length > 0 ? 
            Math.round(currentLicenses.reduce((sum, l) => sum + l.utilization, 0) / currentLicenses.length) : 0;
          
          items.push({
            id: `UPSELL-${opp.opportunity_id}`,
            type: 'opportunity',
            title: `Upsell ${opp.recommended_product} - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue: avgUtilization < 80 ? Math.floor(index / 2) + 1 : 0,
            assignee: customer.csm_id || 'Account Manager',
            priority: avgUtilization >= 85 ? 'high' : 'medium',
            status: avgUtilization >= 80 ? 'in_progress' : 'pending',
            nextAction: avgUtilization >= 85 ? 
              `Execute ${opp.recommended_product} capacity expansion` : 
              `Drive ${opp.recommended_product} adoption to 85%+ before upsell`,
            businessImpact: `${customer.tier} • ${opp.recommended_product} • ${avgUtilization}% utilization • ${opp.stage} stage • ${opp.close_probability}% win prob • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR expansion`
          });
        }
      });
    }

    // STAGE CONVERSION ANALYSIS
    if (actionId === 'stage-conversion-analysis') {
      const conversions = [
        { from: 'Prospecting', to: 'Engaged', rate: 68 },
        { from: 'Engaged', to: 'Proposed', rate: 80 },
        { from: 'Proposed', to: 'Negotiating', rate: 77 },
        { from: 'Negotiating', to: 'Closed Won', rate: 84 }
      ];
      
      conversions.forEach((conversion, index) => {
        const fromOpps = expansionOpportunitiesData.filter(opp => opp.stage === conversion.from);
        const avgValue = fromOpps.length > 0 ? fromOpps.reduce((sum, opp) => sum + opp.estimated_arr, 0) / fromOpps.length : 0;
        
        items.push({
          id: `CONVERSION-${conversion.from.toUpperCase()}-${conversion.to.replace(' ', '').toUpperCase()}`,
          type: 'analysis',
          title: `${conversion.from} → ${conversion.to} Conversion (${conversion.rate}%)`,
          customer: `Stage Conversion Analysis`,
          amount: avgValue * fromOpps.length * (conversion.rate / 100),
          daysOverdue: conversion.rate < 75 ? 1 : 0,
          assignee: 'Sales Operations',
          priority: conversion.rate < 70 ? 'high' : conversion.rate < 80 ? 'medium' : 'low',
          status: conversion.rate >= 80 ? 'completed' : 'pending',
          nextAction: conversion.rate < 75 ? 
            `Improve ${conversion.from.toLowerCase()} to ${conversion.to.toLowerCase()} conversion process` :
            `Monitor and maintain ${conversion.from.toLowerCase()} conversion rate`,
          businessImpact: `${fromOpps.length} opportunities in ${conversion.from} • ${conversion.rate}% conversion rate • $${(avgValue / 1000).toFixed(0)}K avg opportunity value • Process optimization ${conversion.rate < 75 ? 'required' : 'recommended'}`
        });
      });
    }

    // TOP PIPELINE OPPORTUNITIES
    if (actionId === 'top-pipeline-opportunities') {
      const topOpps = expansionOpportunitiesData
        .sort((a, b) => b.estimated_arr - a.estimated_arr)
        .slice(0, 15);
      
      topOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        if (customer) {
          const daysInStage = Math.round(Math.random() * 30 + 5);
          const isHighPriority = opp.estimated_arr > 300000 && opp.close_probability >= 70;
          
          items.push({
            id: `TOP-OPP-${opp.opportunity_id}`,
            type: 'opportunity',
            title: `Top Opportunity: ${opp.recommended_product} - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue: daysInStage > 25 ? daysInStage - 25 : 0,
            assignee: customer.csm_id || 'Senior Account Manager',
            priority: isHighPriority ? 'high' : opp.estimated_arr > 200000 ? 'medium' : 'low',
            status: opp.close_probability >= 80 ? 'in_progress' : 'pending',
            nextAction: opp.close_probability >= 80 ? 
              `Accelerate ${opp.recommended_product} close` : 
              opp.close_probability >= 60 ? 
              `Address ${opp.recommended_product} objections` : 
              `Improve ${opp.recommended_product} value proposition`,
            businessImpact: `${customer.tier} • ${opp.opportunity_type} • ${opp.recommended_product} • ${opp.stage} stage • ${opp.close_probability}% win prob • ${daysInStage} days in stage • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR • Top ${index + 1} opportunity`
          });
        }
      });
    }

    // STUCK DEALS ANALYSIS
    if (actionId === 'stuck-deals') {
      const stuckDeals = expansionOpportunitiesData.filter(opp => opp.close_probability < 50);
      
      stuckDeals.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        if (customer) {
          const daysStuck = Math.round(Math.random() * 20 + 30); // 30-50 days stuck
          
          items.push({
            id: `STUCK-DEAL-${opp.opportunity_id}`,
            type: 'opportunity',
            title: `Stuck Deal: ${opp.recommended_product} - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue: daysStuck - 30,
            assignee: customer.csm_id || 'Account Manager',
            priority: opp.estimated_arr > 200000 ? 'high' : 'medium',
            status: 'pending',
            nextAction: opp.close_probability < 30 ? 
              `Reassess ${opp.recommended_product} opportunity viability` :
              `Develop intervention plan for ${opp.recommended_product} deal`,
            businessImpact: `${customer.tier} • ${opp.recommended_product} • ${opp.stage} stage • ${opp.close_probability}% win prob • ${daysStuck} days stuck • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR at risk • Intervention required`
          });
        }
      });
    }

    // OVERDUE ACTIONS
    if (actionId === 'overdue-actions') {
      const overdueOpps = expansionOpportunitiesData
        .filter((opp, index) => index % 3 === 0) // Simulate 1/3 having overdue actions
        .slice(0, 12);
      
      overdueOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        if (customer) {
          const daysOverdue = Math.round(Math.random() * 10 + 3); // 3-13 days overdue
          
          items.push({
            id: `OVERDUE-ACTION-${opp.opportunity_id}`,
            type: 'opportunity',
            title: `Overdue Action: ${opp.recommended_product} - ${customer.customer_name}`,
            customer: customer.customer_name,
            amount: opp.estimated_arr,
            daysOverdue,
            assignee: customer.csm_id || 'Account Manager',
            priority: daysOverdue > 7 ? 'high' : 'medium',
            status: 'pending',
            nextAction: opp.stage === 'Proposed' ? 
              `Follow up on overdue ${opp.recommended_product} proposal response` :
              opp.stage === 'Engaged' ? 
              `Complete overdue ${opp.recommended_product} technical review` :
              `Execute overdue ${opp.recommended_product} next step`,
            businessImpact: `${customer.tier} • ${opp.recommended_product} • ${opp.stage} stage • ${daysOverdue} days overdue • ${opp.close_probability}% win prob • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR • Action required immediately`
          });
        }
      });
    }

    if (kpiId === 'pipeline-arr') {
      // Get pipeline opportunities from real expansion data
      const pipelineOpps = expansionOpportunitiesData
        .filter(o => ['Prospecting', 'Qualified', 'Engaged'].includes(o.stage))
        .sort((a, b) => b.estimated_arr - a.estimated_arr)
        .slice(0, 8);
      
      pipelineOpps.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        items.push({
          id: `PIPE-${opp.opportunity_id}`,
          type: 'account',
          title: `Pipeline Development - ${opp.recommended_product}`,
          customer: customer?.customer_name || opp.customer_id,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage > 30 ? opp.days_in_stage - 30 : 0,
          assignee: customer?.csm_id || 'Sales Team',
          priority: opp.estimated_arr > 300000 ? 'high' : 'medium',
          status: opp.stage === 'Prospecting' ? 'pending' : 'in_progress',
          nextAction: `Advance ${opp.stage.toLowerCase()} stage - ${opp.recommended_product}`,
          businessImpact: `${opp.stage} stage • ${opp.close_probability}% probability • $${(opp.estimated_arr / 1000).toFixed(0)}K ARR potential`
        });
      });
    }
    
    // UTILIZATION-DRIVEN EXPANSION SIGNALS KPI
    if (kpiId === 'utilization-expansion') {
      // Get high-utilization accounts requiring immediate action
      const highUtilizationAccounts = [
        {
          id: 'TECH-001',
          customer: 'TechCorp Industries',
          product: 'Duo',
          utilization: 97,
          currentLicenses: 500,
          recommendedLicenses: 750,
          potentialARR: 180000,
          priority: 'Critical',
          status: 'expansion_ready',
          assignee: 'Sarah Johnson',
          lastContact: '2024-03-15',
          nextAction: 'Generate expansion quote immediately'
        },
        {
          id: 'MED-001',
          customer: 'MedSecure Systems',
          product: 'Meraki',
          utilization: 95,
          currentLicenses: 800,
          recommendedLicenses: 1200,
          potentialARR: 240000,
          priority: 'Critical',
          status: 'expansion_ready',
          assignee: 'Michael Chen',
          lastContact: '2024-03-14',
          nextAction: 'Schedule capacity planning meeting'
        },
        {
          id: 'GLOBAL-001',
          customer: 'Global Financial Partners',
          product: 'Umbrella',
          utilization: 93,
          currentLicenses: 400,
          recommendedLicenses: 600,
          potentialARR: 160000,
          priority: 'High',
          status: 'contact_pending',
          assignee: 'Emily Rodriguez',
          lastContact: '2024-03-10',
          nextAction: 'Contact customer about capacity expansion'
        },
        {
          id: 'ADV-001',
          customer: 'Advanced Manufacturing Co',
          product: 'Duo',
          utilization: 91,
          currentLicenses: 200,
          recommendedLicenses: 300,
          potentialARR: 85000,
          priority: 'High',
          status: 'contact_pending',
          assignee: 'Sarah Johnson',
          lastContact: '2024-03-12',
          nextAction: 'Proactive capacity planning outreach'
        },
        {
          id: 'INNOV-001',
          customer: 'InnovateTech Solutions',
          product: 'ThousandEyes',
          utilization: 89,
          currentLicenses: 150,
          recommendedLicenses: 200,
          potentialARR: 120000,
          priority: 'Medium',
          status: 'monitoring',
          assignee: 'Michael Chen',
          lastContact: '2024-03-08',
          nextAction: 'Monitor utilization trends'
        }
      ];

      highUtilizationAccounts.forEach((account, index) => {
        const priority = account.priority === 'Critical' ? 'high' : 
                        account.priority === 'High' ? 'medium' : 'low';
        const status = account.status === 'expansion_ready' ? 'pending' :
                      account.status === 'contact_pending' ? 'pending' : 'in_progress';

        items.push({
          id: account.id,
          type: 'account',
          title: `${account.product} Capacity Expansion - ${account.utilization}% Utilization`,
          customer: account.customer,
          amount: account.potentialARR,
          daysOverdue: account.status === 'expansion_ready' ? 0 : 
                      account.status === 'contact_pending' ? 3 : 7,
          assignee: account.assignee,
          priority,
          status,
          nextAction: account.nextAction,
          businessImpact: `${account.utilization}% utilization requires immediate capacity expansion. Risk of service degradation if not addressed within 48 hours. Potential ARR: $${(account.potentialARR / 1000).toFixed(0)}K`
        });
      });
    }
    
    // PERFORMANCE METRICS KPI
    if (kpiId === 'performance-metrics') {
      // At-risk reps and pipeline gaps
      const repPerformance = [
        { rep: 'Jennifer Lee', quota: 88, pipeline: '$1.2M', coverage: 1.8, status: 'At Risk' },
        { rep: 'Robert Martinez', quota: 85, pipeline: '$1.1M', coverage: 1.7, status: 'At Risk' },
        { rep: 'David Park', quota: 92, pipeline: '$1.5M', coverage: 2.1, status: 'Pipeline Gap' },
        { rep: 'Emily Rodriguez', quota: 95, pipeline: '$1.6M', coverage: 2.3, status: 'Pipeline Gap' }
      ];

      repPerformance.forEach((rep, index) => {
        const priority = rep.status === 'At Risk' ? 'high' : 'medium';
        const businessImpact = rep.status === 'At Risk' ? 
          `Quota attainment risk: ${rep.quota}%. Requires immediate coaching and support to prevent quota miss.` :
          `Pipeline coverage at ${rep.coverage}x. Target: 3x. Need to increase prospecting activity.`;

        items.push({
          id: `REP-${index + 1}`,
          type: 'account',
          title: `${rep.rep} - ${rep.status}`,
          customer: rep.rep,
          amount: parseFloat(rep.pipeline.replace('$', '').replace('M', '')) * 1000000,
          daysOverdue: rep.status === 'At Risk' ? 15 : 7,
          assignee: 'Sales Manager',
          priority,
          status: 'pending',
          nextAction: rep.status === 'At Risk' ? 
            'Schedule coaching session and develop improvement plan' :
            'Increase pipeline generation activities',
          businessImpact
        });
      });
    }
    
    // OPPORTUNITY READINESS KPI
    if (kpiId === 'opportunity-readiness') {
      // Hot opportunities and nurture campaigns
      const readinessAccounts = [
        { account: 'TechCorp Industries', score: 92, whiteSpace: '$425K', tier: 'Enterprise', segment: 'Hot' },
        { account: 'MedSecure Systems', score: 88, whiteSpace: '$380K', tier: 'Strategic', segment: 'Hot' },
        { account: 'Global Financial Partners', score: 85, whiteSpace: '$320K', tier: 'Enterprise', segment: 'Hot' },
        { account: 'Advanced Manufacturing', score: 78, whiteSpace: '$185K', tier: 'Commercial', segment: 'Ready' },
        { account: 'InnovateTech Solutions', score: 75, whiteSpace: '$290K', tier: 'Enterprise', segment: 'Ready' },
        { account: 'SecureBank Corp', score: 72, whiteSpace: '$150K', tier: 'Enterprise', segment: 'Nurture' },
        { account: 'HealthTech Systems', score: 68, whiteSpace: '$220K', tier: 'Commercial', segment: 'Nurture' }
      ];

      readinessAccounts.forEach((acc, index) => {
        const customer = customersData.find(c => c.customer_name === acc.account);
        const priority = acc.segment === 'Hot' ? 'high' : acc.segment === 'Ready' ? 'medium' : 'low';
        const status = acc.segment === 'Hot' ? 'pending' : 'in_progress';
        const arrValue = parseFloat(acc.whiteSpace.replace('$', '').replace('K', '')) * 1000;

        items.push({
          id: `READY-${index + 1}`,
          type: 'account',
          title: `${acc.account} - Readiness Score ${acc.score}`,
          customer: acc.account,
          amount: arrValue,
          daysOverdue: acc.segment === 'Hot' ? 0 : acc.segment === 'Ready' ? 7 : 14,
          assignee: customer?.csm_id || 'Sarah Johnson',
          priority,
          status,
          nextAction: acc.segment === 'Hot' ? 
            'Schedule expansion meeting immediately' :
            acc.segment === 'Ready' ?
            'Prepare expansion proposal and business case' :
            'Execute readiness nurture campaign',
          businessImpact: `Readiness score: ${acc.score}/100. White space opportunity: ${acc.whiteSpace}. ${acc.tier} tier account with ${acc.segment.toLowerCase()} expansion readiness.`
        });
      });
    }
    
    // OPPORTUNITY READINESS MATRIX KPI
    if (kpiId === 'opportunity-readiness-matrix') {
      // Sweet spot accounts and readiness acceleration
      const readinessQuadrants = [
        { account: 'TechCorp Industries', readiness: 92, value: 425000, quadrant: 'Sweet Spot', priority: 'high' },
        { account: 'MedSecure Systems', readiness: 88, value: 380000, quadrant: 'Sweet Spot', priority: 'high' },
        { account: 'Global Financial', readiness: 85, value: 320000, quadrant: 'Sweet Spot', priority: 'high' },
        { account: 'DataCorp', readiness: 82, value: 520000, quadrant: 'High Value/Low Ready', priority: 'medium' },
        { account: 'FinanceHub', readiness: 78, value: 480000, quadrant: 'High Value/Low Ready', priority: 'medium' },
        { account: 'SecureBank', readiness: 88, value: 150000, quadrant: 'Quick Win', priority: 'medium' },
        { account: 'CloudTech', readiness: 85, value: 180000, quadrant: 'Quick Win', priority: 'medium' }
      ];

      readinessQuadrants.forEach((acc, index) => {
        const customer = customersData.find(c => c.customer_name === acc.account);
        const priority = acc.priority === 'high' ? 'high' : 'medium';
        
        items.push({
          id: `QUAD-${index + 1}`,
          type: 'account',
          title: `${acc.account} - ${acc.quadrant} Quadrant`,
          customer: acc.account,
          amount: acc.value,
          daysOverdue: acc.quadrant === 'Sweet Spot' ? 0 : 7,
          assignee: customer?.csm_id || 'Sarah Johnson',
          priority,
          status: acc.quadrant === 'Sweet Spot' ? 'pending' : 'in_progress',
          nextAction: acc.quadrant === 'Sweet Spot' ? 
            'Immediate engagement - schedule expansion meeting' :
            acc.quadrant === 'High Value/Low Ready' ?
            'Execute readiness acceleration campaign' :
            'Quick win opportunity - prepare lightweight proposal',
          businessImpact: `Readiness: ${acc.readiness}/100, White Space: $${(acc.value / 1000).toFixed(0)}K. ${acc.quadrant} quadrant positioning.`
        });
      });
    }
    
    // EXPANSION TYPE DISTRIBUTION KPI
    if (kpiId === 'expansion-type-distribution') {
      // Type-specific pipeline opportunities
      const expansionTypes = [
        { type: 'Capacity-Driven', count: 24, arr: 2100000, winRate: 85, avgDays: 18 },
        { type: 'Cross-Sell', count: 32, arr: 1800000, winRate: 62, avgDays: 45 },
        { type: 'Upsell', count: 28, arr: 1500000, winRate: 68, avgDays: 32 },
        { type: 'Bundle', count: 12, arr: 800000, winRate: 72, avgDays: 52 }
      ];

      expansionTypes.forEach((expType, index) => {
        const priority = expType.winRate >= 80 ? 'high' : expType.winRate >= 65 ? 'medium' : 'low';
        
        items.push({
          id: `TYPE-${index + 1}`,
          type: 'account',
          title: `${expType.type} Pipeline - ${expType.count} Opportunities`,
          customer: `${expType.type} Expansion Segment`,
          amount: expType.arr,
          daysOverdue: 0,
          assignee: 'Sales Expansion Team',
          priority,
          status: 'in_progress',
          nextAction: expType.type === 'Capacity-Driven' ? 
            'High win rate - prioritize immediate quotes' :
            expType.type === 'Cross-Sell' ?
            'Product training needed - enable reps on combinations' :
            expType.type === 'Upsell' ?
            'Tier progression playbook execution' :
            'Bundle value positioning workshops',
          businessImpact: `${expType.count} opps, $${(expType.arr / 1000000).toFixed(1)}M ARR, ${expType.winRate}% win rate, ${expType.avgDays}d avg cycle`
        });
      });
    }
    
    // EXCEPTION ALERTS KPI
    if (kpiId === 'exception-alerts') {
      // Critical exception queue
      const criticalAlerts = [
        { account: 'TechCorp Industries', type: 'Champion Departure', severity: 'Critical', arr: 180000, daysOpen: 2 },
        { account: 'MedSecure Systems', type: 'Stalled Deal', severity: 'Critical', arr: 240000, daysOpen: 3 },
        { account: 'Global Financial', type: 'Competitive Threat', severity: 'Critical', arr: 160000, daysOpen: 1 },
        { account: 'DataCorp', type: 'Budget Delay', severity: 'High', arr: 520000, daysOpen: 5 },
        { account: 'FinanceHub', type: 'Champion Departure', severity: 'High', arr: 380000, daysOpen: 4 },
        { account: 'SecureBank', type: 'Stalled Deal', severity: 'High', arr: 150000, daysOpen: 8 },
        { account: 'CloudTech', type: 'Competitive Threat', severity: 'Medium', arr: 180000, daysOpen: 6 }
      ];

      criticalAlerts.forEach((alert, index) => {
        const customer = customersData.find(c => c.customer_name === alert.account);
        const priority = alert.severity === 'Critical' ? 'high' : alert.severity === 'High' ? 'medium' : 'low';
        
        items.push({
          id: `ALERT-${index + 1}`,
          type: 'account',
          title: `${alert.type} - ${alert.account}`,
          customer: alert.account,
          amount: alert.arr,
          daysOverdue: alert.daysOpen,
          assignee: customer?.csm_id || 'Alert Response Team',
          priority,
          status: 'pending',
          nextAction: alert.type === 'Champion Departure' ? 
            'Identify and engage new champion within 48h' :
            alert.type === 'Stalled Deal' ?
            'Execute deal acceleration tactics immediately' :
            alert.type === 'Competitive Threat' ?
            'Deploy competitive battle card and executive engagement' :
            'Budget realignment strategy session',
          businessImpact: `${alert.severity} alert - Open ${alert.daysOpen}d. ARR at risk: $${(alert.arr / 1000).toFixed(0)}K. ${alert.type} requires immediate intervention.`
        });
      });
    }
    
    if (kpiId === 'win-rate') {
      // Get at-risk deals with low win probability from real data
      const atRiskDeals = expansionOpportunitiesData
        .filter(o => o.close_probability < 60 && !['Closed-Won', 'Closed-Lost'].includes(o.stage))
        .sort((a, b) => a.close_probability - b.close_probability)
        .slice(0, 8);
      
      atRiskDeals.forEach((opp, index) => {
        const customer = customersData.find(c => c.customer_id === opp.customer_id);
        items.push({
          id: `WIN-${opp.opportunity_id}`,
          type: 'account',
          title: `At-Risk Deal - ${opp.close_probability}% Win Probability`,
          customer: customer?.customer_name || opp.customer_id,
          amount: opp.estimated_arr,
          daysOverdue: opp.days_in_stage > 45 ? opp.days_in_stage - 45 : 0,
          assignee: customer?.csm_id || 'Sales Director',
          priority: opp.close_probability < 40 ? 'high' : 'medium',
          status: 'in_progress',
          nextAction: `Improve win probability for ${opp.recommended_product} deal`,
          businessImpact: `${opp.close_probability}% win probability • ${opp.stage} stage • $${(opp.estimated_arr / 1000).toFixed(0)}K at risk`
        });
      });
    }

    // COMMERCIAL OPERATIONS KPIs
    switch (kpiId) {
      case 'quote-to-cash-cycle':
        // Enterprise Multi-Level Approval Delays (from Level 2 analysis)
        items.push({
          id: 'ENT-001',
          type: 'account',
          title: 'Enterprise CFO Approval Delays',
          customer: 'Global Pharma Inc',
          amount: 480000,
          daysOverdue: 67,
          assignee: 'Jennifer Lee (AM)',
          priority: 'high',
          status: 'pending',
          nextAction: 'Escalate to CFO with value realization report',
          businessImpact: '$12.3M ARR affected across 87 Enterprise deals. Early payment discount could save $4.7M cash flow.'
        });

        items.push({
          id: 'ENT-002',
          type: 'account',
          title: 'Aerospace Corp Legal Review Loop',
          customer: 'Aerospace Corp',
          amount: 320000,
          daysOverdue: 61,
          assignee: 'Legal Team',
          priority: 'high',
          status: 'in_progress',
          nextAction: 'Apply EU data residency template',
          businessImpact: 'MSA terms disputed 3x. Use pre-approved template to resolve in 2 days vs 7 days avg.'
        });

        // Legal Resource Bottleneck (from Level 2 analysis)
        items.push({
          id: 'LEG-001',
          type: 'contract',
          title: 'Legal Team Resource Shortage',
          customer: 'Multiple Customers',
          amount: 2400000,
          daysOverdue: 14,
          assignee: 'Legal Director',
          priority: 'high',
          status: 'pending',
          nextAction: 'Hire additional attorney or redistribute workload',
          businessImpact: '400 deals/quarter with only 2 attorneys. Attorney B taking 2.25x longer than Attorney A.'
        });

        // Quote/PO Mismatch Issues (from Level 2 analysis)
        items.push({
          id: 'SPL-001',
          type: 'quote',
          title: 'Splunk Quote/PO Mismatches',
          customer: 'Multiple Splunk Customers',
          amount: 1800000,
          daysOverdue: 12,
          assignee: 'Order Operations',
          priority: 'medium',
          status: 'pending',
          nextAction: 'Implement automated quote validation',
          businessImpact: '45% of Splunk deals have discrepancies. Automated validation could save $3.2M cash flow.'
        });

        // Public Sector Payment Terms (from Level 2 analysis)
        items.push({
          id: 'PUB-001',
          type: 'account',
          title: 'Public Sector Payment Delays',
          customer: 'Government Agencies',
          amount: 6400000,
          daysOverdue: 52,
          assignee: 'Public Sector Team',
          priority: 'medium',
          status: 'pending',
          nextAction: 'Implement flexible payment terms pilot',
          businessImpact: '67% subject to government fiscal constraints. 90-day terms + 1% premium could reduce delays.'
        });

        break;

      case 'invoice-accuracy':
        items.push(
          {
            id: 'INV-2025-03-124',
            type: 'invoice',
            title: 'Disputed Invoice - Usage Calculation',
            customer: 'MegaCorp',
            amount: 425000,
            daysOverdue: 67,
            assignee: 'Billing Team',
            priority: 'high',
            status: 'in_progress',
            nextAction: 'Provide usage data justification',
            businessImpact: 'Large customer relationship at risk'
          },
          {
            id: 'INV-2025-04-089',
            type: 'invoice',
            title: 'Payment Plan Negotiation',
            customer: 'StartupX',
            amount: 78000,
            daysOverdue: 45,
            assignee: 'Collections',
            priority: 'medium',
            status: 'pending',
            nextAction: 'Propose payment plan options',
            businessImpact: 'Cash flow impact, customer retention'
          }
        );
        break;

      case 'days-sales-outstanding':
        items.push(
          {
            id: 'AR-CUST-000123',
            type: 'account',
            title: 'High DSO Account - Strategic Tier',
            customer: 'Enterprise Solutions Inc',
            amount: 890000,
            daysOverdue: 75,
            assignee: 'Account Manager',
            priority: 'high',
            status: 'pending',
            nextAction: 'Executive escalation call scheduled',
            businessImpact: 'Strategic account, immediate attention needed'
          },
          {
            id: 'AR-CUST-000456',
            type: 'account',
            title: 'Collection Call Required',
            customer: 'Regional Corp',
            amount: 234000,
            daysOverdue: 62,
            assignee: 'Collections Team',
            priority: 'medium',
            status: 'in_progress',
            nextAction: 'Follow-up collection call',
            businessImpact: 'Standard collection process'
          }
        );
        break;

      default:
        // Generic action items for other KPIs
        items.push(
          {
            id: 'GEN-001',
            type: 'contract',
            title: 'Process Optimization Required',
            customer: 'Multiple Customers',
            amount: 0,
            daysOverdue: 0,
            assignee: 'Process Team',
            priority: 'medium',
            status: 'pending',
            nextAction: 'Review and optimize workflow',
            businessImpact: 'Improve overall efficiency'
          }
        );
    }

    setActionItems(items);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on items:`, selectedItems);
    // Implement bulk actions
  };

  const handleItemAction = (itemId: string, action: string) => {
    console.log(`Performing ${action} on item:`, itemId);
    // Implement individual item actions
  };

  const filteredItems = actionItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesAssignee = filters.assignee === 'all' || item.assignee.includes(filters.assignee);
    
    return matchesSearch && matchesPriority && matchesStatus && matchesAssignee;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <AlertCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Calendar className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading || !kpiDrillDown) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading Action Items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Analysis</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  {kpiDrillDown.kpiName} - Action Center
                  {actionId && (
                    <span className="text-lg font-medium text-blue-600">
                      • {actionId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  )}
                </h1>
                <p className="text-gray-600 mt-1">
                  {actionId 
                    ? `Showing ${actionId.replace('-', ' ')} opportunities only`
                    : 'Immediate actions required for operational excellence'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{filteredItems.filter(i => i.priority === 'high').length} High Priority</span>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Calendar className="h-4 w-4" />
                Schedule Review
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search actions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select 
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedItems.length} selected</span>
                <button 
                  onClick={() => handleBulkAction('assign')}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Bulk Assign
                </button>
                <button 
                  onClick={() => handleBulkAction('escalate')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Escalate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Items Cards */}
      <div className="px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Action Items Requiring Immediate Attention</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredItems.length} items found • Click any card to view account details
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => {
            const customer = customersData.find(c => c.customer_name === item.customer);
            
            return (
              <div
                key={item.id}
                className="rounded-xl shadow-md border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer p-6"
                style={{ backgroundColor: '#F3F3F3' }}
                onClick={() => setShowQuoteDetails(item.id)}
              >
                <div className="flex items-start justify-between">
                  {/* Left Section - Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-sm font-medium text-gray-600 capitalize">{item.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.id}</p>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                      <p className="text-sm font-semibold text-blue-900">{item.businessImpact}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                        <p className="text-sm font-bold text-gray-900">{item.customer}</p>
                        {customer && (
                          <p className="text-xs text-gray-600">{customer.tier} • {customer.industry}</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount</p>
                        <p className="text-lg font-bold text-green-600">
                          {item.amount > 0 ? `$${(item.amount / 1000).toFixed(0)}K` : '-'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Days Overdue</p>
                        <p className={`text-lg font-bold ${
                          item.daysOverdue > 30 ? 'text-red-600' : 
                          item.daysOverdue > 7 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {item.daysOverdue > 0 ? `${item.daysOverdue} days` : 'On Track'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Assignee</p>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-semibold text-gray-900">{item.assignee}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-700 font-semibold uppercase mb-1">Next Action</p>
                      <p className="text-sm font-medium text-yellow-900">{item.nextAction}</p>
                    </div>
                  </div>
                  
                  {/* Right Section - Actions */}
                  <div className="ml-6 flex flex-col gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemAction(item.id, 'call');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemAction(item.id, 'email');
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQuoteDetails(item.id);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      View Account
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Actions Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Immediate Actions
            </h3>
            <div className="space-y-3">
              {filteredItems.filter(item => item.priority === 'high').map(item => (
                <div key={item.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900">{item.nextAction}</p>
                  <p className="text-xs text-red-700 mt-1">{item.customer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              Scheduled Actions
            </h3>
            <div className="space-y-3">
              {filteredItems.filter(item => item.status === 'in_progress').map(item => (
                <div key={item.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-900">{item.nextAction}</p>
                  <p className="text-xs text-yellow-700 mt-1">{item.customer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Financial Impact
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900">
                  Total at Risk: ${filteredItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {filteredItems.filter(item => item.priority === 'high').length} high-priority items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details Modal */}
      {showQuoteDetails && (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-300 max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowQuoteDetails(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-semibold">Back</span>
                  </button>
                  <h2 className="text-3xl font-bold text-white">Account Details</h2>
                </div>
                <button
                  onClick={() => setShowQuoteDetails(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
                >
                  <AlertCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            
            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
              {(() => {
                const actionItem = actionItems.find(item => item.id === showQuoteDetails);
                if (!actionItem) return (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg">Action item not found</p>
                  </div>
                );
                
                const customer = customersData.find(c => c.customer_name === actionItem.customer);
                if (!customer) return (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg">Customer data not found</p>
                  </div>
                );
                
                return (
                  <div className="space-y-6">
                    {/* Customer Name Banner */}
                    <div className="rounded-xl shadow-sm p-6 border-l-4 border-blue-600" style={{ backgroundColor: '#F3F3F3' }}>
                      <h3 className="text-3xl font-bold text-gray-900">{customer.customer_name}</h3>
                      <p className="text-gray-600 mt-1">{customer.customer_id}</p>
                    </div>

                    {/* Account Overview */}
                    <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#F3F3F3' }}>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Account Overview</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <label className="text-xs text-blue-700 uppercase tracking-wide font-semibold block mb-2">Tier</label>
                          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-lg font-bold">{customer.tier}</span>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <label className="text-xs text-purple-700 uppercase tracking-wide font-semibold block mb-2">Industry</label>
                          <p className="text-lg font-bold text-purple-900">{customer.industry}</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <label className="text-xs text-green-700 uppercase tracking-wide font-semibold block mb-2">Story Type</label>
                          <p className="text-sm font-bold text-green-900 capitalize">{customer.story_type.replace('_', ' ')}</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                          <label className="text-xs text-orange-700 uppercase tracking-wide font-semibold block mb-2">Theater</label>
                          <p className="text-lg font-bold text-orange-900">{customer.theater}</p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Metrics */}
                    <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#F3F3F3' }}>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Financial & Account Metrics</h4>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                          <label className="text-sm text-white uppercase tracking-wide font-semibold block mb-2">Annual ARR</label>
                          <p className="text-4xl font-bold text-white">${(customer.arr / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                          <label className="text-sm text-white uppercase tracking-wide font-semibold block mb-2">Product Count</label>
                          <p className="text-4xl font-bold text-white">{customer.product_count}</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                          <label className="text-sm text-white uppercase tracking-wide font-semibold block mb-2">CSM Assigned</label>
                          <p className="text-xl font-bold text-white mt-2">{customer.csm_id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Item Details */}
                    <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#F3F3F3' }}>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Action Item Details</h4>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                        <h5 className="font-bold text-yellow-900 text-xl mb-3">{actionItem.title}</h5>
                        <p className="text-yellow-800 text-base mb-4 leading-relaxed">{actionItem.businessImpact}</p>
                        <div className="grid grid-cols-2 gap-6 mt-4">
                          <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                            <label className="text-xs text-yellow-700 uppercase font-semibold block mb-1">Priority</label>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                              actionItem.priority === 'high' ? 'bg-red-600 text-white' :
                              actionItem.priority === 'medium' ? 'bg-yellow-600 text-white' :
                              'bg-green-600 text-white'
                            }`}>
                              {actionItem.priority.toUpperCase()}
                            </span>
                          </div>
                          <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                            <label className="text-xs text-yellow-700 uppercase font-semibold block mb-1">Status</label>
                            <p className="text-lg font-bold text-yellow-900 capitalize">{actionItem.status.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Action */}
                    <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#F3F3F3' }}>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Next Action Required</h4>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
                        <p className="text-xl font-bold text-blue-900 mb-3">{actionItem.nextAction}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700">Assignee:</span>
                            <span className="text-base font-bold text-blue-900">{actionItem.assignee}</span>
                          </div>
                          {actionItem.daysOverdue > 0 && (
                            <div className="bg-red-100 border-2 border-red-500 px-4 py-2 rounded-lg">
                              <p className="text-sm text-red-700 font-bold">⚠️ Overdue by {actionItem.daysOverdue} days</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Geography & Contact */}
                    <div className="rounded-xl shadow-sm p-6" style={{ backgroundColor: '#F3F3F3' }}>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Location Information</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <label className="text-xs text-gray-500 uppercase font-semibold block mb-1">Theater</label>
                          <p className="text-lg font-bold text-gray-900">{customer.theater}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <label className="text-xs text-gray-500 uppercase font-semibold block mb-1">Region</label>
                          <p className="text-lg font-bold text-gray-900">{customer.region}</p>
                        </div>
                        {customer.country && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <label className="text-xs text-gray-500 uppercase font-semibold block mb-1">Country</label>
                            <p className="text-lg font-bold text-gray-900">{customer.country}</p>
                          </div>
                        )}
                        {customer.state && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <label className="text-xs text-gray-500 uppercase font-semibold block mb-1">State</label>
                            <p className="text-lg font-bold text-gray-900">{customer.state}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="bg-white border-t border-gray-200 px-8 py-6">
              <div className="flex gap-4 justify-end">
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Phone className="h-5 w-5" />
                  Call Customer
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Mail className="h-5 w-5" />
                  Send Email
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold shadow-lg hover:shadow-xl transition-all">
                  <AlertCircle className="h-5 w-5" />
                  Escalate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
