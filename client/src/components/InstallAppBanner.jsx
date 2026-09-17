import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, Share } from 'lucide-react';

const InstallAppBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already launched in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check localStorage if previously dismissed in this session
    const wasDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }

    // Listen for Chrome/Edge/Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect if on iOS Safari
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIos && !isStandalone) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show iOS step-by-step instructions
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isInstalled || dismissed || !isInstallable) {
    return null;
  }

  return (
    <>
      <aside aria-label="Install BloodBank 360 App" style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '380px',
        background: 'rgba(15, 23, 42, 0.96)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(220, 38, 38, 0.35)',
        borderRadius: '16px',
        padding: '1rem 1.15rem',
        boxShadow: '0 20px 35px -8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(239, 68, 68, 0.2)',
        color: 'white',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
          }}>
            <Smartphone size={22} color="white" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'white', letterSpacing: '-0.01em' }}>
                Install BloodBank 360
              </div>
              <button
                onClick={handleDismiss}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4', margin: '0 0 0.75rem 0' }}>
              Add to your home screen for quick offline blood dispatch & emergency SOS alerts.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleInstallClick}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.35)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Download size={14} />
                <span>Install App</span>
              </button>

              <button
                onClick={handleDismiss}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'white',
            color: 'var(--slate-900)',
            borderRadius: '20px',
            maxWidth: '360px',
            width: '100%',
            padding: '1.75rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Share size={26} />
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '800' }}>
              Install on iOS
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              To install <strong>BloodBank 360</strong> on your iPhone or iPad:
            </p>

            <div style={{
              textAlign: 'left',
              background: 'var(--slate-50)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              fontSize: '0.85rem',
              color: 'var(--slate-700)',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700', color: 'var(--primary-600)' }}>1.</span> Tap the <strong>Share</strong> button at bottom of Safari.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '700', color: 'var(--primary-600)' }}>2.</span> Scroll down and tap <strong>Add to Home Screen</strong>.
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallAppBanner;
