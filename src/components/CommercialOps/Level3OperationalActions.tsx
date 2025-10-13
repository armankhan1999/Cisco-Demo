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
  type: string;
  title: string;
  customer: string;
  amount: number;
  daysOverdue: number;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  nextAction: string;
  businessImpact: string;
  prioritizationScore?: number;
  product?: string;
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
    const matchesAssignee = filters.assignee === 'all' || item.assignee === filters.assignee;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesAssignee;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-green-200 bg-green-50 text-green-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!kpiDrillDown) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">KPI Not Found</h3>
        <p className="text-gray-600">The requested KPI drill-down could not be found.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-semibold">Back to Analysis</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  {kpiDrillDown.kpiName} - Action Items
                </h1>
                <p className="text-sm text-gray-600 mt-1">{kpiDrillDown.businessContext}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredItems.length} of {actionItems.length} items
              </span>
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600">
                    {selectedItems.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction('assign')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Bulk Assign
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search action items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Action Items */}
      <div className="flex-1 overflow-y-auto p-8">
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

                  <h3 className="text-xl font-bold text-blue-900 mb-2">{item.title}</h3>
                  <p className="text-xl font-bold text-blue-900 mb-2">{item.customer}</p>
                  {item.product && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Product:</span> {item.product}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-3">{item.nextAction}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {item.assignee}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ${(item.amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    ${(item.amount / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-500">Opportunity</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Account Detail Modal */}
      {selectedActionItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-8 py-6 relative">
              <button
                onClick={() => setSelectedActionItem(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 group"
                aria-label="Close modal"
              >
                <X className="h-6 w-6 text-white group-hover:scale-110 transition-transform" strokeWidth={2.5} />
              </button>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Users className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{selectedActionItem.customer}</h2>
                  <div className="flex items-center gap-4 text-blue-100">
                    <span className="text-sm font-medium">{selectedActionItem.id}</span>
                    <span className="text-sm">•</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">
                      {selectedActionItem.type} Action
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
          </div>
        </div>
      )}
    </div>
  );
}