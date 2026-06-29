import { useMemo } from 'react';
import './Charts.css';
import './RiskHeatmap.css';

const HOURS = ['00', '04', '08', '12', '16', '20'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function riskLevel(score) {
  if (score >= 80) return 4;
  if (score >= 60) return 3;
  if (score >= 30) return 2;
  if (score > 0) return 1;
  return 0;
}

export default function RiskHeatmap({ transactions = [], loading }) {
  const grid = useMemo(() => {
    const matrix = Array.from({ length: 7 }, () => Array(6).fill(0));
    const counts = Array.from({ length: 7 }, () => Array(6).fill(0));

    transactions.forEach((t) => {
      if (!t.timestamp) return;
      const d = new Date(t.timestamp);
      const day = (d.getDay() + 6) % 7;
      const hourBlock = Math.min(Math.floor(d.getHours() / 4), 5);
      matrix[day][hourBlock] += t.risk_score ?? 0;
      counts[day][hourBlock] += 1;
    });

    return matrix.map((row, di) =>
      row.map((sum, hi) => {
        const avg = counts[di][hi] ? sum / counts[di][hi] : 0;
        return riskLevel(avg);
      }),
    );
  }, [transactions]);

  if (loading) {
    return <div className="chart-card glass-card"><div className="skeleton" style={{ height: 260 }} /></div>;
  }

  return (
    <div className="chart-card glass-card">
      <div className="chart-card__header">
        <div>
          <h3>Risk Heatmap</h3>
          <p>Activity intensity by day and time block</p>
        </div>
      </div>
      <div className="chart-card__body">
        <div className="heatmap">
          <div className="heatmap__y-labels">
            {DAYS.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="heatmap__grid">
            {grid.map((row, di) => (
              <div key={di} className="heatmap__row">
                {row.map((level, hi) => (
                  <div
                    key={hi}
                    className={`heatmap__cell heatmap__cell--${level}`}
                    title={`${DAYS[di]} ${HOURS[hi]}:00 — Risk level ${level}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="heatmap__x-labels">
            {HOURS.map((h) => <span key={h}>{h}:00</span>)}
          </div>
        </div>
        <div className="heatmap__legend">
          <span>Low</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`heatmap__cell heatmap__cell--${l}`} />
          ))}
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
}
