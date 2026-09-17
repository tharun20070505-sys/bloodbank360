import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Award, Users, CheckCircle, ArrowRight, Clock, MapPin } from 'lucide-react';

const BecomeDonor = () => {
  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary-50)',
            color: 'var(--primary-700)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}>
            <Heart size={16} color="var(--primary-600)" />
            <span>Lifesaver Community Initiative</span>
          </div>

          <h1 style={{ fontSize: '2.6rem', marginBottom: '1rem' }}>
            Give Blood, Give Life — Join Our Voluntary Network
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            One unit of donated blood can save up to three lives. By registering as a verified voluntary donor,
            you stand as the crucial safety net when nearby blood bank reserves are depleted.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Register as a Voluntary Donor</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/eligibility-checker" className="btn btn-secondary btn-lg">
              <span>Check Eligibility First</span>
            </Link>
          </div>
        </div>

        {/* 3 Value Cards */}
        <div className="grid-3" style={{ marginBottom: '3.5rem' }}>
          <div className="card">
            <div style={{ background: 'var(--primary-100)', color: 'var(--primary-600)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Clock size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>On Your Terms</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              Toggle your availability between <strong>Available</strong> and <strong>Unavailable</strong> anytime with a single tap. Set your maximum travel radius.
            </p>
          </div>

          <div className="card">
            <div style={{ background: 'var(--medical-green-light)', color: 'var(--medical-green-dark)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>100% Privacy Guarantee</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              We never publicly publish your phone number, exact residential address, or private contact. Requesters only connect after you review and accept.
            </p>
          </div>

          <div className="card">
            <div style={{ background: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Award size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Digital Cards & Badges</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              Maintain a verified digital donor pass, log lifetime donations, and receive certified life-saving recognition badges for each completed donation.
            </p>
          </div>
        </div>

        {/* Privacy & Safety Pledge */}
        <div className="card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #f8fafc, #ffffff)', border: '1.5px solid var(--slate-200)', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>The Voluntary Donor Safety & Privacy Pledge</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <CheckCircle size={20} color="var(--medical-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>No Spam or Marketing:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
                  You receive notifications strictly when emergency or patient requests matching your blood group occur within your chosen radius.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <CheckCircle size={20} color="var(--medical-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Recovery Safeguards:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
                  Our system respects your 90-day recovery cycle and alerts you when your recovery interval is fully met.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            <span>Begin Donor Registration</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BecomeDonor;
