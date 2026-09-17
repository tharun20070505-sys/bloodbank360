import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Activity, Award, Cpu, Droplet, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.88rem' }}>
            Our Mission & Vision
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Empowering Emergency Blood Logistics Across Communities
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            BloodConnect 360 is built on a singular belief: No human life should be jeopardized
            because critical blood availability was unknown or delayed.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid-3" style={{ marginBottom: '3.5rem' }}>
          <div className="card">
            <div style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Droplet size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Zero Wastage</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              By connecting regional blood banks into a unified availability registry, we maximize the utilization of existing tested reserves before mobilizing fresh donors.
            </p>
          </div>

          <div className="card">
            <div style={{ background: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>AI Triage & Matching</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              Intelligent multi-factor scoring evaluates distance decay, universal compatibility rules, and donation intervals to surface the most viable donors instantly.
            </p>
          </div>

          <div className="card">
            <div style={{ background: 'var(--medical-green-light)', color: 'var(--medical-green-dark)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Donor Privacy Protection</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              We never publicly publish donor telephone numbers, email addresses, or residential street locations. All contact exchange requires mutual consent.
            </p>
          </div>
        </div>

        {/* Ethical Standards & Compliance */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem', background: 'linear-gradient(135deg, #ffffff, #f8fafc)' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Ethical Coordination & Non-Commercial Policy</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            BloodConnect 360 strictly adheres to the National Blood Transfusion Council (NBTC) and World Health Organization (WHO)
            guidelines promoting 100% voluntary, non-remunerated blood donation.
            Selling or purchasing human blood through this platform is strictly prohibited and constitutes an unlawful offense.
          </p>
          <div className="medical-disclaimer-box" style={{ background: 'var(--slate-100)', color: 'var(--slate-700)', borderColor: 'var(--slate-300)' }}>
            <strong>Regulatory Clarity:</strong> BloodConnect 360 does not perform phlebotomy, blood testing, or transfusion.
            All collection and administration activities occur under the supervision of qualified hematologists at licensed healthcare institutions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
