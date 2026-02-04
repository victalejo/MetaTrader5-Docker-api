import { Activity, Users, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import { useHealth } from '../hooks/useHealth'
import { useAccounts } from '../hooks/useAccounts'
import { usePositions, usePositionStats } from '../hooks/usePositions'
import StatsCard from '../components/StatsCard'
import AccountCard from '../components/AccountCard'
import StatusBadge from '../components/StatusBadge'

export default function Dashboard() {
  const { data: health, isLoading: healthLoading } = useHealth()
  const { data: accounts, isLoading: accountsLoading } = useAccounts()
  const { data: positions } = usePositions()

  const positionCount = positions?.total || 0
  const masterConnected = health?.master_connected
  const slavesConnected = health?.slaves_connected || 0
  const slavesTotal = health?.slaves_total || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitor your copy trading system</p>
        </div>
        <StatusBadge status={health?.status} size="lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="System Status"
          value={health?.running ? 'Running' : 'Stopped'}
          subtitle={health?.status}
          icon={Activity}
          color={health?.running ? 'green' : 'red'}
        />
        <StatsCard
          title="Master Account"
          value={masterConnected ? 'Connected' : 'Disconnected'}
          subtitle={accounts?.master?.name || '-'}
          icon={Users}
          color={masterConnected ? 'green' : 'red'}
        />
        <StatsCard
          title="Slave Accounts"
          value={`${slavesConnected}/${slavesTotal}`}
          subtitle="connected"
          icon={Users}
          color={slavesConnected === slavesTotal ? 'green' : 'yellow'}
        />
        <StatsCard
          title="Active Positions"
          value={positionCount}
          subtitle="being copied"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Account Cards */}
      <div>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Accounts</h2>
        {accountsLoading ? (
          <div className="text-slate-400">Loading accounts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts?.master && (
              <AccountCard account={accounts.master} />
            )}
            {accounts?.slaves?.map((slave) => (
              <AccountCard key={slave.name} account={slave} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Master Balance */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Master Account</h3>
          {accounts?.master ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Balance</span>
                <span className="text-xl font-semibold text-slate-100">
                  ${accounts.master.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Equity</span>
                <span className="text-xl font-semibold text-slate-100">
                  ${accounts.master.equity?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Positions</span>
                <span className="text-xl font-semibold text-slate-100">
                  {accounts.master.positions_count || 0}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">No master account connected</p>
          )}
        </div>

        {/* System Health */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status</span>
              <StatusBadge status={health?.status} size="sm" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Running</span>
              <span className={health?.running ? 'text-green-400' : 'text-red-400'}>
                {health?.running ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Active Mappings</span>
              <span className="text-slate-100">{health?.active_mappings || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Master Connected</span>
              <span className={masterConnected ? 'text-green-400' : 'text-red-400'}>
                {masterConnected ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
