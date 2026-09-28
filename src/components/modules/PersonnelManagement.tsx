import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Shield, 
  Phone, 
  Activity, 
  Radio,
  FileBadge
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { Personnel } from '../../types';

export const PersonnelManagement: React.FC = () => {
  const { personnel, updatePersonnelCheckIn } = useOperational();
  const [stationFilter, setStationFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);

  const filteredPersonnel = personnel.filter(p => {
    const matchesStation = stationFilter === 'ALL' || p.stationId === stationFilter;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.personnelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStation && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Personnel Roster & Check-Ins</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time personnel deployment roster, vital signs monitoring and check-in logs across Antarctic stations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white font-bold">{personnel.length}</span>
            <span className="text-slate-400">REGISTERED SCIENTISTS & CREW</span>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search personnel name (e.g. Ananya), ID (FR-P-001), role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-slate-400 font-mono">Location:</span>
          <select
            value={stationFilter}
            onChange={e => setStationFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200 font-mono"
          >
            <option value="ALL">All Locations</option>
            <option value="maitri">Maitri Station</option>
            <option value="bharati">Bharati Station</option>
            <option value="vessel_golovnin">MV Vasiliy Golovnin</option>
          </select>
        </div>
      </div>

      {/* Personnel Roster Table (Section 18) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] text-slate-400">
                <th className="py-3 px-4">PERSONNEL ID</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4">NATIONALITY</th>
                <th className="py-3 px-4">CURRENT LOCATION</th>
                <th className="py-3 px-4">EXPEDITION</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">LAST CHECK-IN</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPersonnel.map(person => (
                <tr
                  key={person.id}
                  onClick={() => setSelectedPersonnel(person)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {person.personnelId}
                  </td>
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    {person.name}
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-[180px] truncate" title={person.role}>
                    {person.role}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {person.nationality}
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-[160px] truncate" title={person.currentLocation}>
                    {person.currentLocation}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] max-w-[140px] truncate" title={person.expedition}>
                    {person.expedition.replace(' 2026', '')}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      person.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      person.status === 'FIELD_CAMP' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {person.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap text-[11px]">
                    {person.lastCheckIn}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePersonnelCheckIn(person.id);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded transition-colors"
                      title="Update radio check-in"
                    >
                      Check-In Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Personnel Profile Modal */}
      {selectedPersonnel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-gradient-to-tr from-cyan-900 to-blue-700 border border-cyan-500/50 flex items-center justify-center font-bold text-white text-base">
                  {selectedPersonnel.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">{selectedPersonnel.personnelId}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {selectedPersonnel.status}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedPersonnel.name}</h2>
                  <p className="text-[11px] text-slate-400">{selectedPersonnel.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPersonnel(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">DEPARTMENT</span>
                <span className="text-slate-200">{selectedPersonnel.department}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">BLOOD GROUP</span>
                <span className="text-red-400 font-bold font-mono">{selectedPersonnel.bloodGroup}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">POLAR EXPEDITION EXP</span>
                <span className="text-white font-mono">{selectedPersonnel.polarExperienceYears} Seasons</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">LAST CHECK-IN</span>
                <span className="text-cyan-300 font-mono">{selectedPersonnel.lastCheckIn}</span>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">CURRENT STATION LOCATION</span>
              <p className="text-white font-medium">{selectedPersonnel.currentLocation}</p>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-mono">EMERGENCY NEXT OF KIN</span>
              <p className="text-slate-200 font-mono">{selectedPersonnel.emergencyContact}</p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  updatePersonnelCheckIn(selectedPersonnel.id);
                  setSelectedPersonnel(null);
                }}
                className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded cursor-pointer"
              >
                Log Radio Check-In
              </button>
              <button
                onClick={() => setSelectedPersonnel(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
