import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompanyAuthProvider } from './context/CompanyAuthContext';
import { CreatorAuthProvider } from './context/CreatorAuthContext';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Overview from './pages/Overview';
import Company from './pages/Company';
import ComingSoon from './pages/ComingSoon';
import CompanyLogin from './pages/company/CompanyLogin';
import CompanySignup from './pages/company/CompanySignup';
import CompanyLayout from './layouts/CompanyLayout';

import CreatorLogin from './pages/creator/CreatorLogin';
import CreatorSignupFlow from './pages/creator/CreatorSignupFlow';
import CreatorLayout from './layouts/CreatorLayout';
import CreatorDashboard from './pages/creator/CreatorDashboard';
import AdminCreators from './pages/AdminCreators';
import AdminCreatorDetails from './pages/AdminCreatorDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CompanyAuthProvider>
          <CreatorAuthProvider>
            <Routes>
              {/* Admin Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Overview />} />
              <Route path="company" element={<Company />} />
              <Route path="users" element={<ComingSoon />} />
              <Route path="profiles" element={<AdminCreators />} />
              <Route path="profiles/:id" element={<AdminCreatorDetails />} />
              <Route path="casting" element={<ComingSoon />} />
              <Route path="bookings" element={<ComingSoon />} />
              <Route path="payments" element={<ComingSoon />} />
              <Route path="subscriptions" element={<ComingSoon />} />
              <Route path="wallet" element={<ComingSoon />} />
              <Route path="boost" element={<ComingSoon />} />
              <Route path="reviews" element={<ComingSoon />} />
              <Route path="analytics" element={<ComingSoon />} />
              <Route path="cms" element={<Overview />} />
              <Route path="settings" element={<ComingSoon />} />
              <Route path="help" element={<ComingSoon />} />
            </Route>

            {/* Company Routes */}
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/company/signup" element={<CompanySignup />} />
            <Route path="/company/dashboard" element={<CompanyLayout />}>
              <Route index element={<Overview />} />
              <Route path="find-talent" element={<ComingSoon />} />
              <Route path="casting" element={<ComingSoon />} />
              <Route path="talent-cart" element={<ComingSoon />} />
              <Route path="hires" element={<ComingSoon />} />
              <Route path="inbox" element={<ComingSoon />} />
              <Route path="wallet" element={<ComingSoon />} />
              <Route path="subscription" element={<ComingSoon />} />
              <Route path="profile" element={<ComingSoon />} />
              <Route path="settings" element={<ComingSoon />} />
              <Route path="help" element={<ComingSoon />} />
            </Route>

            {/* Creator Routes */}
            <Route path="/creator/login" element={<CreatorLogin />} />
            <Route path="/creator/onboarding" element={<CreatorSignupFlow />} />
            
            <Route path="/creator/dashboard" element={<CreatorLayout />}>
              <Route index element={<CreatorDashboard />} />
              <Route path="portfolio" element={<ComingSoon />} />
              <Route path="casting" element={<ComingSoon />} />
              <Route path="applications" element={<ComingSoon />} />
              <Route path="bookings" element={<ComingSoon />} />
              <Route path="inbox" element={<ComingSoon />} />
              <Route path="wallet" element={<ComingSoon />} />
              <Route path="earnings" element={<ComingSoon />} />
              <Route path="subscription" element={<ComingSoon />} />
              <Route path="profile" element={<ComingSoon />} />
              <Route path="settings" element={<ComingSoon />} />
              <Route path="help" element={<ComingSoon />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </CreatorAuthProvider>
        </CompanyAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
