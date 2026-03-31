import React, { useState, useEffect } from 'react';
import { mockStartups, mockPolicies, mockStatuses } from '../mockData';

const StatusTracking = () => {
  const [selectedStartup, setSelectedStartup] = useState(mockStartups[0].id);
  const [rows, setRows] = useState([]);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    const base = mockStatuses[selectedStartup] || [];
    setRows(base.map(r => ({ ...r })));
    setSaved(null);
  }, [selectedStartup]);

  const handleStatusChange = (policyId, value) => {
    setRows(prev => prev.map(r => r.policyId === policyId ? { ...r, status: value } : r));
  };

  const handleCostChange = (policyId, value) => {
    setRows(prev => prev.map(r => r.policyId === policyId ? { ...r, actualCost: Number(value) } : r));
  };

  const handleUpdate = (policyId) => {
    setSaved(policyId);
    setTimeout(() => setSaved(null), 2000);
  };

  const statusBadge = {
    'Pending': 'badge-warning',
    'In Progress': 'badge-info',
    'Completed': 'badge-success',
  };

  const startup = mockStartups.find(s => s.id === selectedStartup);
  const completedCount = rows.filter(r => r.status === 'Completed').length;
  const progress = rows.length ? Math.round((completedCount / rows.length) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Status Tracking</h1>
          <p className="page-subtitle">Update compliance status for each startup</p>
        </div>
      </div>

      {/* Startup Selector */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>Select Startup</label>
          <select
            className="form-select"
            value={selectedStartup}
            onChange={e => setSelectedStartup(Number(e.target.value))}
            style={{ maxWidth: '300px' }}
          >
            {mockStartups.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {startup && (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontFamily: "'DM Serif Display', serif", color: 'var(--teal)' }}>{completedCount}</div>
              <div style={{ fontSize: '11px', color: 'var(--charcoal-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontFamily: "'DM Serif Display', serif", color: 'var(--charcoal)' }}>{rows.length}</div>
              <div style={{ fontSize: '11px', color: 'var(--charcoal-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontFamily: "'DM Serif Display', serif", color: 'var(--teal)' }}>{progress}%</div>
              <div style={{ fontSize: '11px', color: 'var(--charcoal-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</div>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: '6px', background: 'var(--cream)', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--teal)',
          borderRadius: '3px',
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Stage</th>
              <th>Current Status</th>
              <th>Actual Cost (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const policy = mockPolicies.find(p => p.id === row.policyId);
              if (!policy) return null;
              return (
                <tr key={row.policyId}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{policy.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--charcoal-light)' }}>
                      Est. ₹{policy.estimatedCost.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td><span className="badge badge-info">{policy.stage}</span></td>
                  <td>
                    <select
                      className="form-select"
                      value={row.status}
                      onChange={e => handleStatusChange(row.policyId, e.target.value)}
                      style={{
                        width: '140px',
                        background: row.status === 'Completed' ? 'var(--completed-bg)' :
                          row.status === 'In Progress' ? 'var(--progress-bg)' : 'var(--pending-bg)',
                        color: row.status === 'Completed' ? 'var(--completed-text)' :
                          row.status === 'In Progress' ? 'var(--progress-text)' : 'var(--pending-text)',
                        fontWeight: 600,
                        border: 'none',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-input"
                      value={row.actualCost}
                      onChange={e => handleCostChange(row.policyId, e.target.value)}
                      style={{ width: '120px' }}
                      min="0"
                    />
                  </td>
                  <td>
                    {saved === row.policyId ? (
                      <span className="badge badge-success">✓ Saved</span>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdate(row.policyId)}
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusTracking;
