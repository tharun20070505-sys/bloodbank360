import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, MapPin, Phone, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import BloodBankCard from '../../components/BloodBankCard';
import api from '../../utils/api';

const BloodBanksList = () => {
  const [banks, setBloodBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blood-banks')
      .then((res) => {
        if (res.bloodBanks) setBloodBanks(res.bloodBanks);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBanks = banks.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'ALL' || b.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <Link to="/">Home</Link> / <span style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Blood Banks Directory</span>
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Registered & Verified Blood Centers</h1>
            <p style={{ color: 'var(--slate-600)' }}>
              Explore official hospital blood banks and voluntary blood centers with real-time inventory monitoring.
            </p>
          </div>

          <Link to="/register" className="btn btn-secondary btn-sm">
            <Building2 size={16} />
            <span>Register a Blood Bank</span>
          </Link>
        </div>

        {/* Search & City Filter */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input
                type="text"
                placeholder="Search by center name, address, or landmark..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--slate-700)' }}>City:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="form-control"
                style={{ width: 'auto' }}
              >
                <option value="ALL">All Cities</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blood Banks Grid */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--slate-200)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
            <div>Loading verified blood banks...</div>
          </div>
        ) : (
          <div className="grid-3">
            {filteredBanks.map((bank) => (
              <div key={bank._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{bank.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        Reg: {bank.registrationNumber}
                      </div>
                    </div>
                    {bank.verified && (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.86rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <MapPin size={15} color="var(--slate-400)" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span>{bank.address}, {bank.city}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={15} color="var(--primary-600)" />
                      <strong style={{ color: 'var(--slate-800)' }}>{bank.phone || bank.helpline}</strong>
                    </div>
                  </div>

                  {/* Stock Chips */}
                  <div style={{ background: 'var(--slate-50)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--slate-500)', marginBottom: '6px' }}>
                      Inventory Reserves:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {bank.inventory?.map((inv) => (
                        <span
                          key={inv._id}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: inv.unitsAvailable > 3 ? '#ecfdf5' : inv.unitsAvailable > 0 ? '#fffbeb' : '#fee2e2',
                            color: inv.unitsAvailable > 3 ? '#065f46' : inv.unitsAvailable > 0 ? '#b45309' : '#991b1b'
                          }}
                        >
                          {inv.bloodGroup}: {inv.unitsAvailable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem' }}>
                  <Link to={`/blood-banks/${bank._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <span>View Profile & Inventory</span>
                    <ArrowRight size={14} />
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

export default BloodBanksList;
