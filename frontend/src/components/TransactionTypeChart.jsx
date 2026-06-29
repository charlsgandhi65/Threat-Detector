import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import './Charts.css';

export default function TransactionTypeChart({ transactions = [], loading }) {
  const data = useMemo(() => {
    const counts = {};
    transactions.forEach((t) => {
      counts[t.transaction_type] = (counts[t.transaction_type] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [transactions]);

  if (loading) {
    return <div className="chart-card glass-card"><div className="skeleton" style={{ height: 260 }} /></div>;
  }

  return (
    <div className="chart-card glass-card">
      <div className="chart-card__header">
        <div>
          <h3>Transactions by Type</h3>
          <p>Volume distribution across payment channels</p>
        </div>
      </div>
      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
            <Tooltip
              contentStyle={{
                background: 'rgba(12, 20, 40, 0.95)',
                border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} fillOpacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
