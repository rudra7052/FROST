import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Users, 
  Package, 
  Wrench, 
  Compass, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  MapPin, 
  DollarSign,
  Tag
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { Expedition, ExpeditionStatus, StationId } from '../../types';

export const Expeditions: React.FC = () => {
  const { expeditions, addExpedition, updateExpedition, deleteExpedition, stations } = useOperational();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [selectedExpedition, setSelectedExpedition] = useState<Expedition | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // New Expedition Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [stationId, setStationId] = useState<StationId>('maitri');
  const [commander, setCommander] = useState('Dr. Ananya Rao');
  const [leadScientist, setLeadScientist] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [personnelCount, setPersonnelCount] = useState<number>(30);
  const [budgetAllocatedCr, setBudgetAllocatedCr] = useState<number>(25.0);
  const [objective, setObjective] = useState('');
  const [scientificFocusText, setScientificFocusText] = useState('Glaciology, Atmospheric Physics');

  const filteredExpeditions = expeditions.filter(e => {
    if (filterStatus === 'ALL') return true;
    return e.status === filterStatus;
  });

  const handleCreateExpedition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const stationObj = stations.find(s => s.id === stationId);

    addExpedition({
      name,
      code: code || `44-ISEA-${name.slice(0, 4).toUpperCase()}`,
      status: 'PLANNING',
      stationId,
      stationName: stationObj ? stationObj.name : 'Maitri Station',
      commander: commander || 'Dr. Ananya Rao',
      leadScientist: leadScientist || 'Dr. Arjun Mehta',
      startDate: startDate || '15 Nov 2026',
      endDate: endDate || '25 Mar 2027',
      personnelCount: Number(personnelCount),
      cargoItemCount: 45,
      allocatedAssetCount: 22,
      budgetAllocatedCr: Number(budgetAllocatedCr),
      objective: objective || 'Polar permafrost and atmospheric radiation measurements.',
      scientificFocus: scientificFocusText.split(',').map(s => s.trim()).filter(Boolean),
    });

    setIsCreateOpen(false);
    // Reset form
    setName('');
    setCode('');
    setObjective('');
  };

  const handleUpdateStatus = (id: string, newStatus: ExpeditionStatus) => {
    updateExpedition(id, { status: newStatus });
    if (selectedExpedition && selectedExpedition.id === id) {
      setSelectedExpedition(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Expedition Command</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Plan, deploy, and monitor Indian Antarctic research missions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Expedition</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'ACTIVE', 'PLANNING', 'RESUPPLY', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === status
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800/80'
            }`}
          >
            {status} ({status === 'ALL' ? expeditions.length : expeditions.filter(e => e.status === status).length})
          </button>
        ))}
      </div>

      {/* Expeditions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExpeditions.map(exp => (
          <div
            key={exp.id}
            className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-800 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  exp.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                  exp.status === 'PLANNING' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                  'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {exp.status}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{exp.code}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">{exp.name}</h3>
                <p className="text-xs text-cyan-400 font-mono flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {exp.stationName}
                </p>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {exp.objective}
              </p>

              {/* Expedition Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Personnel</span>
                  <span className="text-xs font-bold font-mono text-white flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-cyan-400" />
                    {exp.personnelCount}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Cargo Items</span>
                  <span className="text-xs font-bold font-mono text-white flex items-center justify-center gap-1">
                    <Package className="w-3 h-3 text-cyan-400" />
                    {exp.cargoItemCount}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block">Assets</span>
                  <span className="text-xs font-bold font-mono text-white flex items-center justify-center gap-1">
                    <Wrench className="w-3 h-3 text-cyan-400" />
                    {exp.allocatedAssetCount}
                  </span>
                </div>
              </div>

              {/* Scientific Focus tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {exp.scientificFocus.slice(0, 3).map((f, i) => (
                  <span key={i} className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {exp.startDate} - {exp.endDate}
              </span>
              <button
                onClick={() => setSelectedExpedition(exp)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                Inspect →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Expedition Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                INITIALIZE NEW POLAR EXPEDITION
              </h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpedition} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Expedition Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maitri Permafrost & Climate Survey 2026-27"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Base Station / Facility</label>
                  <select
                    value={stationId}
                    onChange={e => setStationId(e.target.value as StationId)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="maitri">Maitri Research Station</option>
                    <option value="bharati">Bharati Research Station</option>
                    <option value="vessel_golovnin">MV Vasiliy Golovnin (Vessel)</option>
                    <option value="south_pole">Amundsen-Scott Pole Point</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Mission Code</label>
                  <input
                    type="text"
                    placeholder="44-ISEA-CUSTOM"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Operations Commander</label>
                  <input
                    type="text"
                    value={commander}
                    onChange={e => setCommander(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Lead Scientist</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Arjun Mehta"
                    value={leadScientist}
                    onChange={e => setLeadScientist(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Start Date</label>
                  <input
                    type="text"
                    placeholder="15 Oct 2026"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">End Date</label>
                  <input
                    type="text"
                    placeholder="20 Feb 2027"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Team Size (Personnel)</label>
                  <input
                    type="number"
                    value={personnelCount}
                    onChange={e => setPersonnelCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Allocated Budget (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={budgetAllocatedCr}
                    onChange={e => setBudgetAllocatedCr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Scientific Directives & Disciplines (comma separated)</label>
                <input
                  type="text"
                  value={scientificFocusText}
                  onChange={e => setScientificFocusText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Primary Mission Objective</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail scientific deliverables and logistical milestones..."
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white bg-slate-800 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-slate-950 font-bold bg-cyan-400 hover:bg-cyan-300 rounded cursor-pointer"
                >
                  Commission Expedition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expedition Detail Modal */}
      {selectedExpedition && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{selectedExpedition.code}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {selectedExpedition.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedExpedition.name}</h2>
              </div>
              <button onClick={() => setSelectedExpedition(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-mono">MISSION OBJECTIVE</span>
                <p className="text-slate-200 leading-relaxed">{selectedExpedition.objective}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-mono">Commander</span>
                  <span className="font-bold text-white text-xs">{selectedExpedition.commander}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-mono">Lead Scientist</span>
                  <span className="font-bold text-white text-xs">{selectedExpedition.leadScientist}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-mono">Station Base</span>
                  <span className="font-bold text-cyan-300 text-xs">{selectedExpedition.stationName}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-mono">Budget</span>
                  <span className="font-bold text-emerald-400 text-xs font-mono">₹{selectedExpedition.budgetAllocatedCr} Cr</span>
                </div>
              </div>

              {/* Status Manager */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-mono">UPDATE OPERATIONAL STATUS</span>
                <div className="flex flex-wrap gap-2">
                  {(['PLANNING', 'ACTIVE', 'RESUPPLY', 'STANDBY', 'COMPLETED'] as ExpeditionStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedExpedition.id, st)}
                      className={`px-3 py-1 rounded font-mono text-[11px] cursor-pointer transition-colors ${
                        selectedExpedition.status === st
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Expedition */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => {
                    if (confirm(`Confirm decommissioning ${selectedExpedition.name}?`)) {
                      deleteExpedition(selectedExpedition.id);
                      setSelectedExpedition(null);
                    }
                  }}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Decommission Expedition</span>
                </button>
                <button
                  onClick={() => setSelectedExpedition(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
