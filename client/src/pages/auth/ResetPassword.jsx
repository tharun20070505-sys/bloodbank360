import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { addToast } = useNotifications();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast({
        type: 'success',
        title: 'Password Updated',
        message: 'Your password has been successfully reset. Please log in.'
      });
      navigate('/login');
    }, 800);
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="app-container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Set New Password</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              Enter the security token and your new password
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Reset Token / PIN</label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="form-control"
                placeholder="e.g. 849201"
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                required
                minLength="6"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                placeholder="••••••••"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                required
                minLength="6"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%' }} disabled={loading}>
              <span>{loading ? 'Updating Credentials...' : 'Reset Password'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
