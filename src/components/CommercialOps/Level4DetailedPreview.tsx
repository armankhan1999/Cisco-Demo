'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Printer, Share, Calendar, User, DollarSign, FileText, AlertCircle, CheckCircle, Clock, Phone, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface Level4DetailedPreviewProps {
  itemType: 'invoice' | 'quote' | 'account' | 'contract';
  itemId: string;
  onBack: () => void;
}

interface InvoiceLineItem {
  product: string;
  quantity: number;
  unit_price: number;
  total: number;
  billing_period: string;
}

interface PaymentHistory {
  date: string;
  amount: number;
  method: string;
  status: string;
}

export default function Level4DetailedPreview({ itemType, itemId, onBack }: Level4DetailedPreviewProps) {
  const [itemData, setItemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadItemDetails();
  }, [itemType, itemId]);

  const loadItemDetails = async () => {
    setLoading(true);
    try {
      // Simulate loading detailed item data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock detailed data based on item type
      const mockData = generateMockItemData(itemType, itemId);
      setItemData(mockData);
    } catch (error) {
      console.error('Error loading item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockItemData = (type: string, id: string) => {
    switch (type) {
      case 'invoice':
        return {
          invoice_number: 'INV-2025-03-124',
          customer_name: 'MegaCorp Solutions',
          customer_tier: 'Strategic',
          invoice_amount: 425000,
          tax_amount: 34000,
          total_amount: 459000,
          amount_outstanding: 425000,
          days_overdue: 67,
          dispute_reason: 'Usage calculation discrepancy - customer claims lower utilization than billed',
          dispute_status: 'Under Review',
          payment_terms: 'Net 30',
          invoice_date: '2025-03-15',
          due_date: '2025-04-14',
          line_items: [
            { product: 'Cisco Duo Security', quantity: 5000, unit_price: 48, total: 240000, billing_period: 'Annual' },
            { product: 'Cisco Umbrella DNS', quantity: 5000, unit_price: 24, total: 120000, billing_period: 'Annual' },
            { product: 'ThousandEyes Monitoring', quantity: 100, unit_price: 650, total: 65000, billing_period: 'Annual' }
          ],
          payment_history: [
            { date: '2025-02-15', amount: 34000, method: 'Wire Transfer', status: 'Completed' },
            { date: '2025-01-15', amount: 425000, method: 'ACH', status: 'Failed' }
          ],
          usage_data: [
            { month: 'Jan 2025', duo_users: 4850, umbrella_queries: 2.1, thousandeyes_tests: 95 },
            { month: 'Feb 2025', duo_users: 4920, umbrella_queries: 2.3, thousandeyes_tests: 98 },
            { month: 'Mar 2025', duo_users: 4780, umbrella_queries: 1.9, thousandeyes_tests: 92 }
          ],
          customer_contacts: [
            { name: 'John Smith', role: 'IT Director', email: 'john.smith@megacorp.com', phone: '+1-555-0123' },
            { name: 'Sarah Johnson', role: 'Procurement Manager', email: 'sarah.j@megacorp.com', phone: '+1-555-0124' }
          ]
        };
      
      case 'quote':
        return {
          quote_number: 'QUO-2025-1847',
          customer_name: 'Acme Corporation',
          customer_tier: 'Enterprise',
          total_amount: 285000,
          arr_value: 285000,
          quote_status: 'pending_approval',
          days_pending: 8,
          approver: 'Dir, Sales Ops',
          risk_level: 'high',
          product_families: ['Duo', 'Umbrella', 'ThousandEyes'],
          contract_term: 24,
          approval_workflow: [
            { stage: 'Sales Rep Submission', status: 'completed', date: '2025-04-01', approver: 'Mike Chen' },
            { stage: 'Sales Manager Review', status: 'completed', date: '2025-04-02', approver: 'Lisa Wang' },
            { stage: 'Pricing Approval', status: 'pending', date: null, approver: 'Dir, Sales Ops' },
            { stage: 'Legal Review', status: 'pending', date: null, approver: 'Legal Team' },
            { stage: 'Final Approval', status: 'pending', date: null, approver: 'VP, Sales' }
          ],
          competitive_analysis: {
            competitors: ['Microsoft', 'Okta', 'Zscaler'],
            win_probability: 75,
            key_differentiators: ['Integrated security platform', 'Better pricing', 'Existing relationship']
          }
        };
      
      default:
        return null;
    }
  };

  const renderInvoiceDetails = () => (
    <div className="space-y-8">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <span className="text-sm font-medium text-red-600">DISPUTED</span>
          </div>
          <p className="text-2xl font-bold text-red-900">${itemData.amount_outstanding.toLocaleString()}</p>
          <p className="text-sm text-red-700">Outstanding Amount</p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">OVERDUE</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{itemData.days_overdue}</p>
          <p className="text-sm text-orange-700">Days Past Due</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">CUSTOMER</span>
          </div>
          <p className="text-lg font-bold text-blue-900">{itemData.customer_name}</p>
          <p className="text-sm text-blue-700">{itemData.customer_tier} Tier</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'line-items', 'usage', 'payments', 'contacts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Invoice Information</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Invoice Number</dt>
                  <dd className="text-sm font-medium text-gray-900">{itemData.invoice_number}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Invoice Date</dt>
                  <dd className="text-sm font-medium text-gray-900">{itemData.invoice_date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Due Date</dt>
                  <dd className="text-sm font-medium text-gray-900">{itemData.due_date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Payment Terms</dt>
                  <dd className="text-sm font-medium text-gray-900">{itemData.payment_terms}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="font-semibold text-red-900 mb-4">Dispute Details</h4>
              <p className="text-sm text-red-700 mb-3">{itemData.dispute_reason}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-red-900">Status:</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">{itemData.dispute_status}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Amount Breakdown</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">${itemData.invoice_amount.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Tax</dt>
                  <dd className="text-sm font-medium text-gray-900">${itemData.tax_amount.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-bold text-gray-900">${itemData.total_amount.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-red-600">Outstanding</dt>
                  <dd className="text-sm font-bold text-red-600">${itemData.amount_outstanding.toLocaleString()}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Phone className="h-4 w-4" />
                  Schedule Collection Call
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Mail className="h-4 w-4" />
                  Send Dispute Resolution Email
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  <FileText className="h-4 w-4" />
                  Generate Usage Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'line-items' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">Invoice Line Items</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Billing Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {itemData.line_items.map((item: InvoiceLineItem, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.product}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${item.unit_price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.billing_period}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-6">Usage Analytics</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={itemData.usage_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="duo_users" stroke="#3B82F6" name="Duo Users" />
                <Line type="monotone" dataKey="umbrella_queries" stroke="#10B981" name="Umbrella Queries (M)" />
                <Line type="monotone" dataKey="thousandeyes_tests" stroke="#F59E0B" name="ThousandEyes Tests" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading detailed view...</p>
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
                <span>Back to Actions</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  {itemType === 'invoice' ? `Invoice ${itemData?.invoice_number}` : `${itemType} Details`}
                </h1>
                <p className="text-gray-600 mt-1">Detailed analysis and action center</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Share className="h-4 w-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {itemType === 'invoice' && renderInvoiceDetails()}
      </div>
    </div>
  );
}
