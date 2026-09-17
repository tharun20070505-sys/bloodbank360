import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Building2, ShieldAlert, User, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

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

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/find-blood"
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Search size={20} />
        <span>Find Blood</span>
      </NavLink>

      {/* Centered elevated Emergency SOS action */}
      <NavLink
        to="/emergency-sos"
        className="mobile-nav-sos-center"
        title="Immediate Emergency Broadcast"
      >
        <div className="mobile-nav-sos-circle">
          <ShieldAlert size={22} color="white" />
        </div>
        <span>SOS</span>
      </NavLink>

      <NavLink
        to={user?.role === 'BLOOD_BANK' ? '/bank/dashboard' : '/blood-banks'}
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <Building2 size={20} />
        <span>{user?.role === 'BLOOD_BANK' ? 'My Bank' : 'Banks'}</span>
      </NavLink>

      <NavLink
        to={user ? getDashboardPath() : '/login'}
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        {user ? <Activity size={20} /> : <User size={20} />}
        <span>{user ? 'Portal' : 'Sign In'}</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
