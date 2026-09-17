import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ShieldAlert, MapPin, Building2, Droplet, ArrowRight, ArrowLeft } from 'lucide-react';
import { BLOOD_GROUPS } from '../../utils/compatibility';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const CreateBloodRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  const prefill = location.state || {};

  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState(prefill.prefillBank?.name || 'Coimbatore Medical College Hospital');
  const [bloodGroup, setBloodGroup] = useState(prefill.bloodGroup || 'O+');
  const [unitsRequired, setUnitsRequired] = useState(prefill.units || 1);
  const [address, setAddress] = useState(prefill.prefillBank?.address || 'Sungam Bypass, Trichy Road, Ward 4');
  const [radius, setRadius] = useState(15);
  const [emergency, setEmergency] = useState(prefill.emergency || false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        patientName,
        hospitalName,
        bloodGroup,
        unitsRequired: parseInt(unitsRequired, 10),
        address,
        radius: parseInt(radius, 10),
        emergency,
        latitude: 11.0168,
        longitude: 76.9558,
        notes
      };

      const res = await api.post('/requests', payload);
      if (res.success && res.request) {
        addToast({
          type: emergency ? 'emergency' : 'success',
          title: 'Request Established',
          message: `Two-stage evaluation completed. Current stage: ${res.request.fulfillmentStage}`
        });

        navigate(`/patient/requests/${res.request._id}`);
      }
    } catch (err) {
      addToast({
        type: 'emergency',
        title: 'Submission Failed',
        message: err.message || 'Could not register blood request.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '720px' }}>
        <Link to="/patient/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem' }}>Create Official Blood Request</h1>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem' }}>
              The system will first evaluate local verified blood bank inventory, automatically activating nearby voluntary donors if units are insufficient.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Meenakshi"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital / Healthcare Facility *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KMCH Heart & Trauma Wing"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Required Blood Group *</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="form-control"
                  style={{ fontWeight: '800', color: 'var(--primary-700)' }}
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Required Units (Pints) *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={unitsRequired}
                  onChange={(e) => setUnitsRequired(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Ward / Bed / Delivery Location *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
                placeholder="e.g. ICU Ward 3, 2nd Floor, Room 204"
              />
            </div>

            <div className="grid-2" style={{ alignItems: 'center', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Search Radius</label>
                  <span style={{ fontWeight: '700', color: 'var(--primary-600)' }}>{radius} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--primary-600)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="reqEmergency"
                  checked={emergency}
                  onChange={(e) => setEmergency(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                />
                <label htmlFor="reqEmergency" style={{ fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', color: emergency ? 'var(--primary-600)' : 'var(--slate-700)' }}>
                  Mark as Emergency Priority
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Clinical Diagnostic Notes / Instructions</label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control"
                placeholder="e.g. Patient scheduled for elective cardiac bypass surgery tomorrow morning."
              />
            </div>

            <button type="submit" className={`btn ${emergency ? 'btn-emergency' : 'btn-primary'} btn-lg`} style={{ width: '100%' }} disabled={submitting}>
              <span>{submitting ? 'Executing Evaluation...' : 'Submit Request & Evaluate Availability'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBloodRequest;
