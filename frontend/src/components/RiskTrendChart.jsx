import { useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatTime } from '../utils/helpers';
import './Charts.css';

export default function RiskTrendChart({ transactions = [], loading, timeBased = false }) {
  const data = useMemo(() => {
    if (timeBased) {
      return [...transactions]
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(-30)
        .map((t) => ({
          name: formatTime(t.timestamp),
          risk: t.risk_score ?? 0,
        }));
    }
    const recent = [...transactions].slice(0, 30).reverse();
    return recent.map((t) => ({
      name: `#${t.id}`,
      risk: t.risk_score ?? 0,
    }));
  }, [transactions, timeBased]);

  if (loading) {
    return <div className="chart-card glass-card"><div className="skeleton" style={{ height: 260 }} /></div>;
  }

  const title = timeBased ? 'Risk Trend Over Time' : 'Risk Trend';
  const tooltipStyle = {
    background: 'rgba(12, 20, 40, 0.95)',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: 10,
    fontSize: 12,
  };

  return (
    <div className="chart-card glass-card">
      <div className="chart-card__header">
        <div>
          <h3>{title}</h3>
          <p>Risk scores across recent transactions</p>
        </div>
      </div>
      <div className="chart-card__body">
        {data.length === 0 ? (
          <div className="chart-card__empty">No trend data available</div>
        ) : timeBased ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="risk" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="risk" stroke="#00d4ff" strokeWidth={2} fill="url(#riskGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
