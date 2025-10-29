'use client';

import AdminPanel from '../components/AdminPanel';
import ProtectedRoute from '../components/ProtectedRoute';
import Header from '../components/Header';

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminPanel />
      </div>
    </ProtectedRoute>
  );
}