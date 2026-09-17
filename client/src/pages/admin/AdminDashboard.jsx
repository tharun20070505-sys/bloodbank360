import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Settings,
  Activity,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/statistics')
      .then((res) => {
        if (res.stats) setStats(res.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>Loading administrative intelligence...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              <span>Administration</span> / <span style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Control Center</span>
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>System Oversight & Administration</h1>
            <p style={{ color: 'var(--slate-600)' }}>
              Monitor system health, verify blood bank facilities, manage accounts, and oversee two-stage dispatch protocols.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/blood-banks" className="btn btn-secondary btn-sm">
              <Building2 size={16} />
              <span>Verify Blood Banks</span>
            </Link>
            <Link to="/admin/settings" className="btn btn-primary btn-sm">
              <Settings size={16} />
              <span>System & AI Settings</span>
            </Link>
          </div>
        </div>

        {/* 6 Key Metric Cards */}
        <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Total Registered Users</span>
              <Users size={18} color="var(--primary-600)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--slate-900)' }}>
              {stats?.totalUsers || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Donors: <strong>{stats?.totalDonors}</strong> ({stats?.availableDonors} Available Now)
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Licensed Blood Banks</span>
              <Building2 size={18} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--slate-900)' }}>
              {stats?.totalBloodBanks || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--medical-green-dark)' }}>
              ✓ {stats?.verifiedBloodBanks} Verified & Active
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Emergency SOS Requests</span>
              <AlertTriangle size={18} color="var(--primary-600)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--primary-600)' }}>
              {stats?.emergencyRequests || 0}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              High-priority medical broadcasts
            </div>
          </div>
        </div>

        {/* Second Row: Navigation Shortcuts & Regional Inventory Overview */}
        <div className="grid-2" style={{ marginBottom: '2.5rem', gap: '2rem' }}>
          {/* Quick Management Links */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Administrative Modules</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/admin/blood-banks" className="btn btn-secondary btn-md" style={{ justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} /> Blood Bank Verification Queue
                </span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/admin/users" className="btn btn-secondary btn-md" style={{ justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} /> User & Donor Account Management
                </span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/admin/requests" className="btn btn-secondary btn-md" style={{ justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} /> Blood Requests & SOS Monitor
                </span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/admin/audit-logs" className="btn btn-secondary btn-md" style={{ justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} /> System Security & Audit Trail
                </span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Regional Stock Matrix */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Regional Inventory Reserves Aggregated</h3>
            <div className="grid-4">
              {stats?.inventoryByGroup?.map((item) => (
                <div key={item._id} style={{ background: 'var(--slate-50)', padding: '0.85rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--slate-200)' }}>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>{item._id}</strong>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: item.totalUnits > 10 ? 'var(--medical-green-dark)' : 'var(--primary-600)' }}>
                    {item.totalUnits}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Units</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
