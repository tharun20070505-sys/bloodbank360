import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Search,
  ArrowRight,
  ShieldAlert,
  Activity
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/requests/my')
      .then((res) => {
        if (res.requests) setRequests(res.requests);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeRequests = requests.filter(r => !['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(r.status));
  const emergencyRequests = requests.filter(r => r.emergency && !['COMPLETED', 'CANCELLED'].includes(r.status));

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              <span>Patient Portal</span> / <span style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Dashboard</span>
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Welcome, {user?.name}</h1>
            <p style={{ color: 'var(--slate-600)' }}>
              Manage active blood requests, track nearby blood bank inventory, and monitor donor responses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/find-blood" className="btn btn-secondary btn-md">
              <Search size={16} />
              <span>Search Blood</span>
            </Link>
            <Link to="/patient/create-request" className="btn btn-primary btn-md">
              <PlusCircle size={16} />
              <span>Create Blood Request</span>
            </Link>
          </div>
        </div>

        {/* Emergency Alert Banner if any */}
        {emergencyRequests.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            border: '2px solid #ef4444',
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
              <ShieldAlert size={28} color="var(--primary-600)" />
              <div>
                <strong style={{ color: 'var(--primary-900)', fontSize: '1.05rem', display: 'block' }}>
                  Active Emergency Request Broadcast ({emergencyRequests.length})
                </strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--primary-800)' }}>
                  Hospital: {emergencyRequests[0].hospitalName} • Group: {emergencyRequests[0].bloodGroup} ({emergencyRequests[0].unitsRequired} Units)
                </span>
              </div>
            </div>
            <Link to={`/patient/requests/${emergencyRequests[0]._id}`} className="btn btn-emergency btn-sm">
              Live Response Tracker
            </Link>
          </div>
        )}

        {/* 4 Summary Metric Cards */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Active Requests</span>
              <Activity size={18} color="var(--primary-600)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--slate-900)' }}>
              {activeRequests.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              In evaluation or fallback
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Total Submitted</span>
              <Clock size={18} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--slate-900)' }}>
              {requests.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              Lifetime blood requests
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Fulfilled Requests</span>
              <CheckCircle2 size={18} color="var(--medical-green)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--medical-green-dark)' }}>
              {requests.filter(r => r.status === 'COMPLETED').length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              Successfully transfused
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Nearby Facilities</span>
              <Building2 size={18} color="var(--warning-amber)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--slate-900)' }}>
              5 Centers
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              Within 15km boundary
            </div>
          </div>
        </div>

        {/* Active Requests Table / Cards */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem' }}>Your Active Blood Requests</h2>
            <Link to="/patient/requests" className="btn btn-secondary btn-sm">
              View All ({requests.length})
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading requests...</div>
          ) : activeRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Droplet size={40} color="var(--slate-300)" style={{ margin: '0 auto 1rem auto' }} />
              <h4>No Active Blood Requests</h4>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                You have no active or pending requests at this time.
              </p>
              <Link to="/patient/create-request" className="btn btn-primary btn-sm">
                Create New Request
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeRequests.map((req) => (
                <div
                  key={req._id}
                  style={{
                    border: '1px solid var(--slate-200)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    background: req.emergency ? '#fff5f5' : 'white'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{
                        background: 'var(--primary-600)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '800',
                        fontSize: '0.95rem'
                      }}>
                        {req.bloodGroup}
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                        {req.patientName} ({req.unitsRequired} Units)
                      </strong>
                      <StatusBadge status={req.status} />
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      📍 {req.hospitalName} • Stage: <strong>{req.fulfillmentStage}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/patient/requests/${req._id}`} className="btn btn-secondary btn-sm">
                      <span>Live Details</span>
                      <ArrowRight size={14} />
                    </Link>
                    {req.fulfillmentStage === 'STAGE_2_DONOR_FALLBACK' && (
                      <Link to={`/patient/requests/${req._id}/donor-fallback`} className="btn btn-primary btn-sm">
                        <Users size={14} />
                        <span>Manage Donors</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
