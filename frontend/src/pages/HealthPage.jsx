import { HiOutlineHeart } from 'react-icons/hi2';
import { useAppData } from '../context/DataContext';
import HealthDashboard from '../components/HealthDashboard';
import PageError from '../components/PageError';
import PageLoader from '../components/PageLoader';
import { getSystemHealth } from '../utils/helpers';

export default function HealthPage() {
  const {
    transactions,
    stats,
    apiStatus,
    loading,
    error,
    lastUpdated,
    requestCount,
  } = useAppData();

  const health = getSystemHealth(transactions, apiStatus);
  const recordCount = stats?.total ?? transactions.length;

  if (loading && transactions.length === 0) {
    return (
      <div className="page-container fade-in">
        <header className="page-header">
          <h2 className="page-title">System Health</h2>
          <p className="page-desc">Operational status of all application services</p>
        </header>
        <PageLoader message="Checking system health..." />
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h2 className="page-title">System Health</h2>
        <p className="page-desc">
          Service monitoring and infrastructure metrics — auto-refreshes every 2 seconds
        </p>
      </header>

      {error && <PageError message={error} />}

      <div className="section-header">
        <div>
          <h3 className="section-title"><HiOutlineHeart /> Infrastructure Status</h3>
          <p className="section-subtitle">Real-time health of all system components</p>
        </div>
      </div>

      <HealthDashboard
        health={health}
        loading={loading && transactions.length === 0}
        lastUpdated={lastUpdated}
        requestCount={requestCount}
        recordCount={recordCount}
      />
    </div>
  );
}
