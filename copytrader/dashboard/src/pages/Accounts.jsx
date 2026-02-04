import { useState } from 'react'
import { Plus, Power, PowerOff, Trash2, Settings, RefreshCw } from 'lucide-react'
import { clsx } from 'clsx'
import { useAccounts, useReconnectAccount } from '../hooks/useAccounts'
import { useSlaves, useEnableSlave, useDisableSlave, useDeleteSlave, useUpdateSlave } from '../hooks/useSlaves'
import AccountCard from '../components/AccountCard'
import SlaveConfigForm from '../components/SlaveConfigForm'

export default function Accounts() {
  const { data: accounts, isLoading } = useAccounts()
  const { data: slavesDetail } = useSlaves()
  const enableSlave = useEnableSlave()
  const disableSlave = useDisableSlave()
  const deleteSlave = useDeleteSlave()
  const updateSlave = useUpdateSlave()
  const reconnect = useReconnectAccount()

  const [editingSlave, setEditingSlave] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const handleEnable = (name) => {
    enableSlave.mutate(name)
  }

  const handleDisable = (name) => {
    disableSlave.mutate({ name, closePositions: false })
  }

  const handleDelete = (name) => {
    deleteSlave.mutate({ name, closePositions: false })
    setShowDeleteConfirm(null)
  }

  const handleSaveConfig = (data) => {
    updateSlave.mutate(
      { name: editingSlave.name, data },
      { onSuccess: () => setEditingSlave(null) }
    )
  }

  if (isLoading) {
    return <div className="text-slate-400">Loading accounts...</div>
  }

  const slaves = slavesDetail || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Accounts</h1>
          <p className="text-slate-400 mt-1">Manage master and slave accounts</p>
        </div>
      </div>

      {/* Master Account */}
      <div>
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Master Account</h2>
        {accounts?.master ? (
          <div className="max-w-md">
            <AccountCard account={accounts.master} />
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400">No master account configured</p>
          </div>
        )}
      </div>

      {/* Slave Accounts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">Slave Accounts</h2>
        </div>

        {slaves.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
            <p className="text-slate-400">No slave accounts configured</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {slaves.map((slave) => (
              <div
                key={slave.name}
                className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-slate-100">{slave.name}</h3>
                      <p className="text-sm text-slate-400">{slave.host}:{slave.port}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          'px-2 py-1 rounded text-xs font-medium',
                          slave.enabled
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-500/20 text-slate-400'
                        )}
                      >
                        {slave.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <span
                        className={clsx(
                          'px-2 py-1 rounded text-xs font-medium',
                          slave.connected
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                        )}
                      >
                        {slave.connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>

                  {/* Config Summary */}
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lot Mode</span>
                      <span className="text-slate-300">{slave.lot_mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lot Value</span>
                      <span className="text-slate-300">{slave.lot_value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Magic</span>
                      <span className="text-slate-300">{slave.magic_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Invert</span>
                      <span className="text-slate-300">{slave.invert_trades ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {slave.symbols_filter && slave.symbols_filter.length > 0 && (
                    <div className="mt-3">
                      <span className="text-xs text-slate-500">Symbols: </span>
                      <span className="text-xs text-slate-300">
                        {slave.symbols_filter.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-5 py-3 bg-slate-900/50 border-t border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {slave.enabled ? (
                      <button
                        onClick={() => handleDisable(slave.name)}
                        disabled={disableSlave.isPending}
                        className="flex items-center text-sm text-yellow-400 hover:text-yellow-300"
                      >
                        <PowerOff className="w-4 h-4 mr-1" />
                        Disable
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnable(slave.name)}
                        disabled={enableSlave.isPending}
                        className="flex items-center text-sm text-green-400 hover:text-green-300"
                      >
                        <Power className="w-4 h-4 mr-1" />
                        Enable
                      </button>
                    )}
                    {!slave.connected && (
                      <button
                        onClick={() => reconnect.mutate(slave.name)}
                        disabled={reconnect.isPending}
                        className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                      >
                        <RefreshCw className={clsx('w-4 h-4 mr-1', reconnect.isPending && 'animate-spin')} />
                        Reconnect
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingSlave(slave)}
                      className="flex items-center text-sm text-slate-400 hover:text-slate-100"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(slave.name)}
                      className="flex items-center text-sm text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingSlave && (
        <SlaveConfigForm
          slave={editingSlave}
          onSave={handleSaveConfig}
          onCancel={() => setEditingSlave(null)}
          isLoading={updateSlave.isPending}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-slate-100">Delete Slave</h3>
            <p className="text-slate-400 mt-2">
              Are you sure you want to delete <strong>{showDeleteConfirm}</strong>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm text-slate-300 hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
