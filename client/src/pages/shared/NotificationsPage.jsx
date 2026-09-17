import React from 'react';
import { Bell, CheckCheck, ShieldAlert, Heart, Building2, Clock, Check } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '840px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem' }}>Notifications Center</h1>
            <p style={{ color: 'var(--slate-600)' }}>
              Real-time alerts, donor responses, and emergency blood dispatches.
            </p>
          </div>

          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn btn-secondary btn-sm">
              <CheckCheck size={16} />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Bell size={48} color="var(--slate-300)" style={{ margin: '0 auto 1rem auto' }} />
            <h4>No Notifications Yet</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              You are completely caught up! New alerts and donor responses will arrive here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map((n) => (
              <div
                key={n._id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  background: n.read ? 'white' : 'var(--primary-50)',
                  borderLeft: n.type === 'EMERGENCY_REQUEST' ? '5px solid var(--primary-600)' : n.read ? '1px solid var(--slate-200)' : '4px solid var(--primary-600)'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: n.type === 'EMERGENCY_REQUEST' ? '#fee2e2' : n.type === 'DONOR_RESPONSE' ? '#ecfdf5' : '#e0f2fe',
                    color: n.type === 'EMERGENCY_REQUEST' ? '#991b1b' : n.type === 'DONOR_RESPONSE' ? '#065f46' : '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {n.type === 'EMERGENCY_REQUEST' ? <ShieldAlert size={20} /> : n.type === 'DONOR_RESPONSE' ? <Heart size={20} /> : <Bell size={20} />}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--slate-900)', marginBottom: '2px' }}>
                      {n.title}
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                      {n.message}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: '4px' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}
                  >
                    <Check size={12} />
                    <span>Mark Read</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
