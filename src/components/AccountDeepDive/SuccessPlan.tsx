import React, { useState } from 'react';

interface ActionItem {
  text: string;
  completed: boolean;
  date?: string;
}

interface WeekPlan {
  week: string;
  title: string;
  items: ActionItem[];
}

export default function SuccessPlan() {
  const [expandedWeek, setExpandedWeek] = useState<string | null>('WEEK 1');

  const weekPlans: WeekPlan[] = [
    {
      week: 'WEEK 1',
      title: 'Discovery & Realignment (Oct 11-17)',
      items: [
        { text: 'Emergency QBR with CTO Sarah Miller (Oct 12) - SCHEDULED', completed: false, date: 'Oct 12' },
        { text: 'Executive Briefing with Cisco VP (Oct 13) - TO SCHEDULE', completed: false, date: 'Oct 13' },
        { text: 'Technical Assessment (Oct 14-15)', completed: false, date: 'Oct 14-15' }
      ]
    },
    {
      week: 'WEEK 2',
      title: 'Quick Wins & Value Demonstration (Oct 18-24)',
      items: [
        { text: 'Feature Enablement Workshop (Oct 19) - 9 active users + IT team', completed: false, date: 'Oct 19' },
        { text: 'Champion Identification & Enablement (Oct 20-21)', completed: false, date: 'Oct 20-21' },
        { text: 'Training Blitz for Inactive Users (Oct 22-24)', completed: false, date: 'Oct 22-24' }
      ]
    },
    {
      week: 'WEEK 3',
      title: 'License Optimization & Contract Discussion (Oct 25-31)',
      items: [
        { text: 'License Right-Sizing Proposal (Oct 26)', completed: false, date: 'Oct 26' },
        { text: 'Value Realization Report (Oct 28)', completed: false, date: 'Oct 28' }
      ]
    },
    {
      week: 'WEEK 4-6',
      title: 'Renewal Negotiation & Stabilization (Nov 1-20)',
      items: [
        { text: 'Renewal Business Review (Nov 3)', completed: false, date: 'Nov 3' },
        { text: 'Contract Negotiation (Nov 5-15)', completed: false, date: 'Nov 5-15' },
        { text: 'Contract Signature Target: Nov 20', completed: false, date: 'Nov 20' },
        { text: 'Post-Renewal Success Plan Kickoff: Nov 22', completed: false, date: 'Nov 22' }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📋 CUSTOMER SUCCESS PLAN - EMERGENCY INTERVENTION
      </h2>
      
      <div className="mb-4">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
          <div className="font-bold text-red-800 text-lg mb-2">Plan Status: 🔴 CRITICAL - Immediate Action Required</div>
          <div className="text-sm text-gray-700 space-y-1">
            <div><strong>Plan Owner:</strong> Sarah Chen (CSM) + Michael Torres (Director, Customer Success)</div>
            <div><strong>Executive Sponsor Required:</strong> YES</div>
            <div><strong>Target Completion:</strong> 45 days (before renewal window)</div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="font-bold text-gray-800 mb-2">🎯 PRIMARY OBJECTIVES:</div>
          <div className="space-y-1 text-sm text-gray-700">
            <div>1. Stabilize health score to &gt;70 by Nov 15 (35 days)</div>
            <div>2. Increase utilization to &gt;40% by Nov 20 (40 days)</div>
            <div>3. Secure renewal commitment by Nov 27 (48 days)</div>
            <div>4. Right-size license allocation (50 → 20 seats)</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="font-bold text-gray-800 mb-2">📅 ACTION PLAN:</div>
          {weekPlans.map((plan) => (
            <div key={plan.week} className="border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedWeek(expandedWeek === plan.week ? null : plan.week)}
                className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-3 text-left font-medium text-gray-800 flex items-center justify-between transition-colors"
              >
                <span>{plan.week}: {plan.title}</span>
                <span>{expandedWeek === plan.week ? '▼' : '▶'}</span>
              </button>
              {expandedWeek === plan.week && (
                <div className="p-4 bg-white space-y-2">
                  {plan.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={item.completed}
                        className="mt-1"
                        readOnly
                      />
                      <span className={item.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                        ☐ {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
          <div className="font-bold text-gray-800 mb-2">💰 FINANCIAL OUTCOME SCENARIOS:</div>
          <div className="space-y-1 text-sm text-gray-700">
            <div>• <strong className="text-green-700">Best Case:</strong> Renew at $120K (right-sized 20 seats) - $120K ARR retained</div>
            <div>• <strong className="text-blue-700">Likely Case:</strong> Renew at $100K (15 seats + 6-month trial) - $100K ARR</div>
            <div>• <strong className="text-red-700">Worst Case:</strong> Churn - $180K ARR lost</div>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            ✅ Approve Plan
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            📅 Schedule All Activities
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
            👥 Assign Tasks
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
            📊 Export to PDF
          </button>
        </div>
      </div>
    </div>
  );
}
