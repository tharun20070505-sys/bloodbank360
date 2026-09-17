import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Smartphone,
  Download,
  Apple,
  Chrome,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Zap,
  Bell,
  WifiOff,
  Navigation,
  ExternalLink,
  Terminal,
  Layers,
  ArrowRight,
  Monitor
} from 'lucide-react';

const DownloadApp = () => {
  const [activeTab, setActiveTab] = useState('laptop');
  const [detectedPlatform, setDetectedPlatform] = useState('mac');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [hostUrl, setHostUrl] = useState('');

  useEffect(() => {
    // Detect user agent
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setDetectedPlatform('ios');
      setActiveTab('mobile');
    } else if (/android/.test(ua)) {
      setDetectedPlatform('android');
      setActiveTab('mobile');
    } else if (/mac/.test(ua)) {
      setDetectedPlatform('mac');
      setActiveTab('laptop');
    } else if (/win/.test(ua)) {
      setDetectedPlatform('windows');
      setActiveTab('laptop');
    } else {
      setDetectedPlatform('desktop');
      setActiveTab('laptop');
    }

    setHostUrl(window.location.origin);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install on your current browser: Click the Install icon (computer with down arrow) in your browser address bar, or tap Menu (⋮) -> Install BloodBank 360.');
    }
  };

  return (
    <div className="page-wrapper" style={{ background: '#f8fafc', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 70%, #3b0764 100%)',
        color: 'white',
        padding: '4rem 1.5rem 5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.25) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div className="app-container" style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: '#fca5a5',
            marginBottom: '1.25rem'
          }}>
            <Zap size={16} color="#ef4444" />
            <span>Cross-Platform Native & PWA Experience</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            color: 'white',
            letterSpacing: '-0.02em',
            marginBottom: '1rem'
          }}>
            Download BloodBank 360 <br />
            <span style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              For Mobile & Laptop
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            maxWidth: '620px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Install our dedicated app on your <strong>Mac/PC laptop</strong> or your <strong>Android/iPhone</strong>.
            Enjoy instant offline access, real-time dispatch tracking, and critical SOS alerts without opening a browser.
          </p>

          {/* Platform Switcher Tabs */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '6px',
            gap: '6px'
          }}>
            <button
              onClick={() => setActiveTab('laptop')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.75rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'laptop' ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'transparent',
                color: activeTab === 'laptop' ? 'white' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'laptop' ? '0 4px 12px rgba(220, 38, 38, 0.4)' : 'none'
              }}
            >
              <Laptop size={18} />
              <span>Laptop / Desktop</span>
            </button>

            <button
              onClick={() => setActiveTab('mobile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1.75rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'mobile' ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'transparent',
                color: activeTab === 'mobile' ? 'white' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'mobile' ? '0 4px 12px rgba(220, 38, 38, 0.4)' : 'none'
              }}
            >
              <Smartphone size={18} />
              <span>Mobile (Phone/Tablet)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Tab Contents */}
      <div className="app-container" style={{ maxWidth: '960px', marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        {activeTab === 'laptop' ? (
          /* ================= LAPTOP / DESKTOP TAB ================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Primary Option: Desktop Standalone PWA */}
            <div className="card" style={{ padding: '2.5rem', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)'
                }}>
                  <Monitor size={26} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '800' }}>
                    1-Click Desktop App (macOS & Windows)
                  </h2>
                  <div style={{ fontSize: '0.88rem', color: 'var(--slate-500)' }}>
                    Runs in its own standalone window directly from your Dock / Taskbar
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--slate-600)', lineHeight: '1.6', fontSize: '0.98rem', marginBottom: '1.75rem' }}>
                Install <strong>BloodBank 360</strong> as an official desktop app on your MacBook, iMac, or Windows PC.
                It runs with native window controls, launch icons in your Applications folder, and complete offline capability.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                  onClick={handleInstallClick}
                  className="btn btn-primary btn-lg"
                  style={{
                    padding: '0.85rem 1.85rem',
                    fontSize: '1rem',
                    fontWeight: '800',
                    boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)'
                  }}
                >
                  <Download size={20} />
                  <span>INSTALL ON LAPTOP NOW</span>
                </button>

                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="var(--emerald-600)" />
                  <span>Compatible with macOS 10.15+, Windows 10/11 & Linux</span>
                </div>
              </div>

              {/* Step by Step Desktop Guides */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
                background: 'var(--slate-50)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid var(--slate-200)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '0.95rem', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                    <Chrome size={18} color="#2563eb" />
                    <span>Google Chrome / Brave</span>
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
                    <li>Look at the top-right of your address bar for the <strong>Install icon</strong> (computer monitor with down arrow).</li>
                    <li>Click <strong>Install BloodBank 360</strong>.</li>
                    <li>The app will launch in its own desktop window and save to your Mac Applications or Windows Start Menu!</li>
                  </ol>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '0.95rem', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                    <Monitor size={18} color="#0284c7" />
                    <span>Microsoft Edge</span>
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
                    <li>Click the <strong>App available</strong> icon in the address bar.</li>
                    <li>Click <strong>Install</strong>.</li>
                    <li>Choose whether to pin to Taskbar or create Desktop shortcut.</li>
                  </ol>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '0.95rem', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                    <Apple size={18} color="#000000" />
                    <span>macOS Safari</span>
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
                    <li>In the Safari menu bar, click <strong>File</strong>.</li>
                    <li>Select <strong>Add to Dock...</strong></li>
                    <li>Click <strong>Add</strong>. It now behaves like a native Mac .app!</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Option 2: Native Electron Desktop Developer Mode */}
            <div className="card" style={{ padding: '2rem', borderLeft: '4px solid var(--primary-600)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <Terminal size={22} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '800' }}>
                  Native Desktop App Launcher (Electron / Node)
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5', marginBottom: '1rem' }}>
                If you are running the project source code on your laptop, you can launch BloodBank 360 directly in native desktop mode with hot-reloading:
              </p>

              <div style={{
                background: '#0f172a',
                color: '#e2e8f0',
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                lineHeight: '1.6'
              }}>
                <div style={{ color: '#94a3b8' }}># 1. Open the project directory on your laptop:</div>
                <div style={{ color: '#4ade80' }}>cd "/Users/apple/Documents/mern portfolio/blood"</div>
                <div style={{ color: '#94a3b8', marginTop: '6px' }}># 2. Open directly in native desktop browser mode:</div>
                <div style={{ color: '#38bdf8' }}>npm start & open http://localhost:5173</div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= MOBILE TAB ================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2.5rem', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}>
              <div className="responsive-2col">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)'
                    }}>
                      <Smartphone size={26} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '800' }}>
                        Mobile Phone App (Android & iPhone)
                      </h2>
                      <div style={{ fontSize: '0.88rem', color: 'var(--slate-500)' }}>
                        Optimized for touch with native bottom tab navigation
                      </div>
                    </div>
                  </div>

                  <p style={{ color: 'var(--slate-600)', lineHeight: '1.6', fontSize: '0.98rem', marginBottom: '1.5rem' }}>
                    Install BloodBank 360 directly onto your smartphone.
                    Includes full touch gestures, bottom navigation bar, GPS route directions, scannable QR passes, and emergency dispatch alerts.
                  </p>

                  <div style={{
                    background: 'var(--slate-50)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    border: '1px solid var(--slate-200)',
                    marginBottom: '1.5rem'
                  }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--slate-800)' }}>
                      Quick Install Instructions:
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
                      <li><strong>Android (Chrome)</strong>: Tap the <strong>"Install App"</strong> prompt at the bottom of the screen, or tap Menu (⋮) $\rightarrow$ <em>Add to Home screen</em>.</li>
                      <li><strong>iPhone (Safari)</strong>: Tap the <strong>Share icon</strong> (box with arrow up) at the bottom $\rightarrow$ scroll down and select <strong>"Add to Home Screen"</strong>.</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleInstallClick}
                    className="btn btn-primary btn-lg"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      fontSize: '1rem',
                      fontWeight: '800',
                      boxShadow: '0 6px 20px rgba(220, 38, 38, 0.4)',
                      justifyContent: 'center'
                    }}
                  >
                    <Download size={20} />
                    <span>INSTALL ON THIS DEVICE</span>
                  </button>
                </div>

                {/* QR Code Quick Connect for Mobile */}
                <div style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                  border: '2px dashed var(--slate-300)',
                  borderRadius: '20px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--slate-800)', fontWeight: '800', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                    <QrCode size={18} color="var(--primary-600)" />
                    <span>Scan with Mobile Camera</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '1.25rem' }}>
                    Point your phone camera here to open and install instantly on your phone
                  </p>

                  <div style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 1.25rem',
                    background: 'white',
                    padding: '12px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                    border: '1px solid var(--slate-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* SVG QR Code */}
                    <svg viewBox="0 0 100 100" width="156" height="156">
                      <rect width="100" height="100" fill="white" />
                      <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                      <rect x="13" y="13" width="12" height="12" fill="#dc2626" rx="2" />

                      <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                      <rect x="75" y="13" width="12" height="12" fill="#dc2626" rx="2" />

                      <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                      <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                      <rect x="13" y="75" width="12" height="12" fill="#dc2626" rx="2" />

                      <rect x="40" y="10" width="6" height="12" fill="#0f172a" />
                      <rect x="52" y="10" width="8" height="6" fill="#0f172a" />
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

                  <span style={{
                    display: 'inline-block',
                    background: 'var(--emerald-50)',
                    color: 'var(--emerald-700)',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    ✓ Real-time Sync Active
                  </span>
                </div>
              </div>
            </div>

            {/* Native Mobile Build Scripts (Capacitor) */}
            <div className="card" style={{ padding: '2rem', borderLeft: '4px solid var(--primary-600)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <Terminal size={22} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '800' }}>
                  Native Android (APK) & iOS Project Generator (Capacitor)
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5', marginBottom: '1rem' }}>
                To export this web app into a native Android Studio APK package or iOS Xcode project, run:
              </p>

              <div style={{
                background: '#0f172a',
                color: '#e2e8f0',
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                lineHeight: '1.6'
              }}>
                <div style={{ color: '#94a3b8' }}># 1. Build web distribution package:</div>
                <div style={{ color: '#4ade80' }}>cd client && npm run build</div>
                <div style={{ color: '#94a3b8', marginTop: '6px' }}># 2. Add Android or iOS native platform:</div>
                <div style={{ color: '#38bdf8' }}>npx cap add android   # or: npx cap add ios</div>
                <div style={{ color: '#94a3b8', marginTop: '6px' }}># 3. Open in Android Studio to build APK:</div>
                <div style={{ color: '#facc15' }}>npx cap open android</div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Comparison Grid */}
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.75rem', color: 'var(--slate-900)' }}>
            Why Install the App on Both Devices?
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ color: 'var(--primary-600)', marginBottom: '0.75rem' }}>
                <Zap size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Instant Launch</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.5', margin: 0 }}>
                Launches in under 1 second from your desktop Dock or phone home screen without typing URLs or opening browser tabs.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ color: 'var(--emerald-600)', marginBottom: '0.75rem' }}>
                <WifiOff size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Offline Resilience</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.5', margin: 0 }}>
                Essential blood compatibility matrices, donor screening rules, and emergency guidelines remain cached and accessible during network drops.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ color: '#8b5cf6', marginBottom: '0.75rem' }}>
                <Navigation size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Mobile GPS & Route Tracking</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.5', margin: 0 }}>
                Direct integration with device GPS coordinates for live distance calculation, courier route turn-by-turn navigation, and donor proximity screening.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
