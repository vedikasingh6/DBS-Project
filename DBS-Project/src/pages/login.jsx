import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('dbs_logged_in', 'true');
      localStorage.setItem('dbs_user', form.email.split('@')[0]);
      navigate('/app/dashboard');
    }, 900);
  };

  return (
    <div style={styles.page}>
      {/* Left decorative panel */}
      <div style={styles.panel}>
        <div style={styles.panelInner}>
          <div style={styles.brandMark}>DBS</div>
          <h1 style={styles.panelTitle}>Startup Registry<br />& Compliance</h1>
          <p style={styles.panelSub}>
            Track every startup's compliance journey — from registration to full certification.
          </p>
          <div style={styles.pillRow}>
            {['GST', 'MSME', 'Trademark', 'ISO', 'PF'].map(tag => (
              <span key={tag} style={styles.pill}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={styles.decorCircle1} />
        <div style={styles.decorCircle2} />
      </div>

      {/* Right form panel */}
      <div style={styles.formSide}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSub}>Sign in to your account</p>
          </div>

          {error && (
            <div style={styles.errorBox}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px' }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p style={styles.signupLink}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--teal)', fontWeight: 600 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--cream-light)',
  },
  panel: {
    width: '45%',
    background: 'var(--charcoal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    position: 'relative',
    overflow: 'hidden',
  },
  panelInner: {
    position: 'relative',
    zIndex: 1,
  },
  brandMark: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '13px',
    letterSpacing: '0.25em',
    color: 'var(--teal-light)',
    textTransform: 'uppercase',
    marginBottom: '24px',
    background: 'rgba(74,128,112,0.2)',
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '4px',
  },
  panelTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '38px',
    color: '#F7F2E8',
    lineHeight: 1.25,
    marginBottom: '16px',
  },
  panelSub: {
    color: 'rgba(247,242,232,0.55)',
    fontSize: '14px',
    lineHeight: 1.7,
    maxWidth: '320px',
    marginBottom: '32px',
  },
  pillRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  pill: {
    padding: '5px 12px',
    borderRadius: '20px',
    background: 'rgba(74,128,112,0.25)',
    color: '#5C9A88',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    border: '1px solid rgba(74,128,112,0.3)',
  },
  decorCircle1: {
    position: 'absolute',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'rgba(74,128,112,0.08)',
    bottom: '-80px',
    right: '-80px',
  },
  decorCircle2: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(74,128,112,0.05)',
    top: '40px',
    left: '-60px',
  },
  formSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 32px',
  },
  formCard: {
    width: '100%',
    maxWidth: '400px',
  },
  formHeader: {
    marginBottom: '32px',
  },
  formTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '30px',
    color: 'var(--charcoal)',
    marginBottom: '6px',
  },
  formSub: {
    fontSize: '14px',
    color: 'var(--charcoal-light)',
  },
  errorBox: {
    background: '#FEE8E8',
    color: '#B84040',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '14px',
    border: '1px solid #F0C0C0',
  },
  signupLink: {
    textAlign: 'center',
    marginTop: '22px',
    fontSize: '13.5px',
    color: 'var(--charcoal-light)',
  },
};

export default Login;
