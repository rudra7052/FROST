import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Truck, 
  Radio, 
  Shield, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { Asset, AssetCondition } from '../../types';

export const AssetManagement: React.FC = () => {
  const { assets, updateAssetStatus } = useOperational();
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectAsset, setInspectAsset] = useState<Asset | null>(null);

  const assetTypes = [
    'Scientific Equipment',
    'Vehicles',
    'Generators',
    'Communication Equipment',
    'Power Systems',
    'Safety Equipment'
  ];

  const filteredAssets = assets.filter(a => {
    const matchesType = selectedType === 'ALL' || a.type === selectedType;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.currentLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Mission Asset Registry</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Fleet tracking, power generator telemetry, scientific equipment health and scheduled polar maintenance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded">
            94.2% FLEET READINESS
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1.5 rounded font-mono cursor-pointer whitespace-nowrap ${
              selectedType === 'ALL'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                : 'text-slate-400 bg-slate-900 border border-slate-800'
            }`}
          >
            All Types ({assets.length})
          </button>
          {assetTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded font-mono cursor-pointer whitespace-nowrap ${
                selectedType === t
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                  : 'text-slate-400 bg-slate-900 border border-slate-800'
              }`}
            >
              {t} ({assets.filter(a => a.type === t).length})
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Asset ID (e.g. FROST-GEN-042), name, bay..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-300 font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPERATIONAL">OPERATIONAL</option>
              <option value="STANDBY">STANDBY</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Table (Section 17) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] text-slate-400">
                <th className="py-3 px-4">ASSET ID</th>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">CURRENT LOCATION</th>
                <th className="py-3 px-4">CONDITION</th>
                <th className="py-3 px-4">LAST SERVICE</th>
                <th className="py-3 px-4">NEXT SERVICE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAssets.map(asset => (
                <tr
                  key={asset.id}
                  onClick={() => setInspectAsset(asset)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {asset.assetId}
                  </td>
                  <td className="py-3 px-4 text-white font-medium max-w-[220px] truncate" title={asset.name}>
                    {asset.name}
                  </td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                    {asset.type}
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-[180px] truncate" title={asset.currentLocation}>
                    {asset.currentLocation}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      asset.condition === 'EXCELLENT' ? 'bg-emerald-950 text-emerald-300' :
                      asset.condition === 'GOOD' ? 'bg-cyan-950 text-cyan-300' :
                      'bg-amber-950 text-amber-300'
                    }`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {asset.lastMaintenance}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                    {asset.nextMaintenance}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      asset.status === 'OPERATIONAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      asset.status === 'STANDBY' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectAsset(asset);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-medium group-hover:underline"
                    >
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Detail & Maintenance Modal */}
      {inspectAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold font-mono text-cyan-400">{inspectAsset.assetId}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {inspectAsset.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{inspectAsset.name}</h2>
              </div>
              <button onClick={() => setInspectAsset(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">ASSET TYPE</span>
                  <span className="text-white font-medium">{inspectAsset.type}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">RUN-HOURS</span>
                  <span className="text-white font-mono font-bold">{inspectAsset.operatingHours} hrs</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">HEALTH SCORE</span>
                  <span className="text-emerald-400 font-mono font-bold">{inspectAsset.healthScore}%</span>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block font-mono">CURRENT LOCATION & EXPEDITION</span>
                <p className="text-white font-medium">{inspectAsset.currentLocation}</p>
                <p className="text-slate-400 text-[11px]">{inspectAsset.assignedExpedition}</p>
              </div>

              {/* Maintenance Schedule Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">LAST MAINTENANCE</span>
                  <span className="text-slate-200 font-mono">{inspectAsset.lastMaintenance}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">NEXT SCHEDULED SERVICE</span>
                  <span className="text-cyan-300 font-mono font-bold">{inspectAsset.nextMaintenance}</span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="font-mono text-slate-400 block">SET OPERATIONAL STATE</span>
                <div className="flex gap-2">
                  {(['OPERATIONAL', 'STANDBY', 'MAINTENANCE'] as Asset['status'][]).map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        updateAssetStatus(inspectAsset.id, st);
                        setInspectAsset(prev => prev ? { ...prev, status: st } : null);
                      }}
                      className={`px-3 py-1.5 rounded font-mono text-xs cursor-pointer transition-colors ${
                        inspectAsset.status === st
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setInspectAsset(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
