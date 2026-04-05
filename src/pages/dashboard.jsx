import React, { useState, useEffect, useMemo } from 'react';
import { getStartups, getPolicies, getStatus } from '../api/api';

/* ================= THEME CONSTANTS ================= */
const COLORS = {
  bg: '#F8F6F0',      // Soft Cream
  card: '#FCFAF5',    // Ivory (Not pure white)
  teal: '#4A8070',    // Brand Primary
  tealLight: '#D0E8E2', // Est. Bars
  gold: '#C8860A',    // Progress/Secondary
  text: '#3D3D3D',
  muted: '#7A7A7A',
  border: '#E8E4D8'
};

/* ================= BAR CHART (Side-by-Side) ================= */
const BarChart = ({ data }) => {
  if (!data || data.length === 0) return <div style={{ color: COLORS.muted }}>No data...</div>;

  const maxVal = Math.max(...data.map(d => Math.max(d.estimated || 0, d.actual || 0)), 1);
  const chartH = 140;
  const barW = 22;
  const barGap = 6;
  const groupGap = 40;

  return (
    <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '10px' }}>
      <svg width={data.length * (barW * 2 + barGap + groupGap)} height={chartH + 50}>
        {data.map((d, i) => {
          const xBase = i * (barW * 2 + barGap + groupGap);
          const estH = ((d.estimated || 0) / maxVal) * chartH;
          const actH = ((d.actual || 0) / maxVal) * chartH;

          return (
            <g key={i}>
              {/* Estimated Bar */}
              <rect x={xBase} y={chartH - estH} width={barW} height={estH} fill={COLORS.tealLight} rx="4" />
              {/* Actual Bar */}
              <rect x={xBase + barW + barGap} y={chartH - actH} width={barW} height={actH} fill={COLORS.teal} rx="4" />
              
              <text x={xBase + barW + barGap / 2} y={chartH + 20} fontSize="11" textAnchor="middle" fill={COLORS.text} fontWeight="600">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '11px', fontWeight: 'bold' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: COLORS.tealLight, borderRadius: '3px' }} /> Estimated
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', background: COLORS.teal, borderRadius: '3px' }} /> Actual
        </div>
      </div>
    </div>
  );
};

/* ================= DONUT CHART ================= */
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 45, cx = 65, cy = 65, strokeW = 16;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ position: 'relative' }}>
        <svg width="130" height="130">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8E4D8" strokeWidth={strokeW} />
          {data.map((d, i) => {
            const dash = (d.value / total) * circumference;
            const color = [COLORS.teal, COLORS.gold, COLORS.tealLight][i % 3];
            const circle = (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeW}
                strokeDasharray={`${dash} ${circumference}`} strokeDashoffset={-offset}
                transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="round"
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '800' }}>{total}</div>
          <div style={{ fontSize: '9px', color: COLORS.muted }}>TOTAL</div>
        </div>
      </div>
      <div style={{ width: '100%' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${COLORS.border}`, fontSize: '12px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: [COLORS.teal, COLORS.gold, COLORS.tealLight][i % 3] }} />
                {d.label}
             </div>
             <span style={{ fontWeight: '800' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= DASHBOARD COMPONENT ================= */
const Dashboard = () => {
  const [startups, setStartups] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [s, p, st] = await Promise.all([getStartups(), getPolicies(), getStatus()]);
        setStartups(s || []);
        setPolicies(p || []);
        setStatusData(st || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const completed = statusData.filter(s => s.status === 'Completed').length;
    const totalCost = statusData.reduce((sum, s) => sum + Number(s.actual_cost || 0), 0);
    return { startups: startups.length, policies: policies.length, completed, cost: totalCost };
  }, [startups, policies, statusData]);

  const chartData = useMemo(() => {
    return policies.slice(0, 5).map(p => {
      const related = statusData.filter(s => s.policy_name === p.policy_name);
      const actualTotal = related.reduce((sum, r) => sum + Number(r.actual_cost || 0), 0);
      return {
        label: p.policy_name.split(' ')[0],
        estimated: Number(p.total_estimated_cost || 5000) * startups.length,
        actual: actualTotal,
      };
    });
  }, [policies, statusData, startups]);

  const donutData = useMemo(() => [
    { label: 'Completed', value: statusData.filter(s => s.status === 'Completed').length },
    { label: 'In Progress', value: statusData.filter(s => s.status === 'In Progress').length },
    { label: 'Pending', value: statusData.filter(s => s.status === 'Pending').length },
  ], [statusData]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', background: COLORS.bg, minHeight: '100vh' }}>Synchronizing...</div>;

  return (
    <div style={{ padding: '30px', backgroundColor: COLORS.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: COLORS.text }}>Platform Analytics</h2>
        <p style={{ color: COLORS.muted, fontSize: '14px', margin: '4px 0 0 0' }}>Overview of startup compliance and incurred costs</p>
      </header>

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Total Startups', value: stats.startups, color: COLORS.teal, icon: '◈' },
          { label: 'Compliance Policies', value: stats.policies, color: COLORS.gold, icon: '⬟' },
          { label: 'Successful Stages', value: stats.completed, color: '#3A6A5E', icon: '✓' },
          { label: 'Total Expenditure', value: `₹${(stats.cost / 1000).toFixed(1)}k`, color: '#5A3D3D', icon: '₹' },
        ].map((card, i) => (
          <div key={i} style={{ background: COLORS.card, padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ background: `${card.color}15`, color: card.color, width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: COLORS.text }}>{card.value}</div>
              <div style={{ fontSize: '12px', color: COLORS.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '25px', marginBottom: '30px' }}>
        <div style={{ background: COLORS.card, padding: '30px', borderRadius: '24px', border: `1px solid ${COLORS.border}` }}>
          <h4 style={{ margin: '0 0 30px 0', fontSize: '16px', fontWeight: '700' }}>Budget Comparison (Est vs Act)</h4>
          <BarChart data={chartData} />
        </div>
        <div style={{ background: COLORS.card, padding: '30px', borderRadius: '24px', border: `1px solid ${COLORS.border}` }}>
          <h4 style={{ margin: '0 0 30px 0', fontSize: '16px', fontWeight: '700' }}>Compliance Pipeline</h4>
          <DonutChart data={donutData} />
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        <div style={{ background: COLORS.card, padding: '30px', borderRadius: '24px', border: `1px solid ${COLORS.border}` }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Live Activity</h4>
          {statusData.slice(-5).reverse().map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 0', borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS.teal }} />
              <div style={{ fontSize: '14px', color: COLORS.text }}>
                <span style={{ fontWeight: '700' }}>{s.startup_name}</span> updated <span style={{ fontWeight: '700' }}>{s.policy_name}</span>
                <span style={{ marginLeft: '10px', fontSize: '11px', padding: '3px 8px', borderRadius: '12px', background: '#f0f0f0', color: COLORS.muted }}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.card, padding: '30px', borderRadius: '24px', border: `1px solid ${COLORS.border}` }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Startup Progress</h4>
          {startups.map(s => {
            const related = statusData.filter(x => x.startup_name === s.startup_name);
            const done = related.filter(x => x.status === 'Completed').length;
            const pct = related.length ? Math.round((done / related.length) * 100) : 0;
            return (
              <div key={s.startup_id} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: COLORS.teal, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                  {s.startup_name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>
                    <span>{s.startup_name}</span>
                    <span style={{ color: COLORS.teal }}>{pct}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#E8E4D8', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: COLORS.teal, borderRadius: '10px', transition: 'width 0.8s ease' }} />
                  </div>
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