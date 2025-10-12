'use client';

import { useState, useEffect } from 'react';
import { DSODrillDownService, type DSOLevel3CustomerData } from '@/services/dsoDrillDownService';
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Clock, Search, Filter, Phone, Mail } from '@/utils/iconMapping';

interface DSOLevel3CustomerAgingProps {
  segment: string;
  productFamily: string;
  onBack: () => void;
  onDrillToLevel4: (customerId: string) => void;
}

export default function DSOLevel3CustomerAging({ 
  segment,
  productFamily,
  onBack, 
  onDrillToLevel4 
}: DSOLevel3CustomerAgingProps) {
  const [customerData, setCustomerData] = useState<DSOLevel3CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = DSODrillDownService.getLevel3CustomerData(segment, productFamily);
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching DSO Level 3 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [segment, productFamily]);

  const handleCustomerClick = (customerId: string) => {
    onDrillToLevel4(customerId);
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for customers:`, selectedCustomers);
    // Implement bulk actions here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter customers based on search and filters
  const filteredCustomers = customerData.filter(customer => {
    const matchesSearch = customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || customer.priority === selectedPriority;
    const matchesTrend = selectedTrend === 'all' || customer.paymentTrend === selectedTrend;
    
    return matchesSearch && matchesPriority && matchesTrend;
  });

  // Calculate summary metrics
  const totalOutstanding = filteredCustomers.reduce((sum, c) => sum + c.totalOutstanding, 0);
  const highPriorityCount = filteredCustomers.filter(c => c.priority === 'high').length;
  const overdueAmount = filteredCustomers.reduce((sum, c) => sum + c.overdueAmount, 0);
  const avgDSO = filteredCustomers.reduce((sum, c) => sum + c.avgDaysOutstanding, 0) / filteredCustomers.length || 0;

  // Render sparkline for payment history
  const renderSparkline = (paymentHistory: number[], trend: string) => {
    const max = Math.max(...paymentHistory);
    const min = Math.min(...paymentHistory);
    const range = max - min || 1;
    
    const points = paymentHistory.map((value, index) => {
      const x = (index / (paymentHistory.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');
    
    const trendColor = trend === 'improving' ? '#10B981' : trend === 'declining' ? '#EF4444' : '#6B7280';
    
    return (
      <svg width="60" height="20" className="inline-block">
        <polyline
          fill="none"
          stroke={trendColor}
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

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
            Back to Matrix
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer AR Aging Detail</h1>
            <p className="text-gray-600">
              {segment} - {productFamily} | Which customers owe the most?
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-blue-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Total Outstanding</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">${Math.round(totalOutstanding / 1000)}K</p>
          <p className="text-sm text-blue-600">{filteredCustomers.length} customers</p>
        </div>

        <div className="border border-red-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-700">High Priority</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
          <p className="text-sm text-red-600">Customers need attention</p>
        </div>

        <div className="border border-yellow-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-yellow-700">Overdue Amount</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">${Math.round(overdueAmount / 1000)}K</p>
          <p className="text-sm text-yellow-600">{Math.round((overdueAmount / totalOutstanding) * 100)}% of total AR</p>
        </div>

        <div className="border border-green-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Avg DSO</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{Math.round(avgDSO)} days</p>
          <p className="text-sm text-green-600">Segment average</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <select
              value={selectedTrend}
              onChange={(e) => setSelectedTrend(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Trends</option>
              <option value="improving">Improving</option>
              <option value="stable">Stable</option>
              <option value="declining">Declining</option>
            </select>
          </div>
          
          {selectedCustomers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedCustomers.length} selected</span>
              <button 
                onClick={() => handleBulkAction('remind')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Send Reminder
              </button>
              <button 
                onClick={() => handleBulkAction('escalate')}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Escalate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Customer AR Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Customer AR Aging Analysis</h2>
            <p className="text-sm text-gray-600">Click any customer to view detailed payment profile</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCustomers(filteredCustomers.map(c => c.customerId));
                      } else {
                        setSelectedCustomers([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Outstanding</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Current</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">31-60d</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">61-90d</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">90+d</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Payment History</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Priority</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCustomerClick(customer.customerId)}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedCustomers.includes(customer.customerId)}
                      onChange={() => handleSelectCustomer(customer.customerId)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{customer.customerName}</div>
                      <div className="text-sm text-gray-500">{customer.segment}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-semibold text-gray-900">
                      ${Math.round(customer.totalOutstanding / 1000)}K
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.avgDaysOutstanding}d avg
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-green-600 font-medium">
                      ${Math.round(customer.current_0_30 / 1000)}K
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`font-medium ${customer.aging_31_60 > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                      ${Math.round(customer.aging_31_60 / 1000)}K
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`font-medium ${customer.aging_61_90 > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                      ${Math.round(customer.aging_61_90 / 1000)}K
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`font-medium ${customer.aging_90_plus > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                      ${Math.round(customer.aging_90_plus / 1000)}K
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {renderSparkline(customer.paymentHistory, customer.paymentTrend)}
                      <span className={`text-xs ${
                        customer.paymentTrend === 'improving' ? 'text-green-600' :
                        customer.paymentTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {customer.paymentTrend === 'improving' ? '↗' :
                         customer.paymentTrend === 'declining' ? '↘' : '→'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.priority === 'high' ? 'bg-red-100 text-red-800' :
                      customer.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {customer.priority === 'high' ? '🔴 High' :
                       customer.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Call Customer"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pareto Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Customer Concentration Analysis (80/20 Rule)</h2>
            <p className="text-sm text-gray-600">Top customers contributing to outstanding AR</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredCustomers
            .sort((a, b) => b.totalOutstanding - a.totalOutstanding)
            .slice(0, 5)
            .map((customer, index) => {
              const percentage = (customer.totalOutstanding / totalOutstanding) * 100;
              const cumulativePercentage = filteredCustomers
                .sort((a, b) => b.totalOutstanding - a.totalOutstanding)
                .slice(0, index + 1)
                .reduce((sum, c) => sum + c.totalOutstanding, 0) / totalOutstanding * 100;
              
              return (
                <div key={customer.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{customer.customerName}</span>
                      <span className="text-sm text-gray-600">
                        ${Math.round(customer.totalOutstanding / 1000)}K ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round(cumulativePercentage)}% cumulative
                  </div>
                </div>
              );
            })}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Insight:</strong> Top 3 customers represent {Math.round(
              filteredCustomers
                .sort((a, b) => b.totalOutstanding - a.totalOutstanding)
                .slice(0, 3)
                .reduce((sum, c) => sum + c.totalOutstanding, 0) / totalOutstanding * 100
            )}% of outstanding AR balance
          </p>
        </div>
      </div>
    </div>
  );
}
