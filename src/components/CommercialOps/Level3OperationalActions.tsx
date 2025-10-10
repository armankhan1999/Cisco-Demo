'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Clock, DollarSign, User, Phone, Mail, FileText, CheckCircle, XCircle, RefreshCw, Filter, Search, Calendar, Bell } from 'lucide-react';
import { drillDownService, type KPIDrillDown } from '@/services/drillDownService';

interface Level3OperationalActionsProps {
  kpiId: string;
  actionId?: string;
  onBack: () => void;
}

interface ActionItem {
  id: string;
  type: 'quote' | 'invoice' | 'account' | 'contract';
  title: string;
  customer: string;
  amount: number;
  daysOverdue: number;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  nextAction: string;
  businessImpact: string;
}

export default function Level3OperationalActions({ kpiId, actionId, onBack }: Level3OperationalActionsProps) {
  const [kpiDrillDown, setKpiDrillDown] = useState<KPIDrillDown | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    assignee: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const drillDown = drillDownService.getKPIDrillDown(kpiId);
    if (drillDown) {
      setKpiDrillDown(drillDown);
      loadActionItems(kpiId);
    }
    setLoading(false);
  }, [kpiId]);

  const loadActionItems = (kpiId: string) => {
    // Generate action items based on KPI and real data patterns
    const items: ActionItem[] = [];

    switch (kpiId) {
      case 'quote-to-cash-cycle':
        items.push(
          {
            id: 'QUO-2025-1847',
            type: 'quote',
            title: 'High-Value Quote Pending Approval',
            customer: 'Acme Corp',
            amount: 285000,
            daysOverdue: 8,
            assignee: 'Dir, Sales Ops',
            priority: 'high',
            status: 'pending',
            nextAction: 'Escalate to VP for immediate approval',
            businessImpact: '$285K ARR at risk, customer expecting response'
          },
          {
            id: 'QUO-2025-1923',
            type: 'quote',
            title: 'Legal Review Bottleneck',
            customer: 'GlobalTech',
            amount: 156000,
            daysOverdue: 6,
            assignee: 'Legal Team',
            priority: 'medium',
            status: 'in_progress',
            nextAction: 'Schedule legal review meeting',
            businessImpact: 'Standard contract terms, should be fast-tracked'
          },
          {
            id: 'QUO-2025-2011',
            type: 'quote',
            title: 'Pricing Exception Required',
            customer: 'TechStart',
            amount: 92000,
            daysOverdue: 5,
            assignee: 'VP, Commercial',
            priority: 'medium',
            status: 'pending',
            nextAction: 'Review pricing exception request',
            businessImpact: 'Startup customer, strategic importance'
          }
        );
        break;

      case 'invoice-accuracy':
        items.push(
          {
            id: 'INV-2025-03-124',
            type: 'invoice',
            title: 'Disputed Invoice - Usage Calculation',
            customer: 'MegaCorp',
            amount: 425000,
            daysOverdue: 67,
            assignee: 'Billing Team',
            priority: 'high',
            status: 'in_progress',
            nextAction: 'Provide usage data justification',
            businessImpact: 'Large customer relationship at risk'
          },
          {
            id: 'INV-2025-04-089',
            type: 'invoice',
            title: 'Payment Plan Negotiation',
            customer: 'StartupX',
            amount: 78000,
            daysOverdue: 45,
            assignee: 'Collections',
            priority: 'medium',
            status: 'pending',
            nextAction: 'Propose payment plan options',
            businessImpact: 'Cash flow impact, customer retention'
          }
        );
        break;

      case 'days-sales-outstanding':
        items.push(
          {
            id: 'AR-CUST-000123',
            type: 'account',
            title: 'High DSO Account - Strategic Tier',
            customer: 'Enterprise Solutions Inc',
            amount: 890000,
            daysOverdue: 75,
            assignee: 'Account Manager',
            priority: 'high',
            status: 'pending',
            nextAction: 'Executive escalation call scheduled',
            businessImpact: 'Strategic account, immediate attention needed'
          },
          {
            id: 'AR-CUST-000456',
            type: 'account',
            title: 'Collection Call Required',
            customer: 'Regional Corp',
            amount: 234000,
            daysOverdue: 62,
            assignee: 'Collections Team',
            priority: 'medium',
            status: 'in_progress',
            nextAction: 'Follow-up collection call',
            businessImpact: 'Standard collection process'
          }
        );
        break;

      default:
        // Generic action items for other KPIs
        items.push(
          {
            id: 'GEN-001',
            type: 'contract',
            title: 'Process Optimization Required',
            customer: 'Multiple Customers',
            amount: 0,
            daysOverdue: 0,
            assignee: 'Process Team',
            priority: 'medium',
            status: 'pending',
            nextAction: 'Review and optimize workflow',
            businessImpact: 'Improve overall efficiency'
          }
        );
    }

    setActionItems(items);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on items:`, selectedItems);
    // Implement bulk actions
  };

  const handleItemAction = (itemId: string, action: string) => {
    console.log(`Performing ${action} on item:`, itemId);
    // Implement individual item actions
  };

  const filteredItems = actionItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filters.priority === 'all' || item.priority === filters.priority;
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesAssignee = filters.assignee === 'all' || item.assignee.includes(filters.assignee);
    
    return matchesSearch && matchesPriority && matchesStatus && matchesAssignee;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading || !kpiDrillDown) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading Action Items...</p>
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
                <span>Back to Analysis</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  {kpiDrillDown.kpiName} - Action Center
                </h1>
                <p className="text-gray-600 mt-1">Immediate actions required for operational excellence</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg">
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">{filteredItems.filter(i => i.priority === 'high').length} High Priority</span>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Calendar className="h-4 w-4" />
                Schedule Review
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search actions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select 
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedItems.length} selected</span>
                <button 
                  onClick={() => handleBulkAction('assign')}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Bulk Assign
                </button>
                <button 
                  onClick={() => handleBulkAction('escalate')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Escalate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Items Table */}
      <div className="px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Action Items Requiring Immediate Attention</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredItems.length} items found • Sorted by priority and days overdue
            </p>
          </div>
          
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(filteredItems.map(item => item.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Overdue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.id}</div>
                        <div className="text-xs text-blue-600 mt-1">{item.businessImpact}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.amount > 0 ? `$${item.amount.toLocaleString()}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        item.daysOverdue > 30 ? 'text-red-600' : 
                        item.daysOverdue > 7 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {item.daysOverdue > 0 ? `${item.daysOverdue} days` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{item.assignee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-sm text-gray-900 capitalize">{item.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleItemAction(item.id, 'call')}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Call Customer"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleItemAction(item.id, 'email')}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleItemAction(item.id, 'details')}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                          title="View Details"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Actions Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Immediate Actions
            </h3>
            <div className="space-y-3">
              {filteredItems.filter(item => item.priority === 'high').map(item => (
                <div key={item.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-900">{item.nextAction}</p>
                  <p className="text-xs text-red-700 mt-1">{item.customer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Scheduled Actions
            </h3>
            <div className="space-y-3">
              {filteredItems.filter(item => item.status === 'in_progress').map(item => (
                <div key={item.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-900">{item.nextAction}</p>
                  <p className="text-xs text-yellow-700 mt-1">{item.customer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Financial Impact
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900">
                  Total at Risk: ${filteredItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {filteredItems.filter(item => item.priority === 'high').length} high-priority items
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
