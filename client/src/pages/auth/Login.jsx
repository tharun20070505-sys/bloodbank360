import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Droplet, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Login = () => {
  const { login } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const returnUrl = location.state?.returnUrl || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back, ${res.user.name} (${res.user.role})`
      });

      if (returnUrl) {
        navigate(returnUrl);
        return;
      }

      switch (res.user.role) {
        case 'PATIENT': navigate('/patient/dashboard'); break;
        case 'DONOR': navigate('/donor/dashboard'); break;
        case 'BLOOD_BANK': navigate('/bank/dashboard'); break;
        case 'ADMIN': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } else {
      setErrorMsg(res.message || 'Invalid email or password');
    }
  };

  // Demo autofill shortcut
  const handleAutofill = (demoRole) => {
    switch (demoRole) {
      case 'ADMIN':
        setEmail('admin@bloodconnect.org');
        setPassword('Password@123');
        break;
      case 'PATIENT':
        setEmail('patient@bloodconnect.org');
        setPassword('Password@123');
        break;
      case 'DONOR':
        setEmail('donor@bloodconnect.org');
        setPassword('Password@123');
        break;
      case 'BLOOD_BANK':
        setEmail('bloodbank@bloodconnect.org');
        setPassword('Password@123');
        break;
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="app-container" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="brand-icon-wrap" style={{ margin: '0 auto 1rem auto', width: '48px', height: '48px' }}>
              <Droplet size={28} fill="currentColor" />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--slate-900)' }}>Sign In to BloodConnect 360</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginTop: '4px' }}>
              Access your medical coordination dashboard
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
              marginBottom: '1.25rem'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--slate-400)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary-600)' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--slate-400)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%', marginBottom: '1.5rem' }} disabled={loading}>
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Role Autofill Shortcuts */}
          <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--slate-400)', textAlign: 'center', marginBottom: '0.75rem' }}>
              ⚡ 1-Click Demo Role Autofill
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleAutofill('PATIENT')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                Patient / Requester
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('DONOR')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                Voluntary Donor
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('BLOOD_BANK')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                Blood Bank Center
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('ADMIN')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                Administrator
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--slate-600)' }}>
            Do not have an account?{' '}
            <Link to="/register" style={{ fontWeight: '700', color: 'var(--primary-600)' }}>
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
