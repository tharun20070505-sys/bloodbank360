import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Send, CheckCircle, ArrowLeft, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import DonorCard from '../../components/DonorCard';
import AIMatchModal from '../../components/AIMatchModal';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const DonorFallbackView = () => {
  const { id } = useParams();
  const { addToast } = useNotifications();
  const [request, setRequest] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dispatchingAll, setDispatchingAll] = useState(false);
  const [sentMap, setSentMap] = useState({});
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get(`/requests/${id}`)
      .then(async (res) => {
        if (res.request) {
          setRequest(res.request);
          // Query nearby donors matching this request
          const donorRes = await api.get('/search/blood', {
            bloodGroup: res.request.bloodGroup,
            units: res.request.unitsRequired,
            radius: res.request.radius || 20
          });
          if (donorRes.donors) {
            setDonors(donorRes.donors);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDispatchOne = async (donor) => {
    try {
      await api.post(`/requests/${id}/dispatch-donors`, { donorIds: [donor._id] });
      setSentMap(prev => ({ ...prev, [donor._id]: true }));
      addToast({
        type: 'success',
        title: 'Notification Dispatched',
        message: `Alert sent to ${donor.pseudoName}.`
      });
    } catch (err) {
      addToast({ type: 'emergency', title: 'Error', message: err.message });
    }
  };

  const handleDispatchAll = async () => {
    if (donors.length === 0) return;
    setDispatchingAll(true);
    try {
      const donorIds = donors.map(d => d._id);
      await api.post(`/requests/${id}/dispatch-donors`, { donorIds });
      const newMap = {};
      donors.forEach(d => { newMap[d._id] = true; });
      setSentMap(newMap);
      addToast({
        type: 'success',
        title: 'Broadcast Complete',
        message: `Urgent notifications sent to ${donors.length} voluntary donors!`
      });
    } catch (err) {
      addToast({ type: 'emergency', title: 'Broadcast Failed', message: err.message });
    } finally {
      setDispatchingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <div>Loading fallback donors and AI triage scores...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to={`/patient/requests/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.75rem' }}>
            <ArrowLeft size={16} /> Back to Request Details
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="stage-badge stage-badge-donor">STAGE 2 AUTOMATIC FALLBACK</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-700)' }}>
                  {request?.bloodGroup} ({request?.unitsRequired} Units)
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', marginTop: '4px' }}>
                Voluntary Donor Fallback Dispatcher
              </h1>
              <p style={{ color: 'var(--slate-600)' }}>
                Patient: <strong>{request?.patientName}</strong> at {request?.hospitalName}.
                Bank inventory was insufficient. Dispatch urgent alerts to ranked voluntary donors below.
              </p>
            </div>

            <button
              onClick={handleDispatchAll}
              className="btn btn-primary btn-md"
              disabled={dispatchingAll || donors.length === 0}
            >
              <Send size={16} />
              <span>{dispatchingAll ? 'Broadcasting...' : `Dispatch to All ${donors.length} Donors`}</span>
            </button>
          </div>
        </div>

        {/* Fallback Notice Banner verbatim as specified in prompt section 7 */}
        <div className="fallback-alert-banner">
          <AlertTriangle size={24} color="var(--primary-600)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>
              No sufficient blood stock was found in nearby blood banks.
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--primary-700)', marginTop: '2px' }}>
              Searching registered voluntary donors near you...
            </p>
          </div>
        </div>

        {/* Donors Grid */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {donors.map((donor) => (
            <DonorCard
              key={donor._id}
              donor={donor}
              onSendRequest={handleDispatchOne}
              onViewAIReport={(d) => { setSelectedDonor(d); setModalOpen(true); }}
              isRequestSent={sentMap[donor._id]}
            />
          ))}
        </div>

        <AIMatchModal
          donor={selectedDonor}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default DonorFallbackView;
