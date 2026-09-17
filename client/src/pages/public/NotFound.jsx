import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--primary-100)',
          color: 'var(--primary-600)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={38} />
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>404 - Page Not Found</h1>
        <p style={{ color: 'var(--slate-600)', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto 2rem auto' }}>
          The healthcare resource or coordination URL you requested does not exist or has been relocated.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary btn-md">
            <Home size={16} />
            <span>Return to Homepage</span>
          </Link>
          <Link to="/find-blood" className="btn btn-secondary btn-md">
            <Search size={16} />
            <span>Search Blood</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
