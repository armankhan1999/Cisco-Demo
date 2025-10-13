'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { useSidebar } from '../../../../contexts/SidebarContext';
import { getAllChampionDepartureAlerts, getActiveAccounts } from '@/lib/data/csmDataLoader';

function ChampionDeparturesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [departures, setDepartures] = useState<any[]>([]);
  const [filteredDepartures, setFilteredDepartures] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filterDays, setFilterDays] = useState<number | null>(null);

  useEffect(() => {
    try {
      console.log('👥 Loading Champion Departures...');
      
      const championAlerts = getAllChampionDepartureAlerts();
      const allAccounts = getActiveAccounts();
      
      // Process champion departure data
      const departureData = championAlerts.map(alert => {
        const account = allAccounts.find(acc => acc.account.id === alert.account_id);
        
        const daysSinceDeparture = Math.ceil(
          (new Date().getTime() - new Date(alert.departure_date).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        return {
          ...alert,
          accountName: alert.account_name || account?.account.name || 'Unknown',
          tier: account?.account.tier || 'Unknown',
          healthScore: account?.account.health_score || 0,
          arr: alert.arr_at_risk || 0,
          daysSinceDeparture,
          churnProbability: alert.historical_churn_probability || 0
        };
      });

      // Sort by days since departure (most recent first)
      const sortedData = departureData.sort((a, b) => a.daysSinceDeparture - b.daysSinceDeparture);
      
      setDepartures(sortedData);
      
      // Check if we should filter by recent (30 days)
      const daysParam = searchParams.get('days');
      if (daysParam) {
        const days = parseInt(daysParam);
        setFilterDays(days);
        setFilteredDepartures(sortedData.filter(d => d.daysSinceDeparture <= days));
      } else {
        setFilteredDepartures(sortedData);
      }
      
      console.log(`  Total Champion Departures: ${sortedData.length}`);
      console.log(`  Recent (≤30 days): ${sortedData.filter(d => d.daysSinceDeparture <= 30).length}`);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading champion departures:', error);
      setLoading(false);
    }
  }, [searchParams]);

  const totalPages = Math.ceil(filteredDepartures.length / perPage);
  const paginatedData = filteredDepartures.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Champion Departures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar currentPersona="CSM" onPersonaChange={() => {}} />
      
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ${isCollapsed ? 'ml-[56px]' : 'ml-[280px]'}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <button
            onClick={() => router.push('/csm/kpi/churn-rate')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium transition-colors"
          >
            ← Back to Churn Analysis
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
                👥 Champion Departures
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Key stakeholder departures and impact analysis
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total departures: {departures.length} | Recent (≤30 days): {departures.filter(d => d.daysSinceDeparture <= 30).length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm">
                📊 Export Report
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Departures</p>
                  <p className="text-3xl font-bold text-gray-900">{departures.length}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent (≤30 Days)</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {departures.filter(d => d.daysSinceDeparture <= 30).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total ARR at Risk</p>
                  <p className="text-3xl font-bold text-red-600">
                    ${(departures.reduce((sum, d) => sum + d.arr, 0) / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Impact Score</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {(departures.reduce((sum, d) => sum + d.impact_score, 0) / departures.length).toFixed(0)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Indicator */}
          {filterDays && (
            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-900">
                    🕐 Showing Recent Departures Only
                  </p>
                  <p className="text-xs text-orange-700">
                    Displaying {filteredDepartures.length} departures within the last {filterDays} days
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFilterDays(null);
                  setFilteredDepartures(departures);
                  setCurrentPage(1);
                  router.push('/csm/kpi/champion-departures');
                }}
                className="px-4 py-2 text-sm font-medium text-orange-700 bg-white border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Show All Departures
              </button>
            </div>
          )}

          {/* Departures Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Champion Departure Details</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setFilterDays(30);
                      setFilteredDepartures(departures.filter(d => d.daysSinceDeparture <= 30));
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filterDays === 30
                        ? 'bg-orange-100 text-orange-700 border border-orange-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Recent (≤30 days)
                  </button>
                  <select 
                    value={perPage} 
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Champion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Since</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ARR at Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((departure: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <button 
                            onClick={() => router.push(`/csm/accounts/${departure.account_id}`)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {departure.accountName}
                          </button>
                          <div className="text-sm text-gray-500">{departure.tier}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{departure.champion_name}</div>
                        <div className="text-sm text-gray-500">{departure.champion_role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(departure.departure_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Detected: {departure.detection_method}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          departure.daysSinceDeparture <= 7 ? 'bg-red-100 text-red-800' :
                          departure.daysSinceDeparture <= 14 ? 'bg-orange-100 text-orange-800' :
                          departure.daysSinceDeparture <= 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {departure.daysSinceDeparture} days ago
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            departure.impact_score >= 80 ? 'bg-red-100 text-red-800' :
                            departure.impact_score >= 60 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {departure.impact_score}/100
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {departure.impact_level}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(departure.arr / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-gray-500">
                          {(departure.churnProbability * 100).toFixed(0)}% churn risk
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          departure.alert_status === 'Open' ? 'bg-red-100 text-red-800' :
                          departure.alert_status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {departure.alert_status}
                        </span>
                        {departure.outcome && (
                          <div className="text-xs text-gray-500 mt-1">{departure.outcome}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => router.push(`/csm/accounts/${departure.account_id}`)}
                            className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-600 rounded hover:bg-blue-50"
                          >
                            View Account
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
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, filteredDepartures.length)} of {filteredDepartures.length} departures
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChampionDeparturesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Champion Departures...</p>
        </div>
      </div>
    }>
      <ChampionDeparturesContent />
    </Suspense>
  );
}
