import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import '../App.css';

import CyberBackground from '../components/CyberBackground';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ThreatAlertNotifier from '../components/ThreatAlertNotifier';
import { useAppData } from '../context/DataContext';
import useThreatNotifications from '../hooks/useThreatNotifications';
import { stopThreatAlarm } from '../utils/alarm';

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    transactions,
    alerts,
    stats,
    loading,
    error,
    apiStatus,
  } = useAppData();

  const {
    activeThreat,
    toastQueue,
    audioUnlocked,
    dismissThreat,
    dismissToast,
    enableAudio,
  } = useThreatNotifications(alerts, loading);

  useEffect(() => () => stopThreatAlarm(), []);

  return (
    <div className="app">
      <CyberBackground />
      <ThreatAlertNotifier
        activeThreat={activeThreat}
        toastQueue={toastQueue}
        transactions={transactions}
        audioUnlocked={audioUnlocked}
        onDismiss={dismissThreat}
        onDismissToast={dismissToast}
        onEnableAudio={enableAudio}
        onViewAlerts={() => {
          dismissThreat();
          navigate('/alerts');
        }}
      />
      <Navbar
        apiStatus={apiStatus}
        alertCount={alerts.length}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <main className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {error && (
          <div className="error-banner">
            <HiOutlineExclamationCircle />
            Unable to reach backend API. Start Flask with <code className="mono">python app.py</code>
          </div>
        )}
        <Outlet context={{ transactions, alerts, stats, loading, apiStatus }} />
      </main>
      <Footer collapsed={sidebarCollapsed} />
    </div>
  );
}
