import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, PlusCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const DonationCamps = () => {
  const [camps] = useState([
    {
      id: 1,
      title: 'PSG Tech Campus Voluntary Blood Donation Drive',
      location: 'PSG College of Technology, Peelamedu',
      date: 'Saturday, 28th September 2026',
      time: '9:00 AM - 4:00 PM',
      targetUnits: 150,
      collectedUnits: 45,
      organizer: 'PSG Hospitals Blood Bank'
    },
    {
      id: 2,
      title: 'Rotary Metro Community Blood Camp',
      location: 'Rotary Community Hall, R.S. Puram, Coimbatore',
      date: 'Sunday, 5th October 2026',
      time: '8:30 AM - 2:00 PM',
      targetUnits: 100,
      collectedUnits: 0,
      organizer: 'Rotary Metro Life Blood Bank'
    },
    {
      id: 3,
      title: 'KMCH Annual Corporate Donor Camp',
      location: 'TIDEL Park Coimbatore, Civil Aerodrome Post',
      date: 'Wednesday, 15th October 2026',
      time: '10:00 AM - 5:00 PM',
      targetUnits: 200,
      collectedUnits: 0,
      organizer: 'KMCH Hospital Blood Center'
    }
  ]);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/bank/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem' }}>Blood Donation Drives & Mobile Camps</h1>
              <p style={{ color: 'var(--slate-600)' }}>
                Scheduled community collection events to replenish regional inventory reserves.
              </p>
            </div>
            <button onClick={() => alert('Camp scheduling form opened.')} className="btn btn-primary btn-md">
              <PlusCircle size={16} />
              <span>Schedule New Camp</span>
            </button>
          </div>
        </div>

        <div className="grid-3">
          {camps.map((camp) => (
            <div key={camp.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-600)', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
                  <Calendar size={15} />
                  <span>{camp.date}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{camp.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={15} color="var(--slate-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{camp.location}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                  ⏰ Hours: {camp.time} • Organizer: <strong>{camp.organizer}</strong>
                </div>

                {/* Progress */}
                <div style={{ background: 'var(--slate-100)', borderRadius: 'var(--radius-full)', height: '8px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ width: `${(camp.collectedUnits / camp.targetUnits) * 100}%`, background: 'var(--medical-green)', height: '100%' }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textAlign: 'right' }}>
                  {camp.collectedUnits} / {camp.targetUnits} Target Units
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '1rem', marginTop: '1rem' }}>
                <button onClick={() => alert(`Registered for ${camp.title}`)} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  Manage Collection Staff
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationCamps;
