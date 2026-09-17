import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, ShieldCheck, ShieldAlert, ArrowLeft, UserX, UserCheck } from 'lucide-react';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const ManageUsers = () => {
  const { addToast } = useNotifications();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    api.get('/admin/users')
      .then(res => { if (res.users) setUsers(res.users); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-status`);
      if (res.success) {
        addToast({ type: 'info', title: 'User Status Updated', message: res.message });
        fetchUsers();
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Error', message: err.message });
    }
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Administration
          </Link>
          <h1 style={{ fontSize: '2.2rem' }}>User & Donor Account Management</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Inspect registered accounts, manage security statuses, and review role access.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['ALL', 'PATIENT', 'DONOR', 'BLOOD_BANK', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`btn ${roleFilter === r ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--slate-100)', textAlign: 'left', borderBottom: '1px solid var(--slate-200)' }}>
                <th style={{ padding: '12px 16px' }}>User Name</th>
                <th style={{ padding: '12px 16px' }}>Email Address</th>
                <th style={{ padding: '12px 16px' }}>Phone</th>
                <th style={{ padding: '12px 16px' }}>System Role</th>
                <th style={{ padding: '12px 16px' }}>Account Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700' }}>{u.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-info">{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`btn ${u.isActive ? 'btn-outline' : 'btn-secondary'} btn-sm`}
                      >
                        {u.isActive ? 'Suspend' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
