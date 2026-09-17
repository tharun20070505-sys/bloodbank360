import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom colored markers with SVG icons
const createCustomIcon = (color, labelText, emoji) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        color: white;
        border: 2px solid white;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        position: relative;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
};

const userIcon = createCustomIcon('#2563eb', 'YOU', '📍');
const bankIcon = createCustomIcon('#dc2626', 'BANK', '🏥');
const donorIcon = createCustomIcon('#10b981', 'DONOR', '👤');

// Recenter Map Helper
const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
};

const MapView = ({
  center = [11.0168, 76.9558], // default Coimbatore [lat, lng]
  zoom = 13,
  radiusKm = 15,
  userLocation = null,
  bloodBanks = [],
  donors = [],
  height = '480px',
  onSelectEntity = null
}) => {
  // Center is [lat, lng]
  const mapCenter = userLocation || center;

  return (
    <div style={{ height, width: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--slate-200)' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <MapRecenter center={mapCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker & Radius Circle */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div style={{ padding: '4px' }}>
                  <strong style={{ color: '#2563eb', display: 'block', marginBottom: '4px' }}>
                    📍 Your Search Location
                  </strong>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    Search Radius: {radiusKm} km boundary
                  </div>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={userLocation}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 1.5,
                dashArray: '4, 6'
              }}
            />
          </>
        )}

        {/* Blood Banks Markers */}
        {bloodBanks.map((item, idx) => {
          const bank = item.bloodBank || item;
          // Coordinates in GeoJSON are [longitude, latitude] -> Leaflet requires [latitude, longitude]
          const coords = bank.location?.coordinates
            ? [bank.location.coordinates[1], bank.location.coordinates[0]]
            : null;

          if (!coords || !coords[0] || !coords[1]) return null;

          return (
            <Marker key={bank._id || idx} position={coords} icon={bankIcon}>
              <Popup>
                <div style={{ maxWidth: '240px', padding: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px' }}>🏥</span>
                    <strong style={{ color: '#0f172a', fontSize: '13px' }}>{bank.name}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                    {bank.address}, {bank.city}
                  </div>
                  {item.availableUnits !== undefined && (
                    <div style={{
                      display: 'inline-block',
                      background: item.sufficientForRequest ? '#ecfdf5' : '#fffbeb',
                      color: item.sufficientForRequest ? '#047857' : '#b45309',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '11px',
                      marginBottom: '6px'
                    }}>
                      Stock: {item.availableUnits} Units Available
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>
                    📞 {bank.phone || bank.helpline || 'Available 24/7'}
                  </div>
                  {bank.distanceKm !== undefined && (
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#dc2626' }}>
                      Approx. {bank.distanceKm} km away
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Fallback Donors Markers (Privacy-Preserved Coordinates) */}
        {donors.map((donor, idx) => {
          const rawCoords = donor.approximateLocation?.coordinates || donor.location?.coordinates;
          // [longitude, latitude] -> [latitude, longitude]
          const coords = rawCoords ? [rawCoords[1], rawCoords[0]] : null;
          if (!coords || !coords[0] || !coords[1]) return null;

          return (
            <React.Fragment key={donor._id || idx}>
              <Marker position={coords} icon={donorIcon}>
                <Popup>
                  <div style={{ maxWidth: '230px', padding: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px' }}>👤</span>
                      <strong style={{ color: '#0f172a', fontSize: '13px' }}>
                        {donor.pseudoName || `Donor #${donor._id.toString().slice(-4)}`}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <span style={{
                        background: '#fee2e2',
                        color: '#991b1b',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {donor.bloodGroup}
                      </span>
                      {donor.aiCompatibilityScore && (
                        <span style={{
                          background: '#ecfdf5',
                          color: '#065f46',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          {donor.aiCompatibilityScore}% AI Match
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                      Approx. {donor.distanceKm} km away • {donor.city}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>
                      🛡️ Exact location protected for privacy
                    </div>
                  </div>
                </Popup>
              </Marker>
              {/* Privacy Fuzzing Circle (Approximate neighborhood) */}
              <Circle
                center={coords}
                radius={800} // 800 meter approximate fuzzing radius
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#10b981',
                  fillOpacity: 0.08,
                  weight: 1,
                  dashArray: '2, 4'
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
