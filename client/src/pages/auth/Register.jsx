import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Lock, Mail, Phone, User, Building2, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { BLOOD_GROUPS } from '../../utils/compatibility';

const Register = () => {
  const { register } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [role, setRole] = useState('PATIENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Donor specific fields
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [city, setCity] = useState('Coimbatore');
  const [preferredRadius, setPreferredRadius] = useState(15);
  const [lastDonationDate, setLastDonationDate] = useState('');

  // Blood Bank specific fields
  const [bankName, setBankName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    let additionalData = {};
    if (role === 'DONOR') {
      additionalData = {
        bloodGroup,
        city,
        preferredRadius: parseInt(preferredRadius, 10),
        lastDonationDate: lastDonationDate || null,
        coordinates: [76.9558, 11.0168]
      };
    } else if (role === 'BLOOD_BANK') {
      additionalData = {
        name: bankName || `${name} Blood Center`,
        registrationNumber: registrationNumber || `BB-REG-${Date.now().toString().slice(-6)}`,
        address: address || 'Main Healthcare Avenue',
        city,
        coordinates: [76.9600, 11.0200]
      };
    }

    const payload = {
      name,
      email,
      password,
      phone,
      role,
      additionalData
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      addToast({
        type: 'success',
        title: 'Registration Successful',
        message: `Your ${role} account has been established.`
      });

      switch (role) {
        case 'PATIENT': navigate('/patient/dashboard'); break;
        case 'DONOR': navigate('/donor/dashboard'); break;
        case 'BLOOD_BANK': navigate('/bank/dashboard'); break;
        case 'ADMIN': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } else {
      setErrorMsg(res.message || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '620px' }}>
        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="brand-icon-wrap" style={{ margin: '0 auto 1rem auto', width: '48px', height: '48px' }}>
              <Droplet size={28} fill="currentColor" />
            </div>
            <h1 style={{ fontSize: '2rem' }}>Create Your Account</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem', marginTop: '4px' }}>
              Join the unified blood coordination network
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Role Selection Tabs */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">I am registering as a:</label>
            <div className="role-selector-grid">
              <button
                type="button"
                onClick={() => setRole('PATIENT')}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: role === 'PATIENT' ? '2px solid var(--primary-600)' : '1px solid var(--slate-300)',
                  background: role === 'PATIENT' ? 'var(--primary-50)' : 'white',
                  color: role === 'PATIENT' ? 'var(--primary-700)' : 'var(--slate-700)',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <User size={18} />
                <span>Patient / User</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('DONOR')}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: role === 'DONOR' ? '2px solid var(--primary-600)' : '1px solid var(--slate-300)',
                  background: role === 'DONOR' ? 'var(--primary-50)' : 'white',
                  color: role === 'DONOR' ? 'var(--primary-700)' : 'var(--slate-700)',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Heart size={18} />
                <span>Voluntary Donor</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('BLOOD_BANK')}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: role === 'BLOOD_BANK' ? '2px solid var(--primary-600)' : '1px solid var(--slate-300)',
                  background: role === 'BLOOD_BANK' ? 'var(--primary-50)' : 'white',
                  color: role === 'BLOOD_BANK' ? 'var(--primary-700)' : 'var(--slate-700)',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Building2 size={18} />
                <span>Blood Center</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  placeholder="e.g. Priya Sundaram"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                  placeholder="+91 98401 23456"
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="name@domain.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role Specific Dynamic Fields */}
            {role === 'DONOR' && (
              <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', margin: '1rem 0', border: '1px solid var(--slate-200)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--slate-800)' }}>
                  Donor Medical Screening Details
                </h4>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Blood Group *</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="form-control"
                      style={{ fontWeight: '700', color: 'var(--primary-700)' }}
                    >
                      {BLOOD_GROUPS.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Travel Radius</label>
                    <select
                      value={preferredRadius}
                      onChange={(e) => setPreferredRadius(e.target.value)}
                      className="form-control"
                    >
                      <option value="5">Within 5 km</option>
                      <option value="15">Within 15 km (Recommended)</option>
                      <option value="25">Within 25 km</option>
                      <option value="40">Anywhere in District (40 km)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">City / District</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Donation Date (If Any)</label>
                    <input
                      type="date"
                      value={lastDonationDate}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                  🔒 Your exact residential address and telephone number will remain private and shielded.
                </div>
              </div>
            )}

            {role === 'BLOOD_BANK' && (
              <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', margin: '1rem 0', border: '1px solid var(--slate-200)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--slate-800)' }}>
                  Official Blood Bank Facility Registration
                </h4>
                <div className="form-group">
                  <label className="form-label">Official Center Name *</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="form-control"
                    placeholder="e.g. Apex Multispeciality Blood Bank"
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">License / Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="form-control"
                      placeholder="e.g. BB-TN-CBE-988"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Facility Street Address *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      placeholder="e.g. 102 Hospital Bypass Road"
                    />
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                  🛡️ Blood banks will be pending verification by system administration before public listing.
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              <span>{loading ? 'Establishing Account...' : 'Complete Registration'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--slate-600)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: '700', color: 'var(--primary-600)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
