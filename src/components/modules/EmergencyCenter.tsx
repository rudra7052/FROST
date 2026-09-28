import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Plus, 
  Clock, 
  Users, 
  MapPin, 
  HeartPulse, 
  Flame, 
  Wrench, 
  CloudLightning, 
  Send, 
  CheckCircle2, 
  X,
  Radio,
  FileCheck
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { Incident, StationId } from '../../types';

export const EmergencyCenter: React.FC = () => {
  const { 
    incidents, 
    addIncident, 
    addIncidentTimelineEvent, 
    updateIncidentStatus,
    selectedIncidentId,
    setSelectedIncidentId 
  } = useOperational();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activeTabIncidentId, setActiveTabIncidentId] = useState<string>(
    selectedIncidentId || incidents[0]?.id || ''
  );
  const [newActionInput, setNewActionInput] = useState('');

  // New Incident Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Incident['type']>('Medical');
  const [location, setLocation] = useState('Maitri Research Station (Medical Ward Alpha)');
  const [stationId, setStationId] = useState<StationId>('maitri');
  const [severity, setSeverity] = useState<Incident['severity']>('CRITICAL');
  const [affectedPersonnelCount, setAffectedPersonnelCount] = useState<number>(2);
  const [affectedPersonnelNames, setAffectedPersonnelNames] = useState('Technician Subhash Rawat, Amit Bansal');
  const [affectedAssets, setAffectedAssets] = useState('PistenBully Snowcat PB-18, Portable Oxygen Unit');
  const [description, setDescription] = useState('');
  const [requiredResources, setRequiredResources] = useState('Hyperbaric warming pod, oxygen line, trauma physician');
  const [leadResponder, setLeadResponder] = useState('Dr. Rajesh Sen (Chief Medical Officer)');

  const activeIncident = incidents.find(i => i.id === activeTabIncidentId) || incidents[0];

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const created = addIncident({
      title,
      type,
      location,
      stationId,
      severity,
      affectedPersonnelCount: Number(affectedPersonnelCount),
      affectedPersonnelNames: affectedPersonnelNames.split(',').map(s => s.trim()).filter(Boolean),
      affectedAssets: affectedAssets.split(',').map(s => s.trim()).filter(Boolean),
      leadResponder,
      description,
      requiredResources
    });

    setIsReportOpen(false);
    setActiveTabIncidentId(created.id);
    setTitle('');
    setDescription('');
  };

  const handleAddTimelineAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionInput.trim() || !activeIncident) return;
    addIncidentTimelineEvent(activeIncident.id, newActionInput, 'Dr. Ananya Rao (Operations Commander)');
    setNewActionInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-mono text-white">EMERGENCY COMMAND CENTER</h1>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Mission-critical search and rescue, medical evacuations and extreme weather emergency response dispatch.
          </p>
        </div>

        <button
          onClick={() => setIsReportOpen(true)}
          className="px-4 py-2 text-xs font-bold text-slate-950 bg-red-400 hover:bg-red-300 rounded shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Incident</span>
        </button>
      </div>

      {/* Incident Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {incidents.map(inc => (
          <button
            key={inc.id}
            onClick={() => setActiveTabIncidentId(inc.id)}
            className={`px-4 py-2 rounded-lg font-mono font-bold flex items-center gap-2.5 cursor-pointer transition-all ${
              activeIncident?.id === inc.id
                ? 'bg-red-950 text-red-200 border border-red-700 shadow-md polar-glow-danger'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${inc.severity === 'CRITICAL' ? 'bg-red-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>#{inc.incidentNumber} · {inc.title.slice(0, 24)}...</span>
          </button>
        ))}
      </div>

      {/* Active Incident Operational Command Board (Section 20 & 21) */}
      {activeIncident && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Incident Dossier (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-xl bg-slate-900/80 border border-red-800/60 shadow-xl space-y-5">
              {/* Incident Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-extrabold text-red-400 text-sm">INCIDENT #{activeIncident.incidentNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      {activeIncident.severity}
                    </span>
                    <span className="text-slate-400">· {activeIncident.reportedTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1.5">{activeIncident.title}</h2>
                </div>

                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold whitespace-nowrap ${
                  activeIncident.status === 'RESPONSE IN PROGRESS' ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse' :
                  activeIncident.status === 'CONTAINED' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {activeIncident.status}
                </span>
              </div>

              {/* Core Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">INCIDENT TYPE</span>
                  <span className="text-white font-bold">{activeIncident.type}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">LOCATION</span>
                  <span className="text-cyan-300 font-medium truncate block">{activeIncident.location}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">AFFECTED</span>
                  <span className="text-red-400 font-bold font-mono">0{activeIncident.affectedPersonnelCount} Personnel</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">LEAD RESPONDER</span>
                  <span className="text-white truncate block">{activeIncident.leadResponder.split(' ')[0]} {activeIncident.leadResponder.split(' ')[1]}</span>
                </div>
              </div>

              {/* Description & Sitrep */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  SITUATION REPORT (SITREP)
                </span>
                <p className="text-xs text-slate-200 bg-slate-950 p-3.5 rounded border border-slate-800 leading-relaxed">
                  {activeIncident.description}
                </p>
              </div>

              {/* Allocated Resources */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  DEPLOYED EMERGENCY RESOURCES & ASSETS
                </span>
                <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <p><span className="text-slate-400 font-mono">Resources: </span>{activeIncident.requiredResources}</p>
                  <p><span className="text-slate-400 font-mono">Affected Assets: </span>{activeIncident.affectedAssets.join(', ') || 'None'}</p>
                  <p><span className="text-slate-400 font-mono">Personnel Involved: </span>{activeIncident.affectedPersonnelNames.join(', ') || 'N/A'}</p>
                </div>
              </div>

              {/* Status Transition Control */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400 font-bold block">
                  INCIDENT RESPONSE STATE TRANSITION
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {(['ACTIVE', 'RESPONSE IN PROGRESS', 'CONTAINED', 'RESOLVED'] as Incident['status'][]).map(st => (
                    <button
                      key={st}
                      onClick={() => updateIncidentStatus(activeIncident.id, st)}
                      className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                        activeIncident.status === st
                          ? 'bg-red-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Response Timeline (Section 21) (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold font-mono text-white uppercase">
                    INCIDENT RESPONSE TIMELINE
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">UTC LIVE AUDIT</span>
              </div>

              {/* Timeline Items */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {activeIncident.timeline.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="font-mono text-cyan-400 font-bold shrink-0 pt-0.5 text-[11px]">
                      {evt.time}
                    </span>
                    <div className="flex-1 bg-slate-950 p-2.5 rounded border border-slate-800/80 space-y-1">
                      <p className="text-slate-200 font-medium leading-relaxed">{evt.action}</p>
                      <span className="text-[10px] font-mono text-slate-400 block">By: {evt.actor}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Dispatch Input Form */}
              <form onSubmit={handleAddTimelineAction} className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <span className="font-mono text-slate-400 block font-semibold">
                  DISPATCH ACTION / ADD SITUATION UPDATE
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Log field update (e.g. Core warming underway)..."
                    value={newActionInput}
                    onChange={e => setNewActionInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-2 text-white text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Log</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Report New Incident Modal (Section 20) */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-700/80 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold font-mono text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                REPORT EMERGENCY INCIDENT
              </h2>
              <button onClick={() => setIsReportOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Severe Blizzard Structure Compromise at Dome C"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Incident Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="Medical">Medical</option>
                    <option value="Fire">Fire</option>
                    <option value="Equipment Failure">Equipment Failure</option>
                    <option value="Weather">Weather</option>
                    <option value="Transport">Transport</option>
                    <option value="Communication">Communication</option>
                    <option value="Personnel">Personnel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Severity Level</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono font-bold"
                  >
                    <option value="CRITICAL" className="text-red-400">CRITICAL</option>
                    <option value="HIGH" className="text-amber-400">HIGH</option>
                    <option value="MEDIUM" className="text-yellow-400">MEDIUM</option>
                    <option value="LOW" className="text-blue-400">LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Station Base</label>
                  <select
                    value={stationId}
                    onChange={e => setStationId(e.target.value as StationId)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="maitri">Maitri Research Station</option>
                    <option value="bharati">Bharati Research Station</option>
                    <option value="vessel_golovnin">MV Vasiliy Golovnin</option>
                    <option value="south_pole">Amundsen-Scott Pole Point</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Affected Personnel Count</label>
                  <input
                    type="number"
                    value={affectedPersonnelCount}
                    onChange={e => setAffectedPersonnelCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Lead Responder</label>
                  <input
                    type="text"
                    value={leadResponder}
                    onChange={e => setLeadResponder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Incident Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe situational urgency and tactical constraints..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-red-500 rounded p-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Required Emergency Resources</label>
                <input
                  type="text"
                  value={requiredResources}
                  onChange={e => setRequiredResources(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded cursor-pointer"
                >
                  Dispatch Emergency Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
