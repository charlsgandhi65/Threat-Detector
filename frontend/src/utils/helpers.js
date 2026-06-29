export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(dateInput) {
  if (!dateInput) return '—';
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return formatDate(dateStr);
}

export const STATUS_COLORS = {
  SAFE: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.35)' },
  MEDIUM: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.35)' },
  HIGH: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.35)' },
  CRITICAL: { bg: 'rgba(220, 38, 38, 0.2)', text: '#fca5a5', border: 'rgba(220, 38, 38, 0.45)' },
};

export function computeThreatIntel(transactions = [], alerts = []) {
  if (!transactions.length) {
    return {
      highestRiskUser: '—',
      mostDangerousLocation: '—',
      highestTransaction: 0,
      mostCommonThreat: '—',
      averageRiskScore: 0,
      mostUsedType: '—',
      topAlertCategory: '—',
    };
  }

  const byUser = {};
  const byLocation = {};
  const byType = {};
  const threatCounts = {};
  let maxAmount = 0;
  let totalRisk = 0;

  transactions.forEach((t) => {
    byUser[t.user_name] = Math.max(byUser[t.user_name] ?? 0, t.risk_score ?? 0);
    byLocation[t.location] = (byLocation[t.location] ?? 0) + (t.risk_score ?? 0);
    byType[t.transaction_type] = (byType[t.transaction_type] ?? 0) + 1;
    maxAmount = Math.max(maxAmount, t.amount ?? 0);
    totalRisk += t.risk_score ?? 0;
    if (t.status && t.status !== 'SAFE') {
      threatCounts[t.status] = (threatCounts[t.status] ?? 0) + 1;
    }
  });

  const alertCats = {};
  alerts.forEach((a) => {
    alertCats[a.severity] = (alertCats[a.severity] ?? 0) + 1;
  });

  const topUser = Object.entries(byUser).sort((a, b) => b[1] - a[1])[0];
  const topLoc = Object.entries(byLocation).sort((a, b) => b[1] - a[1])[0];
  const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
  const topThreat = Object.entries(threatCounts).sort((a, b) => b[1] - a[1])[0];
  const topAlert = Object.entries(alertCats).sort((a, b) => b[1] - a[1])[0];

  return {
    highestRiskUser: topUser?.[0] ?? '—',
    mostDangerousLocation: topLoc?.[0] ?? '—',
    highestTransaction: maxAmount,
    mostCommonThreat: topThreat?.[0] ?? '—',
    averageRiskScore: Math.round(totalRisk / transactions.length),
    mostUsedType: topType?.[0] ?? '—',
    topAlertCategory: topAlert?.[0] ?? '—',
  };
}

export function buildTimelineEvents(transactions = [], alerts = []) {
  const events = [];

  transactions.slice(0, 40).forEach((t) => {
    events.push({
      id: `tx-${t.id}`,
      type: 'transaction',
      title: 'Transaction Created',
      detail: `${t.user_name} · ${formatCurrency(t.amount)} · ${t.location}`,
      time: t.timestamp,
      severity: 'SAFE',
    });
    if (t.risk_score > 0) {
      events.push({
        id: `risk-${t.id}`,
        type: 'risk',
        title: 'Risk Calculated',
        detail: `Score ${t.risk_score} — ${t.status}`,
        time: t.timestamp,
        severity: t.status,
      });
    }
  });

  alerts.slice(0, 20).forEach((a) => {
    events.push({
      id: `alert-${a.id}`,
      type: 'alert',
      title: 'Alert Generated',
      detail: a.message,
      time: a.created_at,
      severity: a.severity,
    });
  });

  return events
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 15);
}

export function getSystemHealth(transactions = [], apiStatus) {
  const latest = transactions[0];
  const latestTime = latest?.timestamp ? new Date(latest.timestamp).getTime() : 0;
  const ageSec = latestTime ? (Date.now() - latestTime) / 1000 : Infinity;

  const generatorStatus = ageSec < 45 ? 'online' : ageSec < 120 ? 'warning' : 'offline';
  const recentAnalyzed = transactions.slice(0, 5).every((t) => t.risk_score > 0 || t.status === 'SAFE');
  const monitorStatus = transactions.length === 0 ? 'warning' : recentAnalyzed ? 'online' : 'warning';

  return {
    backend: apiStatus,
    database: apiStatus === 'online' ? 'online' : 'offline',
    generator: generatorStatus,
    monitor: monitorStatus,
    api: apiStatus,
  };
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function computePageIntel(transactions = []) {
  if (!transactions.length) {
    return {
      highestRiskCustomer: '—',
      highestTransactionAmount: 0,
      mostDangerousLocation: '—',
      mostCommonThreatReason: '—',
      averageRiskScore: 0,
      totalThreatsToday: 0,
      mostUsedTransactionType: '—',
      totalFlaggedTransactions: 0,
    };
  }

  const byUser = {};
  const byLocation = {};
  const byType = {};
  const reasonCounts = {};
  let maxAmount = 0;
  let totalRisk = 0;
  let flagged = 0;
  let threatsToday = 0;

  transactions.forEach((t) => {
    byUser[t.user_name] = Math.max(byUser[t.user_name] ?? 0, t.risk_score ?? 0);
    if (t.status === 'HIGH' || t.status === 'CRITICAL') {
      byLocation[t.location] = (byLocation[t.location] ?? 0) + 1;
    }
    byType[t.transaction_type] = (byType[t.transaction_type] ?? 0) + 1;
    maxAmount = Math.max(maxAmount, t.amount ?? 0);
    totalRisk += t.risk_score ?? 0;
    if (t.is_flagged) flagged += 1;

    if ((t.status === 'HIGH' || t.status === 'CRITICAL') && isToday(t.timestamp)) {
      threatsToday += 1;
    }

    if (t.risk_reason) {
      t.risk_reason.split(',').map((r) => r.trim()).filter(Boolean).forEach((reason) => {
        reasonCounts[reason] = (reasonCounts[reason] ?? 0) + 1;
      });
    }
  });

  const topUser = Object.entries(byUser).sort((a, b) => b[1] - a[1])[0];
  const topLoc = Object.entries(byLocation).sort((a, b) => b[1] - a[1])[0];
  const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
  const topReason = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0];

  return {
    highestRiskCustomer: topUser?.[0] ?? '—',
    highestTransactionAmount: maxAmount,
    mostDangerousLocation: topLoc?.[0] ?? '—',
    mostCommonThreatReason: topReason?.[0] ?? '—',
    averageRiskScore: Math.round(totalRisk / transactions.length),
    totalThreatsToday: threatsToday,
    mostUsedTransactionType: topType?.[0] ?? '—',
    totalFlaggedTransactions: flagged,
  };
}

export function getMonitoringStatus(health) {
  if (health.monitor === 'online' && health.generator === 'online') return 'Active';
  if (health.monitor === 'offline' || health.generator === 'offline') return 'Offline';
  return 'Degraded';
}

