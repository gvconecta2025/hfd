import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createFamilyMember } from '../services/adminService';
import { FamilyRole } from '../types';
import { Users, UserPlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [familyRole, setFamilyRole] = useState<FamilyRole>('Filho(a)');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Segurança extra na rota
  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center text-red-500">Acesso restrito.</div>;
  }

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await createFamilyMember(user, { email, password, displayName, familyRole });
      setMessage('Membro adicionado com sucesso!');
      setEmail(''); setPassword(''); setDisplayName('');
    } catch (error: any) {
      setMessage('Erro ao criar membro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-casa-bg text-casa-text p-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Admin */}
        <header className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <button onClick={() => navigate('/')} className="p-2 text-casa-accent hover:text-casa-primary transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-medium flex items-center gap-2">
              <Users size={20} /> Gestão da Família
            </h1>
            <p className="text-xs text-casa-accent">Adicione familiares ao seu ambiente.</p>
          </div>
        </header>

        {/* Formulário de Criação (O "Convite") */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-md font-medium mb-4 flex items-center gap-2">
            <UserPlus size={18} /> Cadastrar Novo Membro
          </h2>
          
          <form onSubmit={handleCreateMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-casa-accent mb-1">Nome de Exibição</label>
                <input required type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-casa-bg rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-casa-accent" placeholder="Ex: João" />
              </div>
              
              <div>
                <label className="block text-xs text-casa-accent mb-1">Papel na Família</label>
                <select value={familyRole} onChange={e => setFamilyRole(e.target.value as FamilyRole)}
                  className="w-full bg-casa-bg rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-casa-accent">
                  <option value="Pai">Pai</option>
                  <option value="Mãe">Mãe</option>
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Avô(ó)">Avô(ó)</option>
                  <option value="Tio(a)">Tio(a)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-casa-accent mb-1">E-mail (Login do membro)</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-casa-bg rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-casa-accent" placeholder="joao@familia.com" />
              </div>

              <div>
                <label className="block text-xs text-casa-accent mb-1">Senha Temporária</label>
                <input required type="text" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-casa-bg rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-casa-accent" placeholder="senha123" />
              </div>
            </div>

            {message && <p className="text-xs text-casa-primary mt-2">{message}</p>}

            <button type="submit" disabled={loading}
              className="mt-4 bg-casa-primary text-white rounded-lg px-6 py-2 text-sm hover:bg-slate-700 transition disabled:opacity-50">
              {loading ? 'Cadastrando...' : 'Cadastrar Membro'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
