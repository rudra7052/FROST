import React, { useState } from 'react';
import { 
  Box, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Cpu, 
  Plus, 
  Edit3, 
  X, 
  RefreshCw,
  Flame,
  Utensils,
  HeartPulse,
  Microscope,
  Cpu as PowerIcon,
  Shirt,
  Radio,
  Sliders
} from 'lucide-react';
import { useOperational } from '../../context/OperationalContext';
import { InventoryCategory, InventoryItem, StationId } from '../../types';

export const InventoryManagement: React.FC = () => {
  const { inventory, updateInventoryItem, stations } = useOperational();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stationFilter, setStationFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);

  const categories: InventoryCategory[] = [
    'Fuel', 
    'Food', 
    'Medical', 
    'Scientific Equipment', 
    'Spare Parts', 
    'Clothing', 
    'Power Systems', 
    'Communications'
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesStation = stationFilter === 'ALL' || item.station === stationFilter;
    const matchesSearch = 
      item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.station.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStation && matchesSearch;
  });

  const handleOpenPredictor = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustmentQuantity(item.quantity);
  };

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    updateInventoryItem(selectedItem.id, adjustmentQuantity);
    setSelectedItem(prev => prev ? { ...prev, quantity: adjustmentQuantity } : null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white">Smart Inventory Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time consumables monitoring with automated depletion thresholds and resupply risk prediction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const maitriFuel = inventory.find(i => i.item.includes('Diesel Fuel'));
              if (maitriFuel) handleOpenPredictor(maitriFuel);
            }}
            className="px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/80 hover:bg-amber-900/60 rounded flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Maitri Fuel Risk Model</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded font-mono transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'ALL' 
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold' 
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            All Categories ({inventory.length})
          </button>
          {categories.map(cat => {
            const count = inventory.filter(i => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold' 
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search supply name or station..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded pl-9 pr-3 py-1.5 text-white"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-slate-400 font-mono">Station:</span>
            <select
              value={stationFilter}
              onChange={e => setStationFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-200 font-mono"
            >
              <option value="ALL">All Bases</option>
              <option value="Maitri">Maitri</option>
              <option value="Bharati">Bharati</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table (Section 15) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-[11px] text-slate-400">
                <th className="py-3 px-4">ITEM</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">STATION</th>
                <th className="py-3 px-4 text-right">QUANTITY</th>
                <th className="py-3 px-4">UNIT</th>
                <th className="py-3 px-4 text-right">THRESHOLD</th>
                <th className="py-3 px-4 text-right">DAYS REMAINING</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">PREDICTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInventory.map(item => {
                const isRisk = item.status === 'CRITICAL_RISK';
                const isLow = item.status === 'LOW';

                return (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenPredictor(item)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span className="text-cyan-400">▪</span>
                      <span>{item.item}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 text-cyan-300 font-semibold font-mono">
                      {item.station}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {item.threshold.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${
                      isRisk ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {item.daysRemaining} days
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isRisk ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse' :
                        isLow ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPredictor(item);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold group-hover:underline"
                      >
                        Model Risk →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Inventory Prediction Drawer/Modal (Section 16 & Section 34) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{selectedItem.category}</span>
                  <span className="text-[10px] font-mono text-slate-400">· {selectedItem.station} Base</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-0.5">{selectedItem.item}</h2>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Smart Inventory Prediction Display (Section 16 format) */}
            <div className={`p-4 rounded-xl border space-y-4 ${
              selectedItem.status === 'CRITICAL_RISK'
                ? 'bg-red-950/30 border-red-800/80 polar-glow-danger'
                : selectedItem.status === 'LOW'
                ? 'bg-amber-950/30 border-amber-800/80'
                : 'bg-emerald-950/20 border-emerald-800/60'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    DEPLETION & RESUPPLY INTELLIGENCE
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  selectedItem.status === 'CRITICAL_RISK' ? 'bg-red-900 text-red-200' :
                  selectedItem.status === 'LOW' ? 'bg-amber-900 text-amber-200' :
                  'bg-emerald-900 text-emerald-200'
                }`}>
                  {selectedItem.status === 'CRITICAL_RISK' ? '🔴 RESUPPLY RISK' : selectedItem.status}
                </span>
              </div>

              {/* Exact Metrics List from Section 16 */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CURRENT STOCK</span>
                  <span className="text-base font-bold text-white">
                    {selectedItem.quantity.toLocaleString()} {selectedItem.unit}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">DAILY CONSUMPTION</span>
                  <span className="text-base font-bold text-cyan-300">
                    {selectedItem.dailyConsumption} {selectedItem.unit}/day
                  </span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">DAYS REMAINING</span>
                  <span className={`text-base font-bold ${
                    selectedItem.daysRemaining < selectedItem.nextResupplyDays ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {selectedItem.daysRemaining} days
                  </span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">NEXT RESUPPLY WINDOW</span>
                  <span className="text-base font-bold text-white">
                    {selectedItem.nextResupplyDays} days
                  </span>
                </div>
              </div>

              {/* Automated Recommendation */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  AUTOMATED SYSTEM RECOMMENDATION
                </span>
                <p className="text-xs text-slate-200 bg-slate-950/80 p-3 rounded border border-slate-800 leading-relaxed">
                  {selectedItem.recommendation || 'Maintain routine monitoring.'}
                </p>
              </div>
            </div>

            {/* Adjust Stock Form for interactive demo */}
            <form onSubmit={handleSaveStock} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <span className="font-mono text-slate-400 font-bold block">
                AUDIT / STOCK ADJUSTMENT FORM
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={adjustmentQuantity}
                  onChange={e => setAdjustmentQuantity(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono text-sm focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded cursor-pointer whitespace-nowrap"
                >
                  Save Stock Level
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Adjusting stock triggers dynamic recomputation of remaining days and updates system risk alerts.
              </p>
            </form>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs cursor-pointer"
              >
                Close Risk Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
