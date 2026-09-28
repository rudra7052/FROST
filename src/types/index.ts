export type StationId = 'maitri' | 'bharati' | 'south_pole' | 'cape_town' | 'vessel_golovnin' | 'schirmacher_camp';

export interface Station {
  id: StationId;
  name: string;
  code: string;
  type: 'permanent_station' | 'field_camp' | 'logistics_hub' | 'vessel';
  coordinates: {
    lat: number;
    lng: number;
    elevationMeters: number;
  };
  temperatureCelsius: number;
  windSpeedKnots: number;
  weatherCondition: string;
  personnelCount: number;
  fuelPercentage: number;
  foodDays: number;
  equipmentReadiness: number;
  status: 'OPERATIONAL' | 'WARNING' | 'ALERT';
}

export type ExpeditionStatus = 'PLANNING' | 'ACTIVE' | 'RESUPPLY' | 'STANDBY' | 'COMPLETED';

export interface Expedition {
  id: string;
  name: string;
  code: string;
  status: ExpeditionStatus;
  stationId: StationId;
  stationName: string;
  commander: string;
  leadScientist: string;
  startDate: string;
  endDate: string;
  personnelCount: number;
  cargoItemCount: number;
  allocatedAssetCount: number;
  budgetAllocatedCr: number;
  objective: string;
  scientificFocus: string[];
}

export type CargoStatus = 
  | 'REGISTERED' 
  | 'PACKED' 
  | 'DISPATCHED' 
  | 'IN TRANSIT' 
  | 'ARRIVED' 
  | 'DELIVERED' 
  | 'DELAYED';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface CargoEvent {
  timestamp: string;
  location: string;
  status: CargoStatus;
  notes: string;
  handler: string;
}

export interface CargoItem {
  id: string;
  trackingNumber: string;
  description: string;
  category: 'Scientific Equipment' | 'Fuel' | 'Food Supplies' | 'Medical' | 'Vehicle Parts' | 'Habitation';
  origin: string;
  destination: string;
  currentLocation: string;
  status: CargoStatus;
  priority: PriorityLevel;
  eta: string;
  lastUpdated: string;
  weightKg: number;
  volumeM3: number;
  temperatureControlled: boolean;
  requiredTempCelsius?: number;
  handler: string;
  chainOfCustody: string[];
  timeline: CargoEvent[];
  qrData?: string;
  delayReason?: string;
}

export type InventoryCategory = 
  | 'Fuel' 
  | 'Food' 
  | 'Medical' 
  | 'Scientific Equipment' 
  | 'Spare Parts' 
  | 'Clothing' 
  | 'Power Systems' 
  | 'Communications';

export interface InventoryItem {
  id: string;
  item: string;
  category: InventoryCategory;
  station: string;
  stationId: StationId;
  quantity: number;
  unit: string;
  threshold: number;
  dailyConsumption: number;
  daysRemaining: number;
  nextResupplyDays: number;
  status: 'NORMAL' | 'LOW' | 'CRITICAL_RISK';
  recommendation?: string;
  lastAudited: string;
}

export type AssetCondition = 'EXCELLENT' | 'GOOD' | 'NEEDS_MAINTENANCE' | 'OFFLINE';

export interface Asset {
  id: string;
  assetId: string;
  name: string;
  type: 
    | 'Scientific Equipment' 
    | 'Vehicles' 
    | 'Generators' 
    | 'Communication Equipment' 
    | 'Power Systems' 
    | 'Research Instruments' 
    | 'Safety Equipment';
  currentLocation: string;
  stationId: StationId;
  assignedExpedition: string;
  condition: AssetCondition;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'OPERATIONAL' | 'STANDBY' | 'MAINTENANCE' | 'DECOMMISSIONED';
  serialNumber: string;
  operatingHours: number;
  healthScore: number;
}

export interface Personnel {
  id: string;
  personnelId: string;
  name: string;
  role: string;
  department: string;
  nationality: string;
  bloodGroup: string;
  currentLocation: string;
  stationId: StationId;
  expedition: string;
  status: 'ACTIVE' | 'IN_TRANSIT' | 'FIELD_CAMP' | 'REST';
  lastCheckIn: string;
  emergencyContact: string;
  polarExperienceYears: number;
}

export interface MovementRequest {
  id: string;
  personnelId: string;
  personnelName: string;
  from: string;
  to: string;
  departureDate: string;
  transport: 'Twin Otter KB-402' | 'Helicopter Kamov-32' | 'PistenBully Snowcat' | 'Zodiac Boat' | 'MV Vasiliy Golovnin';
  status: 'PLANNED' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  hasConflict: boolean;
  conflictReason?: string;
  requestedBy: string;
  priority: PriorityLevel;
}

export interface IncidentEvent {
  time: string;
  action: string;
  actor: string;
}

export interface Incident {
  id: string;
  incidentNumber: string;
  title: string;
  type: 
    | 'Medical' 
    | 'Fire' 
    | 'Equipment Failure' 
    | 'Weather' 
    | 'Transport' 
    | 'Communication' 
    | 'Personnel' 
    | 'Other';
  location: string;
  stationId: StationId;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affectedPersonnelCount: number;
  affectedPersonnelNames: string[];
  affectedAssets: string[];
  reportedTime: string;
  status: 'ACTIVE' | 'RESPONSE IN PROGRESS' | 'CONTAINED' | 'RESOLVED';
  leadResponder: string;
  description: string;
  requiredResources: string;
  timeline: IncidentEvent[];
}

export interface SmartAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  source: string;
  time: string;
  description: string;
  recommendedAction: string;
  acknowledged: boolean;
  resolved: boolean;
  category: 'inventory' | 'cargo' | 'weather' | 'personnel' | 'asset' | 'emergency';
  targetModule: string;
}
