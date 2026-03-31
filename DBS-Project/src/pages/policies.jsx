import React, { useState } from 'react';
import { mockPolicies, stages } from '../mockData';

const Policies = () => {
  const [stageFilter, setStageFilter] = useState('All');

  const filtered = stageFilter === 'All'
    ? mockPolicies
    : mockPolicies.filter(p => p.stage === stageFilter);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Policies</h1>
          <p className="page-subtitle">{mockPolicies.length} compliance policies tracked</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['All', ...stages].map(s => (
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
              transition: 'all 0.15s',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
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
                <td style={{ color: 'var(--charcoal-light)', fontWeight: 500 }}>{idx + 1}</td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>
                  <span className="badge badge-info">{p.stage}</span>
                </td>
                <td>
                  {p.mandatory
                    ? <span className="badge badge-success">Yes</span>
                    : <span className="badge badge-neutral">No</span>
                  }
                </td>
                <td style={{ fontWeight: 500 }}>₹{p.estimatedCost.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--charcoal-light)' }}>
          No policies found for this stage.
        </div>
      )}
    </div>
  );
};

export default Policies;
