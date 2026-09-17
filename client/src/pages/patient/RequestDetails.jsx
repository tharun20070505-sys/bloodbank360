import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Droplet,
  Building2,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  XCircle,
  Sparkles,
  Send
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import AIMatchModal from '../../components/AIMatchModal';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const RequestDetails = () => {
  const { id } = useParams();
  const { addToast } = useNotifications();
  const [request, setRequest] = useState(null);
  const [donorResponses, setDonorResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const fetchDetails = () => {
    api.get(`/requests/${id}`)
      .then((res) => {
        if (res.request) setRequest(res.request);
        if (res.donorResponses) setDonorResponses(res.donorResponses);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetails();
    const interval = setInterval(fetchDetails, 10000); // 10s auto refresh
    return () => clearInterval(interval);
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this blood request?')) return;
    setCancelling(true);
    try {
      const res = await api.patch(`/requests/${id}/cancel`);
      if (res.success) {
        addToast({ type: 'info', title: 'Request Cancelled', message: 'Blood request has been closed.' });
        fetchDetails();
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Action Failed', message: err.message });
    } finally {
      setCancelling(false);
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Mark this request as successfully fulfilled?')) return;
    setCompleting(true);
    try {
      const res = await api.patch(`/requests/${id}/complete`, {
        fulfillingEntity: {
          type: request.acceptedEntity?.entityType || 'DONOR',
          name: request.acceptedEntity?.name || 'Voluntary Donor Network'
        }
      });
      if (res.success) {
        addToast({ type: 'success', title: 'Request Completed', message: 'Blood fulfilled. Thank you!' });
        fetchDetails();
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Error', message: err.message });
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--slate-200)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
        <div>Loading real-time tracking data...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Request Not Found</h2>
        <Link to="/patient/requests" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
          Back to Requests
        </Link>
      </div>
    );
  }

  const isAccepted = donorResponses.some(r => r.response === 'ACCEPTED');

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/patient/requests" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.75rem' }}>
            <ArrowLeft size={16} /> Back to My Requests
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{
                  background: 'var(--primary-600)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontWeight: '900',
                  fontSize: '1.25rem'
                }}>
                  {request.bloodGroup}
                </span>
                <h1 style={{ fontSize: '2.2rem' }}>{request.patientName}</h1>
                <StatusBadge status={request.status} />
                {request.emergency && (
                  <span className="badge badge-danger">EMERGENCY BROADCAST</span>
                )}
              </div>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                Tracking ID: <code>{request._id}</code> • Created on: {new Date(request.createdAt).toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
                <>
                  <button onClick={handleCancel} className="btn btn-outline btn-sm" disabled={cancelling}>
                    <XCircle size={15} />
                    <span>{cancelling ? 'Closing...' : 'Cancel Request'}</span>
                  </button>
                  <button onClick={handleComplete} className="btn btn-primary btn-sm" disabled={completing}>
                    <CheckCircle2 size={15} />
                    <span>{completing ? 'Completing...' : 'Mark as Fulfilled'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Multi-step Visual Progress Bar */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <div className="tracker-steps-grid">
            <div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--medical-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: '800' }}>✓</div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>1. Request Created</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Initiated</div>
            </div>

            <div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: request.bloodBankMatches?.length > 0 ? 'var(--medical-green)' : 'var(--slate-200)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: '800' }}>
                {request.bloodBankMatches?.length > 0 ? '✓' : '2'}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>2. Blood Banks Check</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {request.fulfillmentStage === 'STAGE_1_BLOOD_BANK' ? 'Stock Found' : 'Stock Insufficient'}
              </div>
            </div>

            <div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: request.fulfillmentStage === 'STAGE_2_DONOR_FALLBACK' ? 'var(--primary-600)' : 'var(--slate-200)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: '800' }}>
                3
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>3. Donor Fallback</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {request.donorMatches?.length > 0 ? `${request.donorMatches.length} AI Matches` : 'Not Needed'}
              </div>
            </div>

            <div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isAccepted ? 'var(--medical-green)' : 'var(--slate-200)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: '800' }}>
                {isAccepted ? '✓' : '4'}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>4. Donor Responded</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                {isAccepted ? 'Accepted & En Route' : 'Awaiting Donor'}
              </div>
            </div>

            <div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: request.status === 'COMPLETED' ? 'var(--medical-green)' : 'var(--slate-200)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px auto', fontWeight: '800' }}>
                {request.status === 'COMPLETED' ? '✓' : '5'}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>5. Fulfilled</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Transfusion Complete</div>
            </div>
          </div>
        </div>

        {/* Accepted Donor Contact Banner (Controlled Contact Sharing) */}
        {isAccepted && (
          <div style={{
            background: 'var(--medical-green-light)',
            border: '2px solid var(--medical-green)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '2.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--medical-green)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--medical-green-dark)' }}>
                  A Potential Voluntary Donor Has Accepted Your Request!
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  Controlled contact sharing is now unlocked for direct hospital coordination.
                </div>
              </div>
            </div>

            {donorResponses.filter(r => r.response === 'ACCEPTED').map((resp) => (
              <div key={resp._id} style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem' }}>
                      {resp.donorId?.userId?.name || 'Voluntary Donor'}
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                      💬 Message: "{resp.message || 'I am ready to donate and traveling to the hospital center.'}"
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                      ⏱️ Estimated Arrival: ~{resp.estimatedArrivalTimeMins || 30} minutes
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: 'var(--primary-50)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'block' }}>Donor Direct Line:</span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--primary-700)' }}>
                        {resp.donorId?.userId?.phone || '+91 97890 54321'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Information Grid: Hospital & Clinical Notes */}
        <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Patient & Hospital Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <div><strong>Patient Name:</strong> {request.patientName}</div>
              <div><strong>Required Blood Group:</strong> <span style={{ color: 'var(--primary-600)', fontWeight: '800' }}>{request.bloodGroup}</span></div>
              <div><strong>Required Units:</strong> {request.unitsRequired} Pint(s)</div>
              <div><strong>Hospital / Center:</strong> {request.hospitalName}</div>
              <div><strong>Ward / Address:</strong> {request.address}</div>
              <div><strong>Search Boundary:</strong> {request.radius} km radius</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Fulfillment & Clinical Notes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <div><strong>Fulfillment Stage:</strong> <span className="badge badge-info">{request.fulfillmentStage}</span></div>
              <div><strong>Emergency Level:</strong> {request.emergency ? '🚨 Critical SOS' : 'Standard Routine'}</div>
              <div><strong>Clinical Instructions:</strong> {request.notes || 'No specific doctor notes provided.'}</div>
              {request.acceptedEntity?.name && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--slate-50)', borderRadius: '6px' }}>
                  <strong>Fulfilled By:</strong> {request.acceptedEntity.name} ({request.acceptedEntity.entityType})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stage 1 Blood Banks Matched */}
        {request.bloodBankMatches?.length > 0 && (
          <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={20} color="var(--accent-cyan)" />
              <span>Nearby Blood Banks Evaluated in Stage 1 ({request.bloodBankMatches.length})</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {request.bloodBankMatches.map((bankItem, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-200)', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <strong>{bankItem.name}</strong>
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                      Distance: approx. {bankItem.distanceKm} km away • Status: <strong>{bankItem.status}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: '700', color: bankItem.availableUnits > 0 ? 'var(--medical-green-dark)' : 'var(--primary-600)' }}>
                      {bankItem.availableUnits} Units in Stock
                    </span>
                    {bankItem.bloodBankId && (
                      <Link to={`/blood-banks/${bankItem.bloodBankId._id || bankItem.bloodBankId}`} className="btn btn-secondary btn-sm">
                        Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stage 2 Donor Fallback Section */}
        {request.fulfillmentStage === 'STAGE_2_DONOR_FALLBACK' && (
          <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem', borderTop: '4px solid var(--primary-600)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="var(--primary-600)" />
                  <span>Stage 2: Automatic Donor Fallback Candidates</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                  Voluntary donors screened & ranked by AI compatibility index.
                </p>
              </div>

              <Link to={`/patient/requests/${request._id}/donor-fallback`} className="btn btn-primary btn-sm">
                <Send size={15} />
                <span>Open Donor Fallback Dispatcher</span>
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {request.donorMatches?.map((dItem, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-200)', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong>{dItem.donorId?.userId?.name ? `Donor (${dItem.donorId.userId.name.split(' ')[0]})` : `Donor #${idx + 1}`}</strong>
                      <span style={{ background: 'var(--medical-green-light)', color: 'var(--medical-green-dark)', padding: '1px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                        {dItem.aiCompatibilityScore}% AI Score
                      </span>
                      <span className={`badge ${dItem.responseStatus === 'ACCEPTED' ? 'badge-success' : 'badge-neutral'}`}>
                        {dItem.responseStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                      {dItem.aiRationale || `Distance: approx. ${dItem.distanceKm} km`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <AIMatchModal
          donor={selectedDonor}
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default RequestDetails;
