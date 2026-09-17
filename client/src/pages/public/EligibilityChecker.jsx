import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, Heart, ArrowRight, RotateCcw } from 'lucide-react';
import api from '../../utils/api';

const EligibilityChecker = () => {
  const [formData, setFormData] = useState({
    age: 25,
    weightKg: 65,
    lastDonatedMonthsAgo: 4,
    hasRecentTattooOrPiercing: false,
    hadFeverOrInfectionPastWeek: false,
    hasChronicCondition: false,
    isPregnantOrNursing: false
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10) || 0
    }));
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/ai/screening-guide', formData);
      setResult(res);
    } catch (err) {
      // Local evaluation fallback
      let eligible = true;
      const notes = [];

      if (formData.age < 18 || formData.age > 65) {
        eligible = false;
        notes.push('Standard voluntary donation age requirement is typically 18 to 65 years.');
      }
      if (formData.weightKg < 50) {
        eligible = false;
        notes.push('Minimum weight for whole blood donation is 50 kg to ensure donor comfort and safety.');
      }
      if (formData.lastDonatedMonthsAgo < 3) {
        eligible = false;
        notes.push('Standard recovery interval is 90 days (3 months) for whole blood donation.');
      }
      if (formData.hasRecentTattooOrPiercing) {
        eligible = false;
        notes.push('Tattoos or piercings within the past 6-12 months require temporary deferral.');
      }
      if (formData.hadFeverOrInfectionPastWeek) {
        eligible = false;
        notes.push('Active fever, cold, or acute antibiotic treatment requires full recovery prior to donation.');
      }

      setResult({
        eligible: eligible && !formData.hasChronicCondition && !formData.isPregnantOrNursing,
        screeningNotes: notes.length > 0 ? notes : ['You appear to meet initial informational screening criteria!'],
        disclaimer: 'This informational screening is not a clinical diagnosis. Final medical qualification is certified by on-site healthcare professionals.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      age: 25,
      weightKg: 65,
      lastDonatedMonthsAgo: 4,
      hasRecentTattooOrPiercing: false,
      hadFeverOrInfectionPastWeek: false,
      hasChronicCondition: false,
      isPregnantOrNursing: false
    });
  };

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.88rem' }}>
            Informational Self-Screening
          </span>
          <h1 style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Am I Eligible to Donate Blood?
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Quick 60-second interactive screening assessment to check standard donor readiness
            prior to visiting a blood bank or registering as an active voluntary donor.
          </p>
        </div>

        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <form onSubmit={handleEvaluate} className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Your Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="16"
                  max="80"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Body Weight (kg)</label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleChange}
                  min="35"
                  max="160"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Months Since Your Last Blood Donation</label>
              <input
                type="number"
                name="lastDonatedMonthsAgo"
                value={formData.lastDonatedMonthsAgo}
                onChange={handleChange}
                min="0"
                max="60"
                className="form-control"
                required
              />
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                Enter 12+ if you have never donated or cannot recall.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', margin: '1.5rem 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="hasRecentTattooOrPiercing"
                  checked={formData.hasRecentTattooOrPiercing}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                />
                <span>Received a tattoo, piercing, or acupuncture in the past 6 months</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="hadFeverOrInfectionPastWeek"
                  checked={formData.hadFeverOrInfectionPastWeek}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                />
                <span>Had active fever, influenza symptoms, or dental surgery in past 7 days</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="hasChronicCondition"
                  checked={formData.hasChronicCondition}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                />
                <span>History of cardiac condition, uncontrolled hypertension, or hepatitis</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isPregnantOrNursing"
                  checked={formData.isPregnantOrNursing}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
                />
                <span>Currently pregnant or lactating (within 6 months post-partum)</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary btn-md" style={{ flex: 1 }} disabled={loading}>
                <CheckCircle2 size={18} />
                <span>{loading ? 'Evaluating Readiness...' : 'Evaluate Informational Eligibility'}</span>
              </button>
              <button type="button" onClick={handleReset} className="btn btn-secondary btn-md">
                <RotateCcw size={16} />
              </button>
            </div>
          </form>

          {/* Assessment Result Card */}
          {result && (
            <div className="card" style={{
              borderLeft: `6px solid ${result.eligible ? 'var(--medical-green)' : 'var(--warning-amber)'}`,
              padding: '2rem',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                {result.eligible ? (
                  <div style={{ background: 'var(--medical-green-light)', color: 'var(--medical-green-dark)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={24} />
                  </div>
                ) : (
                  <div style={{ background: 'var(--warning-light)', color: 'var(--warning-dark)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={24} />
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.35rem' }}>
                    {result.eligible ? 'Initial Screening: Highly Likely Eligible' : 'Initial Screening: Temporary Deferral Advised'}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    Based on standard national blood transfusion guidelines
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--slate-800)' }}>Guideline Notes:</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                  {result.screeningNotes?.map((note, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: result.eligible ? 'var(--medical-green)' : 'var(--warning-amber)', fontWeight: 'bold' }}>•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="medical-disclaimer-box" style={{ background: 'var(--slate-50)', color: 'var(--slate-600)', borderColor: 'var(--slate-200)' }}>
                <strong>⚠️ Non-Diagnostic Disclaimer:</strong> {result.disclaimer}
              </div>

              {result.eligible && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <Link to="/become-donor" className="btn btn-primary btn-md">
                    <Heart size={16} />
                    <span>Join Voluntary Donor Registry</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;
