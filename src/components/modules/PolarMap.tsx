import React, { useState } from 'react';
import { 
  Station, 
  StationId 
} from '../../types';
import { useOperational } from '../../context/OperationalContext';
import { 
  Wind, 
  Thermometer, 
  Users, 
  Fuel, 
  ShieldCheck, 
  Radio, 
  Maximize2, 
  Layers, 
  Navigation,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface PolarMapProps {
  compact?: boolean;
}

export const PolarMap: React.FC<PolarMapProps> = ({ compact = false }) => {
  const { stations, setCurrentView } = useOperational();
  const [selectedStationId, setSelectedStationId] = useState<StationId>('maitri');
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showFlightCorridor, setShowFlightCorridor] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedStation = stations.find(s => s.id === selectedStationId) || stations[0];

  // Coordinates projected onto our custom 800x800 Polar Stereographic SVG Canvas
  // Center is South Pole (400, 400)
  const stationProjectedCoords: Record<StationId, { x: number; y: number; labelPos: 'top' | 'bottom' | 'left' | 'right' }> = {
    south_pole: { x: 400, y: 400, labelPos: 'bottom' },
    maitri: { x: 375, y: 235, labelPos: 'top' }, // Queen Maud Land / Schirmacher Oasis
    bharati: { x: 535, y: 290, labelPos: 'right' }, // Larsemann Hills / Prydz Bay
    vessel_golovnin: { x: 430, y: 165, labelPos: 'top' }, // Southern Ocean en route
    cape_town: { x: 385, y: 65, labelPos: 'top' }, // Africa staging gateway
    schirmacher_camp: { x: 360, y: 250, labelPos: 'left' }
  };

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col ${compact ? 'h-[460px]' : 'h-[720px]'}`}>
      {/* Map Control Bar */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ANTARCTIC HIGH-LATITUDE OPERATIONS RADAR (PROJECTION: POLAR STEREOGRAPHIC)</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">· GRID: 70°S - 90°S</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2.5 py-1 rounded font-mono text-[11px] cursor-pointer transition-colors ${
              showRoutes ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Maritime Lanes
          </button>
          <button
            onClick={() => setShowFlightCorridor(!showFlightCorridor)}
            className={`px-2.5 py-1 rounded font-mono text-[11px] cursor-pointer transition-colors ${
              showFlightCorridor ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Air Skiway Routes
          </button>
          {!compact && (
            <div className="flex items-center gap-1 bg-slate-800 rounded p-0.5">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
                className="px-2 py-0.5 text-slate-300 hover:text-white font-mono"
              >
                +
              </button>
              <span className="text-[10px] font-mono px-1 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                className="px-2 py-0.5 text-slate-300 hover:text-white font-mono"
              >
                -
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Map Visual Area */}
      <div className="flex-1 relative overflow-hidden bg-[#030816] flex items-center justify-center">
        {/* Antarctic Continent Vector Map */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-300 select-none"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 800 800"
            className="w-full h-full max-w-[760px] max-h-[760px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients */}
              <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#081832" />
                <stop offset="70%" stopColor="#030816" />
                <stop offset="100%" stopColor="#02040a" />
              </radialGradient>
              <linearGradient id="iceShelfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0e2a47" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#081e35" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#143456" />
                <stop offset="100%" stopColor="#0f2642" />
              </linearGradient>
            </defs>

            {/* Ocean Basin Background */}
            <circle cx="400" cy="400" r="390" fill="url(#oceanGlow)" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="3 3" />

            {/* Polar Coordinate Latitudes */}
            <circle cx="400" cy="400" r="340" fill="none" stroke="#152b47" strokeWidth="1" strokeDasharray="2 4" />
            <text x="405" y="70" fill="#38bdf8" opacity="0.4" fontSize="10" fontFamily="monospace">60°S (Southern Ocean Polar Boundary)</text>

            <circle cx="400" cy="400" r="240" fill="none" stroke="#1b395d" strokeWidth="1" strokeDasharray="4 4" />
            <text x="405" y="170" fill="#38bdf8" opacity="0.4" fontSize="10" fontFamily="monospace">70°S (Antarctic Circle Line)</text>

            <circle cx="400" cy="400" r="130" fill="none" stroke="#1f446e" strokeWidth="1" strokeDasharray="3 3" />
            <text x="405" y="280" fill="#38bdf8" opacity="0.4" fontSize="10" fontFamily="monospace">80°S Polar Plateau</text>

            {/* Longitude Axes */}
            <line x1="400" y1="20" x2="400" y2="780" stroke="#112742" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="20" y1="400" x2="780" y2="400" stroke="#112742" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="130" y1="130" x2="670" y2="670" stroke="#112742" strokeWidth="0.8" strokeDasharray="2 6" />
            <line x1="130" y1="670" x2="670" y2="130" stroke="#112742" strokeWidth="0.8" strokeDasharray="2 6" />

            {/* Continental Ice Shelf Contours (Antarctic Peninsula, Queen Maud Land, Enderby, Prydz Bay, Wilkes Land, Ross Shelf, Ronne Shelf) */}
            <path
              d="M 370 190 
                 C 420 180, 480 200, 520 230 
                 C 560 260, 600 310, 610 380 
                 C 620 440, 590 510, 550 560 
                 C 510 610, 430 630, 360 620 
                 C 300 610, 240 560, 220 500 
                 C 200 450, 190 380, 210 320 
                 C 220 290, 200 240, 230 200 
                 C 250 170, 320 195, 370 190 Z"
              fill="url(#iceShelfGrad)"
              stroke="#2563eb"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />

            {/* Main Continental Bedrock / Glacial Dome */}
            <path
              d="M 375 220 
                 C 410 210, 470 230, 510 260 
                 C 545 285, 575 340, 580 400 
                 C 585 460, 550 515, 510 550 
                 C 460 590, 400 600, 350 590 
                 C 285 575, 250 530, 235 480 
                 C 220 425, 230 350, 255 305 
                 C 270 270, 320 230, 375 220 Z"
              fill="url(#landGrad)"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeOpacity="0.8"
            />

            {/* Antarctic Peninsula Extension (towards South America) */}
            <path
              d="M 235 305 C 190 260, 160 220, 140 160 C 145 155, 155 160, 165 190 C 185 240, 210 275, 235 305 Z"
              fill="#143456"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />

            {/* Transantarctic Mountains subtle ridge line */}
            <path
              d="M 280 470 Q 360 430, 420 470 T 520 540"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            <text x="310" y="460" fill="#93c5fd" opacity="0.4" fontSize="9" fontFamily="monospace">TRANSANTARCTIC RANGE</text>

            {/* Region Names */}
            <text x="350" y="275" fill="#bae6fd" opacity="0.5" fontSize="10" fontFamily="monospace">Queen Maud Land</text>
            <text x="480" y="340" fill="#bae6fd" opacity="0.5" fontSize="10" fontFamily="monospace">Larsemann Hills</text>
            <text x="355" y="530" fill="#bae6fd" opacity="0.5" fontSize="10" fontFamily="monospace">East Antarctic Ice Sheet</text>

            {/* Maritime Route: Cape Town -> Southern Ocean -> Maitri & Bharati */}
            {showRoutes && (
              <g className="maritime-paths">
                {/* Cape Town to Golovnin */}
                <path
                  d="M 385 65 Q 410 110, 430 165"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.8"
                />
                {/* Golovnin to Maitri Barrier */}
                <path
                  d="M 430 165 Q 395 190, 375 235"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  opacity="0.9"
                />
                {/* Golovnin to Bharati (Prydz Bay) */}
                <path
                  d="M 430 165 Q 480 210, 535 290"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  opacity="0.9"
                />
                <text x="450" y="140" fill="#38bdf8" fontSize="9" fontFamily="monospace">MV Golovnin Sea Transit (64°S)</text>
              </g>
            )}

            {/* Flight Skiway Corridor: Maitri <-> Bharati <-> South Pole */}
            {showFlightCorridor && (
              <g className="flight-paths">
                {/* Maitri to Bharati inter-station hop */}
                <path
                  d="M 375 235 Q 460 220, 535 290"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                  opacity="0.8"
                />
                {/* Maitri to South Pole flight corridor */}
                <path
                  d="M 375 235 Q 385 320, 400 400"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                  opacity="0.7"
                />
                <text x="430" y="245" fill="#c084fc" fontSize="9" fontFamily="monospace">Twin Otter Airway (3,000 km)</text>
              </g>
            )}

            {/* Station / Base Markers */}
            {stations.map(st => {
              const pos = stationProjectedCoords[st.id];
              if (!pos) return null;
              const isSelected = selectedStationId === st.id;
              const isWarning = st.status === 'WARNING';
              const isAlert = st.status === 'ALERT';

              return (
                <g 
                  key={st.id} 
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedStationId(st.id)}
                >
                  {/* Outer pulse */}
                  <circle
                    r={isSelected ? "14" : "10"}
                    fill={isAlert ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}
                    opacity={isSelected ? "0.35" : "0.2"}
                    className={isSelected ? "animate-ping" : ""}
                  />
                  {/* Selection border ring */}
                  {isSelected && (
                    <circle
                      r="16"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  )}
                  {/* Center Dot */}
                  <circle
                    r="5"
                    fill={isAlert ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Marker label */}
                  <text
                    x={pos.labelPos === 'left' ? -12 : pos.labelPos === 'right' ? 12 : 0}
                    y={pos.labelPos === 'top' ? -12 : pos.labelPos === 'bottom' ? 18 : 4}
                    textAnchor={pos.labelPos === 'left' ? 'end' : pos.labelPos === 'right' ? 'start' : 'middle'}
                    fill={isSelected ? '#38bdf8' : '#ffffff'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {st.name.replace(' Research Station', '').replace(' Gateway Hub', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Station Telemetry HUD Card (Section 12) */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 rounded-lg bg-slate-950/90 border border-slate-700/80 p-4 backdrop-blur-md shadow-2xl space-y-3 z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">{selectedStation.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                  selectedStation.status === 'OPERATIONAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  selectedStation.status === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-red-950 text-red-400 border border-red-800'
                }`}>
                  {selectedStation.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Lat: {selectedStation.coordinates.lat.toFixed(2)}° · Lng: {selectedStation.coordinates.lng.toFixed(2)}° · Alt: {selectedStation.coordinates.elevationMeters}m
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800/80 text-center">
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Personnel</span>
              <span className="text-sm font-bold text-white font-mono">{selectedStation.personnelCount}</span>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Fuel</span>
              <span className={`text-sm font-bold font-mono ${selectedStation.fuelPercentage < 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {selectedStation.fuelPercentage}%
              </span>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Food Days</span>
              <span className="text-sm font-bold text-white font-mono">{selectedStation.foodDays}d</span>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Equipment</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{selectedStation.equipmentReadiness}%</span>
            </div>
          </div>

          {/* Weather status strip */}
          <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedStation.temperatureCelsius}°C</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedStation.windSpeedKnots} kt</span>
            </div>
            <span className="truncate max-w-[140px] text-slate-400">{selectedStation.weatherCondition}</span>
          </div>

          {/* Quick jump to inventory/personnel */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={() => setCurrentView('inventory')}
              className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              Inspect Inventory →
            </button>
            <button
              onClick={() => setCurrentView('personnel')}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Personnel Roster →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
