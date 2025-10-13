'use client';

import { useState, useEffect } from 'react';
import { getLevel2SegmentBreakdown, type DSOSegmentData } from '@/services/dsoRealDataService';
import { ArrowLeft, MapPin, Users, TrendingUp, AlertCircle } from '@/utils/iconMapping';

interface NewDSOLevel2SegmentBreakdownProps {
  productFamily: string;
  onBack: () => void;
  onDrillToLevel3: (segment: string, geography: string, productFamily: string) => void;
}

export default function NewDSOLevel2SegmentBreakdown({
  productFamily,
  onBack,
  onDrillToLevel3
}: NewDSOLevel2SegmentBreakdownProps) {
  const [segmentData, setSegmentData] = useState<DSOSegmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedGeography, setSelectedGeography] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = getLevel2SegmentBreakdown(productFamily);
        setSegmentData(data);
      } catch (error) {
        console.error('Error fetching DSO Level 2 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productFamily]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter data
  const filteredData = segmentData.filter(item => {
    const matchesSegment = selectedSegment === 'all' || item.segment === selectedSegment;
    const matchesGeography = selectedGeography === 'all' || item.geography === selectedGeography;
    return matchesSegment && matchesGeography;
  });

  // Calculate metrics
  const totalAR = filteredData.reduce((sum, item) => sum + item.arBalance, 0);
  const avgDSO = filteredData.length > 0
    ? filteredData.reduce((sum, item) => sum + (item.dsoValue * item.arBalance), 0) / totalAR
    : 0;
  const criticalSegments = filteredData.filter(item => item.status === 'critical').length;
  const totalDelayedCustomers = filteredData.reduce((sum, item) => sum + item.delayedCustomersCount, 0);

  // Get unique segments and geographies for filters
  const segments = Array.from(new Set(segmentData.map(item => item.segment))).sort();
  const geographies = Array.from(new Set(segmentData.map(item => item.geography))).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Customer Segment & Geography Breakdown
            </h1>
            <p className="text-gray-600">
              {productFamily} - Is it concentrated in specific segments or regions?
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Customer Segment</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Segments</option>
              {segments.map(segment => (
                <option key={segment} value={segment}>{segment}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">Geography</label>
            <select
              value={selectedGeography}
              onChange={(e) => setSelectedGeography(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Geographies</option>
              {geographies.map(geo => (
                <option key={geo} value={geo}>{geo}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedSegment('all');
                setSelectedGeography('all');
              }}
              className="px-4 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Avg DSO</h3>
            <span className="text-xs font-medium text-blue-600">
              {Math.round(avgDSO) <= 35 ? 'On Target' : 'At Risk'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{Math.round(avgDSO)} days</p>
          <p className="text-xs text-gray-500 mb-3">Filtered segments</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${Math.round(avgDSO) <= 35 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min((Math.round(avgDSO) / 60) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Critical Segments</h3>
            <span className="text-xs font-medium text-red-600">
              {criticalSegments > 0 ? 'Action Needed' : 'All Good'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{criticalSegments}</p>
          <p className="text-xs text-gray-500 mb-3">Need attention</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${criticalSegments === 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min((criticalSegments / filteredData.length) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Total AR</h3>
            <span className="text-xs font-medium text-gray-600">Outstanding</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">${Math.round(totalAR / 1000)}K</p>
          <p className="text-xs text-gray-500 mb-3">{filteredData.length} combinations</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Delayed Customers</h3>
            <span className="text-xs font-medium text-yellow-600">45+ Days</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{totalDelayedCustomers}</p>
          <p className="text-xs text-gray-500 mb-3">Customers affected</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-yellow-500" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      {/* Segment Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Segment × Geography Performance</h2>
            <p className="text-sm text-gray-600">Click any row to drill down to invoice details</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Segment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Geography</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">DSO (Days)</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">AR Balance</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Invoices</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Avg Invoice</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Primary Bucket</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Delayed</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onDrillToLevel3(item.segment, item.geography, item.productFamily)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm">{item.segment}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 text-sm">{item.geography}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`font-semibold text-sm ${
                      item.status === 'good' ? 'text-green-600' :
                      item.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.dsoValue} days
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-medium text-gray-900 text-sm">
                      ${Math.round(item.arBalance / 1000)}K
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-gray-700 text-sm">{item.invoiceVolume}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-gray-700 text-sm">
                      ${Math.round(item.avgInvoiceValue / 1000)}K
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                      item.primaryAgingBucket === 'current-0-30' ? 'bg-green-100 text-green-800' :
                      item.primaryAgingBucket === '31-60' ? 'bg-yellow-100 text-yellow-800' :
                      item.primaryAgingBucket === '61-90' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.primaryAgingBucket.replace('current-', '')}d
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-red-600 font-medium text-sm">{item.delayedCustomersCount}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                      item.status === 'good' ? 'bg-green-100 text-green-800' :
                      item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View Invoices →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xs">No segments match the selected filters</p>
            <button
              onClick={() => {
                setSelectedSegment('all');
                setSelectedGeography('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Key Insights</h3>
        <div className="space-y-3">
          {filteredData
            .filter(item => item.status === 'critical')
            .slice(0, 3)
            .map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-red-800">
                    {item.segment} - {item.geography} needs immediate focus
                  </p>
                  <p className="text-xs text-red-600">
                    {item.dsoValue} days DSO with {item.delayedCustomersCount} delayed customers ({item.invoiceVolume} invoices)
                  </p>
                </div>
              </div>
            ))}

          {filteredData
            .filter(item => item.status === 'good')
            .slice(0, 1)
            .map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-green-800">
                    {item.segment} - {item.geography} performing well
                  </p>
                  <p className="text-xs text-green-600">
                    {item.dsoValue} days DSO with strong collection performance
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
