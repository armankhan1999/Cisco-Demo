'use client';

import { useState, useEffect } from 'react';
import { Q2CCycleDrillDownService, type Q2CLevel3TransactionDetail } from '@/services/q2cDrillDownService';
import { ArrowLeft, Phone, Mail, Clock, AlertTriangle, CheckCircle, DollarSign, Calendar, User, Building, Search, Filter, Download, MoreHorizontal } from '@/utils/iconMapping';

interface Q2CLevel3TransactionDetailProps {
  segment: string;
  productFamily: string;
  onBack: () => void;
  onDrillToLevel4: (customerId: string) => void;
}

export default function Q2CLevel3TransactionDetail({ segment, productFamily, onBack, onDrillToLevel4 }: Q2CLevel3TransactionDetailProps) {
  const [transactionData, setTransactionData] = useState<Q2CLevel3TransactionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = Q2CCycleDrillDownService.getLevel3TransactionDetails(segment, productFamily);
        setTransactionData(data);
      } catch (error) {
        console.error('Error fetching Q2C Level 3 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [segment, productFamily]);

  const handleTransactionClick = (customerId: string) => {
    onDrillToLevel4(customerId);
  };

  const handleSelectTransaction = (customerId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for transactions:`, selectedTransactions);
    // Implement bulk actions here
  };

  const filteredTransactions = transactionData.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.productFamily.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || transaction.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const criticalCount = transactionData.filter(t => t.status === 'critical').length;
  const warningCount = transactionData.filter(t => t.status === 'warning').length;
  const totalValue = transactionData.reduce((sum, t) => sum + t.invoiceAmount, 0);

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
            Back to Segment Analysis
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{segment} - {productFamily} Transactions</h1>
            <p className="text-gray-600">Which specific deals are stuck?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-red-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-700">Critical</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
          <p className="text-sm text-red-600">Deals &gt;60 days or incomplete</p>
        </div>

        <div className="border border-yellow-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-yellow-700">At Risk</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
          <p className="text-sm text-yellow-600">Deals 45-60 days</p>
        </div>

        <div className="border border-blue-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">${Math.round(totalValue / 1000)}K</p>
          <p className="text-sm text-blue-600">Revenue at risk</p>
        </div>

        <div className="border border-green-200 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Total Deals</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{filteredTransactions.length}</p>
          <p className="text-sm text-green-600">Requiring attention</p>
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
          </div>
          
          {selectedTransactions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedTransactions.length} selected</span>
              <button
                onClick={() => handleBulkAction('contact')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Bulk Contact
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

      {/* Transaction Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
              <p className="text-sm text-gray-600">Click any row for root cause analysis</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Showing {filteredTransactions.length} of {transactionData.length} transactions</span>
              <span>•</span>
              <span className="text-red-600">{criticalCount} critical</span>
              <span>•</span>
              <span className="text-yellow-600">{warningCount} at risk</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTransactions(filteredTransactions.map(t => t.customerId));
                      } else {
                        setSelectedTransactions([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Quote Date</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Days</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Owner</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Health</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleTransactionClick(transaction.customerId)}
                >
                  <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.customerId)}
                      onChange={() => handleSelectTransaction(transaction.customerId)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.status === 'critical' ? 'bg-red-500' :
                        transaction.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.customerName}</div>
                        <div className="text-sm text-gray-600">{transaction.customerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{transaction.productFamily}</td>
                  <td className="py-4 px-4 text-gray-600">{transaction.quoteDate}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`font-bold ${
                      transaction.status === 'critical' ? 'text-red-600' :
                      transaction.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {transaction.totalDays}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.currentStage === 'paid' ? 'bg-green-100 text-green-800' :
                      transaction.currentStage === 'payment' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.currentStage}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{transaction.owner}</td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    ${Math.round(transaction.invoiceAmount / 1000)}K
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        (transaction.healthScore || 0) >= 80 ? 'bg-green-500' :
                        (transaction.healthScore || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {transaction.healthScore || '--'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Phone className="h-5 w-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Contact All Critical</div>
              <div className="text-sm text-gray-600">Call {criticalCount} customers</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Send Payment Reminders</div>
              <div className="text-sm text-gray-600">Email overdue accounts</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Building className="h-5 w-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Escalate to CSM</div>
              <div className="text-sm text-gray-600">High-value accounts</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
