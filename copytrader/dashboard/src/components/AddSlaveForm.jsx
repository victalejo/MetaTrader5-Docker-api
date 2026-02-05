import { useState } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

const LOT_MODES = [
  { value: 'exact', label: 'Exacto', description: 'Mismo lote que el principal' },
  { value: 'fixed', label: 'Fijo', description: 'Tamaño de lote fijo' },
  { value: 'multiplier', label: 'Multiplicador', description: 'Lote × multiplicador' },
  { value: 'proportional', label: 'Proporcional', description: 'Escalar por ratio de balance' },
]

export default function AddSlaveForm({ onSave, onCancel, isLoading }) {
  const [form, setForm] = useState({
    name: '',
    host: '',
    port: 8001,
    enabled: true,
    lot_mode: 'exact',
    lot_value: 1.0,
    max_lot: 10.0,
    min_lot: 0.01,
    magic_number: 123456,
    invert_trades: false,
    max_slippage: 20,
    symbols_filter: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    if (!form.host.trim()) {
      newErrors.host = 'El host es requerido'
    }
    if (!form.port || form.port < 1 || form.port > 65535) {
      newErrors.port = 'Puerto inválido (1-65535)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const data = {
      name: form.name.trim(),
      host: form.host.trim(),
      port: parseInt(form.port),
      enabled: form.enabled,
      lot_mode: form.lot_mode,
      lot_value: parseFloat(form.lot_value),
      max_lot: parseFloat(form.max_lot),
      min_lot: parseFloat(form.min_lot),
      magic_number: parseInt(form.magic_number),
      invert_trades: form.invert_trades,
      max_slippage: parseInt(form.max_slippage),
      symbols_filter: form.symbols_filter
        ? form.symbols_filter.split(',').map((s) => s.trim()).filter(Boolean)
        : null,
    }
    onSave(data)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">
            Agregar Cuenta Esclava
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Connection Info */}
          <div className="border-b border-slate-700 pb-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Conexión</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Nombre <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="slave-cuenta1"
                  className={clsx(
                    'w-full bg-slate-700 border rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    errors.name ? 'border-red-500' : 'border-slate-600'
                  )}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Host <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="host"
                    value={form.host}
                    onChange={handleChange}
                    placeholder="mt5-slave1 o 192.168.1.100"
                    className={clsx(
                      'w-full bg-slate-700 border rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                      errors.host ? 'border-red-500' : 'border-slate-600'
                    )}
                  />
                  {errors.host && <p className="text-xs text-red-400 mt-1">{errors.host}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Puerto <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="port"
                    value={form.port}
                    onChange={handleChange}
                    min="1"
                    max="65535"
                    className={clsx(
                      'w-full bg-slate-700 border rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                      errors.port ? 'border-red-500' : 'border-slate-600'
                    )}
                  />
                  {errors.port && <p className="text-xs text-red-400 mt-1">{errors.port}</p>}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={form.enabled}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-slate-300">
                  Habilitar al crear
                </label>
              </div>
            </div>
          </div>

          {/* Lot Configuration */}
          <div className="border-b border-slate-700 pb-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Configuración de Lote</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Modo de Lote
                </label>
                <select
                  name="lot_mode"
                  value={form.lot_mode}
                  onChange={handleChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {LOT_MODES.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label} - {mode.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    name="lot_value"
                    value={form.lot_value}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Mínimo
                  </label>
                  <input
                    type="number"
                    name="min_lot"
                    value={form.min_lot}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Máximo
                  </label>
                  <input
                    type="number"
                    name="max_lot"
                    value={form.max_lot}
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trade Configuration */}
          <div className="border-b border-slate-700 pb-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Configuración de Operaciones</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Número Mágico
                  </label>
                  <input
                    type="number"
                    name="magic_number"
                    value={form.magic_number}
                    onChange={handleChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Deslizamiento Máx.
                  </label>
                  <input
                    type="number"
                    name="max_slippage"
                    value={form.max_slippage}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="invert_trades"
                  checked={form.invert_trades}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-slate-300">
                  Invertir operaciones (COMPRA → VENTA)
                </label>
              </div>
            </div>
          </div>

          {/* Symbols Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Filtro de Símbolos (opcional)
            </label>
            <input
              type="text"
              name="symbols_filter"
              value={form.symbols_filter}
              onChange={handleChange}
              placeholder="EURUSD, GBPUSD, USDJPY (vacío = todos)"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Separar símbolos con comas. Dejar vacío para copiar todos.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-lg',
                'bg-blue-600 text-white hover:bg-blue-700',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? 'Creando...' : 'Crear Esclava'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
