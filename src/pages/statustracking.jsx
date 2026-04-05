import React, { useState, useEffect, useMemo } from 'react';
import { getStartups, getPolicies, getStatus, addStatus } from '../api/api';

const StatusTracking = () => {
  const [startups, setStartups] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [statusData, setStatusData] = useState([]);
  
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [rows, setRows] = useState([]); // This holds the editable table data
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(null);

  // 1. Initial Data Load
  useEffect(() => {
    const init = async () => {
      try {
        const [s, p, st] = await Promise.all([getStartups(), getPolicies(), getStatus()]);
        setStartups(s);
        setPolicies(p);
        setStatusData(st);
        
        // Default to the first startup in the list
        if (s.length > 0) setSelectedStartup(s[0].startup_id);
      } catch (err) {
        console.error("Initial load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 2. Build Rows whenever startup or raw data changes
  useEffect(() => {
    if (!selectedStartup || policies.length === 0) return;

    // We map through ALL policies to ensure the table is always full
    const startupRows = policies.map(policy => {
      // Find if this startup already has a record for this specific policy
      const record = statusData.find(
        st => st.startup_id === selectedStartup && st.policy_id === policy.policy_id
      );

      return {
        policyId: policy.policy_id,
        name: policy.policy_name,
        stage: policy.stage_name,
        estimated: Number(policy.total_estimated_cost) || 0,
        status: record ? record.status : 'Pending',
        actualCost: record ? Number(record.actual_cost) : 0,
      };
    });

    setRows(startupRows);
    setSaved(null);
  }, [selectedStartup, policies, statusData]);

  // 3. Local State Handlers (Updating the UI before clicking Save)
  const handleStatusChange = (policyId, value) => {
    setRows(prev => prev.map(r => r.policyId === policyId ? { ...r, status: value } : r));
  };

  const handleCostChange = (policyId, value) => {
    setRows(prev => prev.map(r => r.policyId === policyId ? { ...r, actualCost: value } : r));
  };

  // 4. Save to Backend
  const handleUpdate = async (row) => {
    try {
      await addStatus({
        startup_id: selectedStartup,
        policy_id: row.policyId,
        status: row.status,
        actual_cost: Number(row.actualCost),
      });

      setSaved(row.policyId);
      setTimeout(() => setSaved(null), 2000);

      // Refresh the raw status data from the server to keep everything in sync
      const updatedStatus = await getStatus();
      setStatusData(updatedStatus);
    } catch (err) {
      alert("Error updating status. Check your backend console.");
      console.error(err);
    }
  };

  const completedCount = useMemo(() => rows.filter(r => r.status === 'Completed').length, [rows]);
  const progress = rows.length ? Math.round((completedCount / rows.length) * 100) : 0;

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Connecting to database...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Status Tracking</h1>
          <p className="page-subtitle">Update compliance status for each startup</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>Select Startup</label>
          <select
            className="form-select"
            value={selectedStartup || ''}
            onChange={e => setSelectedStartup(Number(e.target.value))}
            style={{ maxWidth: '300px' }}
          >
            {startups.map(s => (
              <option key={s.startup_id} value={s.startup_id}>{s.startup_name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', color: 'var(--teal)', fontWeight: 'bold' }}>{completedCount}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Completed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', color: '#333', fontWeight: 'bold' }}>{rows.length}</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Total</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', color: 'var(--teal)', fontWeight: 'bold' }}>{progress}%</div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>Progress</div>
          </div>
        </div>
      </div>

      <div style={{ height: '6px', background: '#eee', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--teal)', transition: 'width 0.5s ease' }} />
      </div>

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
            {rows.map(row => (
              <tr key={row.policyId}>
                <td>
                  <div style={{ fontWeight: 600 }}>{row.name}</div>
                  <div style={{ fontSize: '11.5px', color: '#888' }}>
                    Est. ₹{row.estimated.toLocaleString('en-IN')}
                  </div>
                </td>
                <td><span className="badge badge-info">{row.stage}</span></td>
                <td>
                  <select
                    className="form-select"
                    value={row.status}
                    onChange={e => handleStatusChange(row.policyId, e.target.value)}
                    style={{ width: '140px', fontWeight: 600 }}
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
                  />
                </td>
                <td>
                  {saved === row.policyId ? (
                    <span className="badge badge-success">✓ Saved</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(row)}>
                      Update
                    </button>
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

export default StatusTracking;