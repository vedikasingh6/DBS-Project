import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const pageTitles = {
  '/app/dashboard': { title: 'Dashboard',       sub: 'Overview of all activity' },
  '/app/startups':  { title: 'Startups',         sub: 'Manage registered startups' },
  '/app/policies':  { title: 'Policies',         sub: 'Compliance & legal policies' },
  '/app/status':    { title: 'Status Tracking',  sub: 'Track policy completion per startup' },
  '/app/expenses':  { title: 'Expenses',         sub: 'Detailed cost breakdown across startups' },
  '/app/reports':   { title: 'Reports',          sub: 'Cost analysis & summaries' },
};

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const pageInfo  = pageTitles[location.pathname] || { title: 'DBS Project', sub: '' };
  const user      = localStorage.getItem('dbs_user') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('dbs_logged_in');
    localStorage.removeItem('dbs_user');
    navigate('/login');
  };

  return (
    <header style={{
      position: 'fixed', top: 0,
      left: 'var(--sidebar-width)', right: 0,
      height: 'var(--navbar-height)',
      background: 'rgba(247,242,232,0.92)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px', zIndex: 100,
    }}>
      {/* Page title */}
      <div>
        <h2 style={{
          fontSize: '18px', fontFamily: "'DM Serif Display', serif", lineHeight: 1.2,
        }}>{pageInfo.title}</h2>
        <p style={{ fontSize: '11.5px', color: 'var(--charcoal-light)', marginTop: '1px' }}>
          {pageInfo.sub}
        </p>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* User pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          padding: '6px 14px',
          background: 'var(--cream)', borderRadius: '20px',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'var(--teal)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700,
          }}>
            {user.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>{user}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px',
            background: 'transparent',
            border: '1.5px solid var(--border)',
            borderRadius: '8px',
            fontSize: '13px', color: 'var(--charcoal-light)',
            cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#B84040';
            e.currentTarget.style.color = '#B84040';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--charcoal-light)';
          }}
        >
          ↩ Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
