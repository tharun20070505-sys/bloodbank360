import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Clock, ShieldCheck, Droplet, ArrowLeft, ArrowRight } from 'lucide-react';
import MapView from '../../components/MapView';
import api from '../../utils/api';
import { BLOOD_GROUPS } from '../../utils/compatibility';

const BloodBankDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blood-banks/${id}`)
      .then((res) => {
        if (res.bloodBank) setBank(res.bloodBank);
        if (res.inventory) setInventory(res.inventory);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--slate-200)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
        <div>Loading blood bank center details...</div>
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Blood Bank Not Found</h2>
        <Link to="/blood-banks" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
          Back to Directory
        </Link>
      </div>
    );
  }

  const bankCoords = bank.location?.coordinates
    ? [bank.location.coordinates[1], bank.location.coordinates[0]]
    : [11.0168, 76.9558];

  const totalUnits = inventory.reduce((acc, curr) => acc + curr.unitsAvailable, 0);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/blood-banks" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.75rem' }}>
            <ArrowLeft size={16} /> Back to Blood Banks
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '2.2rem' }}>{bank.name}</h1>
                {bank.verified && (
                  <span className="badge badge-success">
                    <ShieldCheck size={14} /> Official Licensed Provider
                  </span>
                )}
              </div>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginTop: '4px' }}>
                Registration Authority ID: <strong>{bank.registrationNumber}</strong>
              </div>
            </div>

            <button
              onClick={() => navigate('/patient/create-request', { state: { prefillBank: bank } })}
              className="btn btn-primary btn-md"
            >
              <span>Submit Blood Request to this Center</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Profile Card & Info */}
        <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
          <div className="card">
            <h4 style={{ fontSize: '1rem', color: 'var(--slate-500)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Center Location
            </h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem', color: 'var(--slate-800)' }}>
              <MapPin size={18} color="var(--primary-600)" style={{ marginTop: '3px', flexShrink: 0 }} />
              <div>
                <strong>{bank.address}</strong><br />
                {bank.city}, {bank.state || 'Tamil Nadu'}
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1rem', color: 'var(--slate-500)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Direct Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--primary-600)" />
                <strong>{bank.phone}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--accent-cyan)" />
                <span>{bank.email}</span>
              </div>
              {bank.helpline && (
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: '600' }}>
                  Emergency Helpline: {bank.helpline}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1rem', color: 'var(--slate-500)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Operating Schedule
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
              <Clock size={18} color="var(--medical-green)" />
              <div>
                <strong>{bank.operatingHours || '24/7 Round-the-clock Emergency Service'}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Whole blood & components available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Inventory Grid */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Live Blood Inventory Matrix</h2>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>
                Real-time count of tested, cross-match-ready units at this facility.
              </p>
            </div>
            <div style={{ background: 'var(--slate-100)', padding: '6px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '0.95rem' }}>
              Total Reserves: <span style={{ color: 'var(--primary-600)' }}>{totalUnits} Units</span>
            </div>
          </div>

          <div className="grid-4">
            {BLOOD_GROUPS.map((bg) => {
              const item = inventory.find(i => i.bloodGroup === bg);
              const units = item ? item.unitsAvailable : 0;
              const hasStock = units > 0;

              return (
                <div
                  key={bg}
                  style={{
                    background: hasStock ? 'var(--slate-50)' : '#fef2f2',
                    border: `1.5px solid ${hasStock ? 'var(--slate-200)' : '#fca5a5'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    fontSize: '1.4rem',
                    fontWeight: '900',
                    color: hasStock ? 'var(--slate-900)' : 'var(--primary-700)',
                    marginBottom: '4px'
                  }}>
                    {bg}
                  </div>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: units >= 5 ? 'var(--medical-green-dark)' : units > 0 ? 'var(--warning-amber)' : 'var(--primary-600)'
                  }}>
                    {units}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                    {hasStock ? 'Units Ready' : 'Depleted (Fallback Active)'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map View of Facility */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Facility Geographic Location</h3>
          <div style={{ height: '380px', borderRadius: '12px', overflow: 'hidden' }}>
            <MapView
              center={bankCoords}
              zoom={14}
              bloodBanks={[{ bloodBank: bank, availableUnits: totalUnits }]}
              height="380px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodBankDetail;
