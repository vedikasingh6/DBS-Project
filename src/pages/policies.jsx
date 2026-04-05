import React, { useState, useEffect } from 'react';
import { getPolicies } from '../api/api';

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [stageFilter, setStageFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

const loadPolicies = async () => {
  try {
    const data = await getPolicies();
    console.log("Raw data from backend:", data[0]); // Check your console (F12) for this!

    const formatted = data.map(p => ({
      id: p.policy_id,
      name: p.policy_name,
      stage: p.stage_name,
      mandatory: p.mandatory,
      // 🔥 Convert the DB string to a Number. 
      // Use the exact name: total_estimated_cost
      estimatedCost: Number(p.total_estimated_cost) || 0 
    }));

    setPolicies(formatted);
  } catch (err) {
    console.error("Error fetching policies:", err);
  } finally {
    setLoading(false);
  }
};

  const stages = ['All', ...new Set(policies.map(p => p.stage))];

  const filtered =
    stageFilter === 'All'
      ? policies
      : policies.filter(p => p.stage === stageFilter);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading policies...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Policies</h1>
          <p className="page-subtitle">
            {policies.length} compliance policies tracked
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {stages.map(s => (
          <button
            key={s}
            onClick={() => setStageFilter(s)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              border: stageFilter === s ? 'none' : '1.5px solid var(--border)',
              background: stageFilter === s ? 'var(--teal)' : 'var(--white)',
              color: stageFilter === s ? 'white' : 'var(--charcoal-light)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Policy Name</th>
              <th>Stage</th>
              <th>Mandatory</th>
              <th>Estimated Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={p.id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>
                  <span className="badge badge-info">{p.stage}</span>
                </td>
                <td>
                  {p.mandatory ? (
                    <span className="badge badge-success">Yes</span>
                  ) : (
                    <span className="badge badge-neutral">No</span>
                  )}
                </td>
                <td style={{ fontWeight: 600, color: 'var(--teal)' }}>
                  ₹{p.estimatedCost.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No policies found for this stage.
        </div>
      )}
    </div>
  );
};

export default Policies;