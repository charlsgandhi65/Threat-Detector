import { useState, useEffect, useCallback } from 'react';
import { fetchTransactions, fetchAlerts, fetchStats, checkApiHealth } from '../services/api';

export const POLL_MS = 2000;

export default function useLiveData() {
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('warning');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [requestCount, setRequestCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const health = await checkApiHealth();
      setApiStatus(health);
      setRequestCount((c) => c + 1);

      const [tx, al, st] = await Promise.all([
        fetchTransactions(),
        fetchAlerts(),
        fetchStats(),
      ]);

      setRequestCount((c) => c + 3);
      setTransactions(tx);
      setAlerts(al);
      setStats(st);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      setApiStatus('offline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return {
    transactions,
    alerts,
    stats,
    loading,
    error,
    apiStatus,
    lastUpdated,
    requestCount,
    refresh,
  };
}
