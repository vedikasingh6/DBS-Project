import React, { useState } from 'react';
import { mockStartups, registrationTypes, startupStages } from '../mockData';
import Modal from '../components/Modal';

const Startups = () => {
  const [startups, setStartups] = useState(mockStartups);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', founder: '', type: 'Private Limited', date: '', stage: 'Early' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    if (!form.name || !form.founder || !form.date) return;
    const newStartup = { ...form, id: Date.now() };
    setStartups(prev => [newStartup, ...prev]);
    setForm({ name: '', founder: '', type: 'Private Limited', date: '', stage: 'Early' });
    setShowModal(false);
  };

  const filtered = startups.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.founder.toLowerCase().includes(search.toLowerCase())
  );

  const stageColor = { Idea: 'badge-neutral', Early: 'badge-warning', Growth: 'badge-info', Scaling: 'badge-success' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Startups</h1>
          <p className="page-subtitle">{startups.length} startups registered</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Startup
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '16px' }}>
        <input
          className="form-input"
          type="text"
          placeholder="Search by name or founder…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '340px' }}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Startup Name</th>
              <th>Founder</th>
              <th>Registration Type</th>
              <th>Stage</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--charcoal-light)' }}>No startups found.</td></tr>
            ) : (
              filtered.map((s, idx) => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--charcoal-light)', fontWeight: 500 }}>{idx + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'var(--teal)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 700, flexShrink: 0,
                      }}>
                        {s.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                    </div>
                  </td>
                  <td>{s.founder}</td>
                  <td>
                    <span className="badge badge-neutral">{s.type}</span>
                  </td>
                  <td>
                    <span className={`badge ${stageColor[s.stage] || 'badge-neutral'}`}>{s.stage}</span>
                  </td>
                  <td>{new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <Modal
          title="Add New Startup"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Add Startup</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Startup Name</label>
            <input className="form-input" name="name" placeholder="e.g. GreenLeaf Tech" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Founder Name</label>
            <input className="form-input" name="founder" placeholder="e.g. Arjun Mehta" value={form.founder} onChange={handleChange} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Registration Type</label>
              <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                {registrationTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Stage</label>
              <select className="form-select" name="stage" value={form.stage} onChange={handleChange}>
                {startupStages.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Registration Date</label>
            <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Startups;
