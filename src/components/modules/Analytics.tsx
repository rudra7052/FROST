import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Box, 
  Users, 
  ShieldAlert, 
  Compass, 
  Wrench,
  Fuel
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { AnalyticsReportsChatbot } from './AnalyticsReportsChatbot';

export const Analytics: React.FC = () => {
  const { expeditions, cargo, inventory, assets, personnel, incidents } = useOperational();

  // Monthly throughput data (Metric Tonnes)
  const throughputData = [
    { month: 'May', planned: 45, actual: 42 },
    { month: 'Jun', planned: 60, actual: 58 },
    { month: 'Jul', planned: 75, actual: 70 },
    { month: 'Aug', planned: 110, actual: 95 },
    { month: 'Sep', planned: 140, actual: 128 },
    { month: 'Oct (Est)', planned: 180, actual: 162 },
  ];

  const maxThroughput = Math.max(...throughputData.map(d => Math.max(d.planned, d.actual)));

  // Station personnel breakdown
  const personnelByStation = [
    { name: 'Maitri Research Station', count: 42, color: '#38bdf8' },
    { name: 'Bharati Research Station', count: 31, color: '#10b981' },
    { name: 'Cape Town Gateway Hub', count: 6, color: '#a855f7' },
    { name: 'MV Vasiliy Golovnin', count: 4, color: '#f59e0b' },
    { name: 'Amundsen-Scott Pole Point', count: 4, color: '#ec4899' },
  ];

  // Asset status counts
  const assetStatusCounts = {
    OPERATIONAL: assets.filter(a => a.status === 'OPERATIONAL').length,
    STANDBY: assets.filter(a => a.status === 'STANDBY').length,
    MAINTENANCE: assets.filter(a => a.status === 'MAINTENANCE').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Operational Analytics & Trends</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Mission logistics throughput, consumption burn curves, asset availability and safety incident distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 px-3 py-1.5 rounded">
            TELEMETRY CADENCE: REAL-TIME (HOURLY SYNC)
          </span>
        </div>
      </div>

      {/* Grid of Analytical Charts (Section 23) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart 1: Cargo Throughput Over Time */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" />
                <span>CARGO THROUGHPUT (METRIC TONNES)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Planned vs Actual Delivered Tonnage</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm" /> Actual
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 bg-slate-700 rounded-sm" /> Planned
              </span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {throughputData.map((d, i) => {
              const actualHeight = Math.round((d.actual / maxThroughput) * 160);
              const plannedHeight = Math.round((d.planned / maxThroughput) * 160);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Planned Bar */}
                    <div 
                      className="w-1/2 bg-slate-800 rounded-t transition-all group-hover:bg-slate-700" 
                      style={{ height: `${plannedHeight}px` }}
                      title={`Planned: ${d.planned}T`}
                    />
                    {/* Actual Bar */}
                    <div 
                      className="w-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all group-hover:brightness-110" 
                      style={{ height: `${actualHeight}px` }}
                      title={`Actual: ${d.actual}T`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 whitespace-nowrap">{d.month}</span>
                  <span className="text-[10px] font-mono font-bold text-white">{d.actual}T</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Inventory Consumption & Days Remaining */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" />
                <span>KEY CONSUMABLE DEPLETION CURVES</span>
              </h3>
              <p className="text-[11px] text-slate-400">Days Remaining vs Resupply Buffer</p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {inventory.slice(0, 5).map(item => {
              const percentage = Math.min(Math.round((item.daysRemaining / (item.nextResupplyDays * 1.5)) * 100), 100);
              const isDanger = item.daysRemaining < item.nextResupplyDays;

              return (
                <div key={item.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-white truncate max-w-[240px]">{item.item}</span>
                    <span className={`font-mono font-bold ${isDanger ? 'text-red-400' : 'text-emerald-400'}`}>
                      {item.daysRemaining} days left ({item.quantity.toLocaleString()} {item.unit})
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isDanger ? 'bg-red-500' : percentage < 50 ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Personnel Distribution by Station */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>PERSONNEL DISTRIBUTION (TOTAL: 87)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Station Complement Allocation</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {personnelByStation.map((st, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">{st.name}</span>
                  <span className="font-mono font-bold text-white">{st.count} personnel</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full rounded-full"
                    style={{ width: `${(st.count / 87) * 100}%`, backgroundColor: st.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Asset Availability & Maintenance Readiness */}
        <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>ASSET HEALTH & AVAILABILITY</span>
              </h3>
              <p className="text-[11px] text-slate-400">Total Registered Platforms: 142</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-emerald-800/60 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">OPERATIONAL</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-400">128</span>
              <span className="text-[10px] text-emerald-400 font-mono block">90.1%</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-blue-800/60 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">STANDBY / CACHED</span>
              <span className="text-2xl font-extrabold font-mono text-blue-400">10</span>
              <span className="text-[10px] text-blue-400 font-mono block">7.0%</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-amber-800/60 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">MAINTENANCE</span>
              <span className="text-2xl font-extrabold font-mono text-amber-400">04</span>
              <span className="text-[10px] text-amber-400 font-mono block">2.9%</span>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span className="text-cyan-400 font-mono font-bold">RELIABILITY INDEX: </span>
            Polar winterization standards met across all baseload generators and survival vehicles. No cold-stall casualties recorded this operational cycle.
          </div>
        </div>
      </div>

      {/* Gemini AI Chatbot for Analytics */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div>
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span>GEMINI INTELLIGENCE & ANALYTICAL REASONING CHATBOT</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Query operational telemetry, calculate complex consumable depletion slopes, and ground insights with Google Search data.
          </p>
        </div>
        <AnalyticsReportsChatbot embeddedIn="analytics" />
      </div>
    </div>
  );
};
