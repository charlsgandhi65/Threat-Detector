import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import AppLayout from './layouts/AppLayout';

import DashboardRoute from './pages/DashboardRoute';
import TransactionsPage from './pages/TransactionsPage';
import AlertsPage from './pages/AlertsPage';
import IntelligencePage from './pages/IntelligencePage';
import AnalyticsPage from './pages/AnalyticsPage';
import HealthPage from './pages/HealthPage';
import SettingsPage from './pages/SettingsPage';
import IncidentInvestigationPage from './pages/IncidentInvestigationPage';

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardRoute />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="intelligence" element={<IntelligencePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="incidents" element={<IncidentInvestigationPage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}
