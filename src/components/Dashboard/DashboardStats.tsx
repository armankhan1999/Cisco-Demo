'use client';

import { colors, personaColors } from '@/config/theme';
import { Persona, getPersonaData } from '@/data/dummyData';

interface DashboardStatsProps {
  persona: Persona;
}

export default function DashboardStats({ persona }: DashboardStatsProps) {
  const data = getPersonaData(persona) as any;

  const renderCSMStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Accounts"
        value={data.accounts?.length.toString() || '0'}
        subtitle="Active customers"
        color={colors.primary.DEFAULT}
        icon="👥"
      />
      <StatCard
        title="Avg Health Score"
        value="89"
        subtitle="Across all accounts"
        color={colors.primary.DEFAULT}
        icon="💚"
      />
      <StatCard
        title="Total ARR"
        value="$8.5M"
        subtitle="Annual recurring revenue"
        color={colors.primary.DEFAULT}
        icon="💰"
      />
      <StatCard
        title="Products"
        value={data.products?.length.toString() || '0'}
        subtitle="In portfolio"
        color={colors.primary.DEFAULT}
        icon="📦"
      />
    </div>
  );

  const renderCOStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Active Quotes"
        value={data.quotes?.length.toString() || '0'}
        subtitle="Pending & accepted"
        color={colors.primary.DEFAULT}
        icon="📋"
      />
      <StatCard
        title="NRR"
        value="114.8%"
        subtitle="Net revenue retention"
        color={colors.primary.DEFAULT}
        icon="📈"
      />
      <StatCard
        title="DSO"
        value="45 days"
        subtitle="Days sales outstanding"
        color={colors.primary.DEFAULT}
        icon="⏱️"
      />
      <StatCard
        title="Active Subscriptions"
        value={data.subscriptions?.length.toString() || '0'}
        subtitle="Current period"
        color={colors.primary.DEFAULT}
        icon="🔄"
      />
    </div>
  );

  const renderSEStats = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
          No Data Available
        </h3>
        <p className="text-sm" style={{ color: colors.text.secondary }}>
          Sales Expansion data will be configured soon
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
          Key Metrics
        </h3>
        {persona === 'CSM' && renderCSMStats()}
        {persona === 'CO' && renderCOStats()}
        {persona === 'SE' && renderSEStats()}
      </div>

      {/* Sample Data Table */}
      {persona !== 'SE' && (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
            Recent Activity
          </h3>
          <div className="bg-white rounded-lg border" style={{ borderColor: colors.neutral[200] }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: colors.background.secondary }}>
                  <tr>
                    {persona === 'CSM' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Account</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Tier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>ARR</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Health Score</th>
                      </>
                    )}
                    {persona === 'CO' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Quote ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium" style={{ color: colors.text.secondary }}>Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: colors.neutral[200] }}>
                  {persona === 'CSM' && data.accounts?.map((account: any) => (
                    <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm" style={{ color: colors.text.primary }}>{account.name}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: colors.text.secondary }}>{account.tier}</td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: colors.text.primary }}>${(account.arr / 1000).toFixed(0)}K</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                          {account.healthScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {persona === 'CO' && data.quotes?.map((quote: any) => (
                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: colors.text.primary }}>{quote.id}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: colors.text.secondary }}>{quote.customer}</td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: colors.text.primary }}>${(quote.amount / 1000).toFixed(0)}K</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-blue-50 text-blue-600">
                          {quote.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: string;
}

function StatCard({ title, value, subtitle, color, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 border hover:shadow-lg hover:border-blue-500 transition-all duration-200" style={{ borderColor: colors.neutral[200] }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
            {title}
          </p>
          <p className="text-3xl font-bold mb-1" style={{ color: colors.text.primary }}>
            {value}
          </p>
          <p className="text-xs" style={{ color: colors.text.muted }}>
            {subtitle}
          </p>
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-gray-100">
        <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: colors.primary.DEFAULT, width: '75%' }} />
      </div>
    </div>
  );
}
