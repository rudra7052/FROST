import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  QrCode, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  Truck, 
  Thermometer, 
  ArrowRight, 
  X,
  Share2,
  FileCheck
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { CargoItem, CargoStatus, PriorityLevel } from '../../types';

export const CargoTracking: React.FC = () => {
  const { 
    cargo, 
    addCargo, 
    updateCargoStatus, 
    selectedCargoId, 
    setSelectedCargoId 
  } = useOperational();

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // New Cargo Form State
  const [trackingNumber, setTrackingNumber] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CargoItem['category']>('Scientific Equipment');
  const [origin, setOrigin] = useState('Delhi National Cargo Complex');
  const [destination, setDestination] = useState('Maitri Research Station');
  const [currentLocation, setCurrentLocation] = useState('Cape Town Gateway Staging');
  const [priority, setPriority] = useState<PriorityLevel>('HIGH');
  const [weightKg, setWeightKg] = useState<number>(350);
  const [volumeM3, setVolumeM3] = useState<number>(1.8);
  const [temperatureControlled, setTemperatureControlled] = useState(false);
  const [requiredTempCelsius, setRequiredTempCelsius] = useState<number>(20);
  const [handler, setHandler] = useState('NCPOR Logistics Wing');
  const [eta, setEta] = useState('12 Oct 2026');

  const selectedCargo = cargo.find(c => c.id === selectedCargoId) || null;

  const filteredCargo = cargo.filter(item => {
    const matchesSearch = 
      item.trackingNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleRegisterCargo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const autoId = trackingNumber || `FR-AX-${Math.floor(10000 + Math.random() * 90000)}`;

    addCargo({
      trackingNumber: autoId,
      description,
      category,
      origin,
      destination,
      currentLocation,
      status: 'REGISTERED',
      priority,
      eta,
      lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
      weightKg: Number(weightKg),
      volumeM3: Number(volumeM3),
      temperatureControlled,
      requiredTempCelsius: temperatureControlled ? Number(requiredTempCelsius) : undefined,
      handler,
      chainOfCustody: [`Registered by ${handler} at ${origin}`],
      timeline: [
        {
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
          location: origin,
          status: 'REGISTERED',
          notes: 'Manifest created and certified for Antarctic consignment',
          handler
        }
      ]
    });

    setIsRegisterOpen(false);
    setDescription('');
    setTrackingNumber('');
  };

  const pipelineSteps: CargoStatus[] = [
    'REGISTERED',
    'PACKED',
    'DISPATCHED',
    'IN TRANSIT',
    'ARRIVED',
    'DELIVERED'
  ];

  const getStepIndex = (status: CargoStatus): number => {
    if (status === 'DELAYED') return 3; // within transit stage
    return pipelineSteps.indexOf(status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Cargo Intelligence & Tracking</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            End-to-end chain of custody tracking from port of embarkation to Antarctic base arrival.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow-md flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Cargo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Cargo ID (e.g. FR-AX-10482), item, port..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="REGISTERED">REGISTERED</option>
            <option value="PACKED">PACKED</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="IN TRANSIT">IN TRANSIT</option>
            <option value="ARRIVED">ARRIVED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="DELAYED">DELAYED</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300 font-mono"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Cargo Table (Section 14) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] text-slate-400">
                <th className="py-3 px-4">CARGO ID</th>
                <th className="py-3 px-4">DESCRIPTION</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">ORIGIN</th>
                <th className="py-3 px-4">DESTINATION</th>
                <th className="py-3 px-4">CURRENT LOCATION</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">PRIORITY</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4">LAST UPDATED</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCargo.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No cargo shipments match search parameters.
                  </td>
                </tr>
              ) : (
                filteredCargo.map(item => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedCargoId(item.id)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {item.trackingNumber}
                    </td>
                    <td className="py-3 px-4 text-white font-medium max-w-[200px] truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {item.origin.split(' ')[0]}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-semibold whitespace-nowrap">
                      {item.destination.replace(' Research Station', '')}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-[150px] truncate" title={item.currentLocation}>
                      {item.currentLocation}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.status === 'DELAYED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        item.status === 'DELIVERED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        item.status === 'ARRIVED' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                        item.status === 'IN TRANSIT' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono">
                      <span className={`${
                        item.priority === 'CRITICAL' ? 'text-red-400 font-bold' :
                        item.priority === 'HIGH' ? 'text-amber-400 font-semibold' :
                        'text-slate-400'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap font-mono">
                      {item.eta}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px] font-mono">
                      {item.lastUpdated}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCargoId(item.id);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-medium group-hover:underline"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cargo Detail Modal (Section 14) */}
      {selectedCargo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold font-mono text-cyan-400">{selectedCargo.trackingNumber}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    selectedCargo.status === 'DELAYED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    selectedCargo.status === 'DELIVERED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {selectedCargo.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">PRIORITY: {selectedCargo.priority}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedCargo.description}</h2>
              </div>
              <button 
                onClick={() => setSelectedCargoId(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delay Alert if any */}
            {selectedCargo.delayReason && (
              <div className="p-3 rounded bg-amber-950/40 border border-amber-800/80 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold font-mono">DELIVERY ADVISORY: </span>
                  <span>{selectedCargo.delayReason}</span>
                </div>
              </div>
            )}

            {/* Visual Tracking Progress Timeline (Section 14) */}
            <div className="space-y-2 p-4 rounded bg-slate-950 border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                CONSIGNMENT STAGES
              </span>

              <div className="grid grid-cols-6 gap-2 pt-2">
                {pipelineSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(selectedCargo.status);
                  const isPassed = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step} className="flex flex-col items-center text-center space-y-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                        isPassed 
                          ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30' 
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[10px] font-mono tracking-tight ${
                        isCurrent ? 'text-cyan-300 font-bold' : isPassed ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">ORIGIN</span>
                <span className="text-white font-medium">{selectedCargo.origin}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">DESTINATION</span>
                <span className="text-cyan-300 font-bold">{selectedCargo.destination}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">WEIGHT & VOLUME</span>
                <span className="text-white font-mono">{selectedCargo.weightKg} kg · {selectedCargo.volumeM3} m³</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">THERMAL PROFILE</span>
                <span className="text-white font-mono">
                  {selectedCargo.temperatureControlled ? `Locked ${selectedCargo.requiredTempCelsius}°C` : 'Standard Ambient'}
                </span>
              </div>
            </div>

            {/* Chain of Custody & Event Log */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              {/* Event History */}
              <div className="space-y-2">
                <span className="font-mono text-slate-400 font-bold block">AUDIT TRAIL & EVENT LOG</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCargo.timeline.map((evt, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-950/80 border border-slate-800 space-y-0.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-cyan-400 font-bold">{evt.status}</span>
                        <span className="text-slate-400">{evt.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{evt.notes}</p>
                      <div className="text-[10px] text-slate-400 flex justify-between">
                        <span>Loc: {evt.location}</span>
                        <span>Handler: {evt.handler}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chain of Custody & QR Code Representation */}
              <div className="space-y-3">
                <span className="font-mono text-slate-400 font-bold block">CHAIN OF CUSTODY & QR CODE</span>
                <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-white font-mono font-bold">{selectedCargo.trackingNumber}</span>
                    <p className="text-[10px] text-slate-400">Digital Consignment QR Manifest</p>
                    <button
                      onClick={() => setShowQrModal(true)}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Full QR Code</span>
                    </button>
                  </div>
                  {/* Visual QR Code Representation Canvas/SVG */}
                  <div 
                    onClick={() => setShowQrModal(true)}
                    className="w-16 h-16 bg-white p-1 rounded cursor-pointer shadow-md flex items-center justify-center shrink-0"
                    title="Click to view QR code"
                  >
                    <svg viewBox="0 0 33 33" className="w-full h-full text-slate-950">
                      <rect width="33" height="33" fill="#ffffff" />
                      {/* Top-left corner finder */}
                      <rect x="2" y="2" width="7" height="7" fill="#000000" />
                      <rect x="3" y="3" width="5" height="5" fill="#ffffff" />
                      <rect x="4" y="4" width="3" height="3" fill="#000000" />
                      {/* Top-right corner finder */}
                      <rect x="24" y="2" width="7" height="7" fill="#000000" />
                      <rect x="25" y="3" width="5" height="5" fill="#ffffff" />
                      <rect x="26" y="4" width="3" height="3" fill="#000000" />
                      {/* Bottom-left corner finder */}
                      <rect x="2" y="24" width="7" height="7" fill="#000000" />
                      <rect x="3" y="25" width="5" height="5" fill="#ffffff" />
                      <rect x="4" y="26" width="3" height="3" fill="#000000" />
                      {/* Data dots pattern */}
                      <rect x="12" y="4" width="2" height="2" fill="#000" />
                      <rect x="16" y="6" width="2" height="2" fill="#000" />
                      <rect x="10" y="10" width="3" height="3" fill="#000" />
                      <rect x="15" y="12" width="4" height="2" fill="#000" />
                      <rect x="14" y="16" width="5" height="5" fill="#000" />
                      <rect x="11" y="23" width="2" height="4" fill="#000" />
                      <rect x="18" y="24" width="3" height="3" fill="#000" />
                      <rect x="24" y="14" width="4" height="3" fill="#000" />
                      <rect x="25" y="20" width="3" height="4" fill="#000" />
                      <rect x="26" y="26" width="3" height="3" fill="#000" />
                    </svg>
                  </div>
                </div>

                {/* Status Updater */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-400">DISPATCH / STATUS TRANSITION</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['PACKED', 'DISPATCHED', 'IN TRANSIT', 'ARRIVED', 'DELIVERED', 'DELAYED'] as CargoStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => updateCargoStatus(selectedCargo.id, st)}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                          selectedCargo.status === st
                            ? 'bg-cyan-400 text-slate-950 font-bold'
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

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedCargoId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Presentation Modal */}
      {showQrModal && selectedCargo && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-white">CARGO QR PASSPORT</span>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-white p-4 rounded-lg inline-block mx-auto shadow-xl">
              <svg viewBox="0 0 33 33" className="w-48 h-48 text-slate-950">
                <rect width="33" height="33" fill="#ffffff" />
                <rect x="2" y="2" width="7" height="7" fill="#000000" />
                <rect x="3" y="3" width="5" height="5" fill="#ffffff" />
                <rect x="4" y="4" width="3" height="3" fill="#000000" />
                <rect x="24" y="2" width="7" height="7" fill="#000000" />
                <rect x="25" y="3" width="5" height="5" fill="#ffffff" />
                <rect x="26" y="4" width="3" height="3" fill="#000000" />
                <rect x="2" y="24" width="7" height="7" fill="#000000" />
                <rect x="3" y="25" width="5" height="5" fill="#ffffff" />
                <rect x="4" y="26" width="3" height="3" fill="#000000" />
                <rect x="12" y="4" width="2" height="2" fill="#000" />
                <rect x="16" y="6" width="2" height="2" fill="#000" />
                <rect x="10" y="10" width="3" height="3" fill="#000" />
                <rect x="15" y="12" width="4" height="2" fill="#000" />
                <rect x="14" y="16" width="5" height="5" fill="#000" />
                <rect x="11" y="23" width="2" height="4" fill="#000" />
                <rect x="18" y="24" width="3" height="3" fill="#000" />
                <rect x="24" y="14" width="4" height="3" fill="#000" />
                <rect x="25" y="20" width="3" height="4" fill="#000" />
                <rect x="26" y="26" width="3" height="3" fill="#000" />
              </svg>
            </div>

            <div className="space-y-1">
              <p className="font-mono font-bold text-sm text-cyan-400">{selectedCargo.trackingNumber}</p>
              <p className="text-xs text-slate-300">{selectedCargo.description}</p>
              <p className="text-[11px] text-slate-400 font-mono">Dest: {selectedCargo.destination}</p>
            </div>

            <button
              onClick={() => {
                alert(`QR Code Manifest for ${selectedCargo.trackingNumber} copied to clipboard!`);
                setShowQrModal(false);
              }}
              className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded cursor-pointer"
            >
              Export Manifest Tag
            </button>
          </div>
        </div>
      )}

      {/* Register New Cargo Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" />
                REGISTER POLAR CARGO CONSIGNMENT
              </h2>
              <button onClick={() => setIsRegisterOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterCargo} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Consignment Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seismic Geophone Array & Cold-Hardened Cables"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Tracking Code (Optional / Auto)</label>
                  <input
                    type="text"
                    placeholder="FR-AX-10555"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="Scientific Equipment">Scientific Equipment</option>
                    <option value="Fuel">Fuel</option>
                    <option value="Food Supplies">Food Supplies</option>
                    <option value="Medical">Medical</option>
                    <option value="Vehicle Parts">Vehicle Parts</option>
                    <option value="Habitation">Habitation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Origin</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Destination</label>
                  <select
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="Maitri Research Station">Maitri Research Station</option>
                    <option value="Bharati Research Station">Bharati Research Station</option>
                    <option value="MV Vasiliy Golovnin">MV Vasiliy Golovnin</option>
                    <option value="Amundsen-Scott Pole Point">Amundsen-Scott Pole Point</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={e => setWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Volume (m³)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={volumeM3}
                    onChange={e => setVolumeM3(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white bg-slate-800 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-slate-950 font-bold bg-cyan-400 hover:bg-cyan-300 rounded cursor-pointer"
                >
                  Register Consignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
