import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Save, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';
import { BLOOD_GROUPS } from '../../utils/compatibility';

const DonorSettings = () => {
  const { addToast } = useNotifications();
  const [formData, setFormData] = useState({
    bloodGroup: 'O+',
    city: 'Coimbatore',
    preferredRadius: 15,
    lastDonationDate: '',
    weightKg: 65,
    hemoglobin: 14.5
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/donors/profile').then(res => {
      if (res.donor) {
        setFormData({
          bloodGroup: res.donor.bloodGroup || 'O+',
          city: res.donor.city || 'Coimbatore',
          preferredRadius: res.donor.preferredRadius || 15,
          lastDonationDate: res.donor.lastDonationDate ? res.donor.lastDonationDate.split('T')[0] : '',
          weightKg: res.donor.weightKg || 65,
          hemoglobin: res.donor.hemoglobin || 14.5
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/donors/profile', formData);
      if (res.success) {
        addToast({ type: 'success', title: 'Settings Saved', message: 'Your donor profile and preferences have been updated.' });
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Save Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>Loading donor configuration...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '640px' }}>
        <Link to="/donor/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Donor Preferences & Settings</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              Adjust your preferred dispatch distance, health screening stats, and blood group info.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Blood Group *</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="form-control"
                  style={{ fontWeight: '700', color: 'var(--primary-700)' }}
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City / Territory</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Preferred Donation Radius</label>
                <span style={{ fontWeight: '700', color: 'var(--primary-600)' }}>{formData.preferredRadius} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={formData.preferredRadius}
                onChange={(e) => setFormData({ ...formData, preferredRadius: parseInt(e.target.value, 10) })}
                style={{ width: '100%', accentColor: 'var(--primary-600)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Donation Date</label>
              <input
                type="date"
                value={formData.lastDonationDate}
                onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="grid-2" style={{ marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Body Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hemoglobin Level (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.hemoglobin}
                  onChange={(e) => setFormData({ ...formData, hemoglobin: parseFloat(e.target.value) || 0 })}
                  className="form-control"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%' }} disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Updating Settings...' : 'Save Preferences'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorSettings;
