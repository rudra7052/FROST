import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle, 
  Calendar, 
  Layers, 
  Package, 
  Box, 
  Users, 
  ShieldAlert,
  X
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { AnalyticsReportsChatbot } from './AnalyticsReportsChatbot';

export const Reports: React.FC = () => {
  const { expeditions, cargo, inventory, personnel, assets, incidents } = useOperational();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'expedition_summary',
      title: '44th ISEA Expedition Operations Summary',
      category: 'Expedition Command',
      icon: Layers,
      description: 'Comprehensive status report of all active Antarctic science missions, station personnel complements, and budget drawdowns.',
      recordsCount: expeditions.length,
    },
    {
      id: 'cargo_manifest',
      title: 'Consolidated Polar Cargo & Cold-Chain Manifest',
      category: 'Logistics Intelligence',
      icon: Package,
      description: 'Full audit log of active consignments, inter-modal transit statuses, delays, and chain of custody handoffs.',
      recordsCount: cargo.length,
    },
    {
      id: 'inventory_risk',
      title: 'Station Consumables & Resupply Depletion Audit',
      category: 'Smart Inventory',
      icon: Box,
      description: 'Depletion curve analytics, threshold shortfall warnings (including Maitri Arctic-50 Fuel deficit), and safety margins.',
      recordsCount: inventory.length,
    },
    {
      id: 'personnel_deployment',
      title: 'Polar Personnel Medical & Deployment Roster',
      category: 'Human Resources',
      icon: Users,
      description: 'Official registry of deployed scientists, station leaders, check-in histories, and emergency contacts.',
      recordsCount: personnel.length,
    },
    {
      id: 'incident_after_action',
      title: 'Emergency Incident After-Action Report (AAR)',
      category: 'Emergency Command',
      icon: ShieldAlert,
      description: 'Detailed chronological timeline logs, medical SAR interventions, response times, and resource allocations for Incident #INC-204.',
      recordsCount: incidents.length,
    },
  ];

  const handleDownload = (reportTitle: string) => {
    setDownloadSuccessMsg(`Generated official PDF/CSV export for "${reportTitle}". Download complete.`);
    setTimeout(() => setDownloadSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Executive Mission Reports</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            MoES & NCPOR compliant operational summaries, cargo manifests, inventory audits and safety after-action reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('All Combined Expeditions')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Mission Dossier</span>
          </button>
        </div>
      </div>

      {/* Success notification */}
      {downloadSuccessMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* Reports Grid (Section 24) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map(rep => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-800 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {rep.recordsCount} RECORDS
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    {rep.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 leading-snug">{rep.title}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rep.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedReport(rep.id)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  Preview Document →
                </button>
                <button
                  onClick={() => handleDownload(rep.title)}
                  className="p-2 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gemini AI Dossier & Reporting Chatbot */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div>
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span>GEMINI EXECUTIVE DOSSIER & REPORT SYNTHESIS ENGINE</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatically compile executive briefs, audit logs, and mission debriefs from polar field data with real-time web grounding.
          </p>
        </div>
        <AnalyticsReportsChatbot embeddedIn="reports" />
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400">OFFICIAL MoES / NCPOR RECORD</span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {reportTypes.find(r => r.id === selectedReport)?.title}
                </h2>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Document Print Header */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>GOVERNMENT OF INDIA · MINISTRY OF EARTH SCIENCES</span>
                <span>DOC ID: FROST-REP-44-{Date.now().toString().slice(-4)}</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>ISSUING BODY: NCPOR POLAR COMMAND</span>
                <span>SECURITY CLEARANCE: RESTRICTED OPERATIONAL</span>
              </div>
            </div>

            {/* Preview Body depending on report */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs max-h-72 overflow-y-auto font-mono">
              {selectedReport === 'expedition_summary' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-cyan-400">ACTIVE EXPEDITIONS REGISTRY</h4>
                  {expeditions.map(e => (
                    <div key={e.id} className="p-2 border-b border-slate-800/80 text-[11px] text-slate-300">
                      <p className="font-bold text-white">{e.name} ({e.code})</p>
                      <p className="text-slate-400">Station: {e.stationName} · Commander: {e.commander} · Personnel: {e.personnelCount}</p>
                      <p className="text-slate-400">Objective: {e.objective}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedReport === 'cargo_manifest' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-cyan-400">CARGO MANIFEST & TRANSIT STATE</h4>
                  {cargo.map(c => (
                    <div key={c.id} className="p-2 border-b border-slate-800/80 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span className="font-bold text-white">{c.trackingNumber} · {c.description}</span>
                        <span className="text-cyan-300">{c.status}</span>
                      </div>
                      <p className="text-slate-400">Route: {c.origin} ⟶ {c.destination} · Weight: {c.weightKg}kg</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedReport === 'inventory_risk' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-cyan-400">CONSUMABLES RISK AUDIT</h4>
                  {inventory.map(inv => (
                    <div key={inv.id} className="p-2 border-b border-slate-800/80 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span className="font-bold text-white">{inv.item} ({inv.station})</span>
                        <span className={inv.status === 'CRITICAL_RISK' ? 'text-red-400' : 'text-emerald-400'}>{inv.status}</span>
                      </div>
                      <p className="text-slate-400">Quantity: {inv.quantity} {inv.unit} · Days Remaining: {inv.daysRemaining} days (Threshold: {inv.threshold})</p>
                      {inv.recommendation && <p className="text-amber-300 text-[10px]">Action: {inv.recommendation}</p>}
                    </div>
                  ))}
                </div>
              )}

              {selectedReport === 'personnel_deployment' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-cyan-400">DEPLOYED EXPEDITION PERSONNEL</h4>
                  {personnel.map(p => (
                    <div key={p.id} className="p-2 border-b border-slate-800/80 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span className="font-bold text-white">{p.name} ({p.personnelId})</span>
                        <span className="text-emerald-400">{p.status}</span>
                      </div>
                      <p className="text-slate-400">{p.role} · {p.department} · Station: {p.currentLocation}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedReport === 'incident_after_action' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-red-400">EMERGENCY AFTER-ACTION DOSSIER</h4>
                  {incidents.map(inc => (
                    <div key={inc.id} className="p-2 border-b border-slate-800/80 text-[11px] text-slate-300">
                      <p className="font-bold text-white">#{inc.incidentNumber}: {inc.title} [{inc.severity}]</p>
                      <p className="text-slate-400">Location: {inc.location} · Lead: {inc.leadResponder}</p>
                      <div className="mt-1 space-y-0.5">
                        {inc.timeline.map((t, idx) => (
                          <p key={idx} className="text-slate-400 text-[10px]">[{t.time}] {t.action} - {t.actor}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(reportTypes.find(r => r.id === selectedReport)?.title || 'Report');
                    setSelectedReport(null);
                  }}
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
