import React from 'react';
import { 
  Compass, 
  Users, 
  Package, 
  AlertTriangle, 
  Wrench, 
  ShieldAlert, 
  ArrowRight, 
  Radio, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  MapPin, 
  AlertOctagon 
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { PolarMap } from './PolarMap';

export const MissionControl: React.FC = () => {
  const { 
    expeditions, 
    personnel, 
    cargo, 
    inventory, 
    assets, 
    incidents, 
    alerts, 
    setCurrentView, 
    quickNavigateTo 
  } = useOperational();

  const activeExpeditionsCount = expeditions.filter(e => e.status === 'ACTIVE').length;
  // Simulated total polar deployed personnel count based on Section 11 (87 personnel)
  const deployedPersonnelCount = 87;
  const cargoInTransitCount = 24; // Simulated active manifests across air/sea corridors
  const lowStockAlertsCount = 7;
  const activeAssetsCount = 142;
  const openIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length || 2;

  const criticalIncident = incidents.find(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED');

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            Mission Control
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time operational overview across polar missions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 px-3 py-1.5 rounded flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>44TH INDIAN SCIENTIFIC EXPEDITION TO ANTARCTICA (ISEA)</span>
          </div>
        </div>
      </div>

      {/* Critical Emergency Banner if Active Incident exists */}
      {criticalIncident && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-red-950/80 via-red-900/50 to-slate-900 border border-red-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg polar-glow-danger animate-pulse">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded bg-red-900/80 text-red-200 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-red-400">
                  ACTIVE CRITICAL EMERGENCY #{criticalIncident.incidentNumber}
                </span>
                <span className="text-[11px] text-slate-300">· {criticalIncident.reportedTime}</span>
              </div>
              <h3 className="text-base font-bold text-white">
                {criticalIncident.title}
              </h3>
              <p className="text-xs text-slate-300">
                Location: {criticalIncident.location} · Affected: {criticalIncident.affectedPersonnelCount} personnel · Lead: {criticalIncident.leadResponder}
              </p>
            </div>
          </div>
          <button
            onClick={() => quickNavigateTo('emergency', criticalIncident.id, 'incident')}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-red-400 hover:bg-red-300 rounded shrink-0 self-start sm:self-center transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Open Incident Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 6 Clickable KPI Cards (Section 11) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Active Expeditions */}
        <div
          onClick={() => setCurrentView('expeditions')}
          className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-[11px]">EXPEDITIONS</span>
            <Compass className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            0{activeExpeditionsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Active Deployments</span>
          </div>
        </div>

        {/* Card 2: Personnel Deployed */}
        <div
          onClick={() => setCurrentView('personnel')}
          className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-[11px]">PERSONNEL</span>
            <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {deployedPersonnelCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Maitri, Bharati, Field</span>
          </div>
        </div>

        {/* Card 3: Cargo In Transit */}
        <div
          onClick={() => setCurrentView('cargo')}
          className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-[11px]">CARGO TRANSIT</span>
            <Package className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {cargoInTransitCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>1 Sea / 1 Air Delayed</span>
          </div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div
          onClick={() => setCurrentView('inventory')}
          className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-[11px]">STOCK ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
            0{lowStockAlertsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>Fuel / Oxygen Deficit</span>
          </div>
        </div>

        {/* Card 5: Active Assets */}
        <div
          onClick={() => setCurrentView('assets')}
          className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-[11px]">ACTIVE ASSETS</span>
            <Wrench className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {activeAssetsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>94.2% Availability</span>
          </div>
        </div>

        {/* Card 6: Open Incidents */}
        <div
          onClick={() => setCurrentView('emergency')}
          className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-red-500/60 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono text-[11px]">INCIDENTS</span>
            <AlertOctagon className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-400">
            0{openIncidentsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            <span>1 Critical, 1 Weather</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Polar Operations Map + Operational Telemetry */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Polar Map (8 cols) */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>LIVE POLAR OPERATIONS THEATER</span>
            </h2>
            <button
              onClick={() => setCurrentView('live-map')}
              className="text-xs text-cyan-400 hover:underline cursor-pointer"
            >
              Full Screen Map →
            </button>
          </div>
          <PolarMap compact />
        </div>

        {/* Right Column: Smart Prediction Watch & Inbound Logistics Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Smart Automation Telemetry Spotlight */}
          <div className="p-4 rounded-lg bg-slate-900/80 border border-amber-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                SMART RISK ADVISORY
              </span>
              <span className="text-[10px] font-mono text-slate-400">Maitri Station</span>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Diesel Fuel Level:</span>
                <span className="font-mono font-bold text-white">4,800 L</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Daily Burn:</span>
                <span className="font-mono text-amber-300">420 L/day</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Depletion in:</span>
                <span className="font-mono text-amber-400 font-bold">11.4 days</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Next Resupply:</span>
                <span className="font-mono text-slate-300">15 days</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ⚠ Deficit of ~3.6 days detected before resupply vessel arrival.
            </p>

            <button
              onClick={() => setCurrentView('inventory')}
              className="w-full py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer"
            >
              Manage Fuel Inventory →
            </button>
          </div>

          {/* Quick Cargo Priority Feed */}
          <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">
                INBOUND CARGO WATCH
              </span>
              <button
                onClick={() => setCurrentView('cargo')}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                View All Cargo
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {cargo.slice(0, 3).map(item => (
                <div
                  key={item.id}
                  onClick={() => quickNavigateTo('cargo', item.id, 'cargo')}
                  className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80 hover:border-cyan-800 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white">{item.trackingNumber}</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      item.status === 'DELAYED' ? 'bg-amber-950 text-amber-300' :
                      item.status === 'ARRIVED' ? 'bg-emerald-950 text-emerald-300' :
                      'bg-cyan-950 text-cyan-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">{item.description}</p>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Dest: {item.destination.replace(' Research Station', '')}</span>
                    <span className="text-cyan-400">ETA: {item.eta.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
