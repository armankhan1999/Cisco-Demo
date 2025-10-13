'use client';

import { useState, useEffect } from 'react';
import { getLevel3InvoiceDetails, type DSOInvoiceDetail } from '@/services/dsoRealDataService';
import { ArrowLeft, Search, Phone, Mail, AlertTriangle, FileText, Calendar, DollarSign } from '@/utils/iconMapping';

interface NewDSOLevel3InvoiceDetailProps {
  segment: string;
  geography: string;
  productFamily: string;
  onBack: () => void;
}

export default function NewDSOLevel3InvoiceDetail({
  segment,
  geography,
  productFamily,
  onBack
}: NewDSOLevel3InvoiceDetailProps) {
  const [invoiceData, setInvoiceData] = useState<DSOInvoiceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAgingBucket, setSelectedAgingBucket] = useState<string>('all');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = getLevel3InvoiceDetails(segment, geography, productFamily);
        setInvoiceData(data);
      } catch (error) {
        console.error('Error fetching DSO Level 3 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [segment, geography, productFamily]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter invoices
  const filteredInvoices = invoiceData.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || invoice.collectionsStatus === selectedStatus;
    const matchesAging = selectedAgingBucket === 'all' || invoice.agingBucket === selectedAgingBucket;
    return matchesSearch && matchesStatus && matchesAging;
  });

  // Calculate metrics
  const totalOutstanding = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const avgDSO = filteredInvoices.length > 0
    ? filteredInvoices.reduce((sum, inv) => sum + inv.daysOutstanding, 0) / filteredInvoices.length
    : 0;
  const overdueInvoices = filteredInvoices.filter(inv => inv.daysOutstanding > 30).length;
  const disputedInvoices = filteredInvoices.filter(inv => inv.isDisputed).length;

  // Get unique values for filters
  const collectionStatuses = Array.from(new Set(invoiceData.map(inv => inv.collectionsStatus))).sort();
  const agingBuckets = ['current', '31-60', '61-90', '90+'];

  // Bulk action handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(filteredInvoices.map(inv => inv.invoiceId));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev =>
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for invoices:`, selectedInvoices);
    // Implement bulk actions
    alert(`${action} action for ${selectedInvoices.length} invoices`);
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
            Back to Segments
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transactional Invoice Detail & Actions
            </h1>
            <p className="text-gray-600">
              {segment} - {geography} - {productFamily} | What specific invoices require action?
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Total Outstanding</h3>
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">${Math.round(totalOutstanding / 1000)}K</p>
          <p className="text-xs text-gray-500 mb-3">{filteredInvoices.length} invoices</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Avg DSO</h3>
            <Calendar className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{Math.round(avgDSO)} days</p>
          <p className="text-xs text-gray-500 mb-3">Average days outstanding</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${avgDSO <= 35 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min((avgDSO / 60) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Overdue</h3>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{overdueInvoices}</p>
          <p className="text-xs text-gray-500 mb-3">Invoices past due</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-yellow-500"
              style={{ width: `${Math.min((overdueInvoices / filteredInvoices.length) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-5 shadow-sm" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Disputed</h3>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{disputedInvoices}</p>
          <p className="text-xs text-gray-500 mb-3">Invoices in dispute</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-red-500"
              style={{ width: `${Math.min((disputedInvoices / filteredInvoices.length) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by invoice number or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            {collectionStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={selectedAgingBucket}
            onChange={(e) => setSelectedAgingBucket(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Aging Buckets</option>
            {agingBuckets.map(bucket => (
              <option key={bucket} value={bucket}>{bucket} days</option>
            ))}
          </select>

          {selectedInvoices.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-medium">{selectedInvoices.length} selected</span>
              <button
                onClick={() => handleBulkAction('Send Reminder')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
              >
                <Mail className="h-3 w-3 inline mr-1" />
                Send Reminder
              </button>
              <button
                onClick={() => handleBulkAction('Escalate')}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs"
              >
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Escalate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
            <p className="text-sm text-gray-600">All outstanding invoices for selected segment and geography</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Invoice #</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Customer</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Days Out</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Aging</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Due Date</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Assigned To</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.invoiceId}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    invoice.isDisputed ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice.invoiceId)}
                      onChange={() => handleSelectInvoice(invoice.invoiceId)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm">{invoice.invoiceNumber}</span>
                      {invoice.isDisputed && (
                        <AlertTriangle className="h-3 w-3 text-red-500" title={invoice.disputeReason} />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-700 text-sm">{invoice.customerName}</div>
                    <div className="text-xs text-gray-500">{invoice.customerId}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-semibold text-gray-900 text-sm">
                      ${Math.round(invoice.amount).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`font-semibold text-sm ${
                      invoice.daysOutstanding > 90 ? 'text-red-600' :
                      invoice.daysOutstanding > 60 ? 'text-orange-600' :
                      invoice.daysOutstanding > 30 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {invoice.daysOutstanding} days
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                      invoice.agingBucket === 'current' ? 'bg-green-100 text-green-800' :
                      invoice.agingBucket === '31-60' ? 'bg-yellow-100 text-yellow-800' :
                      invoice.agingBucket === '61-90' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.agingBucket}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-700 text-sm">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                      invoice.collectionsStatus === 'Current' ? 'bg-green-100 text-green-800' :
                      invoice.collectionsStatus === 'Reminder Sent' ? 'bg-yellow-100 text-yellow-800' :
                      invoice.collectionsStatus === 'Follow-up Pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.collectionsStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-700 text-sm">{invoice.assignedTo}</div>
                  </td>
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Call Customer"
                      >
                        <Phone className="h-3 w-3" />
                      </button>
                      <button
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Send Email"
                      >
                        <Mail className="h-3 w-3" />
                      </button>
                      <button
                        className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded"
                        title="View Details"
                      >
                        <FileText className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-xs">No invoices match the selected filters</p>
          </div>
        )}
      </div>

      {/* Action Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h4 className="text-sm font-semibold text-red-800">Critical - 90+ Days</h4>
            </div>
            <p className="text-xs text-red-600 mb-3">
              {filteredInvoices.filter(inv => inv.daysOutstanding > 90).length} invoices need immediate escalation
            </p>
            <button className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs">
              Escalate All
            </button>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-yellow-500" />
              <h4 className="text-sm font-semibold text-yellow-800">Follow-up Needed</h4>
            </div>
            <p className="text-xs text-yellow-600 mb-3">
              {filteredInvoices.filter(inv => inv.daysOutstanding > 60 && inv.daysOutstanding <= 90).length} invoices awaiting response
            </p>
            <button className="w-full px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs">
              Send Reminders
            </button>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-5 w-5 text-blue-500" />
              <h4 className="text-sm font-semibold text-blue-800">Proactive Outreach</h4>
            </div>
            <p className="text-xs text-blue-600 mb-3">
              {filteredInvoices.filter(inv => inv.daysOutstanding > 30 && inv.daysOutstanding <= 60).length} invoices for proactive contact
            </p>
            <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs">
              Schedule Calls
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
