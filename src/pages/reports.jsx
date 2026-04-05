import React, { useMemo, useState, useEffect } from 'react';
import { getPolicies, getStartups, getStatus } from '../api/api';

// --- UI Component for the Bar Comparison ---
const CompareBar = ({ estimated, actual, max }) => {
  const estPct = (estimated / max) * 100 || 0;
  const actPct = (actual / max) * 100 || 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '70px', fontSize: '10px', color: '#888', textAlign: 'right' }}>Est.</div>
        <div style={{ flex: 1, height: '10px', background: '#f5f5f0', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${estPct}%`, height: '100%', background: '#D0E8E2', borderRadius: '5px' }} />
        </div>
        <div style={{ width: '70px', fontSize: '11px', fontWeight: 600 }}>₹{(estimated / 1000).toFixed(0)}K</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '70px', fontSize: '10px', color: '#888', textAlign: 'right' }}>Actual</div>
        <div style={{ flex: 1, height: '10px', background: '#f5f5f0', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${actPct}%`, height: '100%', background: '#4A8070', borderRadius: '5px' }} />
        </div>
        <div style={{ width: '70px', fontSize: '11px', fontWeight: 600 }}>₹{(actual / 1000).toFixed(0)}K</div>
      </div>
    </div>
  );
};

const Reports = () => {
  const [startupFilter, setStartupFilter] = useState('All');
  const [startups, setStartups] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [allStatus, setAllStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load backend data
  useEffect(() => {
    const load = async () => {
      try {
        const [s, p, st] = await Promise.all([getStartups(), getPolicies(), getStatus()]);
        setStartups(s);
        setPolicies(p);
        setAllStatus(st);
      } catch (err) {
        console.error("Report fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const reportData = useMemo(() => {
    return policies.map(p => {
      const relevantStatus = allStatus.filter(s => {
        const policyMatch = s.policy_id === p.policy_id;
        const startupMatch = startupFilter === 'All' || Number(s.startup_id) === Number(startupFilter);
        return policyMatch && startupMatch;
      });

      const actualTotal = relevantStatus.reduce((acc, curr) => acc + (Number(curr.actual_cost) || 0), 0);
      
      const filteredStartupsCount = startupFilter === 'All' ? startups.length : 1;
      const estimatedTotal = (Number(p.total_estimated_cost) || 0) * filteredStartupsCount;

      return {
        id: p.policy_id,
        name: p.policy_name,
        stage: p.stage_name,
        estimatedTotal,
        actualTotal,
        variance: actualTotal - estimatedTotal,
      };
    });
  }, [startupFilter, startups, policies, allStatus]);

  const totalEst = reportData.reduce((s, r) => s + r.estimatedTotal, 0);
  const totalAct = reportData.reduce((s, r) => s + r.actualTotal, 0);
  const maxVal = Math.max(...reportData.map(r => Math.max(r.estimatedTotal, r.actualTotal)), 1);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Generating Reports...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Cost Analysis</h1>
          <p className="page-subtitle">Detailed comparison of estimated vs actual expenditure</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label className="form-label" style={{ margin: 0 }}>Filter by Startup:</label>
          <select
            className="form-select"
            value={startupFilter}
            onChange={e => setStartupFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="All">All Startups</option>
            {startups.map(s => <option key={s.startup_id} value={s.startup_id}>{s.startup_name}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#D0E8E230', color: '#4A8070' }}>📊</div>
          <div className="stat-info">
            <div className="stat-value">₹{(totalEst / 1000).toFixed(0)}K</div>
            <div className="stat-label">Total Estimated Cost</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4A807018', color: '#3A6A5E' }}>💰</div>
          <div className="stat-info">
            <div className="stat-value">₹{(totalAct / 1000).toFixed(0)}K</div>
            <div className="stat-label">Total Actual Cost</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ 
            background: totalAct > totalEst ? '#FEE8E8' : '#DCF0EB', 
            color: totalAct > totalEst ? '#B84040' : '#3A6A5E' 
          }}>
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

      {/* Bar Comparison - Now Full Width */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <div className="chart-title">Cost Comparison per Policy</div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '11px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '8px', background: '#D0E8E2', borderRadius: '2px' }} /> Estimated
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '8px', background: '#4A8070', borderRadius: '2px' }} /> Actual
          </span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {reportData.map(r => (
            <div key={r.id}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#444' }}>{r.name}</div>
              <CompareBar estimated={r.estimatedTotal} actual={r.actualTotal} max={maxVal} />
            </div>
          ))}
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
                <td style={{ color: r.variance > 0 ? '#B84040' : '#3A6A5E', fontWeight: 600 }}>
                  {r.variance > 0 ? '+' : ''}₹{r.variance.toLocaleString('en-IN')}
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