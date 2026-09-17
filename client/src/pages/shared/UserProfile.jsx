import React, { useState } from 'react';
import { User, Phone, Mail, ShieldCheck, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import api from '../../utils/api';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useNotifications();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', { name, phone });
      if (res.success) {
        updateUser({ name, phone });
        addToast({ type: 'success', title: 'Profile Updated', message: 'Your personal details have been saved.' });
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '620px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <User size={32} />
            </div>
            <h1 style={{ fontSize: '2rem' }}>{user?.name}</h1>
            <div style={{ display: 'inline-block', background: 'var(--slate-100)', color: 'var(--slate-700)', padding: '2px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', marginTop: '4px' }}>
              Role: {user?.role}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="form-control"
                style={{ background: 'var(--slate-100)', color: 'var(--slate-500)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control"
                placeholder="+91 98401 23456"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%' }} disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
