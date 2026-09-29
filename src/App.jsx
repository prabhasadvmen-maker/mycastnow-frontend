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
import CompanyOverview from './pages/company/CompanyOverview';
import CompanyFindTalent from './pages/company/CompanyFindTalent';
import CompanyCasting from './pages/company/CompanyCasting';
import CompanyTalentCart from './pages/company/CompanyTalentCart';
import CompanyHires from './pages/company/CompanyHires';
import CompanyInbox from './pages/company/CompanyInbox';
import CompanyWallet from './pages/company/CompanyWallet';
import CompanySubscription from './pages/company/CompanySubscription';
import CompanyProfile from './pages/company/CompanyProfile';
import CompanySettings from './pages/company/CompanySettings';
import CompanyHelp from './pages/company/CompanyHelp';

import CreatorLogin from './pages/creator/CreatorLogin';
import CreatorSignupFlow from './pages/creator/CreatorSignupFlow';
import CreatorLayout from './layouts/CreatorLayout';
import CreatorDashboard from './pages/creator/CreatorDashboard';
import CreatorPortfolio from './pages/creator/CreatorPortfolio';
import CreatorCasting from './pages/creator/CreatorCasting';
import CreatorApplications from './pages/creator/CreatorApplications';
import CreatorBookings from './pages/creator/CreatorBookings';
import CreatorInbox from './pages/creator/CreatorInbox';
import CreatorWallet from './pages/creator/CreatorWallet';
import CreatorEarnings from './pages/creator/CreatorEarnings';
import CreatorSubscription from './pages/creator/CreatorSubscription';
import CreatorProfile from './pages/creator/CreatorProfile';
import CreatorSettings from './pages/creator/CreatorSettings';
import CreatorHelp from './pages/creator/CreatorHelp';
import AdminCreators from './pages/AdminCreators';
import AdminCreatorDetails from './pages/AdminCreatorDetails';
import AdminUsers from './pages/AdminUsers';
import AdminCasting from './pages/AdminCasting';
import AdminBookings from './pages/AdminBookings';
import AdminSubscriptions from './pages/AdminSubscriptions';
import AdminWallet from './pages/AdminWallet';
import AdminBoost from './pages/AdminBoost';
import AdminReviews from './pages/AdminReviews';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import AdminHelp from './pages/AdminHelp';
import PublicWebsite from './pages/PublicWebsite';
import LiveCastingsPage from './pages/public/LiveCastingsPage';
import PublicInfoPage from './pages/public/PublicInfoPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CompanyAuthProvider>
          <CreatorAuthProvider>
            <Routes>
              {/* Public Platform Website */}
              <Route path="/" element={<PublicWebsite />} />
              <Route path="/home" element={<PublicWebsite />} />
              <Route path="/website" element={<PublicWebsite />} />
              <Route path="/landing" element={<PublicWebsite />} />
              <Route path="/castings" element={<LiveCastingsPage />} />
              <Route path="/talents" element={<PublicWebsite />} />
              <Route path="/plans" element={<PublicInfoPage page="plans" />} />
              <Route path="/membership" element={<PublicInfoPage page="plans" />} />
              <Route path="/guidelines" element={<PublicInfoPage page="guidelines" />} />
              <Route path="/safety" element={<PublicInfoPage page="safety" />} />
              <Route path="/support" element={<PublicInfoPage page="support" />} />
              <Route path="/escrow" element={<PublicInfoPage page="escrow" />} />
              <Route path="/terms" element={<PublicInfoPage page="terms" />} />
              <Route path="/privacy" element={<PublicInfoPage page="privacy" />} />
              <Route path="/fraud-prevention" element={<PublicInfoPage page="fraud" />} />
              <Route path="/post-casting" element={<CompanySignup />} />

              {/* Admin Routes */}
              <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Overview />} />
              <Route path="company" element={<Company />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="profiles" element={<AdminCreators />} />
              <Route path="profiles/:id" element={<AdminCreatorDetails />} />
              <Route path="casting" element={<AdminCasting />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="payments" element={<ComingSoon />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="wallet" element={<AdminWallet />} />
              <Route path="boost" element={<AdminBoost />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="cms" element={<Overview />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="help" element={<AdminHelp />} />
            </Route>

            {/* Company Routes */}
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/company/signup" element={<CompanySignup />} />
            <Route path="/company/dashboard" element={<CompanyLayout />}>
              <Route index element={<CompanyOverview />} />
              <Route path="find-talent" element={<CompanyFindTalent />} />
              <Route path="casting" element={<CompanyCasting />} />
              <Route path="talent-cart" element={<CompanyTalentCart />} />
              <Route path="hires" element={<CompanyHires />} />
              <Route path="inbox" element={<CompanyInbox />} />
              <Route path="wallet" element={<CompanyWallet />} />
              <Route path="subscription" element={<CompanySubscription />} />
              <Route path="profile" element={<CompanyProfile />} />
              <Route path="settings" element={<CompanySettings />} />
              <Route path="help" element={<CompanyHelp />} />
            </Route>

            {/* Creator Routes */}
            <Route path="/creator/login" element={<CreatorLogin />} />
            <Route path="/creator/signup" element={<CreatorLogin isSignup={true} />} />
            <Route path="/creator/onboarding" element={<CreatorSignupFlow />} />
            
            <Route path="/creator/dashboard" element={<CreatorLayout />}>
              <Route index element={<CreatorDashboard />} />
              <Route path="portfolio" element={<CreatorPortfolio />} />
              <Route path="casting" element={<CreatorCasting />} />
              <Route path="applications" element={<CreatorApplications />} />
              <Route path="bookings" element={<CreatorBookings />} />
              <Route path="inbox" element={<CreatorInbox />} />
              <Route path="wallet" element={<CreatorWallet />} />
              <Route path="earnings" element={<CreatorEarnings />} />
              <Route path="subscription" element={<CreatorSubscription />} />
              <Route path="profile" element={<CreatorProfile />} />
              <Route path="settings" element={<CreatorSettings />} />
              <Route path="help" element={<CreatorHelp />} />
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
