import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Heart,
  Cpu,
  ArrowRight
} from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.88rem' }}>
            System Blueprint
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            The Two-Stage Blood Search & Fallback Protocol
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Understanding why BloodConnect 360 searches certified blood bank inventory first,
            and how the automatic donor fallback protects both patients and voluntary donors.
          </p>
        </div>

        {/* Visual Architecture Comparison */}
        <div className="grid-2" style={{ marginBottom: '4rem', gap: '2rem' }}>
          {/* Stage 1 Card */}
          <div className="card" style={{ borderTop: '5px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={20} />
              </div>
              <div>
                <span className="stage-badge stage-badge-bank">STAGE 1</span>
                <h3 style={{ fontSize: '1.25rem' }}>Nearby Blood Bank Search</h3>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Blood banks store pre-tested, pathogen-screened, and component-separated blood units ready for immediate transfusion.
              Searching blood banks first saves vital hours in trauma and surgical cases.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--slate-700)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--medical-green)" /> Immediate availability without donation transit wait
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--medical-green)" /> Full component inventory (PRBC, Platelets, FFP)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--medical-green)" /> Officially verified and regulated medical centers
              </li>
            </ul>
          </div>

          {/* Stage 2 Card */}
          <div className="card" style={{ borderTop: '5px solid var(--primary-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div>
                <span className="stage-badge stage-badge-donor">STAGE 2 FALLBACK</span>
                <h3 style={{ fontSize: '1.25rem' }}>Automatic Voluntary Donor Network</h3>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              When local blood banks experience stockouts or cannot meet required quantities, the system automatically
              activates nearby registered voluntary donors who have opted into emergency coordination.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--slate-700)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--primary-600)" /> AI Multi-Factor Proximity & Biological Compatibility Scoring
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--primary-600)" /> Informational interval screening (minimum 56/90 days recovery)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--primary-600)" /> Controlled mutual contact sharing with shielded residential location
              </li>
            </ul>
          </div>
        </div>

        {/* Step by Step Breakdown */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            Detailed User Lifecycle
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--slate-900)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                1
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Location & Need Entry</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
                  Patient or attendant enters blood group, required units, hospital location, and toggles emergency priority if critical.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--slate-900)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                2
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Stage 1 Query Execution</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
                  Backend queries MongoDB 2dsphere indexes for licensed blood banks within the specified radius.
                  If any bank has sufficient units, results are sorted by road distance and rendered with direct contact info.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--primary-600)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                3
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>Automatic Fallback Decision Gate</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
                  If bank units are 0 or less than requested, the system automatically triggers the Donor Matching Service.
                  A prominent banner informs the user: <em>"No sufficient blood stock was found in nearby blood banks. Searching registered voluntary donors near you..."</em>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--medical-green)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>
                4
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>AI Matching & Response Coordination</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
                  Candidate donors are ranked using our AI Compatibility Engine. Requesters dispatch targeted alerts.
                  When a donor accepts, direct coordination is established and the donor travels to the hospital or blood bank.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/find-blood" className="btn btn-primary btn-lg">
            <span>Test the Search Engine Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
