import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="app-container">
        <div className="footer-inner">
          {/* Column 1: Brand & Purpose */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div className="brand-icon-wrap" style={{ width: '34px', height: '34px' }}>
                <Droplet size={20} fill="currentColor" />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.35rem' }}>BloodConnect 360</h3>
            </div>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Next-generation emergency blood coordination platform featuring a certified two-stage fallback:
              instantly checking verified blood bank reserves first, and automatically connecting with nearby
              voluntary donors when inventories run low.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--slate-400)', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={16} color="var(--medical-green)" /> ISO Verified Standards
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Heart size={16} color="var(--primary-500)" /> 100% Voluntary Network
              </span>
            </div>
          </div>

          {/* Column 2: Search & Coordination */}
          <div>
            <h4>Find & Coordinate</h4>
            <ul>
              <li><Link to="/find-blood">Find Blood (Two-Stage Search)</Link></li>
              <li><Link to="/blood-banks">Registered Blood Banks</Link></li>
              <li><Link to="/map-explorer">Interactive Map Explorer</Link></li>
              <li><Link to="/emergency-sos">Emergency SOS Broadcast</Link></li>
              <li><Link to="/download-app" style={{ color: '#f87171', fontWeight: '700' }}>📲 Download App (Mobile & Laptop)</Link></li>
              <li><Link to="/compatibility-guide">Blood Compatibility Matrix</Link></li>
              <li><Link to="/eligibility-checker">Donor Eligibility Self-Check</Link></li>
            </ul>
          </div>

          {/* Column 3: Roles & Portals */}
          <div>
            <h4>Role Portals</h4>
            <ul>
              <li><Link to="/become-donor">Register as Voluntary Donor</Link></li>
              <li><Link to="/login">Patient Dashboard</Link></li>
              <li><Link to="/login">Blood Bank Portal</Link></li>
              <li><Link to="/login">Admin Control Center</Link></li>
              <li><Link to="/how-it-works">Two-Stage Workflow Explained</Link></li>
              <li><Link to="/about">About Our Mission</Link></li>
            </ul>
          </div>

          {/* Column 4: Emergency Contacts & Support */}
          <div>
            <h4>24/7 Emergency Help</h4>
            <ul style={{ gap: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--slate-300)' }}>
                <Phone size={18} color="var(--primary-500)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', color: 'white' }}>Toll-Free SOS Hotline:</strong>
                  1800-425-3600 / 108
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--slate-300)' }}>
                <Mail size={18} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', color: 'white' }}>Emergency Desk:</strong>
                  emergency@bloodconnect360.org
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--slate-300)' }}>
                <MapPin size={18} color="var(--medical-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  Regional Coordination Center,<br />
                  Gandhipuram, Coimbatore, TN
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Medical Safety Disclaimer */}
        <div className="medical-disclaimer-box">
          <strong>⚠️ Official Medical Safety Disclaimer:</strong><br />
          BloodConnect 360 is a coordination platform that helps users locate blood availability and connect with registered donors.
          Final blood compatibility, donor eligibility, testing, collection, and transfusion decisions must be handled by
          qualified healthcare professionals and authorized blood banks. The platform does not provide medical diagnoses or
          guarantee blood availability.
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--slate-800)',
            paddingTop: '1.5rem',
            marginTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--slate-500)'
          }}
        >
          <div>
            © {new Date().getFullYear()} BloodConnect 360. All rights reserved. Built with precision for emergency care.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy" style={{ color: 'var(--slate-400)' }}>Privacy & Donor Data Protection</Link>
            <Link to="/terms" style={{ color: 'var(--slate-400)' }}>Terms of Service</Link>
            <Link to="/contact" style={{ color: 'var(--slate-400)' }}>Support & Grievances</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
