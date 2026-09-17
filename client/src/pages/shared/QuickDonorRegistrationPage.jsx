import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BLOOD_GROUPS } from '../../utils/compatibility';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const QuickDonorRegistrationPage = () => {
  const { register } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'Password@123',
    bloodGroup: 'O+',
    city: 'Coimbatore',
    preferredRadius: 15
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'DONOR',
        additionalData: {
          bloodGroup: formData.bloodGroup,
          city: formData.city,
          preferredRadius: parseInt(formData.preferredRadius, 10),
          coordinates: [76.9558, 11.0168]
        }
      };

      const res = await register(payload);
      if (res.success) {
        addToast({ type: 'success', title: 'Welcome Lifesaver', message: 'You are now an active voluntary donor!' });
        navigate('/donor/dashboard');
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Registration Failed', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="app-container" style={{ maxWidth: '580px' }}>
        <div className="card" style={{ padding: '3rem', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              background: 'var(--primary-100)',
              color: 'var(--primary-600)',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Heart size={30} />
            </div>
            <h1 style={{ fontSize: '2rem' }}>Quick Donor Enrollment</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem' }}>
              Step {step} of 2: {step === 1 ? 'Personal Contact' : 'Blood Group & Radius'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                    placeholder="e.g. S. Karthik"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                    placeholder="karthik@donor.org"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-control"
                    placeholder="+91 97890 54321"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (formData.name && formData.email && formData.phone) setStep(2);
                    else alert('Please enter name, email, and phone.');
                  }}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Your Blood Group *</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="form-control"
                    style={{ fontWeight: '800', color: 'var(--primary-700)', fontSize: '1.1rem' }}
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Preferred Travel Radius</label>
                    <span style={{ fontWeight: '700', color: 'var(--primary-600)' }}>{formData.preferredRadius} km</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={formData.preferredRadius}
                    onChange={(e) => setFormData({ ...formData, preferredRadius: e.target.value })}
                    style={{ width: '100%', accentColor: 'var(--primary-600)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-secondary btn-md">
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary btn-md" style={{ flex: 1 }} disabled={submitting}>
                    <CheckCircle2 size={18} />
                    <span>{submitting ? 'Enrolling...' : 'Complete Registration'}</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickDonorRegistrationPage;
