import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompanyAuthProvider } from './context/CompanyAuthContext';
import { CreatorAuthProvider } from './context/CreatorAuthContext';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy load all pages
const Login = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Overview = lazy(() => import('./pages/admin/Overview'));
const Company = lazy(() => import('./pages/admin/Company'));
const ComingSoon = lazy(() => import('./pages/admin/ComingSoon'));
const CompanyLogin = lazy(() => import('./pages/company/CompanyLogin'));
const CompanySignup = lazy(() => import('./pages/company/CompanySignup'));
const CompanyLayout = lazy(() => import('./layouts/CompanyLayout'));
const CompanyOverview = lazy(() => import('./pages/company/CompanyOverview'));
const CompanyFindTalent = lazy(() => import('./pages/company/CompanyFindTalent'));
const CompanyCasting = lazy(() => import('./pages/company/CompanyCasting'));
const CompanyTalentCart = lazy(() => import('./pages/company/CompanyTalentCart'));
const CompanyHires = lazy(() => import('./pages/company/CompanyHires'));
const CompanyInbox = lazy(() => import('./pages/company/CompanyInbox'));
const CompanyWallet = lazy(() => import('./pages/company/CompanyWallet'));
const CompanySubscription = lazy(() => import('./pages/company/CompanySubscription'));
const CompanyProfile = lazy(() => import('./pages/company/CompanyProfile'));
const CompanySettings = lazy(() => import('./pages/company/CompanySettings'));
const CompanyHelp = lazy(() => import('./pages/company/CompanyHelp'));

const CreatorLogin = lazy(() => import('./pages/creator/CreatorLogin'));
const CreatorSignupFlow = lazy(() => import('./pages/creator/CreatorSignupFlow'));
const CreatorLayout = lazy(() => import('./layouts/CreatorLayout'));
const CreatorDashboard = lazy(() => import('./pages/creator/CreatorDashboard'));
const CreatorPortfolio = lazy(() => import('./pages/creator/CreatorPortfolio'));
const CreatorCasting = lazy(() => import('./pages/creator/CreatorCasting'));
const CreatorApplications = lazy(() => import('./pages/creator/CreatorApplications'));
const CreatorBookings = lazy(() => import('./pages/creator/CreatorBookings'));
const CreatorInbox = lazy(() => import('./pages/creator/CreatorInbox'));
const CreatorWallet = lazy(() => import('./pages/creator/CreatorWallet'));
const CreatorEarnings = lazy(() => import('./pages/creator/CreatorEarnings'));
const CreatorSubscription = lazy(() => import('./pages/creator/CreatorSubscription'));
const CreatorProfile = lazy(() => import('./pages/creator/CreatorProfile'));
const CreatorSettings = lazy(() => import('./pages/creator/CreatorSettings'));
const CreatorHelp = lazy(() => import('./pages/creator/CreatorHelp'));
const AdminCreators = lazy(() => import('./pages/admin/AdminCreators'));
const AdminCreatorDetails = lazy(() => import('./pages/admin/AdminCreatorDetails'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCasting = lazy(() => import('./pages/admin/AdminCasting'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'));
const AdminWallet = lazy(() => import('./pages/admin/AdminWallet'));
const AdminBoost = lazy(() => import('./pages/admin/AdminBoost'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminHelp = lazy(() => import('./pages/admin/AdminHelp'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const PublicWebsite = lazy(() => import('./pages/public/PublicWebsite'));
const LiveCastingsPage = lazy(() => import('./pages/public/LiveCastingsPage'));
const ExploreTalentPage = lazy(() => import('./pages/public/ExploreTalentPage'));
const WatchReelPage = lazy(() => import('./pages/public/WatchReelPage'));
const HowItWorksPage = lazy(() => import('./pages/public/HowItWorksPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const AuditionGuidelinesPage = lazy(() => import('./pages/public/AuditionGuidelinesPage'));
const FAQPage = lazy(() => import('./pages/public/FAQPage'));
const PublicInfoPage = lazy(() => import('./pages/public/PublicInfoPage'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CompanyAuthProvider>
          <CreatorAuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Platform Website */}
                <Route path="/" element={<PublicWebsite />} />
                <Route path="/home" element={<PublicWebsite />} />
                <Route path="/website" element={<PublicWebsite />} />
                <Route path="/landing" element={<PublicWebsite />} />
                <Route path="/talents" element={<ExploreTalentPage />} />
                <Route path="/castings" element={<LiveCastingsPage />} />
                <Route path="/reels" element={<WatchReelPage />} />
                <Route path="/watch-reel" element={<WatchReelPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/plans" element={<PricingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/membership" element={<PricingPage />} />
                <Route path="/guidelines" element={<AuditionGuidelinesPage />} />
                <Route path="/faq" element={<FAQPage />} />
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
                  <Route path="payments" element={<AdminPayments />} />
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

                {/* Dashboard Convenience Redirects */}
                <Route path="/superadmin" element={<Navigate to="/admin" replace />} />
                <Route path="/superadmin/*" element={<Navigate to="/admin" replace />} />
                <Route path="/company" element={<Navigate to="/company/dashboard" replace />} />
                <Route path="/creator" element={<Navigate to="/creator/dashboard" replace />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </CreatorAuthProvider>
        </CompanyAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
