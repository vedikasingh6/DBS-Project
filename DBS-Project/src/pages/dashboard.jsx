import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStartups, mockPolicies, mockStatuses, mockActivity } from '../mockData';

// Simple Bar Chart using SVG
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => Math.max(d.estimated, d.actual)));
  const chartH = 140;
  const barW = 28;
  const gap = 20;
  const groupW = barW * 2 + gap;
  const totalW = data.length * (groupW + 24);

  return (
    <svg width="100%" viewBox={`0 0 ${totalW} ${chartH + 40}`} style={{ overflow: 'visible' }}>
      {data.map((d, i) => {
        const x = i * (groupW + 24) + 12;
        const estH = (d.estimated / max) * chartH;
        const actH = (d.actual / max) * chartH;
        return (
          <g key={d.label}>
            <rect x={x} y={chartH - estH} width={barW} height={estH} rx="4" fill="#D0E8E2" />
            <rect x={x + barW + 4} y={chartH - actH} width={barW} height={actH} rx="4" fill="#4A8070" />
            <text x={x + groupW / 2} y={chartH + 18} textAnchor="middle" fontSize="10" fill="#5A5A5A">{d.label}</text>
          </g>
        );
      })}
      {/* Legend */}
      <rect x={0} y={chartH + 32} width={10} height={10} rx="2" fill="#D0E8E2" />
      <text x={14} y={chartH + 42} fontSize="10" fill="#5A5A5A">Estimated</text>
      <rect x={75} y={chartH + 32} width={10} height={10} rx="2" fill="#4A8070" />
      <text x={89} y={chartH + 42} fontSize="10" fill="#5A5A5A">Actual</text>
    </svg>
  );
};

// Simple Donut Chart
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 52, cx = 70, cy = 70, strokeW = 22;
  const circumference = 2 * Math.PI * r;
  const colors = ['#4A8070', '#C8860A', '#D0E8E2'];

  // Precompute rotations to avoid mutation inside render
  const slices = data.map((d, i) => {
    const cumBefore = data.slice(0, i).reduce((s, x) => s + x.value, 0);
    const rotation = -90 + (cumBefore / total) * 360;
    const pct = d.value / total;
    const dashArray = `${pct * circumference} ${circumference}`;
    return { ...d, rotation, dashArray };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width="140" height="140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EDE8D8" strokeWidth={strokeW} />
        {slices.map((s, i) => (
          <circle
            key={s.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={colors[i]}
            strokeWidth={strokeW}
            strokeDasharray={s.dashArray}
            strokeDashoffset={0}
            transform={`rotate(${s.rotation}, ${cx}, ${cy})`}
          />
        ))}
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#3D3D3D">{total}</text>
        <text x={cx} y={cy + 20} textAnchor="middle" fontSize="9" fill="#5A5A5A">TOTAL</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {slices.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: colors[i], flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: '#5A5A5A' }}>{s.value} policies</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const allStatuses = Object.values(mockStatuses).flat();
    const completed = allStatuses.filter(s => s.status === 'Completed').length;
    const totalCost = allStatuses.reduce((s, p) => s + p.actualCost, 0);
    return {
      startups: mockStartups.length,
      policies: mockPolicies.length,
      completed,
      cost: totalCost,
    };
  }, []);

  const chartData = mockPolicies.slice(0, 5).map(p => {
    const actualTotal = Object.values(mockStatuses)
      .map(arr => arr.find(s => s.policyId === p.id)?.actualCost || 0)
      .reduce((a, b) => a + b, 0);
    return {
      label: p.name.split(' ')[0],
      estimated: p.estimatedCost * mockStartups.length,
      actual: actualTotal,
    };
  });

  const donutData = useMemo(() => {
    const all = Object.values(mockStatuses).flat();
    return [
      { label: 'Completed', value: all.filter(s => s.status === 'Completed').length },
      { label: 'In Progress', value: all.filter(s => s.status === 'In Progress').length },
      { label: 'Pending', value: all.filter(s => s.status === 'Pending').length },
    ];
  }, []);

  const statCards = [
    { label: 'Total Startups', value: stats.startups, icon: '◈', color: '#4A8070' },
    { label: 'Total Policies', value: stats.policies, icon: '⬟', color: '#C8860A' },
    { label: 'Completed Policies', value: stats.completed, icon: '✓', color: '#3A6A5E' },
    { label: 'Total Cost Incurred', value: `₹${(stats.cost / 1000).toFixed(0)}K`, icon: '₹', color: '#5A3D3D' },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        {statCards.map(card => (
          <div className="stat-card" key={card.label}>
            <div className="stat-icon" style={{ background: `${card.color}18`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">Cost Comparison — Estimated vs Actual (₹)</div>
          <BarChart data={chartData} />
        </div>
        <div className="chart-card">
          <div className="chart-title">Policy Stage Distribution</div>
          <DonutChart data={donutData} />
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Recent Activity</h3>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/app/status')}
            >
              View All
            </button>
          </div>
          {mockActivity.map(a => (
            <div className="activity-item" key={a.id}>
              <div className="activity-dot" />
              <div>
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Startups Quick View */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Startups Overview</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/app/startups')}>
              Manage
            </button>
          </div>
          {mockStartups.map(s => {
            const statuses = mockStatuses[s.id] || [];
            const done = statuses.filter(x => x.status === 'Completed').length;
            const pct = Math.round((done / statuses.length) * 100);
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'var(--teal)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, flexShrink: 0,
                }}>
                  {s.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{s.name}</div>
                  <div style={{ height: '4px', background: 'var(--cream)', borderRadius: '2px', marginTop: '5px' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--teal)', borderRadius: '2px', transition: 'width 0.5s' }} />
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--teal)', minWidth: '36px', textAlign: 'right' }}>
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
