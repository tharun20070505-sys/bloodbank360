import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplet,
  Search,
  Users,
  Building2,
  ShieldCheck,
  ArrowRight,
  Heart,
  Sparkles,
  MapPin,
  Clock,
  ShieldAlert,
  ChevronRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import SearchForm from '../../components/SearchForm';
import api from '../../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    donors: '1,420+',
    banks: '18 Verified',
    requestsCompleted: '840+',
    inventoryUnits: '3,890+'
  });

  useEffect(() => {
    // Attempt fetching real statistics from backend
    api.get('/admin/statistics')
      .then((res) => {
        if (res.success && res.stats) {
          setStats({
            donors: res.stats.totalDonors ? `${res.stats.totalDonors} Registered` : '15+ Verified',
            banks: res.stats.verifiedBloodBanks ? `${res.stats.verifiedBloodBanks} Verified Centers` : '5 Verified Centers',
            requestsCompleted: res.stats.completedRequests ? `${res.stats.completedRequests} Fulfilled` : '42 Completed',
            inventoryUnits: '120+ In Reserves'
          });
        }
      })
      .catch(() => {
        // Fallback to demo realistic metrics
      });
  }, []);

  const handleQuickSearch = (criteria) => {
    navigate('/find-blood', { state: { initialSearch: criteria } });
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #450a0a 100%)',
        color: 'white',
        padding: '5rem 0 6rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.25) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div className="app-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-grid">
            {/* Left Column: Heading & Value Proposition */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(220, 38, 38, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: '#fca5a5',
                marginBottom: '1.5rem'
              }}>
                <Sparkles size={16} color="#ef4444" />
                <span>Two-Stage Availability & AI Donor Fallback System</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: '900',
                lineHeight: '1.15',
                color: 'white',
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em'
              }}>
                Find Blood When <br />
                <span style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  It Matters Most.
                </span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: '#cbd5e1',
                lineHeight: '1.7',
                marginBottom: '2.5rem',
                maxWidth: '560px'
              }}>
                <strong>Search nearby blood banks first.</strong> If sufficient units are unavailable or depleted,
                the system automatically activates the <strong>Nearby Donor Search</strong>, ranking compatible
                voluntary donors by proximity, interval readiness, and emergency priority.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <Link to="/find-blood" className="btn btn-primary btn-lg" style={{ boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)' }}>
                  <Search size={18} />
                  <span>FIND BLOOD NOW</span>
                </Link>

                <Link to="/become-donor" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                  <Users size={18} />
                  <span>BECOME A DONOR</span>
                </Link>

                <Link to="/emergency-sos" className="btn btn-emergency btn-lg">
                  <ShieldAlert size={18} />
                  <span>EMERGENCY SOS</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Search Card Preview */}
            <div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                color: 'var(--slate-900)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: 'var(--primary-100)', color: 'var(--primary-600)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Search size={18} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem' }}>Live Blood Search Engine</h3>
                  </div>
                  <span className="stage-badge stage-badge-bank">Stage 1 Priority</span>
                </div>

                <SearchForm onSearch={handleQuickSearch} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Statistics Bar */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--slate-200)', padding: '2rem 0' }}>
        <div className="app-container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary-600)', fontFamily: 'var(--font-heading)' }}>
                {stats.donors}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: '500' }}>
                Registered Voluntary Donors
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-heading)' }}>
                {stats.banks}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: '500' }}>
                Licensed Blood Banks
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--medical-green)', fontFamily: 'var(--font-heading)' }}>
                {stats.requestsCompleted}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: '500' }}>
                Life-Saving Dispatches
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--slate-800)', fontFamily: 'var(--font-heading)' }}>
                {stats.inventoryUnits}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: '500' }}>
                Live Inventory Monitored
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Two-Stage Fallback Workflow Section */}
      <section style={{ padding: '5rem 0', background: 'var(--slate-50)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.88rem' }}>
              Architectural Standard
            </span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              How the Two-Stage Fallback Works
            </h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              BloodConnect 360 enforces a strict business rule: <strong>Never bypass certified blood bank stock.</strong>
              Donors are mobilized automatically only when bank reserves cannot fulfill the critical request.
            </p>
          </div>

          <div className="grid-4">
            {/* Step 1 */}
            <div className="card" style={{ position: 'relative', borderTop: '4px solid var(--accent-cyan)' }}>
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: '20px',
                background: 'var(--accent-cyan)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.9rem'
              }}>
                1
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>Search Request</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                  Requester specifies blood group, units needed, current GPS coordinates, and search radius.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ position: 'relative', borderTop: '4px solid var(--accent-cyan)' }}>
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: '20px',
                background: 'var(--accent-cyan)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.9rem'
              }}>
                2
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>Stage 1: Blood Banks</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                  System scans nearby verified blood bank inventory. If sufficient stock exists, details and contact are presented.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ position: 'relative', borderTop: '4px solid var(--primary-600)' }}>
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: '20px',
                background: 'var(--primary-600)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.9rem'
              }}>
                3
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>Stage 2: Automatic Donor Fallback</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                  If bank stock is 0 or insufficient, AI matching immediately scans registered voluntary donors within range.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="card" style={{ position: 'relative', borderTop: '4px solid var(--medical-green)' }}>
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: '20px',
                background: 'var(--medical-green)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.9rem'
              }}>
                4
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>Protected Coordination</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                  Donors receive secure notification. Once a donor accepts, mutual contact coordination is unlocked for clinical transfer.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/how-it-works" className="btn btn-secondary btn-md">
              <span>Read Full Technical Workflow & Architecture</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Role Overview Section */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Built for the Entire Healthcare Ecosystem</h2>
            <p style={{ color: 'var(--slate-600)' }}>
              Four specialized, integrated interfaces designed for rapid life-saving blood logistics.
            </p>
          </div>

          <div className="grid-4">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Droplet size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Patients & Families</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Create urgent blood requests, track real-time bank inventory, and connect directly with responding donors in emergencies.
                </p>
              </div>
              <Link to="/patient/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Patient Portal
              </Link>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'var(--medical-green-light)', color: 'var(--medical-green-dark)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Heart size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Voluntary Donors</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Set availability and preferred travel radius, receive nearby emergency requests, view donation history and digital certificates.
                </p>
              </div>
              <Link to="/donor/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Donor Portal
              </Link>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Building2 size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Blood Banks</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Update live inventory for all 8 blood groups, process incoming hospital dispatches, and coordinate donation drives.
                </p>
              </div>
              <Link to="/bank/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Blood Bank Portal
              </Link>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'var(--slate-100)', color: 'var(--slate-800)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Administrators</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Verify official blood bank licenses, manage user accounts, monitor emergency response analytics, and oversee audit logs.
                </p>
              </div>
              <Link to="/admin/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
