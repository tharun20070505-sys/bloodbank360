import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const Contact = () => {
  const { addToast } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Coordination Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast({
      type: 'success',
      title: 'Message Transmitted',
      message: 'Thank you. Our coordination desk will review your inquiry within 2 hours.'
    });
  };

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.88rem' }}>
            24/7 Support & Coordination Desk
          </span>
          <h1 style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Get in Touch with BloodConnect 360
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Have questions about blood bank onboarding, technical integration, or grievance redressal?
            Our healthcare operations desk is available round-the-clock.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
          {/* Left Column: Direct Info */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-600)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Phone size={22} color="var(--primary-600)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>
                    24/7 Emergency Blood Hotline
                  </strong>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-700)' }}>
                    1800-425-3600 / 108
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                    Priority lines reserved strictly for acute medical emergencies.
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Mail size={22} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>
                    Regional Coordination Email
                  </strong>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--slate-800)' }}>
                    operations@bloodconnect360.org
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                    For hospital verification requests & technical queries.
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--medical-green)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={22} color="var(--medical-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>
                    Central Operations Office
                  </strong>
                  <div style={{ fontSize: '0.92rem', color: 'var(--slate-700)', lineHeight: '1.5' }}>
                    BloodConnect 360 Healthcare Foundation<br />
                    Civil Aerodrome Post, Avanashi Road,<br />
                    Coimbatore, Tamil Nadu 641014
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Send Us a Message</h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <CheckCircle2 size={48} color="var(--medical-green)" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Message Dispatched</h4>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                  Our team will follow up via email or phone shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-secondary btn-sm" style={{ marginTop: '1.5rem' }}>
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                    placeholder="Dr. Rajesh Kumar"
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
                    placeholder="rajesh@hospital.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Topic of Inquiry</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-control"
                  >
                    <option value="General Coordination Inquiry">General Coordination Inquiry</option>
                    <option value="Blood Bank Verification Assistance">Blood Bank Verification Assistance</option>
                    <option value="Technical Integration / API">Technical Integration / API</option>
                    <option value="Grievance / Privacy Redressal">Grievance / Privacy Redressal</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                  <label className="form-label">Your Message *</label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-control"
                    placeholder="Describe your inquiry or hospital requirement..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%' }}>
                  <Send size={16} />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
