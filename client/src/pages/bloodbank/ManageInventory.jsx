import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Save, Plus, Minus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { BLOOD_GROUPS } from '../../utils/compatibility';

const ManageInventory = () => {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [bankId, setBankId] = useState(null);
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Determine bank ID
    const fetchBankData = async () => {
      let bId = user?.profile?._id;
      if (!bId) {
        const banksRes = await api.get('/blood-banks');
        if (banksRes.bloodBanks?.length > 0) {
          bId = banksRes.bloodBanks[0]._id;
        }
      }
      setBankId(bId);

      if (bId) {
        const invRes = await api.get(`/inventory/${bId}`);
        const invMap = {};
        BLOOD_GROUPS.forEach(g => { invMap[g] = 0; });
        invRes.inventory?.forEach(item => {
          invMap[item.bloodGroup] = item.unitsAvailable;
        });
        setInventory(invMap);
      }
      setLoading(false);
    };

    fetchBankData();
  }, [user]);

  const handleAdjust = (group, delta) => {
    setInventory(prev => ({
      ...prev,
      [group]: Math.max(0, (prev[group] || 0) + delta)
    }));
  };

  const handleInputChange = (group, val) => {
    const parsed = parseInt(val, 10);
    setInventory(prev => ({
      ...prev,
      [group]: isNaN(parsed) ? 0 : Math.max(0, parsed)
    }));
  };

  const handleSaveAll = async () => {
    if (!bankId) return;
    setSaving(true);
    try {
      const bulkUpdates = Object.keys(inventory).map(g => ({
        bloodGroup: g,
        unitsAvailable: inventory[g],
        componentType: 'Whole Blood'
      }));

      const res = await api.patch(`/inventory/${bankId}`, { bulkUpdates });
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Inventory Synchronized',
          message: 'All 8 blood group unit balances updated in real-time registry.'
        });
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Update Failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>Loading live stock matrix...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/bank/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem' }}>Manage Blood Stock Matrix</h1>
              <p style={{ color: 'var(--slate-600)' }}>
                Update available units for all 8 blood groups. Adjustments immediately impact Stage 1 search queries.
              </p>
            </div>

            <button onClick={handleSaveAll} className="btn btn-primary btn-md" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Synchronizing Reserves...' : 'Save All Quantities'}</span>
            </button>
          </div>
        </div>

        {/* 8-Group Interactive Matrix */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {BLOOD_GROUPS.map((bg) => {
            const units = inventory[bg] || 0;
            const isLow = units < 3;

            return (
              <div
                key={bg}
                className="card"
                style={{
                  border: isLow ? '2px solid #fca5a5' : '1px solid var(--slate-200)',
                  background: isLow ? '#fef2f2' : 'white',
                  textAlign: 'center',
                  padding: '1.75rem 1.25rem'
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: isLow ? 'var(--primary-700)' : 'var(--slate-900)', marginBottom: '0.5rem' }}>
                  {bg}
                </div>

                {/* Counter Input with +/- Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '1rem 0' }}>
                  <button
                    type="button"
                    onClick={() => handleAdjust(bg, -1)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid var(--slate-300)',
                      background: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={units}
                    onChange={(e) => handleInputChange(bg, e.target.value)}
                    style={{
                      width: '70px',
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      border: '1.5px solid var(--slate-300)',
                      borderRadius: '8px',
                      padding: '4px'
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => handleAdjust(bg, 1)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid var(--slate-300)',
                      background: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div style={{ fontSize: '0.8rem', color: isLow ? 'var(--primary-700)' : 'var(--slate-500)' }}>
                  {units === 0 ? '⚠️ Zero Stock (Triggers Fallback)' : units < 3 ? '⚠️ Low Buffer' : '✓ Sufficient Buffer'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Guidance Box */}
        <div className="card" style={{ background: 'var(--slate-50)', padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={18} color="var(--accent-cyan)" />
            <span>Two-Stage Search Interoperability Notice</span>
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
            When a patient searches for blood, BloodConnect 360 immediately queries these exact units.
            If your facility has at least the requested units of that specific group, your center is returned in <strong>Stage 1</strong>.
            If units across all nearby blood banks are zero or less than required, the system automatically triggers <strong>Stage 2: Voluntary Donor Fallback</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageInventory;
