import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import AppLayout from '../layouts/AppLayout';
import AddTransaction from '../pages/add-transaction';
import Dashboard from '../pages/dashboard';
import Transactions from '../pages/transactions';
import Insights from '../pages/insights';
import Profile from '../pages/profile';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute publik */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Rute internal aplikasi */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback jika rute tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}