import { useAppData } from '../context/DataContext';
import Dashboard from './Dashboard';

export default function DashboardRoute() {
  const { transactions, alerts, stats, loading, apiStatus } = useAppData();
  return (
    <Dashboard
      transactions={transactions}
      alerts={alerts}
      stats={stats}
      loading={loading}
      apiStatus={apiStatus}
    />
  );
}
