import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();

  // UX Prioridade: Tela de loading moderna durante a verificação de segurança
  if (isLoading) {
    return (
      <div className="min-h-screen bg-hfd-bg flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-hfd-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-hfd-text">Verificando segurança...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, manda para a tela de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, mas não tiver família (usuário quebrado), manda para o login com erro (idealmente)
  if (!user.familyId) {
    console.error("Usuário logado mas sem família vinculada. Acesso negado.");
    return <Navigate to="/login" replace />;
  }

  // Se requer admin mas o usuário é membro, manda para a Home (/)
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Acesso permitido
  return <>{children}</>;
};
