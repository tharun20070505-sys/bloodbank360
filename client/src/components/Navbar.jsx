import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Droplet,
  Search,
  Building2,
  Users,
  ShieldAlert,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  ChevronDown,
  Activity,
  HeartHandshake,
  HelpCircle,
  Sparkles,
  Info,
  GitPullRequest,
  Download,
  Laptop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const resourcesRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setResourcesOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'PATIENT': return '/patient/dashboard';
      case 'DONOR': return '/donor/dashboard';
      case 'BLOOD_BANK': return '/bank/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'PATIENT': return 'Patient';
      case 'DONOR': return 'Donor';
      case 'BLOOD_BANK': return 'Blood Bank';
      case 'ADMIN': return 'Administrator';
      default: return role;
    }
  };

  return (
    <header className="navbar">
      <div className="app-container navbar-inner">
        {/* Left Cluster: Brand & Closer Nav Links */}
        <div className="nav-left-cluster">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            <div className="brand-icon-wrap">
              <Droplet size={20} fill="currentColor" />
            </div>
            <span>BloodConnect <span style={{ color: 'var(--primary-600)' }}>360</span></span>
          </Link>

          {/* Rearranged Desktop Navigation Links (Closer together) */}
          <nav className="nav-links">
            <NavLink to="/find-blood" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Search size={15} />
              <span>Find Blood</span>
            </NavLink>

            <NavLink to="/blood-banks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Building2 size={15} />
              <span>Blood Banks</span>
            </NavLink>

            <NavLink to="/map-explorer" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Compass size={15} />
              <span>Live Map</span>
            </NavLink>

            <NavLink to="/become-donor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HeartHandshake size={15} />
              <span>Become a Donor</span>
            </NavLink>

            {/* Resources Dropdown */}
            <div className="nav-dropdown-wrapper" ref={resourcesRef}>
              <button
                type="button"
                className={`nav-dropdown-trigger ${resourcesOpen ? 'open' : ''}`}
                onClick={() => setResourcesOpen(!resourcesOpen)}
              >
                <span>Resources</span>
                <ChevronDown size={14} style={{ transform: resourcesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {resourcesOpen && (
                <div className="nav-dropdown-menu">
                  <Link to="/download-app" className="nav-dropdown-item" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', marginBottom: '4px' }}>
                    <Download size={16} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: '700' }}>Download App (Mobile & PC)</div>
                      <div className="nav-dropdown-item-desc" style={{ color: 'var(--primary-600)' }}>Install on Android, iOS, Mac & Windows</div>
                    </div>
                  </Link>

                  <Link to="/how-it-works" className="nav-dropdown-item">
                    <HelpCircle size={16} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div>How It Works</div>
                      <div className="nav-dropdown-item-desc">Two-Stage search & fallback process</div>
                    </div>
                  </Link>

                  <Link to="/compatibility-guide" className="nav-dropdown-item">
                    <Droplet size={16} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div>Compatibility Matrix</div>
                      <div className="nav-dropdown-item-desc">ABO & Rh donor-recipient rules</div>
                    </div>
                  </Link>

                  <Link to="/eligibility-checker" className="nav-dropdown-item">
                    <Activity size={16} color="var(--emerald-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div>Eligibility Quiz</div>
                      <div className="nav-dropdown-item-desc">60-second donor self-screening</div>
                    </div>
                  </Link>

                  <Link to="/ai-insights" className="nav-dropdown-item">
                    <Sparkles size={16} color="#8b5cf6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div>AI Matching Lab</div>
                      <div className="nav-dropdown-item-desc">Algorithmic triage & score analyzer</div>
                    </div>
                  </Link>

                  <div style={{ height: '1px', background: 'var(--slate-100)', margin: '0.3rem 0' }} />

                  <Link to="/about" className="nav-dropdown-item">
                    <Info size={16} color="var(--slate-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div>About BloodConnect</div>
                      <div className="nav-dropdown-item-desc">Non-commercial, zero-wastage mission</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Action Cluster: Emergency SOS + Divider + User/Auth Controls */}
        <div className="nav-right-cluster">
          {/* Emergency SOS Callout */}
          <Link to="/emergency-sos" className="sos-btn-compact" title="Immediate Critical Blood Broadcast">
            <span className="sos-pulse-dot" />
            <ShieldAlert size={14} />
            <span>SOS EMERGENCY</span>
          </Link>

          <div className="nav-divider" />

          {/* Authenticated State */}
          {user ? (
            <>
              {/* Notifications Link */}
              <Link
                to="/notifications"
                style={{
                  position: 'relative',
                  padding: '7px',
                  borderRadius: '8px',
                  color: 'var(--slate-600)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.15s'
                }}
                className="nav-icon-btn"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: 'var(--primary-600)',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '700',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Compact Dashboard Pill */}
              <Link
                to={getDashboardPath()}
                className="btn btn-secondary btn-sm"
                style={{
                  padding: '0.38rem 0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  gap: '5px'
                }}
              >
                <Activity size={14} color="var(--primary-600)" />
                <span>Dashboard</span>
              </Link>

              {/* User Avatar Menu Dropdown */}
              <div className="nav-dropdown-wrapper" ref={userMenuRef}>
                <button
                  type="button"
                  className={`user-avatar-btn ${userMenuOpen ? 'open' : ''}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  title={`${user.name} (${user.role})`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                </button>

                {userMenuOpen && (
                  <div className="user-menu-card">
                    <div className="user-menu-header">
                      <div style={{ fontWeight: '700', color: 'var(--slate-900)', fontSize: '0.9rem' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', wordBreak: 'break-all' }}>
                        {user.email}
                      </div>
                      <div style={{ marginTop: '0.4rem' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'var(--primary-50)',
                          color: 'var(--primary-700)',
                          border: '1px solid var(--primary-200)'
                        }}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </div>
                    </div>

                    <Link to="/profile" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={15} color="var(--slate-500)" />
                      <span>My Profile & Settings</span>
                    </Link>

                    <Link to={getDashboardPath()} className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <Activity size={15} color="var(--primary-600)" />
                      <span>Role Portal</span>
                    </Link>

                    <div style={{ height: '1px', background: 'var(--slate-100)', margin: '0.3rem 0' }} />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="nav-dropdown-item"
                      style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: 'var(--primary-700)' }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest State */
            <>
              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.38rem 0.75rem', fontSize: '0.82rem', fontWeight: '600' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                style={{ padding: '0.38rem 0.85rem', fontSize: '0.82rem', fontWeight: '600' }}
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle-btn"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                Main Navigation
              </div>

              <NavLink to="/find-blood" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Search size={16} /> Find Blood
              </NavLink>

              <NavLink to="/blood-banks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Building2 size={16} /> Blood Banks
              </NavLink>

              <NavLink to="/map-explorer" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Compass size={16} /> Live Map Explorer
              </NavLink>

              <NavLink to="/become-donor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <HeartHandshake size={16} /> Become a Voluntary Donor
              </NavLink>

              <div style={{ height: '1px', background: 'var(--slate-100)', margin: '0.5rem 0' }} />

              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                Resources & Education
              </div>

              <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <HelpCircle size={16} /> How It Works (Two-Stage Engine)
              </NavLink>

              <NavLink to="/compatibility-guide" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Droplet size={16} /> Compatibility Guide
              </NavLink>

              <NavLink to="/eligibility-checker" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Activity size={16} /> Eligibility Quiz
              </NavLink>

              <NavLink to="/ai-insights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Sparkles size={16} /> AI Matching Insights
              </NavLink>

              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Info size={16} /> About BloodConnect 360
              </NavLink>

              <NavLink to="/download-app" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--primary-700)', fontWeight: '700', background: 'var(--primary-50)' }}>
                <Download size={16} /> Download Mobile & Laptop App
              </NavLink>

              <div style={{ height: '1px', background: 'var(--slate-100)', margin: '0.5rem 0' }} />

              {/* Mobile Auth / Profile section */}
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.3rem' }}>
                  <div style={{ padding: '0.5rem 0.75rem', background: 'var(--slate-50)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{user.email} • {user.role}</div>
                  </div>
                  <Link to={getDashboardPath()} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Open Dashboard
                  </Link>
                  <Link to="/profile" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <Link to="/login" className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }}>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
