import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './i18n/i18n';

// Shared Layout Components
import { Header } from './components/Header';
import { SideDrawer } from './components/SideDrawer';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { EligibilityModal } from './components/EligibilityModal';

import { ChatbotWidget } from './components/ChatbotWidget';

// Pages
import { Home } from './pages/Home';
import { ServicesDirectory } from './pages/ServicesDirectory';
import { ServiceDetail } from './pages/ServiceDetail';
import { Schemes } from './pages/Schemes';
import { Departments } from './pages/Departments';
import { TrackApplication } from './pages/TrackApplication';
import { LodgeGrievance } from './pages/LodgeGrievance';
import { HelpFaqs } from './pages/HelpFaqs';
import { AboutSetu } from './pages/AboutSetu';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { ApplyStepper } from './pages/ApplyStepper';
import { Dashboard } from './pages/Dashboard';
import { MyProfile } from './pages/MyProfile';
import { DocumentVault } from './pages/DocumentVault';
import { ConsentDashboard } from './pages/ConsentDashboard';
import { AdminHealthMonitor } from './pages/AdminHealthMonitor';
import { AdminAuditLogs } from './pages/AdminAuditLogs';

export const AppContent: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#F5F8FC]">
        {/* Sticky Header */}
        <Header
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* Sliding Side Drawer */}
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenEligibility={() => setIsEligibilityOpen(true)}
        />

        {/* Global Modals */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
        <EligibilityModal
          isOpen={isEligibilityOpen}
          onClose={() => setIsEligibilityOpen(false)}
        />

        {/* Main Page Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onOpenEligibility={() => setIsEligibilityOpen(true)} />} />
            <Route path="/services" element={<ServicesDirectory />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/schemes" element={<Schemes onOpenEligibility={() => setIsEligibilityOpen(true)} />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/track" element={<TrackApplication />} />
            <Route path="/grievances" element={<LodgeGrievance />} />
            <Route path="/help" element={<HelpFaqs />} />
            <Route path="/about" element={<AboutSetu />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/apply/:code" element={<ApplyStepper />} />
            
            {/* Secured Citizen Area */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/vault" element={<DocumentVault />} />
            <Route path="/consents" element={<ConsentDashboard />} />

            {/* Admin Suite */}
            <Route path="/admin/health" element={<AdminHealthMonitor />} />
            <Route path="/admin/audit" element={<AdminAuditLogs />} />

            <Route path="*" element={<Home onOpenEligibility={() => setIsEligibilityOpen(true)} />} />
          </Routes>
        </main>

        {/* AI Assistant Chatbot */}
        <ChatbotWidget />

        {/* Footer with thin emerald line & academic banner on every page */}
        <Footer />
      </div>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
