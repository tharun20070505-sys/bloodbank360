import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Droplet, ArrowLeft, Printer, QrCode, Heart } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const DigitalDonorCard = () => {
  const { user } = useAuth();
  const [donor, setDonor] = useState(null);

  useEffect(() => {
    api.get('/donors/profile').then(res => {
      if (res.donor) setDonor(res.donor);
    });
  }, []);

  const bg = donor?.bloodGroup || 'O-';

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '580px' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/donor/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
            <Printer size={15} />
            <span>Print Pass</span>
          </button>
        </div>

        {/* Digital Pass Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #881337 100%)',
          color: 'white',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          border: '1.5px solid rgba(255,255,255,0.15)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          {/* Watermark logo */}
          <div style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            opacity: 0.07,
            pointerEvents: 'none'
          }}>
            <Droplet size={260} fill="white" />
          </div>

          {/* Card Top */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ background: 'var(--primary-600)', color: 'white', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplet size={18} fill="currentColor" />
                </div>
                <strong style={{ fontSize: '1.2rem', letterSpacing: '0.04em' }}>BloodConnect 360</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                National Voluntary Donor Pass
              </div>
            </div>

            <div style={{
              background: 'white',
              color: 'var(--primary-700)',
              fontWeight: '900',
              fontSize: '1.8rem',
              padding: '6px 16px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {bg}
            </div>
          </div>

          {/* Donor Identification */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Donor Name
            </div>
            <h2 style={{ fontSize: '1.75rem', color: 'white', letterSpacing: '0.02em', margin: '2px 0 8px 0' }}>
              {user?.name}
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>DONOR ID:</span>
                <code>BC360-{donor?._id ? donor._id.slice(-6).toUpperCase() : '889212'}</code>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>STATUS:</span>
                <span style={{ color: '#34d399', fontWeight: '700' }}>● Active Voluntary</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>REGION:</span>
                <span>{donor?.city || 'Coimbatore'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: QR & Verified Stamp */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
              <ShieldCheck size={18} color="#34d399" />
              <span>Identity Verified & Encrypted</span>
            </div>

            <div style={{
              background: 'white',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <QrCode size={36} color="#0f172a" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalDonorCard;
