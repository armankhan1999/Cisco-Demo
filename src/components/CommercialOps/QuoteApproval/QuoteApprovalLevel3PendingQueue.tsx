'use client';

import { useState, useEffect } from 'react';
import { QuoteApprovalDrillDownService, type QuoteApprovalLevel3PendingQuote } from '@/services/quoteApprovalDrillDownService';
import { ArrowLeft, Clock, AlertTriangle, DollarSign, User, Search, Filter, Download } from '@/utils/iconMapping';

interface QuoteApprovalLevel3PendingQueueProps {
  dealSize: string;
  complexity: string;
  onBack: () => void;
  onDrillToLevel4: (quoteId: string) => void;
}

export default function QuoteApprovalLevel3PendingQueue({ 
  dealSize, 
  complexity, 
  onBack, 
  onDrillToLevel4 
}: QuoteApprovalLevel3PendingQueueProps) {
  const [pendingQuotes, setPendingQuotes] = useState<QuoteApprovalLevel3PendingQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = QuoteApprovalDrillDownService.getLevel3PendingQuoteQueue();
        setPendingQuotes(data);
      } catch (error) {
        console.error('Error fetching Quote Approval Level 3 data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dealSize, complexity]);

  const handleQuoteClick = (quoteId: string) => {
    onDrillToLevel4(quoteId);
  };

  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for quotes:`, selectedQuotes);
    // Implement bulk actions here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredQuotes = pendingQuotes.filter(quote => {
    const matchesSearch = quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.productFamily.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || quote.priority === selectedPriority;
    const matchesStage = selectedStage === 'all' || quote.currentStage === selectedStage;
    return matchesSearch && matchesPriority && matchesStage;
  });

  // Calculate summary metrics
  const highPriorityCount = filteredQuotes.filter(q => q.priority === 'high').length;
  const criticalCount = filteredQuotes.filter(q => q.daysInQueue > 5).length;
  const totalValue = filteredQuotes.reduce((sum, q) => sum + q.dealValue, 0);
  const avgDaysInQueue = filteredQuotes.reduce((sum, q) => sum + q.daysInQueue, 0) / filteredQuotes.length || 0;

  // Group quotes by stage for Kanban view
  const stageGroups = filteredQuotes.reduce((acc, quote) => {
    if (!acc[quote.currentStage]) {
      acc[quote.currentStage] = [];
    }
    acc[quote.currentStage].push(quote);
    return acc;
  }, {} as Record<string, QuoteApprovalLevel3PendingQuote[]>);

  const stages = ['Auto-Approve', 'Manager Review', 'Director Review', 'VP/C-Level Review'];

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
            Back to Analysis
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Quote Queue</h1>
            <p className="text-gray-600">Quotes currently in approval pipeline - Kanban board view</p>
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
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="font-medium text-red-700">High Priority</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
          <p className="text-sm text-red-600">Quotes requiring immediate attention</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-yellow-700">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{criticalCount}</p>
          <p className="text-sm text-yellow-600">Quotes {'>'}5 days in queue</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-blue-700">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">${Math.round(totalValue / 1000)}K</p>
          <p className="text-sm text-blue-600">Pipeline value at risk</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-green-500" />
            <span className="font-medium text-green-700">Avg Queue Time</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{Math.round(avgDaysInQueue * 10) / 10}</p>
          <p className="text-sm text-green-600">Days average in pipeline</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-xl shadow-sm border border-gray-200 p-4" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotes, customers, or products..."
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
            
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Stages</option>
              <option value="Manager Review">Manager Review</option>
              <option value="Director Review">Director Review</option>
              <option value="VP/C-Level Review">VP/C-Level Review</option>
            </select>
          </div>
          
          {selectedQuotes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedQuotes.length} selected</span>
              <button 
                onClick={() => handleBulkAction('escalate')}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Escalate
              </button>
              <button 
                onClick={() => handleBulkAction('remind')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Send Reminder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board View */}
      <div className="rounded-xl shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Approval Pipeline - Kanban View</h2>
          <p className="text-sm text-gray-600">Click any quote card to view detailed approval workflow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map(stage => {
            const stageQuotes = stageGroups[stage] || [];
            const stageValue = stageQuotes.reduce((sum, q) => sum + q.dealValue, 0);
            
            return (
              <div key={stage} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{stage}</h3>
                  <span className="text-sm text-gray-600">
                    {stageQuotes.length} quotes
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 mb-4">
                  ${Math.round(stageValue / 1000)}K total value
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stageQuotes.map(quote => (
                    <div
                      key={quote.id}
                      className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleQuoteClick(quote.quoteId)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {quote.quoteNumber}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          quote.priority === 'high' ? 'bg-red-100 text-red-700' :
                          quote.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {quote.priority}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-1">
                        {quote.customerName}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        ${Math.round(quote.dealValue / 1000)}K {quote.quoteType}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{quote.productFamily}</span>
                        <span>{quote.daysInQueue}d in queue</span>
                      </div>
                      
                      {quote.daysInQueue > 5 && (
                        <div className="mt-2 text-xs text-red-600 font-medium">
                          ⚠️ Overdue
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {stageQuotes.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      No quotes in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Quote Table */}
      <div className="rounded-xl shadow-sm border border-gray-200" style={{ backgroundColor: '#F3F3F3' }}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Detailed Quote List</h2>
              <p className="text-sm text-gray-600">Complete list with all quote details</p>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredQuotes.length} of {pendingQuotes.length} pending quotes
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
                    checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedQuotes(filteredQuotes.map(q => q.quoteId));
                      } else {
                        setSelectedQuotes([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Quote</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned To</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Days in Queue</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Priority</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote, index) => (
                <tr
                  key={quote.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleQuoteClick(quote.quoteId)}
                >
                  <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedQuotes.includes(quote.quoteId)}
                      onChange={() => handleSelectQuote(quote.quoteId)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.quoteNumber}</div>
                      <div className="text-sm text-gray-500">{quote.quoteType}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quote.customerName}</div>
                      <div className="text-sm text-gray-500">{quote.customerSegment}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{quote.productFamily}</td>
                  <td className="py-4 px-4 text-right text-sm font-medium text-gray-900">
                    ${Math.round(quote.dealValue / 1000)}K
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{quote.currentStage}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{quote.assignedTo}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`text-sm font-medium ${
                      quote.daysInQueue > 5 ? 'text-red-600' :
                      quote.daysInQueue > 3 ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      {quote.daysInQueue}d
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      quote.priority === 'high' ? 'bg-red-100 text-red-800' :
                      quote.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {quote.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuoteClick(quote.quoteId);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
