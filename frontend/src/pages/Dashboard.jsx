import {
  HiOutlineArrowsRightLeft,
  HiOutlineShieldCheck,
  HiOutlineExclamationTriangle,
  HiOutlineFire,
  HiOutlineBolt,
} from 'react-icons/hi2';
import StatCard from '../components/StatCard';
import AlertBanner from '../components/AlertBanner';
import TransactionTable from '../components/TransactionTable';
import AlertsPanel from '../components/AlertsPanel';
import ThreatPieChart from '../components/ThreatPieChart';
import RiskTrendChart from '../components/RiskTrendChart';
import TransactionTypeChart from '../components/TransactionTypeChart';
import RiskHeatmap from '../components/RiskHeatmap';
import ThreatIntel from '../components/ThreatIntel';
import SystemHealth from '../components/SystemHealth';
import Timeline from '../components/Timeline';
import { computeThreatIntel, buildTimelineEvents, getSystemHealth } from '../utils/helpers';

export default function Dashboard({ transactions, alerts, stats, loading, apiStatus }) {
  const intel = computeThreatIntel(transactions, alerts);
  const timeline = buildTimelineEvents(transactions, alerts);
  const health = getSystemHealth(transactions, apiStatus);

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <h2 className="page-title">Command Center</h2>
        <p className="page-desc">
          Real-Time Database Transaction Monitoring &amp; Threat Detection
        </p>
      </header>

      <div className="dashboard-grid">
        <section className="stats-row">
          <StatCard title="Total Transactions" value={stats?.total ?? 0} icon={HiOutlineArrowsRightLeft} accent="cyan" trend="+Live" trendUp loading={loading} />
          <StatCard title="Safe" value={stats?.safe ?? 0} icon={HiOutlineShieldCheck} accent="green" loading={loading} />
          <StatCard title="Medium Risk" value={stats?.medium ?? 0} icon={HiOutlineExclamationTriangle} accent="amber" loading={loading} />
          <StatCard title="High Risk" value={stats?.high ?? 0} icon={HiOutlineFire} accent="red" trend={stats?.high ? 'Active' : null} trendUp={false} loading={loading} />
          <StatCard title="Critical" value={stats?.critical ?? 0} icon={HiOutlineBolt} accent="critical" trend={stats?.critical ? 'Alert' : null} trendUp={false} loading={loading} />
        </section>

        <section>
          <AlertBanner transactions={transactions} alerts={alerts} loading={loading} />
        </section>

        <section>
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <HiOutlineArrowsRightLeft /> Live Transactions
              </h3>
              <p className="section-subtitle">Real-time transaction stream with risk analysis</p>
            </div>
          </div>
          <TransactionTable transactions={transactions} loading={loading} compact />
        </section>

        <section className="charts-row">
          <ThreatPieChart stats={stats} loading={loading} />
          <RiskTrendChart transactions={transactions} loading={loading} />
        </section>

        <section className="charts-row">
          <TransactionTypeChart transactions={transactions} loading={loading} />
          <RiskHeatmap transactions={transactions} loading={loading} />
        </section>

        <section className="dual-panel">
          <div>
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  <HiOutlineFire /> Recent Threat Alerts
                </h3>
                <p className="section-subtitle">High and critical severity incidents</p>
              </div>
            </div>
            <AlertsPanel alerts={alerts} transactions={transactions} loading={loading} limit={5} />
          </div>
          <div>
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  <HiOutlineArrowsRightLeft /> Activity Timeline
                </h3>
                <p className="section-subtitle">Latest security events</p>
              </div>
            </div>
            <Timeline events={timeline} loading={loading} />
          </div>
        </section>

        <section className="intel-health-row">
          <div>
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  <HiOutlineShieldCheck /> Threat Intelligence
                </h3>
                <p className="section-subtitle">Aggregated threat analytics</p>
              </div>
            </div>
            <ThreatIntel intel={intel} loading={loading} />
          </div>
          <div>
            <div className="section-header">
              <div>
                <h3 className="section-title">
                  <HiOutlineShieldCheck /> System Health
                </h3>
                <p className="section-subtitle">Service status monitoring</p>
              </div>
            </div>
            <SystemHealth health={health} loading={loading} />
          </div>
        </section>
      </div>
    </div>
  );
}
