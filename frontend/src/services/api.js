const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function fetchTransactions() {
  return request('/transactions');
}

export function fetchAlerts() {
  return request('/alerts');
}

export function fetchStats() {
  return request('/stats');
}

export async function checkApiHealth() {
  try {
    await fetchStats();
    return 'online';
  } catch {
    return 'offline';
  }
}
