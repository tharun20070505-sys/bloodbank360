import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import InstallAppBanner from './components/InstallAppBanner';
import MobileBottomNav from './components/MobileBottomNav';

// Public Pages
import Home from './pages/public/Home';
import FindBlood from './pages/public/FindBlood';
import BloodBanksFound from './pages/public/BloodBanksFound';
import FallbackDonors from './pages/public/FallbackDonors';
import MapExplorer from './pages/public/MapExplorer';
import HowItWorks from './pages/public/HowItWorks';
import About from './pages/public/About';
import CompatibilityGuide from './pages/public/CompatibilityGuide';
import EligibilityChecker from './pages/public/EligibilityChecker';
import BloodBanksList from './pages/public/BloodBanksList';
import BloodBankDetail from './pages/public/BloodBankDetail';
import EmergencySOS from './pages/public/EmergencySOS';
import BecomeDonor from './pages/public/BecomeDonor';
import Contact from './pages/public/Contact';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsDisclaimer from './pages/public/TermsDisclaimer';
import DownloadApp from './pages/public/DownloadApp';
import NotFound from './pages/public/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import CreateBloodRequest from './pages/patient/CreateBloodRequest';
import MyRequests from './pages/patient/MyRequests';
import RequestDetails from './pages/patient/RequestDetails';
import DonorFallbackView from './pages/patient/DonorFallbackView';
import PatientHistory from './pages/patient/PatientHistory';

// Donor Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import IncomingRequests from './pages/donor/IncomingRequests';
import RequestAction from './pages/donor/RequestAction';
import DonationHistory from './pages/donor/DonationHistory';
import DigitalDonorCard from './pages/donor/DigitalDonorCard';
import DonorSettings from './pages/donor/DonorSettings';

// Blood Bank Pages
import BloodBankDashboard from './pages/bloodbank/BloodBankDashboard';
import ManageInventory from './pages/bloodbank/ManageInventory';
import IncomingDispatches from './pages/bloodbank/IncomingDispatches';
import DispatchDetail from './pages/bloodbank/DispatchDetail';
import DonationCamps from './pages/bloodbank/DonationCamps';
import StockForecaster from './pages/bloodbank/StockForecaster';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyBloodBanks from './pages/admin/VerifyBloodBanks';
import ManageUsers from './pages/admin/ManageUsers';
import ManageRequests from './pages/admin/ManageRequests';
import AuditLogs from './pages/admin/AuditLogs';
import AISystemSettings from './pages/admin/AISystemSettings';

// Shared Pages
import NotificationsPage from './pages/shared/NotificationsPage';
import UserProfile from './pages/shared/UserProfile';
import AIMatchInsightsPage from './pages/shared/AIMatchInsightsPage';
import LiveTrackerPage from './pages/shared/LiveTrackerPage';
import BloodCompatibilityMatrixPage from './pages/shared/BloodCompatibilityMatrixPage';
import QuickDonorRegistrationPage from './pages/shared/QuickDonorRegistrationPage';

const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/find-blood" element={<FindBlood />} />
          <Route path="/search-results/banks" element={<BloodBanksFound />} />
          <Route path="/search-results/donors" element={<FallbackDonors />} />
          <Route path="/map-explorer" element={<MapExplorer />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/compatibility-guide" element={<CompatibilityGuide />} />
          <Route path="/eligibility-checker" element={<EligibilityChecker />} />
          <Route path="/blood-banks" element={<BloodBanksList />} />
          <Route path="/blood-banks/:id" element={<BloodBankDetail />} />
          <Route path="/emergency-sos" element={<EmergencySOS />} />
          <Route path="/become-donor" element={<BecomeDonor />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsDisclaimer />} />
          <Route path="/download-app" element={<DownloadApp />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']}><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/create-request" element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']}><CreateBloodRequest /></ProtectedRoute>} />
          <Route path="/patient/requests" element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']}><MyRequests /></ProtectedRoute>} />
          <Route path="/patient/requests/:id" element={<ProtectedRoute><RequestDetails /></ProtectedRoute>} />
          <Route path="/patient/requests/:id/donor-fallback" element={<ProtectedRoute><DonorFallbackView /></ProtectedRoute>} />
          <Route path="/patient/history" element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']}><PatientHistory /></ProtectedRoute>} />

          {/* Donor Routes */}
          <Route path="/donor/dashboard" element={<ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}><DonorDashboard /></ProtectedRoute>} />
          <Route path="/donor/requests" element={<ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}><IncomingRequests /></ProtectedRoute>} />
          <Route path="/donor/requests/:id" element={<ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}><RequestAction /></ProtectedRoute>} />
          <Route path="/donor/history" element={<ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}><DonationHistory /></ProtectedRoute>} />
          <Route path="/donor/card" element={<ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}><DigitalDonorCard /></ProtectedRoute>} />
          <Route path="/donor/settings" element={<ProtectedRoute allowedRoles={['DONOR', 'ADMIN']}><DonorSettings /></ProtectedRoute>} />

          {/* Blood Bank Routes */}
          <Route path="/bank/dashboard" element={<ProtectedRoute allowedRoles={['BLOOD_BANK', 'ADMIN']}><BloodBankDashboard /></ProtectedRoute>} />
          <Route path="/bank/inventory" element={<ProtectedRoute allowedRoles={['BLOOD_BANK', 'ADMIN']}><ManageInventory /></ProtectedRoute>} />
          <Route path="/bank/requests" element={<ProtectedRoute allowedRoles={['BLOOD_BANK', 'ADMIN']}><IncomingDispatches /></ProtectedRoute>} />
          <Route path="/bank/requests/:id" element={<ProtectedRoute allowedRoles={['BLOOD_BANK', 'ADMIN']}><DispatchDetail /></ProtectedRoute>} />
          <Route path="/bank/camps" element={<ProtectedRoute allowedRoles={['BLOOD_BANK', 'ADMIN']}><DonationCamps /></ProtectedRoute>} />
          <Route path="/bank/forecaster" element={<ProtectedRoute allowedRoles={['BLOOD_BANK', 'ADMIN']}><StockForecaster /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/blood-banks" element={<ProtectedRoute allowedRoles={['ADMIN']}><VerifyBloodBanks /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['ADMIN']}><ManageRequests /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AuditLogs /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><AISystemSettings /></ProtectedRoute>} />

          {/* Shared Routes */}
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/ai-insights" element={<AIMatchInsightsPage />} />
          <Route path="/live-tracker" element={<LiveTrackerPage />} />
          <Route path="/compatibility-matrix" element={<BloodCompatibilityMatrixPage />} />
          <Route path="/quick-donor-signup" element={<QuickDonorRegistrationPage />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <InstallAppBanner />
      <MobileBottomNav />
    </div>
  );
};

export default App;
