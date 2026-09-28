import React from 'react';
import { OperationalProvider, useOperational } from './context/OperationalContext';
import { LandingPage } from './components/landing/LandingPage';
import { AppLayout } from './components/layout/AppLayout';
import { MissionControl } from './components/modules/MissionControl';
import { PolarMap } from './components/modules/PolarMap';
import { Expeditions } from './components/modules/Expeditions';
import { CargoTracking } from './components/modules/CargoTracking';
import { InventoryManagement } from './components/modules/InventoryManagement';
import { AssetManagement } from './components/modules/AssetManagement';
import { PersonnelManagement } from './components/modules/PersonnelManagement';
import { PersonnelMovement } from './components/modules/PersonnelMovement';
import { EmergencyCenter } from './components/modules/EmergencyCenter';
import { SmartAlerts } from './components/modules/SmartAlerts';
import { Analytics } from './components/modules/Analytics';
import { Reports } from './components/modules/Reports';
import { Settings } from './components/modules/Settings';
import { PolarCopilot } from './components/copilot/PolarCopilot';

const AppContent: React.FC = () => {
  const { inApp, currentView } = useOperational();

  if (!inApp) {
    return <LandingPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return <MissionControl />;
      case 'live-map':
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold font-mono text-white">Live Polar Operations Map</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Real-time geospatial tracking of Antarctic research stations, field camps, flight corridors, and maritime supply lanes.
              </p>
            </div>
            <PolarMap />
          </div>
        );
      case 'expeditions':
        return <Expeditions />;
      case 'cargo':
        return <CargoTracking />;
      case 'inventory':
        return <InventoryManagement />;
      case 'assets':
        return <AssetManagement />;
      case 'personnel':
        return <PersonnelManagement />;
      case 'movements':
        return <PersonnelMovement />;
      case 'emergency':
      case 'incidents':
        return <EmergencyCenter />;
      case 'alerts':
        return <SmartAlerts />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <MissionControl />;
    }
  };

  return (
    <AppLayout>
      {renderCurrentView()}
      <PolarCopilot />
    </AppLayout>
  );
};

export default function App() {
  return (
    <OperationalProvider>
      <AppContent />
    </OperationalProvider>
  );
}
