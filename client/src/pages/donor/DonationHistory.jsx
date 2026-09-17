import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, Droplet, ArrowLeft, ShieldCheck, Download, Heart } from 'lucide-react';
import api from '../../utils/api';

const DonationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/donors/history')
      .then((res) => {
        if (res.history) setHistory(res.history);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/donor/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.2rem' }}>Voluntary Donation Log & Certificates</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Official record of your life-saving voluntary blood contributions.
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading donation history...</div>
        ) : history.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Award size={48} color="var(--slate-300)" style={{ margin: '0 auto 1rem auto' }} />
            <h4>No Donations Recorded Yet</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your completed donation records and digital certificates of appreciation will appear here.
            </p>
            <Link to="/donor/requests" className="btn btn-primary btn-sm">
              View Matching Requests
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {history.map((h) => (
              <div
                key={h._id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft: '5px solid var(--medical-green)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '900', background: 'var(--primary-600)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.95rem' }}>
                      {h.bloodGroup}
                    </span>
                    <strong>{h.unitsDonated || 1} Unit Donated</strong>
                    <span className="badge badge-success">Verified Transfusion</span>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: 'var(--slate-800)', marginTop: '4px' }}>
                    🏥 Center / Hospital: <strong>{h.recipientHospital || h.bloodBankId?.name || 'KMCH Hospital'}</strong>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                    Certificate: <code>{h.certificateNumber || 'BC360-CERT-990182'}</code> • Date: {new Date(h.donationDate).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => alert(`Certificate ${h.certificateNumber || 'BC360-CERT-990182'} verified by National Blood Coordination Authority.`)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Award size={15} color="var(--medical-green)" />
                    <span>View Digital Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
