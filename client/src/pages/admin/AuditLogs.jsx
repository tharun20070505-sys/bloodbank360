import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import api from '../../utils/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/audit-logs')
      .then(res => { if (res.logs) setLogs(res.logs); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Administration
          </Link>
          <h1 style={{ fontSize: '2.2rem' }}>System Security & Activity Audit Trail</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Chronological audit log of all system notifications, dispatch notifications, and clinical events.
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading audit trail...</div>
        ) : (
          <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--slate-100)', textAlign: 'left', borderBottom: '1px solid var(--slate-200)' }}>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px' }}>Event Category</th>
                  <th style={{ padding: '12px 16px' }}>Recipient / Entity</th>
                  <th style={{ padding: '12px 16px' }}>Description / Log Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-info">{log.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>
                      {log.userId?.name} ({log.userId?.role})
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--slate-700)' }}>
                      <strong>{log.title}:</strong> {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
