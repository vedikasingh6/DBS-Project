import React, { useMemo, useState } from 'react';
import { mockPolicies, mockStatuses, mockStartups } from '../mockData';

// Bar chart comparison
const CompareBar = ({ estimated, actual, max }) => {
  const estPct = (estimated / max) * 100;
  const actPct = (actual / max) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '70px', fontSize: '10px', color: 'var(--charcoal-light)', textAlign: 'right' }}>Est.</div>
        <div style={{ flex: 1, height: '10px', background: 'var(--cream)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${estPct}%`, height: '100%', background: '#D0E8E2', borderRadius: '5px' }} />
        </div>
        <div style={{ width: '70px', fontSize: '11px', fontWeight: 600 }}>₹{(estimated / 1000).toFixed(0)}K</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '70px', fontSize: '10px', color: 'var(--charcoal-light)', textAlign: 'right' }}>Actual</div>
        <div style={{ flex: 1, height: '10px', background: 'var(--cream)', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${actPct}%`, height: '100%', background: 'var(--teal)', borderRadius: '5px' }} />
        </div>
        <div style={{ width: '70px', fontSize: '11px', fontWeight: 600 }}>₹{(actual / 1000).toFixed(0)}K</div>
      </div>
    </div>
  );
};

// Pie chart for cost distribution
const PieChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  const colors = ['#4A8070', '#3A6A5E', '#C8860A', '#D0E8E2', '#5A3D3D', '#8070AA', '#AA7060', '#70AA80'];

  const slices = data.map((d, i) => {
    const cumBefore = data.slice(0, i).reduce((s, x) => s + x.value, 0);
    const startAngle = (cumBefore / total) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((cumBefore + d.value) / total) * 2 * Math.PI - Math.PI / 2;
    const r = 70;
    const cx = 85, cy = 85;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = d.value / total > 0.5 ? 1 : 0;
    const path = `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
    return { path, color: colors[i % colors.length], label: d.label, value: d.value, pct: d.value / total };
  });

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <svg width="170" height="170" style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="2" />
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: s.color, flexShrink: 0 }} />
            <div style={{ fontSize: '11.5px' }}>
              <span style={{ fontWeight: 600 }}>{s.label}</span>
              <span style={{ color: 'var(--charcoal-light)', marginLeft: '4px' }}>({(s.pct * 100).toFixed(0)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Reports = () => {
  const [startupFilter, setStartupFilter] = useState('All');

  const reportData = useMemo(() => {
    return mockPolicies.map(p => {
      let actualTotal = 0;
      let count = 0;
      Object.entries(mockStatuses).forEach(([sid, arr]) => {
        if (startupFilter !== 'All' && Number(sid) !== Number(startupFilter)) return;
        const row = arr.find(r => r.policyId === p.id);
        if (row) { actualTotal += row.actualCost; count++; }
      });
      const numStartups = startupFilter === 'All' ? mockStartups.length : 1;
      return {
        ...p,
        estimatedTotal: p.estimatedCost * numStartups,
        actualTotal,
        variance: actualTotal - p.estimatedCost * numStartups,
      };
    });
  }, [startupFilter]);

  const totalEst = reportData.reduce((s, r) => s + r.estimatedTotal, 0);
  const totalAct = reportData.reduce((s, r) => s + r.actualTotal, 0);
  const maxVal = Math.max(...reportData.map(r => Math.max(r.estimatedTotal, r.actualTotal)));

  const pieData = reportData.filter(r => r.actualTotal > 0).map(r => ({
    label: r.name.split(' ')[0],
    value: r.actualTotal,
  }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Cost Analysis</h1>
          <p className="page-subtitle">Compare estimated vs actual expenditure</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label className="form-label" style={{ margin: 0 }}>Filter by Startup:</label>
          <select
            className="form-select"
            value={startupFilter}
            onChange={e => setStartupFilter(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="All">All Startups</option>
            {mockStartups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#D0E8E230', color: 'var(--teal)' }}>📊</div>
          <div className="stat-info">
            <div className="stat-value">₹{(totalEst / 1000).toFixed(0)}K</div>
            <div className="stat-label">Total Estimated Cost</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4A807018', color: 'var(--teal-dark)' }}>💰</div>
          <div className="stat-info">
            <div className="stat-value">₹{(totalAct / 1000).toFixed(0)}K</div>
            <div className="stat-label">Total Actual Cost</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: totalAct > totalEst ? '#FEE8E8' : '#DCF0EB', color: totalAct > totalEst ? '#B84040' : '#3A6A5E' }}>
            {totalAct > totalEst ? '↑' : '↓'}
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: totalAct > totalEst ? '#B84040' : '#3A6A5E' }}>
              ₹{Math.abs(totalAct - totalEst).toLocaleString('en-IN')}
            </div>
            <div className="stat-label">{totalAct > totalEst ? 'Over Budget' : 'Under Budget'}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Bar comparison chart */}
        <div className="chart-card">
          <div className="chart-title">Cost Comparison — Policy wise</div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '11px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '8px', background: '#D0E8E2', borderRadius: '2px' }} /> Estimated
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '8px', background: 'var(--teal)', borderRadius: '2px' }} /> Actual
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reportData.map(r => (
              <div key={r.id}>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{r.name}</div>
                <CompareBar estimated={r.estimatedTotal} actual={r.actualTotal} max={maxVal} />
              </div>
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="chart-card">
          <div className="chart-title">Actual Cost Distribution</div>
          {pieData.length > 0
            ? <PieChart data={pieData} />
            : <div style={{ color: 'var(--charcoal-light)', fontSize: '13px', paddingTop: '16px' }}>No actual costs recorded yet.</div>
          }
        </div>
      </div>

      {/* Detailed Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Stage</th>
              <th>Estimated Cost</th>
              <th>Actual Cost</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.name}</td>
                <td><span className="badge badge-info">{r.stage}</span></td>
                <td>₹{r.estimatedTotal.toLocaleString('en-IN')}</td>
                <td>₹{r.actualTotal.toLocaleString('en-IN')}</td>
                <td>
                  {r.variance === 0 ? (
                    <span style={{ color: 'var(--charcoal-light)' }}>—</span>
                  ) : (
                    <span style={{ color: r.variance > 0 ? '#B84040' : '#3A6A5E', fontWeight: 600 }}>
                      {r.variance > 0 ? '+' : ''}₹{r.variance.toLocaleString('en-IN')}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
