'use client';

import { useState, useEffect } from 'react';
import { DSODrillDownService, type DSOAgingBucketDetail } from '@/services/dsoDrillDownService';
import { X, DollarSign, FileText, Calendar, AlertCircle } from '@/utils/iconMapping';

interface DSOAgingBucketDetailModalProps {
  productFamily: string;
  bucketName: string;
  minDays: number;
  maxDays: number;
  onClose: () => void;
}

export default function DSOAgingBucketDetailModal({
  productFamily,
  bucketName,
  minDays,
  maxDays,
  onClose
}: DSOAgingBucketDetailModalProps) {
  const [data, setData] = useState<DSOAgingBucketDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const bucketData = DSODrillDownService.getAgingBucketDetail(productFamily, minDays, maxDays);
        setData(bucketData);
      } catch (error) {
        console.error('Error fetching aging bucket detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productFamily, minDays, maxDays]);

  const totalAR = data.reduce((sum, customer) => sum + customer.totalOutstanding, 0);
  const totalCustomers = data.length;
  const totalInvoices = data.reduce((sum, customer) => sum + customer.invoices.length, 0);

  return (
    <>
      {/* Modal - Popup without backdrop */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out pointer-events-auto border-4 border-blue-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {productFamily} - {bucketName} Aging Bucket
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Customers and invoices with {minDays}-{maxDays === 999 ? '+' : maxDays} days outstanding
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200" style={{ backgroundColor: '#F3F3F3' }}>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">Total AR</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                ${Math.round(totalAR / 1000)}K
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-600">Customers</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{totalCustomers}</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Invoices</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{totalInvoices}</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No customers found in this aging bucket</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.map((customer) => (
                  <div
                    key={customer.customerId}
                    className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                    style={{ backgroundColor: '#F3F3F3' }}
                  >
                    {/* Customer Header */}
                    <button
                      onClick={() => setExpandedCustomer(
                        expandedCustomer === customer.customerId ? null : customer.customerId
                      )}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white hover:bg-opacity-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">
                              {customer.customerName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-gray-900">{customer.customerName}</h3>
                          <p className="text-sm text-gray-600">{customer.invoices.length} invoice{customer.invoices.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Outstanding</p>
                          <p className="text-2xl font-bold text-red-600">
                            ${Math.round(customer.totalOutstanding).toLocaleString()}
                          </p>
                        </div>
                        <div className={`transform transition-transform ${expandedCustomer === customer.customerId ? 'rotate-180' : ''}`}>
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Invoice List (Expandable) */}
                    {expandedCustomer === customer.customerId && (
                      <div className="px-6 pb-4 bg-white">
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Invoice Details</h4>
                          <div className="space-y-2">
                            {customer.invoices.map((invoice) => (
                              <div
                                key={invoice.invoiceId}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                      </span>
                                      <span className={`px-2 py-1 rounded ${
                                        invoice.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                        invoice.status === 'Disputed' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                      }`}>
                                        {invoice.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                  <p className="text-lg font-bold text-gray-900">
                                    ${Math.round(invoice.amount).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {invoice.daysOutstanding} days old
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
