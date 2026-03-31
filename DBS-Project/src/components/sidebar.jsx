import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/app/dashboard',  icon: '⬡', label: 'Dashboard' },
  { path: '/app/startups',   icon: '◈', label: 'Startups' },
  { path: '/app/policies',   icon: '⬟', label: 'Policies' },
  { path: '/app/status',     icon: '◉', label: 'Status Tracking' },
  { path: '/app/expenses',   icon: '💰', label: 'Expenses' },
  { path: '/app/reports',    icon: '◧', label: 'Reports' },
];

const Sidebar = () => {
  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'var(--charcoal)',
      display: 'flex', flexDirection: 'column',
      zIndex: 200,
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 24px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: '20px', color: '#F7F2E8', letterSpacing: '0.02em',
        }}>DBS Project</div>
        <div style={{
          fontSize: '10.5px', color: 'rgba(247,242,232,0.45)',
          letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px',
        }}>Startup Registry</div>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: '16px 12px',
        display: 'flex', flexDirection: 'column', gap: '3px',
      }}>
        <p style={{
          fontSize: '10px', color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          padding: '8px 12px 4px', fontWeight: 700,
        }}>Navigation</p>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '11px',
              padding: '10px 14px', borderRadius: '8px',
              color: isActive ? '#F7F2E8' : 'rgba(247,242,232,0.52)',
              background: isActive ? 'rgba(74,128,112,0.32)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: '13.5px', textDecoration: 'none',
              transition: 'all 0.15s ease',
              borderLeft: isActive ? '3px solid #4A8070' : '3px solid transparent',
            })}
          >
            <span style={{ fontSize: '15px', opacity: 0.85, flexShrink: 0 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ fontSize: '11px', color: 'rgba(247,242,232,0.28)', letterSpacing: '0.04em' }}>
          v1.0.0 · DBS Registry
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
