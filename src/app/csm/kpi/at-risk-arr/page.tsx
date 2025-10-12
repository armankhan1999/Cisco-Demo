'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { useSidebar } from '../../../../contexts/SidebarContext';
import { calculateAllKPIs } from '@/lib/kpis/csmKPICalculations';
import { getActiveAccounts } from '@/lib/data/csmDataLoader';
import csmsData from '@/source_data/master-data/csms.json';
import contractsData from '@/source_data/master-data/contracts.json';

export default function AtRiskARRDrillDown() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [atRiskData, setAtRiskData] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('healthScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    try {
      console.log('⚠️ Loading At-Risk ARR Drill-Down Data...');
      
      // Get KPI data for at-risk ARR value
      const kpis = calculateAllKPIs();
      const atRiskARR = kpis.atRiskARR;
      
      // Get account data and filter for at-risk accounts (health < 60)
      const allAccounts = getActiveAccounts();
      const contracts = contractsData as any[];
      
      // Filter accounts with health score < 60
      const atRiskAccounts = allAccounts
        .filter(acc => acc.account.health_score < 60)
        .map(acc => {
          // Find contract for account-level renewal date (not product-level)
          const contract = contracts.find(c => c.customer_id === acc.account.id);
          
          // Calculate days to renewal from contract end_date
          const renewalDate = contract ? new Date(contract.end_date) : null;
          const daysToRenewal = renewalDate ? 
            Math.ceil((renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
            null;
          
          // Determine primary risk factor
          let primaryRisk = 'Unknown';
          let riskSeverity = 'medium';
          
          if (acc.account.health_score <= 45) {
            primaryRisk = 'Critical health score';
            riskSeverity = 'critical';
          } else if (acc.account.health_score <= 50) {
            primaryRisk = 'Low engagement';
            riskSeverity = 'high';
          } else {
            primaryRisk = 'Below target performance';
            riskSeverity = 'medium';
          }
          
          // Real CSM mapping from source data
          const csm = csmsData.find(c => c.csm_id === acc.account.csm_id);
          const assignedCSM = csm ? csm.name : 'Unassigned';
          
          return {
            id: acc.account.id,
            name: acc.account.name,
            healthScore: acc.account.health_score,
            arr: acc.account.arr,
            tier: acc.account.tier,
            primaryRisk,
            riskSeverity,
            daysToRenewal,
            csm: assignedCSM,
            lastContact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            actionStatus: Math.random() > 0.5 ? 'In Progress' : 'Pending'
          };
        })
        .sort((a, b) => a.healthScore - b.healthScore); // Sort by health score (worst first)
      
      // Calculate statistics
      const totalAtRiskARR = atRiskAccounts.reduce((sum, acc) => sum + acc.arr, 0);
      const criticalAccounts = atRiskAccounts.filter(acc => acc.healthScore <= 45);
      const highRiskAccounts = atRiskAccounts.filter(acc => acc.healthScore > 45 && acc.healthScore <= 55);
      const mediumRiskAccounts = atRiskAccounts.filter(acc => acc.healthScore > 55 && acc.healthScore < 60);
      
      // Risk distribution
      const riskDistribution = [
        {
          category: 'Critical (0-45)',
          count: criticalAccounts.length,
          arr: criticalAccounts.reduce((sum, acc) => sum + acc.arr, 0),
          percentage: criticalAccounts.length / atRiskAccounts.length * 100,
          color: 'bg-red-500'
        },
        {
          category: 'High Risk (46-55)',
          count: highRiskAccounts.length,
          arr: highRiskAccounts.reduce((sum, acc) => sum + acc.arr, 0),
          percentage: highRiskAccounts.length / atRiskAccounts.length * 100,
          color: 'bg-orange-500'
        },
        {
          category: 'Medium Risk (56-59)',
          count: mediumRiskAccounts.length,
          arr: mediumRiskAccounts.reduce((sum, acc) => sum + acc.arr, 0),
          percentage: mediumRiskAccounts.length / atRiskAccounts.length * 100,
          color: 'bg-yellow-500'
        }
      ];
      
      setAtRiskData({
        totalARR: totalAtRiskARR,
        totalAccounts: atRiskAccounts.length,
        riskDistribution
      });
      
      setAccounts(atRiskAccounts);
      setLoading(false);
      
      console.log(`⚠️ At-Risk Analysis Complete:`);
      console.log(`  Total At-Risk ARR: $${totalAtRiskARR.toLocaleString()}`);
      console.log(`  Total At-Risk Accounts: ${atRiskAccounts.length}`);
      console.log(`  Critical Accounts: ${criticalAccounts.length}`);
      
    } catch (error) {
      console.error('Error loading at-risk ARR data:', error);
      setLoading(false);
    }
  }, []);

  const { isCollapsed } = useSidebar();

  // Search and filter
  const filteredAccounts = accounts.filter(account => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      account.name.toLowerCase().includes(search) ||
      account.tier.toLowerCase().includes(search) ||
      account.primaryRisk.toLowerCase().includes(search) ||
      account.csm.toLowerCase().includes(search)
    );
  });

  // Sort accounts
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return ' ⇅';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading At-Risk ARR Analysis...</div>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(sortedAccounts.length / perPage);
  const paginatedAccounts = sortedAccounts.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        currentPersona="CSM"
        onPersonaChange={() => {}} 
      />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <button
            onClick={() => router.push('/csm')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium transition-colors"
          >
            ← Back to Portfolio Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">At-Risk ARR Analysis</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive analysis of accounts requiring immediate attention
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Export Report
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* At-Risk Definition Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">At-Risk ARR Definition</h3>
                <p className="text-sm text-blue-800">
                  <strong>Threshold:</strong> Accounts with Health Score <strong>&lt; 60</strong> are classified as at-risk.
                  This page shows all accounts requiring immediate attention, categorized by risk severity:
                </p>
                <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded"></span>
                    <span className="text-blue-900"><strong>Critical (0-45):</strong> Immediate intervention</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-orange-500 rounded"></span>
                    <span className="text-blue-900"><strong>High Risk (46-55):</strong> Proactive engagement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded"></span>
                    <span className="text-blue-900"><strong>Medium Risk (56-59):</strong> Close monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="rounded-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total At-Risk ARR</p>
                  <p className="text-3xl font-bold text-red-600">
                    ${(atRiskData.totalARR / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-red-600">
                  ⚠️ Requires Immediate Action
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">At-Risk Accounts</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {atRiskData.totalAccounts}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-gray-600">
                  🎯 At-Risk Threshold: Health Score &lt; 60
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Accounts</p>
                  <p className="text-3xl font-bold text-red-700">
                    {atRiskData.riskDistribution[0].count}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-red-700">
                  🔴 Health Score ≤ 45
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Risk Level</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {accounts.length > 0 ? Math.round(accounts.reduce((sum, acc) => sum + acc.healthScore, 0) / accounts.length) : 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center text-sm font-medium text-orange-600">
                  Portfolio Average
                </span>
              </div>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Risk Distribution</h3>
              <span className="text-xs text-gray-500">Click a category to filter accounts</span>
            </div>
            <div className="space-y-4">
              {atRiskData.riskDistribution.map((risk: any, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    // Filter accounts by risk category
                    const rangeMatch = risk.category.match(/\((\d+)-(\d+)\)/);
                    if (rangeMatch) {
                      const min = parseInt(rangeMatch[1]);
                      const max = parseInt(rangeMatch[2]);
                      const filtered = accounts.filter(acc => acc.healthScore >= min && acc.healthScore <= max);
                      alert(`📊 Filtering ${risk.category}\n\nFound ${filtered.length} accounts:\n${filtered.slice(0, 5).map(a => `• ${a.name} (Health: ${a.healthScore})`).join('\n')}${filtered.length > 5 ? `\n...and ${filtered.length - 5} more` : ''}\n\n💡 Tip: Use the search box to filter by account name, tier, or CSM`);
                    }
                  }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all"
                  title="Click to filter by this risk category"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${risk.color}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{risk.category}</div>
                      <div className="text-sm text-gray-600">{risk.count} accounts</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${(risk.arr / 1000000).toFixed(1)}M ARR
                    </div>
                    <div className="text-sm text-gray-600">
                      {risk.percentage.toFixed(1)}% of at-risk
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* At-Risk Accounts Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">At-Risk Account Details</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search accounts, tier, risk, CSM..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select 
                  value={perPage} 
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
                <span className="text-sm text-gray-600">
                  {sortedAccounts.length} {sortedAccounts.length === 1 ? 'account' : 'accounts'}
                  {searchTerm && ` matching "${searchTerm}"`}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort('name')} className="flex items-center hover:text-blue-600 transition-colors">
                        Account{getSortIcon('name')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort('healthScore')} className="flex items-center hover:text-blue-600 transition-colors">
                        Health Score{getSortIcon('healthScore')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort('arr')} className="flex items-center hover:text-blue-600 transition-colors">
                        ARR{getSortIcon('arr')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort('primaryRisk')} className="flex items-center hover:text-blue-600 transition-colors">
                        Primary Risk{getSortIcon('primaryRisk')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort('daysToRenewal')} className="flex items-center hover:text-blue-600 transition-colors">
                        Days to Renewal{getSortIcon('daysToRenewal')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort('csm')} className="flex items-center hover:text-blue-600 transition-colors">
                        CSM{getSortIcon('csm')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedAccounts.map((account: any, idx: number) => (
                    <tr 
                      key={idx} 
                      onClick={() => router.push(`/csm/accounts/${account.id}`)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      title="Click to view account details"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-0">
                            <div className="text-sm font-medium text-gray-900">{account.name}</div>
                            <div className="text-sm text-gray-500">{account.tier}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            account.healthScore <= 45 ? 'bg-red-100 text-red-800' :
                            account.healthScore <= 55 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {account.healthScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${(account.arr / 1000).toFixed(0)}K</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{account.primaryRisk}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          account.daysToRenewal && account.daysToRenewal < 90 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {account.daysToRenewal ? `${account.daysToRenewal} days` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{account.csm}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              alert(`🚀 Launching Save Campaign for ${account.name}\n\nThis would:\n• Create high-priority ticket\n• Assign to ${account.csm}\n• Schedule immediate intervention call\n• Track in CRM system`);
                            }}
                            className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                          >
                            Launch Save Campaign
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              alert(`📅 Scheduling QBR for ${account.name}\n\nThis would:\n• Open calendar booking\n• Invite: Customer executives + ${account.csm}\n• Prepare QBR deck with health metrics\n• Set follow-up tasks`);
                            }}
                            className="text-orange-600 hover:text-orange-900 text-xs px-2 py-1 border border-orange-600 rounded hover:bg-orange-50 transition-colors"
                          >
                            Schedule QBR
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="mt-8 bg-red-50 rounded-lg border border-red-200 p-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Immediate Action Required</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Prioritize {atRiskData.riskDistribution[0].count} critical health accounts for immediate intervention</li>
                  <li>• Launch proactive save campaigns for accounts with health scores below 50</li>
                  <li>• Schedule executive escalation calls for high-ARR at-risk accounts</li>
                  <li>• Implement weekly health score monitoring for all at-risk accounts</li>
                  <li>• Coordinate with sales teams on potential churn prevention strategies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
