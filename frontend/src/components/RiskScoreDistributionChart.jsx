import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import './Charts.css';

const BUCKETS = [
  { label: '0–9', min: 0, max: 9 },
  { label: '10–29', min: 10, max: 29 },
  { label: '30–59', min: 30, max: 59 },
  { label: '60–89', min: 60, max: 89 },
  { label: '90+', min: 90, max: Infinity },
];

export default function RiskScoreDistributionChart({ transactions = [], loading }) {
  const data = useMemo(() => {
    const counts = BUCKETS.map((b) => ({ range: b.label, count: 0 }));
    transactions.forEach((t) => {
      const score = t.risk_score ?? 0;
      const idx = BUCKETS.findIndex((b) => score >= b.min && score <= b.max);
      if (idx >= 0) counts[idx].count += 1;
    });
    return counts;
  }, [transactions]);

  if (loading) {
    return <div className="chart-card glass-card"><div className="skeleton" style={{ height: 260 }} /></div>;
  }

  return (
    <div className="chart-card glass-card">
      <div className="chart-card__header">
        <div>
          <h3>Risk Score Distribution</h3>
          <p>Histogram of risk scores across all transactions</p>
        </div>
      </div>
      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(12, 20, 40, 0.95)',
                border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
