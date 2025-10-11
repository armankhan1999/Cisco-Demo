'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { AlertTriangle, Eye, Phone, Mail, FileText, DollarSign, Clock, User, ChevronRight, X, Download } from 'lucide-react';
import { 
  getDetailedDisputedInvoices, 
  getDetailedPendingQuotes, 
  getDetailedHighDSOAccounts,
  getRevenueRecognitionAlerts,
  type DetailedInvoice,
  type DetailedQuote,
  type DetailedARAccount,
  type RevenueRecognitionAlert
} from '@/services/enhancedExceptionService';

interface EnhancedExceptionAlertsProps {
  onDrillDown?: (type: string, id: string) => void;
}

export default function EnhancedExceptionAlerts({ onDrillDown }: EnhancedExceptionAlertsProps) {
  const [disputedInvoices, setDisputedInvoices] = useState<DetailedInvoice[]>([]);
  const [pendingQuotes, setPendingQuotes] = useState<DetailedQuote[]>([]);
  const [highDSOAccounts, setHighDSOAccounts] = useState<DetailedARAccount[]>([]);
  const [revenueAlerts, setRevenueAlerts] = useState<RevenueRecognitionAlert[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<DetailedInvoice | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<DetailedQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExceptionData = async () => {
      try {
        const [invoices, quotes, accounts, alerts] = await Promise.all([
          getDetailedDisputedInvoices(),
          getDetailedPendingQuotes(),
          getDetailedHighDSOAccounts(),
          getRevenueRecognitionAlerts()
        ]);
        
        setDisputedInvoices(invoices);
        setPendingQuotes(quotes);
        setHighDSOAccounts(accounts);
        setRevenueAlerts(alerts);
      } catch (error) {
        console.error('Error loading exception data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExceptionData();
  }, []);

  const renderInvoicePreview = (invoice: DetailedInvoice) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Invoice Details - {invoice.invoice_number}</h3>
          <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer</label>
                <p className="text-lg font-semibold text-gray-900">{invoice.customer_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Invoice Amount</label>
                <p className="text-2xl font-bold text-green-600">${invoice.invoice_amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Outstanding Amount</label>
                <p className="text-xl font-bold text-red-600">${invoice.amount_outstanding.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Dispute Status</label>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-red-700">{invoice.dispute_status || 'Active Dispute'}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Days Overdue</label>
                <p className="text-lg font-semibold text-orange-600">{invoice.days_overdue} days</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                <p className="text-lg text-gray-700">{invoice.payment_terms}</p>
              </div>
            </div>
          </div>

          {/* Dispute Details */}
          {invoice.dispute_reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">Dispute Reason</h4>
              <p className="text-red-700">{invoice.dispute_reason}</p>
            </div>
          )}

          {/* Business Impact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Business Impact</h4>
            <p className="text-blue-700">{invoice.business_impact}</p>
          </div>

          {/* Recommended Actions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">Recommended Actions</h4>
            <ul className="space-y-2">
              {invoice.recommended_actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-green-700">
                  <ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Phone className="h-4 w-4" />
              Call Customer
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Mail className="h-4 w-4" />
              Send Email
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              <Download className="h-4 w-4" />
              Export Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Disputed Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Disputed Invoices ({disputedInvoices.length})
            </h3>
            <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full">
              ${disputedInvoices.reduce((sum, inv) => sum + inv.amount_outstanding, 0).toLocaleString()} at risk
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {disputedInvoices.slice(0, 5).map((invoice, index) => (
            <div key={`disputed-invoice-${invoice.invoice_id}-${index}`} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{invoice.invoice_number}</span>
                    <span className="text-sm text-gray-600">{invoice.customer_name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.days_overdue > 60 ? 'bg-red-100 text-red-800' :
                      invoice.days_overdue > 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {invoice.days_overdue} days overdue
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>${invoice.amount_outstanding.toLocaleString()} outstanding</span>
                    <span>•</span>
                    <span>{invoice.dispute_reason || 'Dispute pending review'}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedInvoice(invoice)}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Quotes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Quotes Requiring Action ({pendingQuotes.length})
            </h3>
            <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
              ${pendingQuotes.reduce((sum, quote) => sum + quote.arr_value, 0).toLocaleString()} ARR pending
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {pendingQuotes.slice(0, 5).map((quote, index) => (
            <div key={`pending-quote-${quote.quote_id}-${index}`} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{quote.quote_number}</span>
                    <span className="text-sm text-gray-600">{quote.customer_name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quote.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                      quote.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {quote.risk_level} risk
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>${quote.arr_value.toLocaleString()} ARR</span>
                    <span>•</span>
                    <span>{quote.days_pending} days pending</span>
                    <span>•</span>
                    <span>{quote.approver}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedQuote(quote)}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High DSO Accounts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              High DSO Accounts ({highDSOAccounts.length})
            </h3>
            <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Avg {Math.round(highDSOAccounts.reduce((sum, acc) => sum + acc.avg_days_outstanding, 0) / highDSOAccounts.length)} days
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {highDSOAccounts.slice(0, 5).map((account, index) => (
            <div key={`dso-account-${account.customer_id}-${index}`} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{account.customer_name}</span>
                    <span className="text-sm text-gray-600">{account.customer_tier}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      account.payment_behavior === 'poor' ? 'bg-red-100 text-red-800' :
                      account.payment_behavior === 'concerning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {account.payment_behavior}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>${account.total_ar_balance.toLocaleString()} AR balance</span>
                    <span>•</span>
                    <span>{account.avg_days_outstanding} days DSO</span>
                    <span>•</span>
                    <span>Risk score: {account.risk_score}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onDrillDown?.('dso-account', account.customer_id)}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                  Analyze
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Recognition Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Revenue Recognition Alerts ({revenueAlerts.length})
            </h3>
            <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
              ${revenueAlerts.reduce((sum, alert) => sum + alert.impact_amount, 0).toLocaleString()} variance
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {revenueAlerts.slice(0, 5).map((alert, index) => (
            <div key={`revenue-alert-${alert.schedule_id}-${index}`} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{alert.customer_name}</span>
                    <span className="text-sm text-gray-600">{alert.issue_type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      alert.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.urgency} urgency
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>${alert.impact_amount.toLocaleString()} variance</span>
                    <span>•</span>
                    <span>{alert.variance_percentage}% difference</span>
                    <span>•</span>
                    <span>{alert.resolution_needed}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onDrillDown?.('revenue-alert', alert.schedule_id)}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {selectedInvoice && renderInvoicePreview(selectedInvoice)}
    </div>
  );
}
