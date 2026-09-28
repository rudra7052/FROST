import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  RotateCcw, 
  CheckCircle2, 
  Radio, 
  Key, 
  Sliders
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const Settings: React.FC = () => {
  const { resetAllData } = useOperational();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [fuelThresholdPct, setFuelThresholdPct] = useState(25);
  const [weatherAlertKt, setWeatherAlertKt] = useState(40);
  const [autoAcknowledge, setAutoAcknowledge] = useState(false);

  const handleResetData = () => {
    if (confirm('Restore initial Antarctic mission baseline data? Any custom consignments or incident logs will be reset.')) {
      resetAllData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">System & Operational Settings</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Operations commander credentials, telemetry polling frequencies and local mission persistence controls.
          </p>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Operational baseline restored to default polar expedition configuration.</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 text-xs">
        {/* Profile Card */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white">COMMANDER PROFILE</h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-900 to-blue-700 border-2 border-cyan-400 flex items-center justify-center text-white font-bold text-lg">
              AR
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Dr. Ananya Rao</h4>
              <p className="text-slate-400">Expedition Operations Commander</p>
              <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>OPERATIONAL · ACTIVE LOGON</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Organization:</span>
              <span className="text-slate-200">National Centre for Polar and Ocean Research (NCPOR)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Ministry:</span>
              <span className="text-slate-200">Ministry of Earth Sciences (MoES)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Security Clearance:</span>
              <span className="font-mono text-cyan-400 font-bold">LEVEL-5 POLAR FIELD COMMAND</span>
            </div>
          </div>
        </div>

        {/* Intelligence & Alert Thresholds */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white">PREDICTIVE ALERT THRESHOLDS</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Fuel Depletion Risk Trigger:</span>
                <span className="font-mono text-cyan-400 font-bold">{fuelThresholdPct}% reserve margin</span>
              </div>
              <input
                type="range"
                min={15}
                max={40}
                value={fuelThresholdPct}
                onChange={e => setFuelThresholdPct(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">Katabatic Wind Warning Threshold:</span>
                <span className="font-mono text-cyan-400 font-bold">{weatherAlertKt} knots</span>
              </div>
              <input
                type="range"
                min={25}
                max={60}
                value={weatherAlertKt}
                onChange={e => setWeatherAlertKt(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-slate-300">Continuous UTC Telemetry Sync:</span>
              <span className="font-mono text-emerald-400 font-bold">ENABLED (1s HEARTBEAT)</span>
            </div>
          </div>
        </div>

        {/* Security & Access Protocols */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white">SECURITY & SATELLITE COMMS</h3>
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span>Iridium High-Latitude Encryption</span>
              <span className="font-mono text-emerald-400">AES-256 GCM</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span>DROMLAN Flight Clearing Certificate</span>
              <span className="font-mono text-cyan-400">ACTIVE (44-ISEA)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span>Digital Chain of Custody Signature</span>
              <span className="font-mono text-emerald-400">SHA-256 VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Data Persistence & Reset Controls */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white">DATA MANAGEMENT</h3>
          </div>

          <p className="text-slate-300 leading-relaxed">
            All operations state (expedition edits, cargo tracking, inventory adjustments, movement conflicts, and emergency timeline logs) are securely stored in your browser session storage.
          </p>

          <div className="pt-2">
            <button
              onClick={handleResetData}
              className="px-4 py-2.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/80 rounded font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore Default Operational Baseline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
