'use client';

/* eslint-disable */
// @ts-nocheck

import { useState, useEffect } from 'react';
import { AlertCircle, Users, RefreshCw } from 'lucide-react';
import { drillDownService } from '@/services/drillDownService';
import { ArrowLeft, AlertTriangle, Clock, DollarSign, User, Phone, Mail, FileText, CheckCircle, XCircle, Filter, Search, Calendar, Bell, TrendingUp, Target, Zap, X } from '@/utils/iconMapping';
import { KPI_DRILL_DOWNS, type KPIDrillDown } from '@/services/drillDownService';
import { getQ2CProcessImprovements, getQ2CCapacityInsights, getQ2CBottleneckHeatmap, getQ2CQuotesRequiringAction } from '@/services/q2cAnalyticsService';
import { ActionItemsService } from '@/services/actionItemsService';
import expansionOpportunitiesData from '@/source_data/sales-expansion-data/expansion-opportunities.json';
import customersData from '@/source_data/master-data/customers.json';
import whiteSpaceData from '@/source_data/csm-data/white_space_analysis.json';
import licensesData from '@/source_data/master-data/licenses.json';

interface Level3OperationalActionsProps {
  kpiId: string;
  actionId?: string;
  onBack: () => void;
}

interface ActionItem {
  id: string;
  type: 'account' | 'opportunity' | 'contract' | 'quote' | 'renewal';
  title: string;
  customer: string;
  product?: string;
  amount: number;
  daysOverdue: number;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  nextAction: string;
  businessImpact: string;

