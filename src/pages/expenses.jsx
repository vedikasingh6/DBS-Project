import React, { useState, useEffect, useMemo } from 'react';
import { getStartups, getPolicies, getStatus } from '../api/api';

/* ================= THEME CONSTANTS ================= */
const COLORS = {
  bg: '#F8F6F0',
  card: '#FCFAF5',
  teal: '#4A8070',
  gold: '#C8860A',
  danger: '#B84040',
  text: '#3D3D3D',
  muted: '#7A7A7A',
  border: '#E8E4D8'
};

const Expenses = () => {
  const [startups, setStartups] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startupFilter, setStartupFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, p, st] = await Promise.all([getStartups(), getPolicies(), getStatus()]);
        setStartups(s || []);
        setPolicies(p || []);
        setStatusData(st || []);
      } catch (err) {
        console.error("Error loading expenses:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 🔥 CORE LOGIC: Merge IDs with Names and Filter
  const rows = useMemo(() => {
    return statusData
      .filter(r => {
        // Match by ID instead of Name for better reliability
        const matchesStartup = startupFilter === 'All' || Number(r.startup_id) === Number(startupFilter);
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        return matchesStartup && matchesStatus;
      })
      .map(r => {
        // Find the associated Startup and Policy objects to get their names and estimates
        const startupObj = startups.find(s => Number(s.startup_id) === Number(r.startup_id));
        const policyObj = policies.find(p => Number(p.policy_id) === Number(r.policy_id));

        const estimated = Number(policyObj?.total_estimated_cost || 0);
        const actual = Number(r.actual_cost || 0);

        return {
          startup: startupObj?.startup_name || 'Unknown Startup',
          policy: policyObj?.policy_name || 'Unknown Policy',
          stage: policyObj?.stage_name || 'N/A',
          estimated,
          actual,
          status: r.status,
          variance: actual - estimated,
        };
      });
  }, [statusData, policies, startups, startupFilter, statusFilter]);

  const totalEst = useMemo(() => rows.reduce((s, r) => s + r.estimated, 0), [rows]);
  const totalAct = useMemo(() => rows.reduce((s, r) => s + r.actual, 0), [rows]);
  const totalVariance = totalAct - totalEst;

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', background: COLORS.bg, minHeight: '100vh' }}>Loading data...</div>;

  return (
    <div style={{ padding: '30px', backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: COLORS.text }}>Expense Tracking</h2>
        <p style={{ color: COLORS.muted, fontSize: '14px', marginTop: '4px' }}>Variance analysis of estimated vs actual costs</p>
      </header>

      {/* SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: COLORS.card, padding: '24px', borderRadius: '20px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '12px', color: COLORS.muted, fontWeight: '700', marginBottom: '8px' }}>TOTAL ESTIMATED</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: COLORS.text }}>₹{totalEst.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: COLORS.card, padding: '24px', borderRadius: '20px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '12px', color: COLORS.muted, fontWeight: '700', marginBottom: '8px' }}>TOTAL ACTUAL</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: COLORS.teal }}>₹{totalAct.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ 
          background: totalVariance > 0 ? '#FEECEC' : '#EDF7F4', 
          padding: '24px', borderRadius: '20px', border: `1px solid ${COLORS.border}` 
        }}>
          <div style={{ fontSize: '12px', color: COLORS.muted, fontWeight: '700', marginBottom: '8px' }}>BUDGET VARIANCE</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: totalVariance > 0 ? COLORS.danger : COLORS.teal }}>
            {totalVariance > 0 ? '+' : ''}₹{Math.abs(totalVariance).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <select
          className="form-select"
          value={startupFilter}
          onChange={e => setStartupFilter(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, background: COLORS.card, minWidth: '200px' }}
        >
          <option value="All">All Startups</option>
          {startups.map(s => (
            <option key={s.startup_id} value={s.startup_id}>{s.startup_name}</option>
          ))}
        </select>

        <select
          className="form-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, background: COLORS.card, minWidth: '150px' }}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* TABLE */}
      <div style={{ background: COLORS.card, borderRadius: '20px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#F1EFE9' }}>
            <tr>
              <th style={{ padding: '15px', fontSize: '12px', color: COLORS.muted }}>STARTUP</th>
              <th style={{ padding: '15px', fontSize: '12px', color: COLORS.muted }}>POLICY</th>
              <th style={{ padding: '15px', fontSize: '12px', color: COLORS.muted }}>STATUS</th>
              <th style={{ padding: '15px', fontSize: '12px', color: COLORS.muted }}>ESTIMATED</th>
              <th style={{ padding: '15px', fontSize: '12px', color: COLORS.muted }}>ACTUAL</th>
              <th style={{ padding: '15px', fontSize: '12px', color: COLORS.muted }}>VARIANCE</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: COLORS.muted }}>No expense records found.</td></tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '15px', fontWeight: '700' }}>{r.startup}</td>
                  <td style={{ padding: '15px' }}>{r.policy}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '800',
                      background: r.status === 'Completed' ? '#DCF0EB' : '#F0F0F0',
                      color: r.status === 'Completed' ? '#3A6A5E' : '#666'
                    }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '15px' }}>₹{r.estimated.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '15px', fontWeight: '700', color: COLORS.teal }}>₹{r.actual.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '15px', fontWeight: '700', color: r.variance > 0 ? COLORS.danger : COLORS.teal }}>
                    {r.variance > 0 ? '+' : ''}₹{r.variance.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;