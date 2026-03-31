import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/login');
    }, 900);
  };

  return (
    <div style={styles.page}>
      <div style={styles.panel}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={styles.brandMark}>DBS</div>
          <h1 style={styles.panelTitle}>Join the<br />Registry</h1>
          <p style={styles.panelSub}>
            Create your account and start tracking compliance for all your registered startups.
          </p>
          <div style={{ marginTop: '32px' }}>
            {['✓  Track multiple startups', '✓  Monitor compliance stages', '✓  Analyse costs & reports'].map(item => (
              <div key={item} style={{ color: 'rgba(247,242,232,0.65)', fontSize: '13.5px', marginBottom: '10px' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div style={styles.decorCircle1} />
        <div style={styles.decorCircle2} />
      </div>

      <div style={styles.formSide}>
        <div style={styles.formCard}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={styles.formTitle}>Create account</h2>
            <p style={{ fontSize: '14px', color: 'var(--charcoal-light)' }}>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Arjun Mehta"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '13.5px', color: 'var(--charcoal-light)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: 'var(--cream-light)' },
  panel: {
    width: '45%',
    background: 'var(--teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    position: 'relative',
    overflow: 'hidden',
  },
  brandMark: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '13px',
    letterSpacing: '0.25em',
    color: 'rgba(247,242,232,0.8)',
    textTransform: 'uppercase',
    marginBottom: '24px',
    background: 'rgba(247,242,232,0.12)',
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
    color: 'rgba(247,242,232,0.7)',
    fontSize: '14px',
    lineHeight: 1.7,
    maxWidth: '300px',
  },
  decorCircle1: {
    position: 'absolute',
    width: '300px', height: '300px',
    borderRadius: '50%',
    background: 'rgba(247,242,232,0.06)',
    bottom: '-60px', right: '-80px',
  },
  decorCircle2: {
    position: 'absolute',
    width: '180px', height: '180px',
    borderRadius: '50%',
    background: 'rgba(247,242,232,0.04)',
    top: '40px', left: '-50px',
  },
  formSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 32px',
  },
  formCard: { width: '100%', maxWidth: '400px' },
  formTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '30px',
    color: 'var(--charcoal)',
    marginBottom: '6px',
  },
};

export default Signup;