  prioritizationScore?: number;
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
  const [showQuoteDetails, setShowQuoteDetails] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedActionItem, setSelectedActionItem] = useState<ActionItem | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [quotesRequiringAction, setQuotesRequiringAction] = useState<any[]>([]);

  useEffect(() => {
    const drillDown = KPI_DRILL_DOWNS.find(kpi => kpi.kpiId === kpiId);
    if (drillDown) {
      setKpiDrillDown(drillDown);
      loadActionItems(kpiId, actionId);
      
      // Load real quotes requiring action for Q2C
      if (kpiId === 'quote-to-cash-cycle') {
        const realQuotes = getQ2CQuotesRequiringAction();
        setQuotesRequiringAction(realQuotes);
      }
    }
    setLoading(false);
  }, [kpiId, actionId]);

  const loadActionItems = (kpiId: string, actionId?: string) => {
    // Generate action items based on KPI using real data from source files
    const items = ActionItemsService.getActionItemsForKPI(kpiId, actionId);
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
      case 'completed': return <AlertCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Calendar className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
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
                  {kpiDrillDown.kpiName} - Action Items
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredItems.length} items found • Click any card to view account details
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">High Priority</p>
                <p className="text-xl font-bold text-red-600">
                  {filteredItems.filter(item => item.priority === 'high').length}
                </p>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Total Value</p>
                <p className="text-xl font-bold text-green-600">
                  ${Math.round(filteredItems.reduce((sum, item) => sum + item.amount, 0) / 1000)}K
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search action items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
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

      {/* Action Items Cards */}
      <div className="px-8 py-8">
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedActionItem(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.id));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(item.priority)}`}>
                      {item.priority.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      {getStatusIcon(item.status)}
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {item.daysOverdue > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                        {item.daysOverdue} days overdue
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-blue-900 mb-1">{item.customer}</h3>
                    <p className="text-lg font-semibold text-gray-800">{item.title}</p>
                  </div>
                  <p className="text-gray-600 mb-3">{item.businessImpact}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium">Product:</span>
                      <div className="font-semibold text-indigo-600">{item.product || 'Multiple Products'}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Amount:</span>
                      <div className="font-semibold text-green-600">${(item.amount / 1000).toFixed(0)}K</div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Assignee:</span>
                      <div className="font-semibold text-blue-600">{item.assignee}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Next Action:</span>
                      <div className="font-semibold text-gray-900">{item.nextAction}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-6">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemAction(item.id, 'call');
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemAction(item.id, 'email');
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1 text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedActionItem(item);
                    }}
                    className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                  >
                    View Account
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Item Detail Modal */}
      {selectedActionItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-8 py-6 relative flex-shrink-0">
              <button
                onClick={() => setSelectedActionItem(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </button>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedActionItem.title}</h2>
                  <div className="flex items-center gap-4 text-blue-100">
                    <span className="text-sm font-medium">{selectedActionItem.customer}</span>
                    <span className="text-sm">•</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedActionItem.priority === 'high' ? 'bg-red-500/20 text-red-100' :
                      selectedActionItem.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-100' :
                      'bg-green-500/20 text-green-100'
                    }`}>
                      {selectedActionItem.priority.toUpperCase()} Priority
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedActionItem.status === 'completed' ? 'bg-green-500/20 text-green-100' :
                      selectedActionItem.status === 'in_progress' ? 'bg-blue-500/20 text-blue-100' :
                      'bg-yellow-500/20 text-yellow-100'
                    }`}>
                      {selectedActionItem.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-6">
                {/* Enhanced Account Information */}
                {(() => {
                  const customer = customersData.find(c => c.customer_name === selectedActionItem.customer);
                  const customerLicenses = customer ? licensesData.filter(l => l.customer_id === customer.customer_id) : [];
                  const whiteSpace = customer ? whiteSpaceData.find(ws => ws.account_id === customer.customer_id) : null;
                  
                  return (
                    <>
                      {/* Key Metrics Row 1 */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="text-xs font-semibold text-green-700 uppercase mb-1">Opportunity Amount</div>
                          <div className="text-xl font-bold text-green-700">${Math.floor(selectedActionItem.amount / 1000)}K</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="text-xs font-semibold text-blue-700 uppercase mb-1">Annual ARR</div>
                          <div className="text-xl font-bold text-blue-700">${customer ? Math.floor(customer.arr / 1000) : 0}K</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="text-xs font-semibold text-purple-700 uppercase mb-1">Customer Tier</div>
                          <div className="text-xl font-bold text-purple-700">{customer?.tier || 'Unknown'}</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                          <div className="text-xs font-semibold text-orange-700 uppercase mb-1">Days Overdue</div>
                          <div className="text-xl font-bold text-orange-700">{selectedActionItem.daysOverdue || 0}</div>
                        </div>
                      </div>

                      {/* Key Metrics Row 2 */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                          <div className="text-xs font-semibold text-indigo-700 uppercase mb-1">Product Count</div>
                          <div className="text-xl font-bold text-indigo-700">{customer?.product_count || 0}</div>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                          <div className="text-xs font-semibold text-teal-700 uppercase mb-1">User Count</div>
                          <div className="text-xl font-bold text-teal-700">{customer?.user_count || 0}</div>
                        </div>
                        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                          <div className="text-xs font-semibold text-pink-700 uppercase mb-1">White Space</div>
                          <div className="text-xl font-bold text-pink-700">${whiteSpace ? Math.floor(whiteSpace.total_white_space_arr / 1000) : 0}K</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <div className="text-xs font-semibold text-yellow-700 uppercase mb-1">Assignee</div>
                          <div className="text-lg font-bold text-yellow-700">{selectedActionItem.assignee}</div>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Details</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-600">Industry:</span>
                              <span className="ml-2 font-semibold text-gray-900">{customer?.industry || 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Theater:</span>
                              <span className="ml-2 font-semibold text-gray-900">{customer?.theater || 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Region:</span>
                              <span className="ml-2 font-semibold text-gray-900">{customer?.region || 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Country:</span>
                              <span className="ml-2 font-semibold text-gray-900">{customer?.country || 'Unknown'}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-600">CSM ID:</span>
                              <span className="ml-2 font-semibold text-gray-900">{customer?.csm_id || 'Unassigned'}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Created Date:</span>
                              <span className="ml-2 font-semibold text-gray-900">{customer?.created_date ? new Date(customer.created_date).toLocaleDateString() : 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                              <span className="ml-2 font-semibold text-gray-900">{customer?.last_updated ? new Date(customer.last_updated).toLocaleDateString() : 'Unknown'}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-600">Hero Account:</span>
                              <span className={`ml-2 font-semibold ${customer?.is_hero_account ? 'text-green-600' : 'text-gray-600'}`}>
                                {customer?.is_hero_account ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Current Products & Licenses */}
                      {customerLicenses.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                          <h3 className="text-lg font-bold text-blue-900 mb-4">Current Products & Utilization</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {customerLicenses.map((license, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-blue-900">{license.product_family}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    license.utilization >= 80 ? 'bg-green-100 text-green-800' :
                                    license.utilization >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {license.utilization}% utilized
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <div>Licenses: {license.license_count}</div>
                                  <div>Used: {Math.round(license.utilization * license.license_count / 100)}</div>
                                </div>
                                <div className="mt-2 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      license.utilization >= 80 ? 'bg-green-500' :
                                      license.utilization >= 60 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${license.utilization}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* White Space Opportunities */}
                      {whiteSpace && whiteSpace.white_space_opportunities && whiteSpace.white_space_opportunities.length > 0 && (
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                          <h3 className="text-lg font-bold text-purple-900 mb-4">White Space Opportunities</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {whiteSpace.white_space_opportunities.slice(0, 4).map((opp, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-lg border border-purple-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-purple-900">{opp.product}</span>
                                  <span className="text-lg font-bold text-green-600">${Math.floor(opp.estimated_arr / 1000)}K</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <div>Fit Score: {opp.fit_score}%</div>
                                  <div>Priority: {opp.priority}</div>
                                </div>
                                <div className="mt-2 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full bg-purple-500"
                                    style={{ width: `${opp.fit_score}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Next Action */}
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <h3 className="text-lg font-bold text-blue-900 mb-3">Next Action Required</h3>
                        <p className="text-blue-800 text-lg font-semibold">{selectedActionItem.nextAction}</p>
                      </div>

                      {/* Business Impact */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Business Impact</h3>
                        <p className="text-gray-700 leading-relaxed">{selectedActionItem.businessImpact}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-6 flex-shrink-0">
              <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => setSelectedActionItem(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                >
                  Close
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                  <Phone className="h-5 w-5" />
                  Contact Customer
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-colors">
                  <Calendar className="h-5 w-5" />
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
