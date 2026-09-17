import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Building2,
  Users,
  MapPin,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import SearchForm from '../../components/SearchForm';
import BloodBankCard from '../../components/BloodBankCard';
import DonorCard from '../../components/DonorCard';
import MapView from '../../components/MapView';
import AIMatchModal from '../../components/AIMatchModal';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const FindBlood = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [selectedDonorForAI, setSelectedDonorForAI] = useState(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [sentRequests, setSentRequests] = useState({});
  const [sendingDonorId, setSendingDonorId] = useState(null);

  // Auto-run if navigated with initial search criteria from Home
  useEffect(() => {
    if (location.state?.initialSearch) {
      executeSearch(location.state.initialSearch);
    }
  }, [location.state]);

  const executeSearch = async (params) => {
    setLoading(true);
    setSearchResult(null);

    try {
      const data = await api.get('/search/blood', params);
      setSearchResult(data);
    } catch (err) {
      console.error('Search error:', err);
      addToast({
        type: 'emergency',
        title: 'Search Evaluation Failed',
        message: err.message || 'Unable to complete two-stage blood search.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBloodBank = (bank) => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/find-blood' } });
      return;
    }
    navigate('/patient/create-request', {
      state: {
        prefillBank: bank,
        bloodGroup: searchResult?.query?.bloodGroup || 'O+',
        units: searchResult?.query?.units || 1,
        emergency: searchResult?.query?.emergency || false
      }
    });
  };

  const handleSendDonorRequest = async (donor) => {
    if (!user) {
      navigate('/login', { state: { returnUrl: '/find-blood' } });
      return;
    }

    setSendingDonorId(donor._id);
    try {
      // Create request and dispatch to donor
      const payload = {
        patientName: user.name || 'Emergency Patient',
        hospitalName: 'Local Healthcare Facility',
        bloodGroup: searchResult?.query?.bloodGroup || donor.bloodGroup,
        unitsRequired: searchResult?.query?.units || 1,
        latitude: searchResult?.query?.latitude || 11.0168,
        longitude: searchResult?.query?.longitude || 76.9558,
        address: donor.city ? `Near ${donor.city}` : 'Central District',
        radius: searchResult?.query?.radius || 15,
        emergency: searchResult?.query?.emergency || false,
        notes: 'Direct voluntary donor request from Two-Stage Fallback engine'
      };

      const res = await api.post('/requests', payload);
      if (res.success && res.request) {
        await api.post(`/requests/${res.request._id}/dispatch-donors`, {
          donorIds: [donor._id]
        });

        setSentRequests(prev => ({ ...prev, [donor._id]: true }));
        addToast({
          type: 'success',
          title: 'Request Dispatched to Donor',
          message: `Notification sent to ${donor.pseudoName}. You can track response in your dashboard.`
        });
      }
    } catch (err) {
      addToast({
        type: 'emergency',
        title: 'Dispatch Failed',
        message: err.message || 'Could not send request.'
      });
    } finally {
      setSendingDonorId(null);
    }
  };

  const openAIReport = (donor) => {
    setSelectedDonorForAI(donor);
    setIsAIModalOpen(true);
  };

  const userCoords = searchResult?.query
    ? [searchResult.query.latitude, searchResult.query.longitude]
    : [11.0168, 76.9558];

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Page Title & Breadcrumb */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
            <span>Home</span>
            <span>/</span>
            <span style={{ color: 'var(--primary-600)', fontWeight: '600' }}>Find Blood</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--slate-900)' }}>
            Location-Based Blood Availability Engine
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', marginTop: '0.25rem' }}>
            Two-stage availability workflow: Verifies licensed blood banks first, automatically activating nearby voluntary donors if units are insufficient.
          </p>
        </div>

        {/* Search Input Bar */}
        <div style={{ marginBottom: '2.5rem' }}>
          <SearchForm onSearch={executeSearch} loading={loading} />
        </div>

        {/* Results Area */}
        {loading && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--slate-200)',
              borderTopColor: 'var(--primary-600)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1.5rem auto'
            }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Executing Two-Stage Analysis...</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem' }}>
              Querying regional blood banks inventory $\rightarrow$ Preparing automatic donor fallback if stock deficit exists.
            </p>
          </div>
        )}

        {searchResult && !loading && (
          <div>
            {/* View Switcher Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>Search Evaluation Results</h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--slate-500)' }}>
                  Parameters: <strong>{searchResult.query.bloodGroup}</strong> • {searchResult.query.units} Unit(s) • Radius: {searchResult.query.radius} km
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setViewMode('list')}
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                >
                  <Layers size={15} />
                  <span>Card List View</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                >
                  <MapIcon size={15} />
                  <span>Interactive Map View</span>
                </button>
              </div>
            </div>

            {/* STAGE 1: SUCCESSFUL BLOOD BANK STOCK FOUND */}
            {searchResult.stage === 'STAGE_1_BLOOD_BANKS' && (
              <div>
                {/* Stage 1 Success Alert */}
                <div style={{
                  background: 'var(--medical-green-light)',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.75rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{
                    background: 'var(--medical-green)',
                    color: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="stage-badge stage-badge-bank">STAGE 1: BLOOD BANK STOCK FOUND</span>
                      <span className="badge badge-success">Sufficient Stock Available</span>
                    </div>
                    <div style={{ fontWeight: '700', color: 'var(--slate-900)', fontSize: '1.1rem' }}>
                      {searchResult.message}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                      You can directly coordinate with the blood bank for instant clinical reservation or emergency dispatch.
                    </p>
                  </div>
                </div>

                {viewMode === 'map' ? (
                  <div style={{ height: '550px', marginBottom: '2rem' }}>
                    <MapView
                      userLocation={userCoords}
                      radiusKm={searchResult.query.radius}
                      bloodBanks={searchResult.bloodBanks}
                      height="550px"
                    />
                  </div>
                ) : (
                  <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
                    {searchResult.bloodBanks.map((item, idx) => (
                      <BloodBankCard
                        key={idx}
                        item={item}
                        onRequest={handleRequestBloodBank}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 2: AUTOMATIC DONOR FALLBACK ACTIVATED */}
            {searchResult.stage === 'STAGE_2_DONOR_FALLBACK' && (
              <div>
                {/* Fallback Notice Banner verbatim as specified in prompt section 7 */}
                <div className="fallback-alert-banner">
                  <div style={{
                    background: 'var(--primary-600)',
                    color: 'white',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)'
                  }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="stage-badge stage-badge-donor">
                        STAGE 2: AUTOMATIC DONOR FALLBACK
                      </span>
                      <span className="badge badge-danger">Insufficient Bank Stock</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '0.35rem' }}>
                      No sufficient blood stock was found in nearby blood banks.
                    </h3>
                    <div style={{ fontSize: '0.98rem', fontWeight: '600', color: 'var(--primary-700)', marginBottom: '0.5rem' }}>
                      Searching registered voluntary donors near you...
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      {searchResult.reason} Our AI matching engine has ranked nearby compatible voluntary donors
                      by proximity decay, biological compatibility, and donation intervals.
                    </p>
                  </div>
                </div>

                {/* Donors List or Map */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={20} color="var(--medical-green)" />
                      <span>Nearby Matching Voluntary Donors ({searchResult.donors?.length || 0})</span>
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                      🔒 Donor privacy preserved: Exact coordinates & phone shielded until request accepted
                    </span>
                  </div>

                  {viewMode === 'map' ? (
                    <div style={{ height: '550px', marginBottom: '2rem' }}>
                      <MapView
                        userLocation={userCoords}
                        radiusKm={searchResult.query.radius}
                        bloodBanks={searchResult.partialBloodBanks || []}
                        donors={searchResult.donors || []}
                        height="550px"
                      />
                    </div>
                  ) : (
                    <div className="grid-3">
                      {searchResult.donors?.map((donor, idx) => (
                        <DonorCard
                          key={idx}
                          donor={donor}
                          onSendRequest={handleSendDonorRequest}
                          onViewAIReport={openAIReport}
                          isRequestSent={sentRequests[donor._id]}
                          sending={sendingDonorId === donor._id}
                        />
                      ))}
                    </div>
                  )}

                  {(!searchResult.donors || searchResult.donors.length === 0) && (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                      <Users size={36} color="var(--slate-400)" style={{ margin: '0 auto 1rem auto' }} />
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>No Registered Donors in Radius</h4>
                      <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                        We could not find active registered voluntary donors within {searchResult.query.radius} km.
                        Try expanding your search radius to 30km or broadcasting an Emergency SOS alert.
                      </p>
                      <Link to="/emergency-sos" className="btn btn-emergency btn-md">
                        Broadcast Emergency SOS
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Match Modal */}
        <AIMatchModal
          donor={selectedDonorForAI}
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default FindBlood;
