import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createFamilyMember } from '../services/adminService';
import { FamilyRole } from '../types';
import { Users, UserPlus, ArrowLeft, XCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [familyRole, setFamilyRole] = useState<FamilyRole>('Filho(a)');
  
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-hfd-bg flex items-center justify-center p-6 text-center">
        <div className="bg-hfd-panel p-10 rounded-2xl shadow-md border border-gray-100 max-w-lg space-y-6">
          <XCircle className="mx-auto text-hfd-red" size={72} />
          <h1 className="text-xl font-bold text-hfd-text">Acesso Restrito</h1>
        </div>
      </div>
    );
  }

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ text: '', type: '' });

    if (password.length < 6) {
      setStatusMessage({ text: 'A senha deve ter pelo menos 6 caracteres.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      await createFamilyMember(user, { email, password, displayName, familyRole });
      setStatusMessage({ text: 'Membro cadastrado com sucesso!', type: 'success' });
      setEmail(''); setPassword(''); setDisplayName('');
    } catch (error: any) {
      setStatusMessage({ text: `Erro: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hfd-bg text-hfd-text p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex items-center gap-6 bg-hfd-panel p-6 rounded-2xl shadow-sm">
          <button onClick={() => navigate('/')} className="text-hfd-accent hover:text-hfd-blue transition">
            <ArrowLeft size={28} />
          </button>
          <div className="flex-1 flex items-center gap-4">
            <Users size={32} className="text-hfd-blue" />
            <div>
              <h1 className="text-xl font-bold">Gestão da Família</h1>
              <p className="text-sm text-hfd-accent">Adicione familiares ao seu ambiente.</p>
            </div>
          </div>
        </header>

        {/* Formulário */}
        <div className="bg-hfd-panel p-8 rounded-2xl shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <UserPlus size={24} className="text-hfd-blue" />
            <h2 className="text-lg font-semibold">Cadastrar Novo Membro</h2>
          </div>
          
          <form onSubmit={handleCreateMember} className="space-y-6">
            
            {/* Mensagem de Feedback */}
            {statusMessage.text && (
              <div className={`p-4 rounded-xl flex items-center gap-3 font-medium ${
                statusMessage.type === 'error' ? 'bg-hfd-red text-white' : 'bg-hfd-green text-hfd-text'
              }`}>
                {statusMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} className="text-emerald-700" />}
                <p>{statusMessage.text}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs construídos diretamente para evitar o bug do cursor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">Nome de Exibição</label>
                <input required type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-hfd-bg border-none rounded-xl px-4 py-3 text-hfd-text focus:ring-2 focus:ring-hfd-blue transition" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">Papel na Família</label>
                <select value={familyRole} onChange={(e) => setFamilyRole(e.target.value as FamilyRole)}
                  className="w-full bg-hfd-bg border-none rounded-xl px-4 py-3 text-hfd-text focus:ring-2 focus:ring-hfd-blue transition">
                  <option value="Pai">Pai</option>
                  <option value="Mãe">Mãe</option>
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Avô(ó)">Avô(ó)</option>
                  <option value="Tio(a)">Tio(a)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">E-mail (Login do membro)</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-hfd-bg border-none rounded-xl px-4 py-3 text-hfd-text focus:ring-2 focus:ring-hfd-blue transition" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">Senha Temporária (Mínimo 6)</label>
                <input required type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-hfd-bg border-none rounded-xl px-4 py-3 text-hfd-text focus:ring-2 focus:ring-hfd-blue transition" />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button type="submit" disabled={loading}
                className="bg-hfd-blue text-white rounded-xl px-8 py-3 font-semibold hover:bg-blue-800 transition disabled:opacity-50">
                {loading ? 'Processando...' : 'Cadastrar Membro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};