import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ConciergeDrawer from './components/ConciergeDrawer';
import Home from './pages/Home';
import Search from './pages/Search';
import PropertyDetail from './pages/PropertyDetail';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import AccountLayout from './pages/Account/AccountLayout';
import Overview from './pages/Account/Overview';
import Favorites from './pages/Account/Favorites';
import Transactions from './pages/Account/Transactions';
import SavedSearches from './pages/Account/SavedSearches';
import RecentlyViewed from './pages/Account/RecentlyViewed';
import Messages from './pages/Account/Messages';
import Bookings from './pages/Account/Bookings';
import Notifications from './pages/Account/Notifications';
import Profile from './pages/Account/Profile';
import Settings from './pages/Account/Settings';
import ProviderRoute from './components/ProviderRoute';
import ProviderEntry from './pages/Provider/ProviderEntry';
import ProviderLayout from './pages/Provider/ProviderLayout';
import ProviderOverview from './pages/Provider/ProviderOverview';
import PropertiesList from './pages/Provider/PropertiesList';
import AddProperty from './pages/Provider/AddProperty';
import ProviderEarnings from './pages/Provider/ProviderEarnings';
import ProviderTransactions from './pages/Provider/ProviderTransactions';
import TransactionDetail from './pages/Provider/TransactionDetail';
import PropertyMedia from './pages/Provider/PropertyMedia';
import ProviderOnboarding from './pages/Provider/ProviderOnboarding';
import ProviderLeads from './pages/Provider/ProviderLeads';
import ProviderRequests from './pages/Provider/ProviderRequests';
import ProviderViewings from './pages/Provider/ProviderViewings';
import ProviderMessages from './pages/Provider/ProviderMessages';
import ProviderNotifications from './pages/Provider/ProviderNotifications';
import ProviderProfile from './pages/Provider/ProviderProfile';
import ProviderSettings from './pages/Provider/ProviderSettings';
import ProviderVerification from './pages/Provider/ProviderVerification';
import PropertyPreview from './pages/Provider/PropertyPreview';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminOverview from './pages/Admin/AdminOverview';
import AdminListings from './pages/Admin/AdminListings';
import AdminVerifications from './pages/Admin/AdminVerifications';
import AdminCommissions from './pages/Admin/AdminCommissions';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminAuditLog from './pages/Admin/AdminAuditLog';
import { AuthProvider } from './context/AuthContext';
import { ConsumerProvider } from './context/ConsumerContext';
import { AdminProvider } from './context/AdminContext';
import { I18nProvider } from './context/I18nContext';
import './index.css';

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <ConsumerProvider>
          <AdminProvider>
            <Router>
              <div className="app-container">
                <Navigation />
                <main>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                    <Route path="/cars" element={<Cars />} />
                    <Route path="/cars/:slug" element={<CarDetail />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/register" element={<Auth />} />
                    <Route path="/forgot-password" element={<Auth />} />
                    
                    {/* List Property public redirect */}
                    <Route path="/list" element={<Navigate to="/provider/properties/new" replace />} />
                    
                    {/* Protected Consumer Routes (Phase 3 & Phase 6) */}
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    
                    <Route path="/account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
                      <Route index element={<Overview />} />
                      <Route path="favorites" element={<Favorites />} />
                      <Route path="saved-searches" element={<SavedSearches />} />
                      <Route path="recent" element={<RecentlyViewed />} />
                      <Route path="messages" element={<Messages />} />
                      <Route path="bookings" element={<Bookings />} />
                      <Route path="transactions" element={<Transactions />} />
                      <Route path="notifications" element={<Notifications />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* Provider Routes (Phase 4) */}
                    <Route path="/provider/entry" element={<ProviderEntry />} />
                    
                    <Route path="/provider" element={<ProviderRoute><ProviderLayout /></ProviderRoute>}>
                      <Route index element={<ProviderOverview />} />
                      <Route path="properties" element={<PropertiesList />} />
                      <Route path="properties/new" element={<AddProperty />} />
                      <Route path="properties/:id/edit" element={<AddProperty />} />
                      <Route path="properties/:id/media" element={<PropertyMedia />} />
                      <Route path="properties/:id/preview" element={<PropertyPreview />} />
                      <Route path="leads" element={<ProviderLeads />} />
                      <Route path="requests" element={<ProviderRequests />} />
                      <Route path="viewings" element={<ProviderViewings />} />
                      <Route path="messages" element={<ProviderMessages />} />
                      <Route path="transactions" element={<ProviderTransactions />} />
                      <Route path="transactions/:id" element={<TransactionDetail />} />
                      <Route path="earnings" element={<ProviderEarnings />} />
                      <Route path="onboarding" element={<ProviderOnboarding />} />
                      <Route path="verification" element={<ProviderVerification />} />
                      <Route path="notifications" element={<ProviderNotifications />} />
                      <Route path="profile" element={<ProviderProfile />} />
                      <Route path="settings" element={<ProviderSettings />} />
                    </Route>

                    {/* Admin & Operations Routes (Phase 5) */}
                    <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                      <Route index element={<AdminOverview />} />
                      <Route path="listings" element={<AdminListings />} />
                      <Route path="verifications" element={<AdminVerifications />} />
                      <Route path="commissions" element={<AdminCommissions />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="audit" element={<AdminAuditLog />} />
                    </Route>
                  </Routes>
                </main>
                <Footer />
                {/* AI Concierge omnipresent floating trigger & assistant */}
                <ConciergeDrawer />
              </div>
            </Router>
          </AdminProvider>
        </ConsumerProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
