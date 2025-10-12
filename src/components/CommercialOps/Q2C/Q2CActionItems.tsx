'use client';

import { useState, useEffect } from 'react';
import { Q2CCycleDrillDownService, type Q2CLevel3TransactionDetail } from '@/services/q2cDrillDownService';
import { ArrowLeft, Phone, Mail, Clock, AlertTriangle, CheckCircle, DollarSign, Calendar, User, Building, Search, Filter, Download, MoreHorizontal } from '@/utils/iconMapping';

interface Q2CActionItemsProps {
  onBack: () => void;
}

interface ActionItem {
  id: string;
  type: 'critical' | 'urgent' | 'follow-up';
  title: string;
  description: string;
  customer: string;
  daysOverdue: number;
  amount: number;
  owner: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  actions: string[];
}

export default function Q2CActionItems({ onBack }: Q2CActionItemsProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchActionItems = async () => {
      setLoading(true);
      try {
        // Get critical transactions from all segments
        const segments = ['Enterprise', 'Mid-Market', 'SMB'];
        const products = ['Meraki', 'Duo', 'Umbrella', 'Splunk'];
        
        const allTransactions: Q2CLevel3TransactionDetail[] = [];
        
        for (const segment of segments) {
          for (const product of products) {
            const transactions = Q2CCycleDrillDownService.getLevel3TransactionDetails(segment, product);
            allTransactions.push(...transactions);
          }
        }

        // Convert to action items
        const items: ActionItem[] = allTransactions
          .filter(t => t.status === 'critical' || t.status === 'warning')
          .map(transaction => ({
            id: transaction.customerId,
            type: (transaction.status === 'critical' ? 'critical' : 
                  transaction.totalDays > 50 ? 'urgent' : 'follow-up') as 'critical' | 'urgent' | 'follow-up',
            title: `${transaction.customerName} - Payment Collection`,
            description: `${transaction.productFamily} deal stuck in ${transaction.currentStage} for ${transaction.totalDays} days`,
            customer: transaction.customerName,
            daysOverdue: transaction.totalDays - 45, // Assuming 45 day target
            amount: transaction.invoiceAmount,
            owner: transaction.owner,
            dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: transaction.priority,
            actions: transaction.status === 'critical' 
              ? ['Call Customer', 'Escalate to CSM', 'Review Credit Terms']
              : ['Send Reminder', 'Follow Up', 'Check Payment Status']
          }))
          .sort((a, b) => b.daysOverdue - a.daysOverdue);

        setActionItems(items);
      } catch (error) {
        console.error('Error fetching Q2C action items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActionItems();
  }, []);

  const filteredItems = actionItems.filter(item => {
    const matchesSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleActionClick = (itemId: string, action: string) => {
    console.log(`Action ${action} clicked for item ${itemId}`);
    // Implement specific action logic here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const criticalCount = actionItems.filter(item => item.type === 'critical').length;
  const urgentCount = actionItems.filter(item => item.type === 'urgent').length;
  const totalValue = actionItems.reduce((sum, item) => sum + item.amount, 0);

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
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Q2C Cycle Time - Action Items</h1>
            <p className="text-gray-600">Critical actions required to improve cycle time</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Export Actions
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-gray-700">Critical Actions</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
          <p className="text-sm text-gray-600">Require immediate attention</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-gray-700">Urgent Actions</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{urgentCount}</p>
          <p className="text-sm text-gray-600">Due within 48 hours</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-gray-700">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">${Math.round(totalValue / 1000)}K</p>
          <p className="text-sm text-gray-600">Revenue at risk</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4" style={{ backgroundColor: '#F3F3F3' }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium text-gray-700">Avg Cycle Time</span>
          </div>
          <p className="text-2xl font-bold text-green-600">48</p>
          <p className="text-sm text-gray-600">days (target: 45)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search action items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    item.type === 'critical' ? 'bg-red-500' :
                    item.type === 'urgent' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.type === 'critical' ? 'bg-red-100 text-red-800' :
                    item.type === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Customer:</span>
                    <div className="font-medium text-gray-900">{item.customer}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Days Overdue:</span>
                    <div className={`font-medium ${
                      item.daysOverdue > 15 ? 'text-red-600' :
                      item.daysOverdue > 5 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {item.daysOverdue > 0 ? `+${item.daysOverdue}` : item.daysOverdue}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <div className="font-medium text-gray-900">${Math.round(item.amount / 1000)}K</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Owner:</span>
                    <div className="font-medium text-gray-900">{item.owner}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-6">
                {item.actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    onClick={() => handleActionClick(item.id, action)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      actionIndex === 0 
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Action Items</h3>
          <p className="text-gray-600">All Q2C cycle time issues have been resolved!</p>
        </div>
      )}

      {/* Quick Actions Panel */}
      <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Phone className="h-5 w-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Bulk Call Critical</div>
              <div className="text-sm text-gray-600">Call all critical customers</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Send Reminders</div>
              <div className="text-sm text-gray-600">Email payment reminders</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Building className="h-5 w-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Escalate High Value</div>
              <div className="text-sm text-gray-600">Escalate to management</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
