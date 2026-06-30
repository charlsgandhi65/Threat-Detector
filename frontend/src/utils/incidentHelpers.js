export function getCorrelationRule(rootCause) {
  const rules = {
    'Possible Money Laundering': [
      'High Value Transaction',
      'High Risk Location',
      'Wire Transfer',
    ],
    'Suspicious Financial Activity': [
      'Large Amount',
      'Wire Transfer',
    ],
    'Cross-Border Fraud': [
      'High Risk Location',
      'Suspicious Location',
      'Foreign Transaction Pattern',
    ],
    'Coordinated Fraud Attempt': [
      'Multiple Correlated Events',
      'Rapid Transaction Sequence',
      'Elevated Risk Indicators',
    ],
    'Suspicious Activity': [
      'Anomalous Transaction Pattern',
      'Risk Threshold Exceeded',
    ],
  };

  return rules[rootCause] ?? [
    'Security Event Correlation',
    'Risk Pattern Detection',
    'Behavioral Anomaly',
  ];
}

export function getRecommendedActions(rootCause) {
  const actions = {
    'Possible Money Laundering': [
      'Block suspicious transaction',
      'Notify Security Administrator',
      'Freeze account temporarily',
      'Review transaction history',
    ],
    'Suspicious Financial Activity': [
      'Verify transaction',
      'Notify customer',
      'Continue monitoring',
    ],
    'Cross-Border Fraud': [
      'Review foreign transactions',
      'Enable additional verification',
      'Notify SOC Team',
    ],
    'Coordinated Fraud Attempt': [
      'Escalate to incident response team',
      'Block all pending transactions',
      'Initiate full account audit',
      'Notify law enforcement if required',
    ],
    'Suspicious Activity': [
      'Review transaction details',
      'Increase monitoring level',
      'Notify security analyst',
    ],
  };

  return actions[rootCause] ?? [
    'Review incident details',
    'Notify security team',
    'Continue monitoring user activity',
    'Document findings for audit trail',
  ];
}

export function getUniqueTimelineEvents(timeline = []) {
  const seen = new Set();
  const events = [];

  timeline.forEach((item) => {
    const event = item?.event?.trim();
    if (event && !seen.has(event)) {
      seen.add(event);
      events.push(event);
    }
  });

  return events;
}

export function sortIncidentsNewestFirst(incidents = []) {
  return [...incidents].sort((a, b) => {
    const idDiff = (b.id ?? 0) - (a.id ?? 0);
    if (idDiff !== 0) return idDiff;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

export function computeIncidentStats(incidents = []) {
  if (!incidents.length) {
    return { total: 0, critical: 0, averageConfidence: 0 };
  }

  const critical = incidents.filter((i) => i.severity === 'CRITICAL').length;
  const avgConfidence = Math.round(
    incidents.reduce((sum, i) => sum + (i.confidence ?? 0), 0) / incidents.length,
  );

  return { total: incidents.length, critical, averageConfidence: avgConfidence };
}

export function filterIncidents(incidents = [], search = '', severity = 'ALL') {
  let rows = [...incidents];

  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((i) => i.user_name?.toLowerCase().includes(q));
  }

  if (severity !== 'ALL') {
    rows = rows.filter((i) => i.severity === severity);
  }

  return sortIncidentsNewestFirst(rows);
}
