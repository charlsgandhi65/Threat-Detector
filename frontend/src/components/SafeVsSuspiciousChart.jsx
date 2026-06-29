import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Charts.css';

export default function SafeVsSuspiciousChart({ stats, loading }) {
  const data = stats
    ? [
        { name: 'Safe', value: stats.safe, color: '#34d399' },
        { name: 'Suspicious', value: (stats.medium ?? 0) + (stats.high ?? 0) + (stats.critical ?? 0), color: '#f87171' },
      ].filter((d) => d.value > 0)
    : [];

  if (loading) {
    return <div className="chart-card glass-card"><div className="skeleton" style={{ height: 260 }} /></div>;
  }

  return (
    <div className="chart-card glass-card">
      <div className="chart-card__header">
        <div>
          <h3>Safe vs Suspicious</h3>
          <p>Safe transactions compared to flagged risk levels</p>
        </div>
      </div>
      <div className="chart-card__body">
        {data.length === 0 ? (
          <div className="chart-card__empty">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(12, 20, 40, 0.95)',
                  border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
