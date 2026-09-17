import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MapPin, Clock, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const RequestAction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  const [estimatedArrival, setEstimatedArrival] = useState(30);
  const [message, setMessage] = useState('I am ready to donate and traveling to the hospital center.');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmAccept = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post('/donors/respond', {
        requestId: id,
        response: 'ACCEPTED',
        estimatedArrivalTimeMins: parseInt(estimatedArrival, 10),
        message
      });

      if (res.success) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        addToast({
          type: 'success',
          title: 'Donation Accepted!',
          message: 'Thank you for your life-saving service. Coordination details unlocked.'
        });
        navigate('/donor/dashboard');
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '640px' }}>
        <Link to="/donor/requests" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Requests
        </Link>

        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              background: 'var(--medical-green-light)',
              color: 'var(--medical-green-dark)',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Heart size={30} />
            </div>
            <h1 style={{ fontSize: '2rem' }}>Confirm Your Blood Donation</h1>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
              Let the hospital and patient attendant know your estimated arrival time.
            </p>
          </div>

          <form onSubmit={handleConfirmAccept}>
            <div className="form-group">
              <label className="form-label">Estimated Transit Time to Hospital (Minutes) *</label>
              <select
                value={estimatedArrival}
                onChange={(e) => setEstimatedArrival(e.target.value)}
                className="form-control"
              >
                <option value="15">~15 Minutes (Nearby)</option>
                <option value="30">~30 Minutes (Standard transit)</option>
                <option value="45">~45 Minutes</option>
                <option value="60">~60 Minutes (Within hour)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Message to Hospital Attendant / Patient</label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
              <CheckCircle2 size={18} />
              <span>{submitting ? 'Confirming Dispatch...' : 'Confirm & Transmit Dispatch'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestAction;
