'use client';

import { useState, useEffect } from 'react';
import { enhancedDrillDownService, QuoteToCashDrillDown, type UniversalFilters, type Level3TransactionDetail } from '@/services/enhancedDrillDownService';
import { ArrowLeft, Phone, Mail, Clock, AlertTriangle, CheckCircle, DollarSign, Calendar, User, Building, Search, Filter, Download, MoreHorizontal } from '@/utils/iconMapping';

interface Level3TransactionDetailProps {
  kpiId: string;
  context: any;
  onBack: () => void;
  onDrillToLevel4: (context: any) => void;
}

export default function Level3TransactionDetail({ kpiId, context, onBack, onDrillToLevel4 }: Level3TransactionDetailProps) {
  const [transactionData, setTransactionData] = useState<Level3TransactionDetail[]>([]);
  const [filteredData, setFilteredData] = useState<Level3TransactionDetail[]>([]);
  const [filters, setFilters] = useState<UniversalFilters>(enhancedDrillDownService.getFilters());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'good' | 'warning' | 'critical'>('all');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data: Level3TransactionDetail[] = [];
        
        if (kpiId === 'quote-to-cash-cycle') {
          data = QuoteToCashDrillDown.getLevel3TransactionDetails(context?.segment || '', filters);
        }
        
        setTransactionData(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching Level 3 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kpiId, context, filters]);

  useEffect(() => {
    let filtered = transactionData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [transactionData, searchTerm, statusFilter]);

  const handleTransactionClick = (transaction: Level3TransactionDetail) => {
    onDrillToLevel4({ transactionId: transaction.id, transactionData: transaction });
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on transactions:`, selectedTransactions);
    // Implement bulk actions
  };

  const toggleTransactionSelection = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const selectAllTransactions = () => {
    setSelectedTransactions(
      selectedTransactions.length === filteredData.length 
        ? [] 
        : filteredData.map(t => t.id)
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      good: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      good: 'On Track',
      warning: 'At Risk',
      critical: 'Critical'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPriorityColor = (days: number) => {
    if (days <= 20) return 'text-green-600';
    if (days <= 35) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Segment Analysis
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
                <p className="text-gray-600">
                  {context?.segment} - Which specific deals are stuck in payment collection?
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Critical Deals</p>
                <p className="text-lg font-bold text-red-600">
                  {filteredData.filter(t => t.status === 'critical').length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(filteredData.reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="px-8 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers or quote IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="critical">Critical</option>
                <option value="warning">At Risk</option>
                <option value="good">On Track</option>
              </select>

              <div className="text-sm text-gray-500">
                {filteredData.length} of {transactionData.length} transactions
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Bulk Actions */}
              {selectedTransactions.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedTransactions.length} selected</span>
                  <button
                    onClick={() => handleBulkAction('send-reminder')}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Send Reminder
                  </button>
                  <button
                    onClick={() => handleBulkAction('escalate')}
                    className="px-3 py-1 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
                  >
                    Escalate
                  </button>
                </div>
              )}

              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Interactive Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.length === filteredData.length && filteredData.length > 0}
                      onChange={selectAllTransactions}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Quote ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Quote Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Days</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Stage</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Owner</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((transaction, index) => (
                  <tr 
                    key={transaction.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={() => toggleTransactionSelection(transaction.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.customer}</p>
                          <p className="text-sm text-gray-500">Customer</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-blue-600">{transaction.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{transaction.product}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{formatDate(transaction.date)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {getStatusIcon(transaction.status)}
                        <span className={`text-lg font-bold ${getPriorityColor(transaction.days)}`}>
                          {transaction.days}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{transaction.stage}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{transaction.owner}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        {transaction.actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title={action}
                          >
                            {action.includes('Call') && <Phone className="h-4 w-4" />}
                            {action.includes('Email') && <Mail className="h-4 w-4" />}
                            {action.includes('Escalate') && <AlertTriangle className="h-4 w-4" />}
                          </button>
                        ))}
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No transactions found</p>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Critical Deals</h3>
            <p className="text-3xl font-bold mb-1">
              {filteredData.filter(t => t.status === 'critical').length}
            </p>
            <p className="text-red-100">requiring immediate action</p>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">At Risk</h3>
            <p className="text-3xl font-bold mb-1">
              {filteredData.filter(t => t.status === 'warning').length}
            </p>
            <p className="text-yellow-100">need monitoring</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Average Days</h3>
            <p className="text-3xl font-bold mb-1">
              {(filteredData.reduce((sum, t) => sum + t.days, 0) / filteredData.length || 0).toFixed(1)}
            </p>
            <p className="text-blue-100">payment collection time</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Value</h3>
            <p className="text-3xl font-bold mb-1">
              {formatCurrency(filteredData.reduce((sum, t) => sum + t.amount, 0) / 1000000)}M
            </p>
            <p className="text-green-100">in affected deals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
