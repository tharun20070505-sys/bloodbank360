import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Droplet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { BLOOD_GROUPS } from '../../utils/compatibility';

const BloodBankDashboard = () => {
  const { user } = useAuth();
  const [bank, setBank] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.profile?._id) {
      api.get(`/blood-banks/${user.profile._id}`).then(res => {
        if (res.bloodBank) setBank(res.bloodBank);
        if (res.inventory) setInventory(res.inventory);
      });
      api.get(`/blood-banks/${user.profile._id}/incoming-requests`).then(res => {
        if (res.requests) setIncoming(res.requests);
      });
    } else {
      // Fetch default first bank if profile not loaded
      api.get('/blood-banks').then(res => {
        if (res.bloodBanks?.length > 0) {
          const first = res.bloodBanks[0];
          setBank(first);
          setInventory(first.inventory || []);
        }
      }).finally(() => setLoading(false));
    }
  }, [user]);

  const totalUnits = inventory.reduce((acc, curr) => acc + curr.unitsAvailable, 0);
  const lowStockGroups = inventory.filter(i => i.unitsAvailable < 3);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              <span>Blood Center Portal</span> / <span style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Dashboard</span>
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>{bank?.name || 'Blood Center Dashboard'}</h1>
            <p style={{ color: 'var(--slate-600)' }}>
              License: <strong>{bank?.registrationNumber || 'BB-TN-CBE-001'}</strong> • Operating: {bank?.operatingHours || '24/7 Transfusion Wing'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/bank/inventory" className="btn btn-primary btn-md">
              <Layers size={16} />
              <span>Update Stock Matrix</span>
            </Link>
            <Link to="/bank/forecaster" className="btn btn-secondary btn-md">
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span>AI Shortage Forecaster</span>
            </Link>
          </div>
        </div>

        {/* Low Stock Warning Banner if any */}
        {lowStockGroups.length > 0 && (
          <div style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={24} color="var(--warning-dark)" />
              <div>
                <strong style={{ color: 'var(--warning-dark)', fontSize: '1rem', display: 'block' }}>
                  Low Inventory Warning ({lowStockGroups.length} Groups Near Depletion)
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#78350f' }}>
                  Critical units: {lowStockGroups.map(g => `${g.bloodGroup} (${g.unitsAvailable} units)`).join(', ')}
                </span>
              </div>
            </div>
            <Link to="/bank/inventory" className="btn btn-secondary btn-sm" style={{ background: 'white' }}>
              Replenish Inventory
            </Link>
          </div>
        )}

        {/* 4 Summary Metrics */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="card">
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Total Ready Units</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary-600)', margin: '4px 0' }}>
              {totalUnits}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Across all 8 blood groups</div>
          </div>

          <div className="card">
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Incoming Dispatches</span>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0' }}>
              {incoming.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Awaiting fulfillment</div>
          </div>

          <div className="card">
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Verification Status</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--medical-green-dark)', margin: '8px 0' }}>
              ✓ Official Licensed
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Admin certified facility</div>
          </div>

          <div className="card">
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Donation Drives</span>
            <div style={{ marginTop: '8px' }}>
              <Link to="/bank/camps" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                <Calendar size={14} />
                <span>Mobile Camps</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 8-Group Quick Inventory Grid */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem' }}>Current Inventory Snapshot</h2>
            <Link to="/bank/inventory" className="btn btn-secondary btn-sm">
              Manage Quantities
            </Link>
          </div>

          <div className="grid-4">
            {BLOOD_GROUPS.map((bg) => {
              const item = inventory.find(i => i.bloodGroup === bg);
              const units = item ? item.unitsAvailable : 0;
              const isLow = units < 3;

              return (
                <div
                  key={bg}
                  style={{
                    border: `1.5px solid ${isLow ? '#fca5a5' : 'var(--slate-200)'}`,
                    background: isLow ? '#fef2f2' : 'var(--slate-50)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--slate-900)' }}>{bg}</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: units > 5 ? 'var(--medical-green-dark)' : units > 0 ? 'var(--warning-dark)' : 'var(--primary-600)' }}>
                    {units}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    {units > 0 ? 'Units in Buffer' : 'Depleted'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodBankDashboard;
