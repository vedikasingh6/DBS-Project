import React, { useState, useMemo } from 'react';
import { mockStartups, mockPolicies, mockStatuses } from '../mockData';

const Expenses = () => {
  const [startupFilter, setStartupFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const rows = useMemo(() => {
    const result = [];
    Object.entries(mockStatuses).forEach(([sid, arr]) => {
      const startup = mockStartups.find(s => s.id === Number(sid));
      if (!startup) return;
      if (startupFilter !== 'All' && startup.id !== Number(startupFilter)) return;
      arr.forEach(entry => {
        const policy = mockPolicies.find(p => p.id === entry.policyId);
        if (!policy) return;
        if (statusFilter !== 'All' && entry.status !== statusFilter) return;
        result.push({
          startup: startup.name,
          policy: policy.name,
          stage: policy.stage,
          estimated: policy.estimatedCost,
          actual: entry.actualCost,
          status: entry.status,
          variance: entry.actualCost - policy.estimatedCost,
        });
      });
    });
    return result;
  }, [startupFilter, statusFilter]);

  const totalEst = rows.reduce((s, r) => s + r.estimated, 0);
  const totalAct = rows.reduce((s, r) => s + r.actual, 0);

  const statusBadge = {
    'Pending': 'badge-warning',
    'In Progress': 'badge-info',
    'Completed': 'badge-success',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Detailed cost breakdown across all startups and policies</p>
        </div>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#D0E8E230', color: 'var(--teal)' }}>📋</div>
          <div className="stat-info">
            <div className="stat-value">{rows.length}</div>
            <div className="stat-label">Total Entries</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EDE8D8', color: '#C8860A' }}>₹</div>
          <div className="stat-info">
            <div className="stat-value">₹{(totalEst / 1000).toFixed(0)}K</div>
            <div className="stat-label">Total Estimated</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4A807018', color: 'var(--teal-dark)' }}>💸</div>
          <div className="stat-info">
            <div className="stat-value">₹{(totalAct / 1000).toFixed(0)}K</div>
            <div className="stat-label">Total Actual</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"
            style={{
              background: totalAct > totalEst ? '#FEE8E8' : '#DCF0EB',
              color: totalAct > totalEst ? '#B84040' : '#3A6A5E'
            }}>
            {totalAct > totalEst ? '↑' : '↓'}
          </div>
          <div className="stat-info">
            <div className="stat-value"
              style={{ color: totalAct > totalEst ? '#B84040' : '#3A6A5E' }}>
              ₹{Math.abs(totalAct - totalEst).toLocaleString('en-IN')}
            </div>
            <div className="stat-label">{totalAct > totalEst ? 'Over Budget' : 'Saved'}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label className="form-label" style={{ marginBottom: '4px', display: 'block' }}>Startup</label>
          <select
            className="form-select"
            value={startupFilter}
            onChange={e => setStartupFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="All">All Startups</option>
            {mockStartups.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label" style={{ marginBottom: '4px', display: 'block' }}>Status</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Startup</th>
              <th>Policy</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Estimated (₹)</th>
              <th>Actual (₹)</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--charcoal-light)' }}>
                  No expense entries match the selected filters.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{r.startup}</td>
                  <td>{r.policy}</td>
                  <td><span className="badge badge-info">{r.stage}</span></td>
                  <td><span className={`badge ${statusBadge[r.status]}`}>{r.status}</span></td>
                  <td>₹{r.estimated.toLocaleString('en-IN')}</td>
                  <td>{r.actual > 0 ? `₹${r.actual.toLocaleString('en-IN')}` : <span style={{ color: 'var(--charcoal-light)' }}>—</span>}</td>
                  <td>
                    {r.actual === 0 ? (
                      <span style={{ color: 'var(--charcoal-light)' }}>—</span>
                    ) : r.variance === 0 ? (
                      <span className="badge badge-neutral">On target</span>
                    ) : (
                      <span style={{ color: r.variance > 0 ? '#B84040' : '#3A6A5E', fontWeight: 600 }}>
                        {r.variance > 0 ? '+' : ''}₹{r.variance.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals row */}
      {rows.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '32px',
          padding: '14px 16px',
          background: 'var(--cream)',
          border: '1px solid var(--border)',
          borderTop: 'none',
          borderRadius: '0 0 var(--radius) var(--radius)',
          fontSize: '13px',
          fontWeight: 700,
        }}>
          <span style={{ marginLeft: 'auto' }}>Total Estimated: ₹{totalEst.toLocaleString('en-IN')}</span>
          <span>Total Actual: ₹{totalAct.toLocaleString('en-IN')}</span>
        </div>
      )}
    </div>
  );
};

export default Expenses;
