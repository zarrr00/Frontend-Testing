import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import OAuthCallback from '../pages/auth/OAuthCallback';
import AppLayout from '../layouts/AppLayout';

// Lazy-loaded feature pages
const Dashboard = lazy(() => import('../pages/dashboard'));
const Transactions = lazy(() => import('../pages/transactions'));
const AddTransaction = lazy(() => import('../pages/add-transaction'));
const Insights = lazy(() => import('../pages/insights'));
const Profile = lazy(() => import('../pages/profile'));
const Settings = lazy(() => import('../pages/profile/settings'));
const AboutKasflow = lazy(() => import('../pages/profile/about'));
const Gamification = lazy(() => import('../pages/gamification'));

// New feature pages
const Debts = lazy(() => import('../pages/debts'));
const Goals = lazy(() => import('../pages/goals'));
const Recurring = lazy(() => import('../pages/recurring'));
const POS = lazy(() => import('../pages/pos'));
const Members = lazy(() => import('../pages/members'));
const Notifications = lazy(() => import('../pages/notifications'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rute publik */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          {/* Rute internal aplikasi */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/gamification" element={<Gamification />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/settings" element={<Settings />} />
            <Route path="/profile/about" element={<AboutKasflow />} />
            {/* Fitur baru */}
            <Route path="/debts" element={<Debts />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/recurring" element={<Recurring />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/members" element={<Members />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}