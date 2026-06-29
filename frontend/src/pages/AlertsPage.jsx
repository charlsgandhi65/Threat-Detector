import { HiOutlineBellAlert } from 'react-icons/hi2';
import { useAppData } from '../context/DataContext';
import ThreatAlertsTable from '../components/ThreatAlertsTable';
import PageError from '../components/PageError';

export default function AlertsPage() {
  const { transactions, loading, error } = useAppData();

  const threatCount = transactions.filter(
    (t) => t.status === 'HIGH' || t.status === 'CRITICAL',
  ).length;

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h2 className="page-title">Threat Alerts</h2>
        <p className="page-desc">
          Suspicious HIGH and CRITICAL transactions — auto-refreshes every 2 seconds
        </p>
      </header>

      {error && <PageError message={error} />}

      <div className="section-header">
        <div>
          <h3 className="section-title"><HiOutlineBellAlert /> Active Threats</h3>
          <p className="section-subtitle">{threatCount} suspicious transactions detected</p>
        </div>
      </div>

      <ThreatAlertsTable transactions={transactions} loading={loading && transactions.length === 0} />
    </div>
  );
}
