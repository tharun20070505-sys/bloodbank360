import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, AlertTriangle, Sparkles, Heart } from 'lucide-react';
import DonorCard from '../../components/DonorCard';
import AIMatchModal from '../../components/AIMatchModal';
import api from '../../utils/api';

const FallbackDonors = () => {
  const [searchParams] = useSearchParams();
  const bloodGroup = searchParams.get('bloodGroup') || 'O-';
  const units = searchParams.get('units') || 2;

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get('/search/blood', { bloodGroup, units, radius: 25 })
      .then((res) => {
        if (res.donors) setDonors(res.donors);
      })
      .finally(() => setLoading(false));
  }, [bloodGroup, units]);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <Link to="/">Home</Link> / <Link to="/find-blood">Find Blood</Link> / <span>Stage 2 Fallback Donors</span>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Automatic Donor Fallback Directory</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Nearby blood banks reported insufficient reserves for <strong>{bloodGroup}</strong>.
            Voluntary donors within range are ranked below.
          </p>
        </div>

        <div className="fallback-alert-banner">
          <AlertTriangle size={24} color="var(--primary-600)" />
          <div>
            <strong>Stage 2 Fallback Active:</strong>
            <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', marginTop: '2px' }}>
              No sufficient blood stock was found in nearby blood banks. Searching registered voluntary donors near you...
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--slate-200)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
            <div>Running AI matching algorithm on registered donors...</div>
          </div>
        ) : (
          <div className="grid-3">
            {donors.map((donor, idx) => (
              <DonorCard
                key={idx}
                donor={donor}
                onViewAIReport={(d) => { setSelectedDonor(d); setModalOpen(true); }}
              />
            ))}
          </div>
        )}

        <AIMatchModal
          donor={selectedDonor}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default FallbackDonors;
