import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plane, 
  Calendar, 
  MapPin, 
  X,
  RotateCcw,
  Ban
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { MovementRequest, PriorityLevel } from '../../types';

export const PersonnelMovement: React.FC = () => {
  const { 
    movements, 
    addMovementRequest, 
    approveMovement, 
    reassignMovement, 
    rescheduleMovement, 
    cancelMovement,
    personnel 
  } = useOperational();

  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState(personnel[1]?.id || 'per-02');
  const [fromLocation, setFromLocation] = useState('Maitri Research Station');
  const [toLocation, setToLocation] = useState('Bharati Research Station');
  const [departureDate, setDepartureDate] = useState('08 Oct 2026');
  const [transport, setTransport] = useState<MovementRequest['transport']>('Twin Otter KB-402');
  const [priority, setPriority] = useState<PriorityLevel>('HIGH');

  // Reschedule & Reassign states
  const [editingMovementId, setEditingMovementId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'reassign' | 'reschedule' | null>(null);
  const [newDateInput, setNewDateInput] = useState('14 Oct 2026');
  const [newTransportInput, setNewTransportInput] = useState<MovementRequest['transport']>('Helicopter Kamov-32');

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const person = personnel.find(p => p.id === selectedPersonnelId) || personnel[0];

    addMovementRequest({
      personnelId: person.personnelId,
      personnelName: person.name,
      from: fromLocation,
      to: toLocation,
      departureDate,
      transport,
      status: 'PLANNED',
      requestedBy: 'Dr. Ananya Rao',
      priority
    });

    setIsRequestOpen(false);
  };

  const handleApplyReassign = (id: string) => {
    reassignMovement(id, newTransportInput);
    setModalMode(null);
    setEditingMovementId(null);
  };

  const handleApplyReschedule = (id: string) => {
    rescheduleMovement(id, newDateInput);
    setModalMode(null);
    setEditingMovementId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Personnel Movement Coordinator</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Inter-station flight manifests, overland tracked traverses and automated transport conflict arbitration.
          </p>
        </div>

        <button
          onClick={() => setIsRequestOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow-md flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Movement Request</span>
        </button>
      </div>

      {/* Movement Requests List */}
      <div className="space-y-4">
        {movements.map(mov => (
          <div
            key={mov.id}
            className={`p-5 rounded-xl border transition-all ${
              mov.hasConflict 
                ? 'bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900 border-amber-600/70 polar-glow-danger' 
                : mov.status === 'APPROVED'
                ? 'bg-slate-900/80 border-emerald-800/60'
                : mov.status === 'CANCELLED'
                ? 'bg-slate-900/40 border-slate-800 opacity-60'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Personnel & Route Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{mov.personnelId}</span>
                  <span className="text-base font-bold text-white">{mov.personnelName}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    mov.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    mov.status === 'CANCELLED' ? 'bg-red-950 text-red-300 border border-red-800' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {mov.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">PRIORITY: {mov.priority}</span>
                </div>

                {/* Transit Path */}
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{mov.from}</span>
                  </div>
                  <span className="text-cyan-400 font-bold">⟶</span>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-200">{mov.to}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Dep: {mov.departureDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Plane className="w-3.5 h-3.5 text-slate-400" />
                    Vehicle: {mov.transport}
                  </span>
                  <span>Requested By: {mov.requestedBy}</span>
                </div>
              </div>

              {/* Conflict Notification Box */}
              {mov.hasConflict && mov.status !== 'CANCELLED' && (
                <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-700/80 max-w-md space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                    <span>⚠ MOVEMENT CONFLICT DETECTED</span>
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    {mov.conflictReason}
                  </p>
                </div>
              )}

              {/* Workflow Actions (Section 19: APPROVE, REASSIGN, RESCHEDULE, CANCEL) */}
              {mov.status !== 'CANCELLED' && (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => approveMovement(mov.id)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer"
                  >
                    APPROVE
                  </button>
                  <button
                    onClick={() => {
                      setEditingMovementId(mov.id);
                      setModalMode('reassign');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 transition-colors cursor-pointer"
                  >
                    REASSIGN
                  </button>
                  <button
                    onClick={() => {
                      setEditingMovementId(mov.id);
                      setModalMode('reschedule');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 transition-colors cursor-pointer"
                  >
                    RESCHEDULE
                  </button>
                  <button
                    onClick={() => cancelMovement(mov.id)}
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs rounded border border-red-800/80 transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reassign Modal */}
      {modalMode === 'reassign' && editingMovementId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold font-mono text-white">REASSIGN TRANSPORT PLATFORM</h3>
            <p className="text-xs text-slate-300">
              Select an alternate available transport asset with validated operational clearance:
            </p>
            <select
              value={newTransportInput}
              onChange={e => setNewTransportInput(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white"
            >
              <option value="Helicopter Kamov-32">Helicopter Kamov-32 (Clear)</option>
              <option value="PistenBully Snowcat">PistenBully Snowcat (Track Traverse)</option>
              <option value="MV Vasiliy Golovnin">MV Vasiliy Golovnin (Maritime Corridor)</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalMode(null)} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded">
                Cancel
              </button>
              <button onClick={() => handleApplyReassign(editingMovementId)} className="px-4 py-1.5 bg-cyan-400 text-slate-950 font-bold text-xs rounded">
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {modalMode === 'reschedule' && editingMovementId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold font-mono text-white">RESCHEDULE DEPARTURE WINDOW</h3>
            <p className="text-xs text-slate-300">
              Shift movement to avoid the maintenance hold on Twin Otter KB-402:
            </p>
            <input
              type="text"
              value={newDateInput}
              onChange={e => setNewDateInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white font-mono"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalMode(null)} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded">
                Cancel
              </button>
              <button onClick={() => handleApplyReschedule(editingMovementId)} className="px-4 py-1.5 bg-cyan-400 text-slate-950 font-bold text-xs rounded">
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Movement Request Modal */}
      {isRequestOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
                COMMISSION PERSONNEL MOVEMENT REQUEST
              </h2>
              <button onClick={() => setIsRequestOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMovement} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Personnel Deployee</label>
                <select
                  value={selectedPersonnelId}
                  onChange={e => setSelectedPersonnelId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                >
                  {personnel.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.personnelId}) · {p.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">From Station / Camp</label>
                  <select
                    value={fromLocation}
                    onChange={e => setFromLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="Maitri Research Station">Maitri Research Station</option>
                    <option value="Bharati Research Station">Bharati Research Station</option>
                    <option value="Schirmacher Oasis Field Camp 3">Schirmacher Oasis Field Camp 3</option>
                    <option value="MV Vasiliy Golovnin">MV Vasiliy Golovnin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">To Destination</label>
                  <select
                    value={toLocation}
                    onChange={e => setToLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="Bharati Research Station">Bharati Research Station</option>
                    <option value="Maitri Research Station">Maitri Research Station</option>
                    <option value="Amundsen-Scott Pole Point">Amundsen-Scott Pole Point</option>
                    <option value="MV Vasiliy Golovnin">MV Vasiliy Golovnin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Departure Date</label>
                  <input
                    type="text"
                    value={departureDate}
                    onChange={e => setDepartureDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Transport Asset</label>
                  <select
                    value={transport}
                    onChange={e => setTransport(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="Twin Otter KB-402">Twin Otter KB-402 (Air)</option>
                    <option value="Helicopter Kamov-32">Helicopter Kamov-32 (Air)</option>
                    <option value="PistenBully Snowcat">PistenBully Snowcat (Overland)</option>
                    <option value="MV Vasiliy Golovnin">MV Vasiliy Golovnin (Maritime)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-cyan-400 font-bold font-mono">AUTOMATED CONFLICT AUDIT: </span>
                FROST validates weather corridors, transport maintenance windows, and passenger payload limits before generating clearance slips.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRequestOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded"
                >
                  Submit Movement Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
