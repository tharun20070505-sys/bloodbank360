import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Send, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import { BLOOD_GROUPS } from '../../utils/compatibility';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const EmergencySOS = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    patientName: '',
    hospitalName: '',
    bloodGroup: 'O-',
    unitsRequired: 2,
    address: 'KMCH Emergency Trauma Center, Avanashi Road',
    contactPhone: user?.phone || '',
    emergencyNotes: 'Critical hemorrhage / trauma surgical procedure requiring immediate blood release.'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { returnUrl: '/emergency-sos' } });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        emergency: true,
        urgencyLevel: 'CRITICAL_EMERGENCY',
        latitude: 11.0321,
        longitude: 77.0423,
        radius: 20
      };

      const res = await api.post('/requests', payload);
      if (res.success && res.request) {
        addToast({
          type: 'emergency',
          title: '🚨 EMERGENCY SOS BROADCASTED',
          message: 'Priority alerts transmitted to nearby blood banks and registered voluntary donors.'
        });
        navigate(`/patient/requests/${res.request._id}`);
      }
    } catch (err) {
      addToast({
        type: 'emergency',
        title: 'Broadcast Error',
        message: err.message || 'Failed to dispatch SOS alert.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          {/* Pulsing Emergency Header */}
          <div style={{
            background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
            color: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '2.5rem',
            boxShadow: '0 15px 35px -5px rgba(220, 38, 38, 0.4)',
            border: '2px solid #ef4444'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              marginBottom: '1rem',
              animation: 'pulse-red 1.5s infinite'
            }}>
              <ShieldAlert size={36} color="#ffffff" />
            </div>

            <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              EMERGENCY BLOOD SOS DISPATCH
            </h1>
            <p style={{ color: '#fecaca', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '580px', margin: '0 auto' }}>
              Broadcast high-priority alerts to licensed regional blood centers and on-call voluntary donors simultaneously.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem', border: '2px solid #f87171' }}>
            <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Critical Blood Group *</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="form-control"
                  style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--primary-700)' }}
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg} {['O-', 'AB-'].includes(bg) ? '★ (Ultra-Critical)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Units Needed Immediately *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.unitsRequired}
                  onChange={(e) => setFormData({ ...formData, unitsRequired: parseInt(e.target.value, 10) || 1 })}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Patient Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Babu"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital / Trauma Center *</label>
                <input
                  type="text"
                  placeholder="e.g. KMCH Emergency OT"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Address & Ward Details *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Attendant Emergency Phone *</label>
              <input
                type="tel"
                placeholder="+91 98401 23456"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Clinical Emergency Notes</label>
              <textarea
                rows="3"
                value={formData.emergencyNotes}
                onChange={(e) => setFormData({ ...formData, emergencyNotes: e.target.value })}
                className="form-control"
              />
            </div>

            <button
              type="submit"
              className="btn btn-emergency btn-lg"
              style={{ width: '100%', fontSize: '1.15rem', padding: '1rem' }}
              disabled={submitting}
            >
              <ShieldAlert size={22} />
              <span>{submitting ? 'Broadcasting High-Priority SOS...' : 'BROADCAST EMERGENCY SOS NOW'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmergencySOS;
