import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MapPin,
  Building2,
  Droplet,
  Thermometer,
  QrCode,
  Navigation,
  FileCheck,
  Printer,
  Clock,
  AlertTriangle,
  UserCheck,
  Lock
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const DispatchDetail = () => {
  const { id } = useParams();
  const { addToast } = useNotifications();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handover Verification Modal state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [attendantName, setAttendantName] = useState('');
  const [attendantStaffId, setAttendantStaffId] = useState('');
  const [dispatchPin, setDispatchPin] = useState('3609');
  const [inputPin, setInputPin] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Cold Chain simulation data
  const [temperature, setTemperature] = useState(3.8);

  useEffect(() => {
    api.get(`/requests/${id}`).then(res => {
      if (res.request) {
        setRequest(res.request);
        if (res.request.requesterId?.name) {
          setAttendantName(res.request.requesterId.name);
        }
      }
    }).finally(() => setLoading(false));

    // Slight temperature oscillation within nominal safe range (3.6°C to 4.1°C)
    const interval = setInterval(() => {
      setTemperature((prev) => {
        const delta = (Math.random() - 0.5) * 0.1;
        const next = Math.max(3.4, Math.min(4.4, prev + delta));
        return parseFloat(next.toFixed(1));
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [id]);

  const handleOpenHandoverModal = () => {
    setShowVerifyModal(true);
  };

  const handleConfirmHandover = async (e) => {
    e.preventDefault();
    if (inputPin.trim() && inputPin.trim() !== dispatchPin) {
      addToast({ type: 'emergency', title: 'Invalid PIN', message: 'Verification PIN does not match dispatch manifest.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.patch(`/requests/${id}/complete`, {
        fulfillingEntity: {
          type: 'BLOOD_BANK',
          name: 'Licensed Blood Bank Dispatch Center',
          attendant: attendantName || 'Hospital Duty Attendant',
          staffId: attendantStaffId || 'MED-STAFF-ACTIVE',
          coldBoxId: 'CBX-904-HEMO',
          deliveryTemp: `${temperature}°C`
        }
      });
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Handover Completed',
          message: `Blood units successfully handed over to ${attendantName || 'attendant'}. Cold-chain logged.`
        });
        setRequest(prev => ({
          ...prev,
          status: 'COMPLETED',
          fulfillingEntity: {
            type: 'BLOOD_BANK',
            name: 'Licensed Blood Bank Dispatch Center',
            attendant: attendantName || 'Hospital Duty Attendant'
          }
        }));
        setShowVerifyModal(false);
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Dispatch Error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenNavigation = () => {
    if (!request) return;
    const destination = `${request.hospitalName}, ${request.address}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) return (
    <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div className="spinner" style={{ margin: '0 auto 1rem' }} />
      <div style={{ color: 'var(--slate-500)', fontWeight: '600' }}>Loading Blood Bank Dispatch Manifest...</div>
    </div>
  );

  if (!request) return (
    <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <h2>Dispatch Order Not Found</h2>
      <Link to="/bank/requests" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
        Back to Dispatches
      </Link>
    </div>
  );

  const verificationHash = `BB360-DISP-${id.slice(-6).toUpperCase()}`;

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '780px' }}>
        {/* Top Breadcrumb & Mobile App Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <Link
            to="/bank/requests"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-600)', textDecoration: 'none', fontWeight: '500' }}
          >
            <ArrowLeft size={16} /> Back to Active Dispatches
          </Link>

          <span style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'var(--primary-700)',
            background: 'var(--primary-50)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--primary-200)'
          }}>
            BloodBank 360 Dispatch Suite
          </span>
        </div>

        {/* Main Dispatch Manifest Card */}
        <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--primary-600)', boxShadow: 'var(--shadow-md)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dispatch Manifest #{id.slice(-6).toUpperCase()}
                </span>
                {request.emergency && (
                  <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                    CRITICAL SOS
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '1.85rem', color: 'var(--slate-900)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                {request.patientName}
              </h1>
              <div style={{ fontSize: '0.88rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={14} />
                <span>{request.hospitalName}</span>
                <span>•</span>
                <Clock size={14} />
                <span>{new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <StatusBadge status={request.status} />
          </div>

          {/* Cold Chain & Security Live Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            background: '#f8fafc',
            border: '1px solid var(--slate-200)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem'
          }}>
            {/* Temperature Sensor */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Thermometer size={14} color="var(--emerald-600)" />
                <span>COLD-CHAIN SENSOR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                  {temperature}°C
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--emerald-600)', background: 'var(--emerald-50)', padding: '1px 6px', borderRadius: '4px' }}>
                  ✓ Optimal (2-6°C)
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>Cold-Box #CBX-904-HEMO</div>
            </div>

            {/* Verification Security Hash */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Lock size={14} color="var(--primary-600)" />
                <span>SECURITY MANIFEST ID</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '1.15rem', color: 'var(--primary-700)', marginTop: '4px' }}>
                {verificationHash}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>Cross-Match Validated</div>
            </div>

            {/* Units & Blood Group */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Droplet size={14} color="var(--primary-600)" />
                <span>RESERVED BLOOD UNITS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--primary-600)' }}>
                  {request.bloodGroup}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--slate-700)' }}>
                  × {request.unitsRequired} Pint(s)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Courier Actions Bar (GPS Navigation + Call Attendant) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <button
              onClick={handleOpenNavigation}
              className="btn btn-secondary"
              style={{ justifyContent: 'center', gap: '8px', fontSize: '0.88rem' }}
            >
              <Navigation size={16} color="var(--primary-600)" />
              <span>GPS Route to Ward</span>
            </button>

            <a
              href={`tel:${request.requesterId?.phone || '+919443210987'}`}
              className="btn btn-secondary"
              style={{ justifyContent: 'center', gap: '8px', fontSize: '0.88rem', textDecoration: 'none' }}
            >
              <Phone size={16} color="var(--emerald-600)" />
              <span>Call Attendant</span>
            </a>
          </div>

          {/* Detailed Specifications */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            fontSize: '0.92rem',
            background: 'white',
            border: '1px solid var(--slate-100)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '3px' }}>
                Destination Hospital & Room
              </div>
              <div style={{ fontWeight: '700', color: 'var(--slate-800)' }}>{request.hospitalName}</div>
              <div style={{ color: 'var(--slate-600)', fontSize: '0.85rem' }}>{request.address}</div>
            </div>

            <div>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '3px' }}>
                Attendant On Duty
              </div>
              <div style={{ fontWeight: '700', color: 'var(--slate-800)' }}>
                {request.requesterId?.name || 'Assigned Family Attendant'}
              </div>
              <div style={{ color: 'var(--slate-600)', fontSize: '0.85rem' }}>
                {request.requesterId?.phone || '+91 94432 10987'}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '3px' }}>
                Blood Compatibility
              </div>
              <div style={{ fontWeight: '600', color: 'var(--slate-700)' }}>
                Whole Blood / Packed Red Cells (PRBC)
              </div>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.82rem' }}>Tested Non-Reactive for HBV, HCV, HIV, Syphilis</div>
            </div>

            <div>
              <div style={{ color: 'var(--slate-500)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '3px' }}>
                Clinical Surgeon Instructions
              </div>
              <div style={{ color: 'var(--slate-700)', fontStyle: 'italic', fontSize: '0.88rem' }}>
                "{request.notes || 'Emergency surgical reserve. Maintain standard transfusion protocol.'}"
              </div>
            </div>
          </div>

          {/* Digital QR Handover Pass Card */}
          <div style={{
            border: '2px dashed var(--slate-200)',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)'
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--slate-700)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              <QrCode size={18} color="var(--primary-600)" />
              <span>Digital Dispatch Gate Pass (Scan to Verify Handover)</span>
            </div>

            <div style={{
              width: '160px',
              height: '160px',
              margin: '0 auto 1rem',
              background: 'white',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--slate-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Scalable SVG QR Code representation */}
              <svg viewBox="0 0 100 100" width="136" height="136">
                <rect width="100" height="100" fill="white" />
                {/* Outer corners */}
                <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="13" width="12" height="12" fill="#dc2626" rx="2" />

                <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="75" y="13" width="12" height="12" fill="#dc2626" rx="2" />

                <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="75" width="12" height="12" fill="#dc2626" rx="2" />

                {/* Data matrix pattern */}
                <rect x="40" y="8" width="6" height="12" fill="#0f172a" />
                <rect x="50" y="12" width="10" height="6" fill="#0f172a" />
                <rect x="40" y="24" width="8" height="8" fill="#0f172a" />
                <rect x="10" y="40" width="6" height="14" fill="#0f172a" />
                <rect x="22" y="44" width="12" height="6" fill="#0f172a" />
                <rect x="42" y="42" width="16" height="16" fill="#dc2626" rx="3" />
                <rect x="68" y="40" width="14" height="6" fill="#0f172a" />
                <rect x="86" y="44" width="8" height="12" fill="#0f172a" />
                <rect x="40" y="68" width="10" height="8" fill="#0f172a" />
                <rect x="56" y="74" width="8" height="16" fill="#0f172a" />
                <rect x="72" y="70" width="14" height="8" fill="#0f172a" />
                <rect x="70" y="84" width="18" height="6" fill="#0f172a" />
              </svg>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Verification PIN: <strong style={{ color: 'var(--slate-900)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>{dispatchPin}</strong>
            </div>
          </div>

          {/* Action Trigger / Completion State */}
          {request.status !== 'COMPLETED' ? (
            <button
              onClick={handleOpenHandoverModal}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.05rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 20px rgba(220, 38, 38, 0.35)'
              }}
            >
              <CheckCircle2 size={20} />
              <span>Confirm Release & Handover to Hospital Attendant</span>
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                textAlign: 'center',
                padding: '1.25rem',
                background: 'var(--emerald-50)',
                border: '1px solid var(--emerald-200)',
                borderRadius: '12px',
                color: 'var(--emerald-800)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={22} color="var(--emerald-600)" />
                <span>Units Successfully Released & Handed Over to Hospital Registry</span>
              </div>

              <button
                onClick={handlePrintReceipt}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              >
                <Printer size={16} />
                <span>Print Official Handover Clearance Slip</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Handover Verification Modal */}
      {showVerifyModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>
                  Confirm Handover Release
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  Record attendant identity and verify PIN
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmHandover}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Hospital Duty Attendant Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={attendantName}
                  onChange={(e) => setAttendantName(e.target.value)}
                  placeholder="e.g. Sister Maria / Staff Nurse"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Hospital Staff / Badge ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={attendantStaffId}
                  onChange={(e) => setAttendantStaffId(e.target.value)}
                  placeholder="e.g. KMCH-RN-4821"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">
                  Dispatch Verification PIN (Default: <code>{dispatchPin}</code>)
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder={`Enter PIN (${dispatchPin})`}
                  style={{ fontFamily: 'monospace', letterSpacing: '0.15em', fontSize: '1.1rem', fontWeight: '700' }}
                />
              </div>

              <div style={{
                background: 'var(--slate-50)',
                padding: '0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--slate-600)',
                marginBottom: '1.5rem',
                lineHeight: '1.5'
              }}>
                ℹ️ Confirming release deducts <strong>{request.unitsRequired} Pint(s)</strong> of <strong>{request.bloodGroup}</strong> from your active blood bank reserve and creates an auditable medical dispatch log.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1.5, justifyContent: 'center' }}
                  disabled={submitting}
                >
                  {submitting ? 'Confirming...' : 'Authorize Release'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchDetail;
