import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, XCircle, CheckCircle2, ArrowLeft, Phone, MapPin } from 'lucide-react';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const VerifyBloodBanks = () => {
  const { addToast } = useNotifications();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanks = () => {
    api.get('/admin/blood-banks')
      .then(res => { if (res.bloodBanks) setBanks(res.bloodBanks); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleToggleVerify = async (bankId, currentStatus) => {
    try {
      const res = await api.patch(`/admin/blood-banks/${bankId}/verify`, { verified: !currentStatus });
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Verification Status Updated',
          message: res.message
        });
        fetchBanks();
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Action Failed', message: err.message });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Administration
          </Link>
          <h1 style={{ fontSize: '2.2rem' }}>Blood Bank Facility Verification Queue</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Review official facility registration numbers, licenses, and approve blood centers for public listing.
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading facilities...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {banks.map((bank) => (
              <div
                key={bank._id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft: bank.verified ? '5px solid var(--medical-green)' : '5px solid var(--warning-amber)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{bank.name}</h3>
                    <span className={`badge ${bank.verified ? 'badge-success' : 'badge-warning'}`}>
                      {bank.verified ? '✓ Verified Provider' : '⏳ Pending Review'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--slate-700)', marginTop: '2px' }}>
                    Registration Authority: <strong>{bank.registrationNumber}</strong> • City: {bank.city}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                    📍 {bank.address} • 📞 {bank.phone} • ✉️ {bank.email}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleToggleVerify(bank._id, bank.verified)}
                    className={`btn ${bank.verified ? 'btn-outline' : 'btn-primary'} btn-sm`}
                  >
                    {bank.verified ? (
                      <>
                        <XCircle size={15} />
                        <span>Revoke Verification</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Approve & Verify Facility</span>
                      </>
                    )}
                  </button>
                  <Link to={`/blood-banks/${bank._id}`} className="btn btn-secondary btn-sm">
                    View Public Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyBloodBanks;
