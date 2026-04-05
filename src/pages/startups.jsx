import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { registrationTypes, startupStages } from '../mockData';
import { getStartups, addStartup } from '../api/api';

const Startups = () => {
  const [startups, setStartups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    founder: '',
    type: 'Private Limited',
    date: '',
    stage: 'Early'
  });


  useEffect(() => {
    loadStartups();
  }, []);

  const loadStartups = async () => {
    try {
      const data = await getStartups();

      const formatted = data.map(s => ({
        id: s.startup_id,
        name: s.startup_name,
        founder: s.founder_name,
        type: s.registration_type || 'Private Limited',
        date: s.registration_date || new Date(),
        stage: 'Early' // temporary (not in backend)
      }));

      setStartups(formatted);
    } catch (err) {
      console.error("Error fetching startups:", err);
    }
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔥 Add startup to backend
  const handleAdd = async () => {
    if (!form.name || !form.founder || !form.date) return;

    try {
      await addStartup({
        startup_name: form.name,
        founder_name: form.founder
      });

      await loadStartups(); // refresh from DB

      setForm({
        name: '',
        founder: '',
        type: 'Private Limited',
        date: '',
        stage: 'Early'
      });

      setShowModal(false);
    } catch (err) {
      console.error("Error adding startup:", err);
    }
  };

  // 🔍 Search filter
  const filtered = startups.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.founder.toLowerCase().includes(search.toLowerCase())
  );

  const stageColor = {
    Idea: 'badge-neutral',
    Early: 'badge-warning',
    Growth: 'badge-info',
    Scaling: 'badge-success'
  };

  return (
    <div>
      {/* Header */}
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
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>
                  No startups found.
                </td>
              </tr>
            ) : (
              filtered.map((s, idx) => (
                <tr key={s.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#0ea5e9',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700
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
                    <span className={`badge ${stageColor[s.stage]}`}>
                      {s.stage}
                    </span>
                  </td>
                  <td>
                    {new Date(s.date).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title="Add New Startup"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAdd}>
                Add Startup
              </button>
            </>
          }
        >
          <div className="form-group">
            <label>Startup Name</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Founder Name</label>
            <input
              className="form-input"
              name="founder"
              value={form.founder}
              onChange={handleChange}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Registration Type</label>
              <select
                className="form-select"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                {registrationTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Stage</label>
              <select
                className="form-select"
                name="stage"
                value={form.stage}
                onChange={handleChange}
              >
                {startupStages.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Registration Date</label>
            <input
              type="date"
              className="form-input"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Startups;