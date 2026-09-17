import React, { useState } from 'react';
import { Search, MapPin, AlertTriangle, Navigation, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { BLOOD_GROUPS } from '../utils/compatibility';

const PRESET_CITIES = [
  { name: 'Coimbatore (Gandhipuram)', lat: 11.0168, lng: 76.9558 },
  { name: 'Coimbatore (Peelamedu)', lat: 11.0264, lng: 77.0028 },
  { name: 'Coimbatore (Avanashi Road)', lat: 11.0321, lng: 77.0423 },
  { name: 'Chennai (Central)', lat: 13.0827, lng: 80.2707 },
  { name: 'Bangalore (Koramangala)', lat: 12.9352, lng: 77.6245 }
];

const SearchForm = ({ initialValues = {}, onSearch, loading = false }) => {
  const [bloodGroup, setBloodGroup] = useState(initialValues.bloodGroup || 'O+');
  const [units, setUnits] = useState(initialValues.units || 1);
  const [radius, setRadius] = useState(initialValues.radius || 15);
  const [emergency, setEmergency] = useState(initialValues.emergency || false);
  const [selectedCity, setSelectedCity] = useState(PRESET_CITIES[0].name);
  const [latitude, setLatitude] = useState(initialValues.latitude || PRESET_CITIES[0].lat);
  const [longitude, setLongitude] = useState(initialValues.longitude || PRESET_CITIES[0].lng);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Default Location: Coimbatore');

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const cityObj = PRESET_CITIES.find(c => c.name === cityName);
    if (cityObj) {
      setLatitude(cityObj.lat);
      setLongitude(cityObj.lng);
      setLocationStatus(`Preset: ${cityObj.name}`);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your current browser.');
      return;
    }
    setGpsLoading(true);
    setLocationStatus('Acquiring precise GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGpsLoading(false);
        setLocationStatus(`GPS Locked: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        setSelectedCity('My GPS Location');
      },
      (error) => {
        setGpsLoading(false);
        setLocationStatus('GPS access denied or unavailable. Using selected preset.');
        console.warn('Geolocation error:', error.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        bloodGroup,
        units: parseInt(units, 10),
        radius: parseInt(radius, 10),
        emergency,
        latitude,
        longitude
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ border: emergency ? '2px solid var(--primary-500)' : '1px solid var(--slate-200)' }}>
      {emergency && (
        <div style={{
          background: 'var(--primary-100)',
          color: 'var(--primary-800)',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '700',
          fontSize: '0.9rem'
        }}>
          <ShieldAlert size={20} color="var(--primary-600)" />
          <span>EMERGENCY MODE ACTIVE: High-priority immediate notification broadcast</span>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: '1rem' }}>
        {/* Blood Group */}
        <div className="form-group">
          <label className="form-label">Required Blood Group *</label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="form-control"
            style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary-700)' }}
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg} {['O-', 'AB-'].includes(bg) ? '★ (Critical/Rare)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Required Units */}
        <div className="form-group">
          <label className="form-label">Units Required (Pints) *</label>
          <input
            type="number"
            min="1"
            max="15"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="form-control"
            required
          />
        </div>
      </div>

      {/* Location Selector */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ margin: 0 }}>Search Location</label>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
            disabled={gpsLoading}
          >
            <Navigation size={14} color="var(--primary-600)" />
            {gpsLoading ? 'Detecting...' : 'Use My Current Location'}
          </button>
        </div>
        <select value={selectedCity} onChange={handleCityChange} className="form-control">
          {PRESET_CITIES.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
          {selectedCity === 'My GPS Location' && (
            <option value="My GPS Location">📍 My Live GPS Location</option>
          )}
        </select>
        <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '4px' }}>
          {locationStatus}
        </div>
      </div>

      {/* Radius Slider & Emergency Toggle */}
      <div className="grid-2" style={{ alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Search Radius</label>
            <span style={{ fontWeight: '700', color: 'var(--primary-600)', fontSize: '0.9rem' }}>
              {radius} km
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="40"
            step="1"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
          />
        </div>

        {/* Emergency Flag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
          <input
            type="checkbox"
            id="emergencyCheckbox"
            checked={emergency}
            onChange={(e) => setEmergency(e.target.checked)}
            style={{ width: '20px', height: '20px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
          />
          <label htmlFor="emergencyCheckbox" style={{ cursor: 'pointer', fontSize: '0.92rem', fontWeight: '600' }}>
            <span style={{ color: emergency ? 'var(--primary-600)' : 'var(--slate-700)' }}>
              Mark as Emergency Request (Immediate Priority)
            </span>
          </label>
        </div>
      </div>

      {/* Two-Stage Search Button */}
      <button
        type="submit"
        className={`btn ${emergency ? 'btn-emergency' : 'btn-primary'} btn-lg`}
        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.65rem' }}
        disabled={loading}
      >
        <Search size={20} />
        <span>{loading ? 'Executing Two-Stage Availability Check...' : 'SEARCH BLOOD (STAGE 1: BLOOD BANKS)'}</span>
      </button>

      <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
        🛡️ Automatic Stage 2 Donor Fallback activates automatically if stock is insufficient.
      </div>
    </form>
  );
};

export default SearchForm;
