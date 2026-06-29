import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import './Charts.css';

export default function LocationThreatChart({ transactions = [], loading }) {
  const data = useMemo(() => {
    const counts = {};
    transactions
      .filter((t) => t.status === 'HIGH' || t.status === 'CRITICAL')
      .forEach((t) => {
        counts[t.location] = (counts[t.location] ?? 0) + 1;
      });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [transactions]);

  if (loading) {
    return <div className="chart-card glass-card"><div className="skeleton" style={{ height: 260 }} /></div>;
  }

  return (
    <div className="chart-card glass-card">
      <div className="chart-card__header">
        <div>
          <h3>Threats by Location</h3>
          <p>High and critical threats grouped by geography</p>
        </div>
      </div>
      <div className="chart-card__body">
        {data.length === 0 ? (
          <div className="chart-card__empty">No threat data by location</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(12, 20, 40, 0.95)',
                  border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="#f87171" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
