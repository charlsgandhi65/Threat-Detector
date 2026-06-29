import { HiOutlineChartBar } from 'react-icons/hi2';
import { useAppData } from '../context/DataContext';
import ThreatPieChart from '../components/ThreatPieChart';
import RiskTrendChart from '../components/RiskTrendChart';
import TransactionTypeChart from '../components/TransactionTypeChart';
import LocationThreatChart from '../components/LocationThreatChart';
import SafeVsSuspiciousChart from '../components/SafeVsSuspiciousChart';
import RiskScoreDistributionChart from '../components/RiskScoreDistributionChart';
import PageError from '../components/PageError';

export default function AnalyticsPage() {
  const { transactions, stats, loading, error } = useAppData();

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h2 className="page-title">Analytics</h2>
        <p className="page-desc">
          Threat visualization and pattern analysis — auto-refreshes every 2 seconds
        </p>
      </header>

      {error && <PageError message={error} />}

      <div className="section-header">
        <div>
          <h3 className="section-title"><HiOutlineChartBar /> Threat Analytics</h3>
          <p className="section-subtitle">Live charts powered by backend data</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="charts-row">
          <ThreatPieChart stats={stats} loading={loading && !stats} />
          <RiskTrendChart transactions={transactions} loading={loading && !transactions.length} timeBased />
        </section>
        <section className="charts-row">
          <TransactionTypeChart transactions={transactions} loading={loading && !transactions.length} />
          <LocationThreatChart transactions={transactions} loading={loading && !transactions.length} />
        </section>
        <section className="charts-row">
          <SafeVsSuspiciousChart stats={stats} loading={loading && !stats} />
          <RiskScoreDistributionChart transactions={transactions} loading={loading && !transactions.length} />
        </section>
      </div>
    </div>
  );
}
