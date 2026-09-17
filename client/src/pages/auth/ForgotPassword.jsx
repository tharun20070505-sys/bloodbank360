import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="app-container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Password Recovery</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              Enter your email to receive a password reset token
            </p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <CheckCircle2 size={48} color="var(--medical-green)" style={{ margin: '0 auto 1rem auto' }} />
              <h4>Recovery Link Dispatched</h4>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.88rem', margin: '0.5rem 0 1.5rem 0' }}>
                Instructions have been sent to <strong>{email}</strong>.
              </p>
              <Link to="/reset-password" className="btn btn-primary btn-sm" style={{ width: '100%', marginBottom: '0.75rem' }}>
                Enter Reset PIN
              </Link>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Account Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="name@domain.com"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%', marginBottom: '1rem' }}>
                <span>Send Reset Link</span>
                <ArrowRight size={16} />
              </button>

              <div style={{ textAlign: 'center' }}>
                <Link to="/login" style={{ fontSize: '0.88rem', color: 'var(--slate-500)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
