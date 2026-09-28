import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Filter, 
  ShieldAlert, 
  Check, 
  Clock, 
  Radio,
  ExternalLink
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { SmartAlert } from '../../types';

export const SmartAlerts: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, quickNavigateTo } = useOperational();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Smart Operational Alerts</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time rule-based predictive intelligence, resupply risk notifications, and transport hazard advisories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            Unresolved: <strong className="text-amber-400">{alerts.filter(a => !a.resolved).length}</strong>
          </span>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 rounded font-mono font-medium whitespace-nowrap cursor-pointer transition-colors ${
              filterSeverity === sev
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {sev} ({sev === 'ALL' ? alerts.length : alerts.filter(a => a.severity === sev).length})
          </button>
        ))}
      </div>

      {/* Alerts Stream (Section 22) */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => {
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';
          const isMedium = alert.severity === 'MEDIUM';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border transition-all ${
                alert.resolved
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : isCritical
                  ? 'bg-gradient-to-r from-red-950/40 via-slate-900/90 to-slate-900 border-red-700/80 polar-glow-danger'
                  : isHigh
                  ? 'bg-gradient-to-r from-amber-950/30 via-slate-900/90 to-slate-900 border-amber-700/80'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      isCritical ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                      isHigh ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      isMedium ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-slate-400">SOURCE: {alert.source}</span>
                    <span className="text-slate-400">· {alert.time}</span>
                    {alert.acknowledged && (
                      <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                        <Check className="w-3 h-3" /> Acknowledged
                      </span>
                    )}
                    {alert.resolved && (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{alert.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {alert.description}
                  </p>

                  {/* Recommended Action Box */}
                  <div className="p-3 rounded bg-slate-950/90 border border-slate-800 space-y-1 mt-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      RECOMMENDED MITIGATION
                    </span>
                    <p className="text-xs text-slate-200">
                      {alert.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => quickNavigateTo(alert.targetModule as any)}
                    className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Inspect Module</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}

                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs rounded border border-emerald-800 cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
