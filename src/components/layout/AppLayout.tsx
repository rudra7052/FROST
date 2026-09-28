import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Layers, 
  Package, 
  Box, 
  Wrench, 
  Users, 
  ArrowLeftRight, 
  ShieldAlert, 
  AlertOctagon, 
  Bell, 
  BarChart3, 
  FileText, 
  Settings as SettingsIcon, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useOperational, ViewType } from '../../context/OperationalContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    currentView, 
    setCurrentView, 
    setInApp, 
    alerts, 
    acknowledgeAlert, 
    unreadAlertCount, 
    cargo, 
    personnel, 
    stations, 
    inventory, 
    expeditions, 
    quickNavigateTo 
  } = useOperational();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [utcTime, setUtcTime] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // UTC clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 22) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Click outside listener for search & notifications
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global search filtering across multiple domains
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    const matches: Array<{
      id: string;
      title: string;
      category: string;
      snippet: string;
      view: ViewType;
      itemId?: string;
      type?: 'cargo' | 'incident';
    }> = [];

    // Search Cargo
    cargo.forEach(c => {
      if (c.trackingNumber.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.destination.toLowerCase().includes(q)) {
        matches.push({
          id: c.id,
          title: `${c.trackingNumber} · ${c.description.slice(0, 32)}...`,
          category: 'Cargo Shipment',
          snippet: `Location: ${c.currentLocation} · Status: ${c.status}`,
          view: 'cargo',
          itemId: c.id,
          type: 'cargo'
        });
      }
    });

    // Search Personnel
    personnel.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.personnelId.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)) {
        matches.push({
          id: p.id,
          title: `${p.name} (${p.personnelId})`,
          category: 'Personnel',
          snippet: `${p.role} · Location: ${p.currentLocation.slice(0, 30)}`,
          view: 'personnel'
        });
      }
    });

    // Search Inventory
    inventory.forEach(inv => {
      if (inv.item.toLowerCase().includes(q) || inv.station.toLowerCase().includes(q)) {
        matches.push({
          id: inv.id,
          title: `${inv.item} (${inv.station})`,
          category: 'Inventory',
          snippet: `Stock: ${inv.quantity} ${inv.unit} · Days: ${inv.daysRemaining}d · Status: ${inv.status}`,
          view: 'inventory'
        });
      }
    });

    // Search Expeditions
    expeditions.forEach(exp => {
      if (exp.name.toLowerCase().includes(q) || exp.code.toLowerCase().includes(q)) {
        matches.push({
          id: exp.id,
          title: exp.name,
          category: 'Expedition',
          snippet: `Commander: ${exp.commander} · Personnel: ${exp.personnelCount}`,
          view: 'expeditions'
        });
      }
    });

    return matches.slice(0, 8);
  }, [searchQuery, cargo, personnel, inventory, expeditions]);

  const navSections: NavGroup[] = [
    {
      group: 'COMMAND',
      items: [
        { id: 'overview' as ViewType, label: 'Overview', icon: Compass },
        { id: 'live-map' as ViewType, label: 'Live Operations', icon: MapPin },
        { id: 'expeditions' as ViewType, label: 'Expeditions', icon: Layers },
      ]
    },
    {
      group: 'LOGISTICS',
      items: [
        { id: 'cargo' as ViewType, label: 'Cargo Tracking', icon: Package },
        { id: 'inventory' as ViewType, label: 'Inventory', icon: Box },
        { id: 'assets' as ViewType, label: 'Assets', icon: Wrench },
      ]
    },
    {
      group: 'PEOPLE',
      items: [
        { id: 'personnel' as ViewType, label: 'Personnel', icon: Users },
        { id: 'movements' as ViewType, label: 'Movements', icon: ArrowLeftRight },
      ]
    },
    {
      group: 'RESPONSE',
      items: [
        { id: 'emergency' as ViewType, label: 'Emergency Center', icon: ShieldAlert, badge: 'ACTIVE' },
        { id: 'incidents' as ViewType, label: 'Incidents', icon: AlertOctagon },
      ]
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { id: 'alerts' as ViewType, label: 'Smart Alerts', icon: Bell, count: unreadAlertCount },
        { id: 'analytics' as ViewType, label: 'Analytics', icon: BarChart3 },
        { id: 'reports' as ViewType, label: 'Reports', icon: FileText },
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'settings' as ViewType, label: 'Settings', icon: SettingsIcon },
      ]
    }
  ];

  const getPageTitle = (view: ViewType): string => {
    switch (view) {
      case 'overview': return 'MISSION CONTROL';
      case 'live-map': return 'LIVE POLAR OPERATIONS MAP';
      case 'expeditions': return 'EXPEDITION COMMAND';
      case 'cargo': return 'CARGO INTELLIGENCE & TRACKING';
      case 'inventory': return 'SMART INVENTORY MANAGEMENT';
      case 'assets': return 'MISSION ASSET REGISTRY';
      case 'personnel': return 'PERSONNEL ROSTER';
      case 'movements': return 'PERSONNEL MOVEMENT COORDINATOR';
      case 'emergency': return 'EMERGENCY COMMAND CENTER';
      case 'incidents': return 'INCIDENT LOGS & RESPONSE TIMELINES';
      case 'alerts': return 'SMART OPERATIONAL ALERTS';
      case 'analytics': return 'OPERATIONAL ANALYTICS & TRENDS';
      case 'reports': return 'EXECUTIVE MISSION REPORTS';
      case 'settings': return 'SYSTEM & OPERATIONAL SETTINGS';
      default: return 'OPERATIONS';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col shrink-0 hidden md:flex z-30 select-none">
        {/* Brand header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-mono font-black text-slate-950 text-xs shadow-md shadow-cyan-500/20">
              FR
            </div>
            <div>
              <div className="font-mono font-bold tracking-tight text-white text-base leading-none">
                FROST
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                MoES · NCPOR OPS
              </div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Operational" />
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navSections.map(section => (
            <div key={section.group} className="space-y-1">
              <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                {section.group}
              </div>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 font-semibold' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      {Boolean(item.count && item.count > 0) && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User profile footer - Dr. Ananya Rao */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-gradient-to-tr from-cyan-900 to-blue-700 border border-cyan-500/40 flex items-center justify-center font-semibold text-xs text-white shrink-0">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Dr. Ananya Rao</div>
              <div className="text-[11px] text-slate-400 truncate">Ops Commander</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 font-medium">OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Global Application Header */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          {/* Breadcrumb & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 hidden sm:inline">FROST</span>
              <span className="text-slate-400 hidden sm:inline">/</span>
              <span className="text-cyan-400 font-bold tracking-wide">{getPageTitle(currentView)}</span>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div ref={searchRef} className="relative max-w-md w-full mx-4 hidden lg:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cargo, personnel, assets, expeditions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                <div className="p-2 text-[11px] font-mono text-slate-400 border-b border-slate-800 flex justify-between">
                  <span>FOUND {searchResults.length} RESULTS FOR &quot;{searchQuery}&quot;</span>
                  <span className="text-cyan-400">SELECT TO OPEN</span>
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching records found in polar expedition registry.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {searchResults.map(result => (
                      <div
                        key={result.id}
                        onClick={() => {
                          quickNavigateTo(result.view, result.itemId, result.type);
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className="p-2.5 hover:bg-slate-800/80 cursor-pointer transition-colors space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{result.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                            {result.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{result.snippet}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* UTC Clock */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{utcTime || '09:53 UTC'}</span>
            </div>

            {/* System Status */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-mono bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM OPERATIONAL</span>
            </div>

            {/* Notification Dropdown Trigger */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-white rounded hover:bg-slate-900 transition-colors cursor-pointer"
                title="Operational Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadAlertCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center">
                    {unreadAlertCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-cyan-400" />
                      OPERATIONAL ALERTS ({alerts.length})
                    </span>
                    <button
                      onClick={() => {
                        setCurrentView('alerts');
                        setShowNotifications(false);
                      }}
                      className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                    {alerts.slice(0, 5).map(alert => (
                      <div
                        key={alert.id}
                        className={`p-3 text-xs space-y-1 hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          !alert.acknowledged ? 'bg-slate-850/50' : ''
                        }`}
                        onClick={() => {
                          quickNavigateTo('alerts');
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            alert.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                            alert.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            alert.severity === 'MEDIUM' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                            'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
                        </div>
                        <p className="font-semibold text-white">{alert.title}</p>
                        <p className="text-slate-400 line-clamp-2 text-[11px]">{alert.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Return to Landing Page Button */}
            <button
              onClick={() => setInApp(false)}
              className="text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Public Landing Page"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Landing</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-4 z-40">
            {navSections.map(sec => (
              <div key={sec.group} className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-slate-400">{sec.group}</div>
                <div className="grid grid-cols-2 gap-1">
                  {sec.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded text-xs text-left ${
                        currentView === item.id ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
