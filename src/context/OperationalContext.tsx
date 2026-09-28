import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Station, 
  Expedition, 
  CargoItem, 
  InventoryItem, 
  Asset, 
  Personnel, 
  MovementRequest, 
  Incident, 
  SmartAlert,
  CargoStatus,
  StationId 
} from '../types';
import { 
  INITIAL_STATIONS, 
  INITIAL_EXPEDITIONS, 
  INITIAL_CARGO, 
  INITIAL_INVENTORY, 
  INITIAL_ASSETS, 
  INITIAL_PERSONNEL, 
  INITIAL_MOVEMENTS, 
  INITIAL_INCIDENTS, 
  INITIAL_ALERTS 
} from '../data/initialData';

export type ViewType = 
  | 'overview' 
  | 'live-map' 
  | 'expeditions' 
  | 'cargo' 
  | 'inventory' 
  | 'assets' 
  | 'personnel' 
  | 'movements' 
  | 'emergency' 
  | 'incidents' 
  | 'alerts' 
  | 'analytics' 
  | 'reports' 
  | 'settings';

interface OperationalContextType {
  inApp: boolean;
  setInApp: (val: boolean) => void;
  enterFrost: () => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  stations: Station[];
  expeditions: Expedition[];
  addExpedition: (exp: Omit<Expedition, 'id'>) => void;
  updateExpedition: (id: string, updates: Partial<Expedition>) => void;
  deleteExpedition: (id: string) => void;
  cargo: CargoItem[];
  addCargo: (cargo: Omit<CargoItem, 'id'>) => void;
  updateCargoStatus: (id: string, status: CargoStatus, note?: string) => void;
  inventory: InventoryItem[];
  updateInventoryItem: (id: string, quantity: number) => void;
  assets: Asset[];
  updateAssetStatus: (id: string, status: Asset['status']) => void;
  personnel: Personnel[];
  updatePersonnelCheckIn: (id: string) => void;
  movements: MovementRequest[];
  addMovementRequest: (req: Omit<MovementRequest, 'id' | 'hasConflict' | 'conflictReason'>) => MovementRequest;
  approveMovement: (id: string) => void;
  reassignMovement: (id: string, transport: MovementRequest['transport']) => void;
  rescheduleMovement: (id: string, newDate: string) => void;
  cancelMovement: (id: string) => void;
  incidents: Incident[];
  addIncident: (inc: Omit<Incident, 'id' | 'incidentNumber' | 'timeline' | 'reportedTime' | 'status'>) => Incident;
  addIncidentTimelineEvent: (incidentId: string, action: string, actor: string) => void;
  updateIncidentStatus: (incidentId: string, status: Incident['status']) => void;
  alerts: SmartAlert[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  unreadAlertCount: number;
  resetAllData: () => void;
  selectedCargoId: string | null;
  setSelectedCargoId: (id: string | null) => void;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  quickNavigateTo: (view: ViewType, itemId?: string, type?: 'cargo' | 'incident') => void;
}

const OperationalContext = createContext<OperationalContextType | undefined>(undefined);

const STORAGE_KEY = 'frost_polar_ops_v1';

export const OperationalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inApp, setInApp] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedCargoId, setSelectedCargoId] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Core Data States
  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_stations`);
    return saved ? JSON.parse(saved) : INITIAL_STATIONS;
  });

  const [expeditions, setExpeditions] = useState<Expedition[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expeditions`);
    return saved ? JSON.parse(saved) : INITIAL_EXPEDITIONS;
  });

  const [cargo, setCargo] = useState<CargoItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cargo`);
    return saved ? JSON.parse(saved) : INITIAL_CARGO;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assets`);
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [personnel, setPersonnel] = useState<Personnel[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_personnel`);
    return saved ? JSON.parse(saved) : INITIAL_PERSONNEL;
  });

  const [movements, setMovements] = useState<MovementRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_movements`);
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_incidents`);
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [alerts, setAlerts] = useState<SmartAlert[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_alerts`);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_stations`, JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expeditions`, JSON.stringify(expeditions));
  }, [expeditions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cargo`, JSON.stringify(cargo));
  }, [cargo]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_assets`, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_personnel`, JSON.stringify(personnel));
  }, [personnel]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_movements`, JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_incidents`, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_alerts`, JSON.stringify(alerts));
  }, [alerts]);

  const enterFrost = () => {
    setInApp(true);
    setCurrentView('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickNavigateTo = (view: ViewType, itemId?: string, type?: 'cargo' | 'incident') => {
    setCurrentView(view);
    if (type === 'cargo' && itemId) {
      setSelectedCargoId(itemId);
    } else if (type === 'incident' && itemId) {
      setSelectedIncidentId(itemId);
    }
  };

  // Expedition Handlers
  const addExpedition = (exp: Omit<Expedition, 'id'>) => {
    const newExp: Expedition = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    setExpeditions(prev => [newExp, ...prev]);
  };

  const updateExpedition = (id: string, updates: Partial<Expedition>) => {
    setExpeditions(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExpedition = (id: string) => {
    setExpeditions(prev => prev.filter(e => e.id !== id));
  };

  // Cargo Handlers
  const addCargo = (item: Omit<CargoItem, 'id'>) => {
    const newCargo: CargoItem = {
      ...item,
      id: `cargo-${Date.now()}`,
    };
    setCargo(prev => [newCargo, ...prev]);
  };

  const updateCargoStatus = (id: string, status: CargoStatus, note?: string) => {
    setCargo(prev => prev.map(c => {
      if (c.id === id) {
        const newTimelineEvent = {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
          location: c.currentLocation,
          status,
          notes: note || `Status updated to ${status} by Operations Commander`,
          handler: 'Dr. Ananya Rao',
        };
        return {
          ...c,
          status,
          lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
          timeline: [newTimelineEvent, ...c.timeline],
        };
      }
      return c;
    }));
  };

  // Inventory Handlers
  const updateInventoryItem = (id: string, quantity: number) => {
    setInventory(prev => prev.map(inv => {
      if (inv.id === id) {
        const daysRemaining = Number((quantity / (inv.dailyConsumption || 1)).toFixed(1));
        let status: InventoryItem['status'] = 'NORMAL';
        if (daysRemaining < inv.nextResupplyDays || quantity < inv.threshold) {
          status = daysRemaining < (inv.nextResupplyDays - 2) ? 'CRITICAL_RISK' : 'LOW';
        }
        return {
          ...inv,
          quantity,
          daysRemaining,
          status,
          lastAudited: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
        };
      }
      return inv;
    }));
  };

  // Asset Handlers
  const updateAssetStatus = (id: string, status: Asset['status']) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // Personnel Handlers
  const updatePersonnelCheckIn = (id: string) => {
    setPersonnel(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          lastCheckIn: 'Just now (' + new Date().toISOString().slice(11, 16) + ' UTC)',
        };
      }
      return p;
    }));
  };

  // Movement Handlers with intelligent conflict detection
  const addMovementRequest = (req: Omit<MovementRequest, 'id' | 'hasConflict' | 'conflictReason'>) => {
    // Conflict detection engine:
    // If Twin Otter KB-402 is selected, detect maintenance hold or weather conflict
    let hasConflict = false;
    let conflictReason: string | undefined = undefined;

    if (req.transport === 'Twin Otter KB-402') {
      hasConflict = true;
      conflictReason = 'Transport asset Twin Otter KB-402 is scheduled for routine 100h engine maintenance between 06–09 Oct and Katabatic shear warning active at destination.';
    } else if (req.to.toLowerCase().includes('south pole') && req.transport === 'PistenBully Snowcat') {
      hasConflict = true;
      conflictReason = 'Overland traverse route to South Pole exceeds operational range without intermediate fuel caches.';
    }

    const newMov: MovementRequest = {
      ...req,
      id: `mov-${Date.now()}`,
      hasConflict,
      conflictReason,
    };

    setMovements(prev => [newMov, ...prev]);
    return newMov;
  };

  const approveMovement = (id: string) => {
    setMovements(prev => prev.map(m => m.id === id ? { ...m, status: 'APPROVED', hasConflict: false } : m));
  };

  const reassignMovement = (id: string, transport: MovementRequest['transport']) => {
    setMovements(prev => prev.map(m => m.id === id ? { 
      ...m, 
      transport, 
      hasConflict: false, 
      conflictReason: undefined,
      status: 'APPROVED' 
    } : m));
  };

  const rescheduleMovement = (id: string, newDate: string) => {
    setMovements(prev => prev.map(m => m.id === id ? { 
      ...m, 
      departureDate: newDate, 
      hasConflict: false, 
      conflictReason: undefined,
      status: 'PLANNED' 
    } : m));
  };

  const cancelMovement = (id: string) => {
    setMovements(prev => prev.map(m => m.id === id ? { ...m, status: 'CANCELLED' } : m));
  };

  // Incident Handlers
  const addIncident = (inc: Omit<Incident, 'id' | 'incidentNumber' | 'timeline' | 'reportedTime' | 'status'>) => {
    const count = incidents.length + 205;
    const timeStr = new Date().toISOString().slice(11, 16) + ' UTC';
    const newInc: Incident = {
      ...inc,
      id: `inc-${Date.now()}`,
      incidentNumber: `INC-${count}`,
      reportedTime: timeStr,
      status: 'ACTIVE',
      timeline: [
        { time: timeStr, action: `Incident reported and logged into FROST Emergency Center`, actor: inc.leadResponder },
        { time: timeStr, action: `Emergency response team dispatched. Resources: ${inc.requiredResources.slice(0, 60)}...`, actor: 'Operations Command' }
      ]
    };

    setIncidents(prev => [newInc, ...prev]);

    // Also add to smart alerts
    const alertSeverity: SmartAlert['severity'] = inc.severity === 'LOW' ? 'INFO' : inc.severity;
    const newAlert: SmartAlert = {
      id: `alt-${Date.now()}`,
      severity: alertSeverity,
      title: `Emergency Incident #${newInc.incidentNumber}: ${newInc.title}`,
      source: 'FROST Emergency Center',
      time: timeStr,
      description: inc.description,
      recommendedAction: `Coordinate immediate response at ${newInc.location}. Assigned lead: ${newInc.leadResponder}`,
      acknowledged: false,
      resolved: false,
      category: 'emergency',
      targetModule: 'emergency',
    };
    setAlerts(prev => [newAlert, ...prev]);

    return newInc;
  };

  const addIncidentTimelineEvent = (incidentId: string, action: string, actor: string) => {
    const timeStr = new Date().toISOString().slice(11, 16) + ' UTC';
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          timeline: [...inc.timeline, { time: timeStr, action, actor }]
        };
      }
      return inc;
    }));
  };

  const updateIncidentStatus = (incidentId: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const timeStr = new Date().toISOString().slice(11, 16) + ' UTC';
        return {
          ...inc,
          status,
          timeline: [...inc.timeline, { time: timeStr, action: `Incident status updated to ${status}`, actor: 'Dr. Ananya Rao' }]
        };
      }
      return inc;
    }));
  };

  // Smart Alert Handlers
  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true, resolved: true } : a));
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_stations`);
    localStorage.removeItem(`${STORAGE_KEY}_expeditions`);
    localStorage.removeItem(`${STORAGE_KEY}_cargo`);
    localStorage.removeItem(`${STORAGE_KEY}_inventory`);
    localStorage.removeItem(`${STORAGE_KEY}_assets`);
    localStorage.removeItem(`${STORAGE_KEY}_personnel`);
    localStorage.removeItem(`${STORAGE_KEY}_movements`);
    localStorage.removeItem(`${STORAGE_KEY}_incidents`);
    localStorage.removeItem(`${STORAGE_KEY}_alerts`);

    setStations(INITIAL_STATIONS);
    setExpeditions(INITIAL_EXPEDITIONS);
    setCargo(INITIAL_CARGO);
    setInventory(INITIAL_INVENTORY);
    setAssets(INITIAL_ASSETS);
    setPersonnel(INITIAL_PERSONNEL);
    setMovements(INITIAL_MOVEMENTS);
    setIncidents(INITIAL_INCIDENTS);
    setAlerts(INITIAL_ALERTS);
    setSelectedCargoId(null);
    setSelectedIncidentId(null);
  };

  const unreadAlertCount = alerts.filter(a => !a.acknowledged && !a.resolved).length;

  return (
    <OperationalContext.Provider
      value={{
        inApp,
        setInApp,
        enterFrost,
        currentView,
        setCurrentView,
        stations,
        expeditions,
        addExpedition,
        updateExpedition,
        deleteExpedition,
        cargo,
        addCargo,
        updateCargoStatus,
        inventory,
        updateInventoryItem,
        assets,
        updateAssetStatus,
        personnel,
        updatePersonnelCheckIn,
        movements,
        addMovementRequest,
        approveMovement,
        reassignMovement,
        rescheduleMovement,
        cancelMovement,
        incidents,
        addIncident,
        addIncidentTimelineEvent,
        updateIncidentStatus,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        globalSearchQuery,
        setGlobalSearchQuery,
        unreadAlertCount,
        resetAllData,
        selectedCargoId,
        setSelectedCargoId,
        selectedIncidentId,
        setSelectedIncidentId,
        quickNavigateTo,
      }}
    >
      {children}
    </OperationalContext.Provider>
  );
};

export const useOperational = () => {
  const context = useContext(OperationalContext);
  if (!context) {
    throw new Error('useOperational must be used within an OperationalProvider');
  }
  return context;
};
