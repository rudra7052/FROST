import React, { useState } from 'react';
import { 
  Compass, 
  Box, 
  Package, 
  Users, 
  Radio, 
  AlertTriangle, 
  Cpu, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Clock, 
  Snowflake,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';

export const LandingPage: React.FC = () => {
  const { enterFrost } = useOperational();
  const [interactiveConsumption, setInteractiveConsumption] = useState<number>(420);
  const maitriFuel = 4800;
  const resupplyDays = 15;
  const daysLeft = Number((maitriFuel / interactiveConsumption).toFixed(1));
  const deficit = Number((resupplyDays - daysLeft).toFixed(1));
  const isDeficit = deficit > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-x-hidden">
      {/* Ambient Polar Atmospheric Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-1/3 w-[800px] h-[600px] bg-indigo-900/15 rounded-full blur-[180px]" />
        <div className="absolute inset-0 polar-grid opacity-30" />
      </div>

      {/* Top Bar Contract (1 Row, 3 Zones) */}
      <header className="relative z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black tracking-wider text-xs">
              FR
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              FROST
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 border-l border-slate-700 pl-3">
              MoES · NCPOR
            </span>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#solutions" className="hover:text-cyan-400 transition-colors">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-cyan-400 transition-colors">
              Workflow
            </a>
            <a href="#automation" className="hover:text-cyan-400 transition-colors">
              Smart Automation
            </a>
            <a href="#impact" className="hover:text-cyan-400 transition-colors">
              Mission Readiness
            </a>
          </nav>

          {/* Zone 3: Primary action button */}
          <div className="flex items-center gap-3">
            <button
              onClick={enterFrost}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-all duration-200 shadow-md shadow-cyan-500/20 flex items-center gap-2 group cursor-pointer"
            >
              <span>ENTER FROST</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-28 px-6 border-b border-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>NCPOR POLAR LOGISTICS COMMAND · MoES GOVT OF INDIA</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
                FROST
              </h1>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                Polar Operations. Unified.
              </p>
            </div>

            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl">
              A centralized intelligence and logistics platform for planning expeditions, tracking cargo and assets, monitoring personnel and inventory, and coordinating emergency response in extreme environments.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={enterFrost}
                className="px-7 py-3.5 text-sm font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow-xl shadow-cyan-500/25 flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <span>ENTER FROST</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#solutions"
                className="px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 rounded transition-all flex items-center gap-2"
              >
                <span>EXPLORE CAPABILITIES</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Quick Station Readiness Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-xl">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-mono">MAITRI (70°S)</span>
                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  42 On Station
                </p>
                <p className="text-xs text-slate-400">Temp: -28.4°C</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-mono">BHARATI (69°S)</span>
                <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  31 On Station
                </p>
                <p className="text-xs text-slate-400">Temp: -19.2°C</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-mono">MV GOLOVNIN</span>
                <p className="text-sm font-semibold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  In Transit 64°S
                </p>
                <p className="text-xs text-slate-400">242 Metric Tonnes</p>
              </div>
            </div>
          </div>

          {/* Cinematic Polar Radar & Operations Graphic */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-cyan-800/50 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-2xl polar-glow">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>ANTARCTIC LOGISTICS RADAR · LIVE</span>
                </div>
                <span>UTC 09:53</span>
              </div>

              {/* Polar Coordinate Vector Canvas */}
              <div className="relative aspect-square my-4 rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center">
                {/* Radar concentric rings */}
                <div className="absolute w-[85%] h-[85%] rounded-full border border-cyan-900/40" />
                <div className="absolute w-[60%] h-[60%] rounded-full border border-cyan-800/40" />
                <div className="absolute w-[35%] h-[35%] rounded-full border border-cyan-700/40" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12),transparent_70%)]" />
                
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-cyan-900/40" />
                <div className="absolute h-full w-[1px] bg-cyan-900/40" />

                {/* Rotating radar sweep line */}
                <div className="absolute inset-0 flex items-center justify-center animate-[spin_10s_linear_infinite] pointer-events-none">
                  <div className="w-1/2 h-[2px] bg-gradient-to-r from-transparent to-cyan-400 origin-right translate-x-[-50%]" />
                </div>

                {/* Station Markers */}
                <div className="absolute top-[28%] left-[38%] flex items-center gap-1.5 group cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-ping absolute" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
                  <span className="text-[11px] font-mono text-emerald-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-800/60 whitespace-nowrap">
                    MAITRI (70°S)
                  </span>
                </div>

                <div className="absolute top-[36%] right-[22%] flex items-center gap-1.5 group cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 relative" />
                  <span className="text-[11px] font-mono text-emerald-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-800/60 whitespace-nowrap">
                    BHARATI (69°S)
                  </span>
                </div>

                <div className="absolute bottom-[22%] left-[48%] flex items-center gap-1.5 group cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 relative" />
                  <span className="text-[10px] font-mono text-blue-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-blue-800/60 whitespace-nowrap">
                    SOUTH POLE (-90°)
                  </span>
                </div>

                <div className="absolute top-[14%] left-[44%] flex items-center gap-1.5 group cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 relative animate-pulse" />
                  <span className="text-[10px] font-mono text-amber-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-amber-800/60 whitespace-nowrap">
                    VESSEL GOLOVNIN
                  </span>
                </div>
              </div>

              {/* Status footer inside card */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-slate-300">Active Coordinates: Antarctic Continental Sector</span>
                <button
                  onClick={enterFrost}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Map</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section: ONE PLATFORM. EVERY MISSION. */}
      <section id="solutions" className="relative z-10 py-24 px-6 border-b border-slate-900">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 max-w-3xl">
            <p className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Complete Operations Matrix
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              ONE PLATFORM. EVERY MISSION.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Engineered specifically for the extreme conditions of Antarctic and Arctic deployments, uniting science directives with mission-critical logistics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-700/60 transition-colors space-y-3 group">
              <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900/60 transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Expedition Command</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Plan and monitor complete polar expeditions from one operational interface.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-700/60 transition-colors space-y-3 group">
              <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900/60 transition-colors">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Cargo Intelligence</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Track cargo from warehouse dispatch to station arrival using unique cargo IDs and QR codes.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-700/60 transition-colors space-y-3 group">
              <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900/60 transition-colors">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Smart Inventory</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Monitor supplies, fuel, equipment and consumables with automated low-stock and depletion alerts.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-700/60 transition-colors space-y-3 group">
              <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900/60 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Personnel Movement</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Track personnel deployment, station transfers, check-ins and movement history.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-700/60 transition-colors space-y-3 group">
              <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900/60 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Asset Management</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Maintain visibility over scientific equipment, vehicles, generators and mission-critical assets.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-700/60 transition-colors space-y-3 group">
              <div className="w-10 h-10 rounded bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400 group-hover:bg-red-900/60 transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Emergency Response</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Create, assign and monitor emergency incidents with affected personnel, locations and response actions.
              </p>
            </div>

            {/* Card 7 */}
            <div className="p-6 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-700/60 transition-colors space-y-3 group">
              <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900/60 transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Smart Automation</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Convert operational data into alerts, predictions and actionable recommendations.
              </p>
            </div>

            {/* Card 8 */}
            <div className="p-6 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-700/60 transition-colors space-y-3 group">
              <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900/60 transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Operational Intelligence</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Transform expedition data into dashboards, KPIs, trends and decision-support information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How FROST Works: Workflow */}
      <section id="workflow" className="relative z-10 py-24 px-6 border-b border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Operational Lifecycle
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              HOW FROST WORKS
            </h2>
            <p className="text-slate-300 text-base">
              A continuous feedback loop from mission inception to field response.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 relative">
            {/* Step 1: PLAN */}
            <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-3 relative">
              <div className="text-xs font-mono text-cyan-400 font-bold">01. PLAN</div>
              <h4 className="text-base font-bold text-white">Expedition Setup</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Create expedition · assign team · allocate assets · plan cargo shipments.
              </p>
            </div>

            {/* Step 2: DEPLOY */}
            <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-3 relative">
              <div className="text-xs font-mono text-cyan-400 font-bold">02. DEPLOY</div>
              <h4 className="text-base font-bold text-white">Field Transit</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dispatch cargo · move personnel · deploy mission equipment across continents.
              </p>
            </div>

            {/* Step 3: MONITOR */}
            <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-3 relative">
              <div className="text-xs font-mono text-cyan-400 font-bold">03. MONITOR</div>
              <h4 className="text-base font-bold text-white">Live Tracking</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Track cargo · monitor inventory · track personnel check-ins · monitor assets.
              </p>
            </div>

            {/* Step 4: PREDICT */}
            <div className="p-5 rounded-lg bg-cyan-950/40 border border-cyan-700/60 space-y-3 relative">
              <div className="text-xs font-mono text-cyan-400 font-bold">04. PREDICT</div>
              <h4 className="text-base font-bold text-white">Predictive AI</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Detect shortages · identify delays · detect conflicts · generate automated alerts.
              </p>
            </div>

            {/* Step 5: RESPOND */}
            <div className="p-5 rounded-lg bg-red-950/30 border border-red-800/60 space-y-3 relative">
              <div className="text-xs font-mono text-red-400 font-bold">05. RESPOND</div>
              <h4 className="text-base font-bold text-white">Emergency Center</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Emergency incident · notify team · assign actions · resolve · log post-action report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Automation Section: Interactive Demonstration (Matches Section 6) */}
      <section id="automation" className="relative z-10 py-24 px-6 border-b border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 max-w-3xl">
            <p className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Interactive Decision Support
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              SMART AUTOMATION IN ACTION
            </h2>
            <p className="text-slate-300 text-base">
              FROST doesn't just log raw stock counts—it continuously computes burn curves against scheduled resupply windows and transport availability.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Card: BEFORE (Raw Logistics Data) */}
            <div className="lg:col-span-5 p-7 rounded-xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400 tracking-wider">RAW TELEMETRY INPUT</span>
                <span className="text-xs font-mono text-slate-400">Maitri Research Station</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline border-b border-slate-800/60 pb-2">
                  <span className="text-sm text-slate-400">Fuel inventory:</span>
                  <span className="text-xl font-bold font-mono text-white">4,800 L</span>
                </div>

                <div className="space-y-2 border-b border-slate-800/60 pb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-400">Average daily consumption:</span>
                    <span className="text-xl font-bold font-mono text-cyan-300">
                      {interactiveConsumption} L/day
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Adjust burn:</span>
                    <input
                      type="range"
                      min={250}
                      max={600}
                      step={10}
                      value={interactiveConsumption}
                      onChange={(e) => setInteractiveConsumption(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-baseline border-b border-slate-800/60 pb-2">
                  <span className="text-sm text-slate-400">Next resupply window:</span>
                  <span className="text-xl font-bold font-mono text-white">15 days</span>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-sm text-slate-400">Estimated remaining supply:</span>
                  <span className={`text-xl font-bold font-mono ${daysLeft < 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {daysLeft} days
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: FROST INTELLIGENCE & RECOMMENDED ACTION */}
            <div className={`lg:col-span-7 p-7 rounded-xl border space-y-6 transition-colors ${
              isDeficit 
                ? 'bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-slate-900 border-amber-600/70 polar-glow-danger'
                : 'bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900 border-emerald-600/70'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold tracking-wider text-cyan-400">
                    FROST INTELLIGENCE ENGINE
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">CONFIDENCE: 98.4%</span>
              </div>

              {isDeficit ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-400">
                    <AlertTriangle className="w-6 h-6 animate-pulse shrink-0" />
                    <h4 className="text-lg font-bold font-mono tracking-tight">
                      ⚠ RESUPPLY RISK DETECTED
                    </h4>
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-950/60 p-4 rounded border border-amber-900/50">
                    Current fuel consumption (<span className="text-amber-300 font-mono font-semibold">{interactiveConsumption} L/day</span>) indicates the station will drop below operational threshold approximately <span className="text-amber-300 font-mono font-semibold">{deficit} days</span> before the scheduled resupply vessel arrives.
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      RECOMMENDED ACTION
                    </span>
                    <div className="p-3.5 rounded bg-amber-950/30 border border-amber-700/60 flex items-center justify-between">
                      <span className="text-sm font-semibold text-amber-200">
                        Initiate fuel resupply planning & throttle secondary heating circuits.
                      </span>
                      <button
                        onClick={enterFrost}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded cursor-pointer whitespace-nowrap"
                      >
                        Action In Frost →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    <h4 className="text-lg font-bold font-mono tracking-tight">
                      ✓ SUPPLY MARGIN SECURE
                    </h4>
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-950/60 p-4 rounded border border-emerald-900/50">
                    Estimated supply (<span className="text-emerald-300 font-mono font-semibold">{daysLeft} days</span>) provides a safe <span className="text-emerald-300 font-mono font-semibold">{Math.abs(deficit).toFixed(1)} day</span> reserve buffer beyond the scheduled 15-day resupply voyage.
                  </p>
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      RECOMMENDED ACTION
                    </span>
                    <div className="p-3.5 rounded bg-emerald-950/30 border border-emerald-700/60">
                      <span className="text-sm font-semibold text-emerald-200">
                        Maintain standard operational telemetry monitoring.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="relative z-10 py-20 px-6 border-b border-slate-900 bg-slate-950/70">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Operational Proof
            </p>
            <h2 className="text-3xl font-extrabold text-white">
              BUILT FOR HIGH-RISK MISSIONS
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-400">12+</span>
              <p className="text-xs sm:text-sm font-medium text-slate-300">Operational Modules</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-400">100%</span>
              <p className="text-xs sm:text-sm font-medium text-slate-300">Centralized Visibility</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-400">24/7</span>
              <p className="text-xs sm:text-sm font-medium text-slate-300">Mission Monitoring</p>
            </div>
            <div className="p-6 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-400">1</span>
              <p className="text-xs sm:text-sm font-medium text-slate-300">Unified Command Platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              THE POLAR ENVIRONMENT IS UNFORGIVING.
            </h2>
            <p className="text-xl sm:text-2xl text-cyan-300 font-medium">
              Your logistics platform shouldn't be.
            </p>
          </div>

          <div>
            <button
              onClick={enterFrost}
              className="px-9 py-4 text-base font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded shadow-2xl shadow-cyan-500/30 inline-flex items-center gap-3 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <span>ENTER FROST</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-bold text-white font-mono text-sm">FROST</span>
              <span>· Field Resource & Operations Support Tracker</span>
            </div>
            <p className="text-slate-400">
              Ministry of Earth Sciences (MoES) · National Centre for Polar and Ocean Research (NCPOR)
            </p>
          </div>
          <div className="text-center md:text-right space-y-1">
            <p className="font-mono text-slate-400">SIH Theme: Smart Automation</p>
            <p className="text-slate-400">Built for intelligent expedition operations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
