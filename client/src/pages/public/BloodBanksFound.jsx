import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import BloodBankCard from '../../components/BloodBankCard';
import api from '../../utils/api';

const BloodBanksFound = () => {
  const [searchParams] = useSearchParams();
  const bloodGroup = searchParams.get('bloodGroup') || 'B+';
  const units = searchParams.get('units') || 1;

  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/search/blood', { bloodGroup, units, radius: 25 })
      .then((res) => {
        if (res.bloodBanks) setBanks(res.bloodBanks);
      })
      .finally(() => setLoading(false));
  }, [bloodGroup, units]);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <Link to="/">Home</Link> / <Link to="/find-blood">Find Blood</Link> / <span>Blood Banks Found</span>
          </div>
          <h1 style={{ fontSize: '2rem' }}>Nearby Blood Banks with Matching Stock</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Showing licensed blood centers with available inventory for <strong>{bloodGroup}</strong> ({units} unit(s) requested).
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--slate-200)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
            <div>Checking blood bank reserves...</div>
          </div>
        ) : (
          <div className="grid-3">
            {banks.map((item, idx) => (
              <BloodBankCard key={idx} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodBanksFound;
