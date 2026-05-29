import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { AdminPanel } from './pages/AdminPanel';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './routes/ProtectedRoute';

const AppRoutes = () => {
  const { isLoading } = useAuth(); // Erro corrigido aqui (isLoading em vez de loading)

  if (isLoading) {
     return (
      <div className="min-h-screen bg-hfd-bg flex items-center justify-center font-sans">
        <div className="w-16 h-16 border-4 border-hfd-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminPanel /></ProtectedRoute>} />
    </Routes>
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
