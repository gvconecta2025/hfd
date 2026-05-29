import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Save } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { displayName });
      // Força o reload da página para atualizar o contexto
      window.location.reload(); 
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="h-[100dvh] bg-hfd-bg flex flex-col font-sans">
      <header className="flex items-center gap-4 p-4 bg-hfd-panel shadow-sm shrink-0">
        <button onClick={() => navigate('/')} className="p-2 text-hfd-accent hover:text-hfd-blue transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-hfd-text">Meu Perfil</h1>
      </header>

      <main className="flex-1 p-6 overflow-y-auto flex flex-col items-center mt-10">
        <div className="w-32 h-32 bg-hfd-blue text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg mb-8">
          {initials || <UserIcon size={48} />}
        </div>

        <form onSubmit={handleUpdate} className="w-full max-w-md bg-hfd-panel p-6 rounded-2xl shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-hfd-accent">Nome de Exibição</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-hfd-input border border-hfd-border rounded-xl px-4 py-3 text-hfd-text focus:ring-2 focus:ring-hfd-blue transition" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-hfd-accent">Papel na Família</label>
            <input type="text" value={user.familyRole} disabled className="w-full bg-gray-100 border border-hfd-border rounded-xl px-4 py-3 text-hfd-accent cursor-not-allowed" />
          </div>

          <button type="submit" disabled={loading || displayName === user.displayName} className="w-full bg-hfd-blue text-white rounded-xl py-3 font-semibold hover:bg-hfd-blue-hover transition disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={20} />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </main>
    </div>
  );
};
