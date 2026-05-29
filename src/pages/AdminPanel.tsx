import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createFamilyMember } from '../services/adminService';
import { FamilyRole } from '../types';
import { Users, UserPlus, ArrowLeft, XCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [familyRole, setFamilyRole] = useState<FamilyRole>('Filho(a)');
  
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '', key: 0 });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-hfd-bg flex items-center justify-center p-6 text-center">
        <div className="bg-hfd-panel p-10 rounded-2xl shadow-lg border border-hfd-border max-w-lg space-y-6">
          <XCircle className="mx-auto text-hfd-red" size={72} />
          <h1 className="text-xl font-bold text-hfd-text">Acesso Restrito</h1>
          <button onClick={() => navigate('/')} className="bg-hfd-blue text-white rounded-xl px-8 py-3 text-base font-semibold hover:bg-hfd-blue-hover transition">
            Voltar para a Home
          </button>
        </div>
      </div>
    );
  }

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ text: '', type: '', key: 0 });

    if (password.length < 6) {
      setStatusMessage({ text: 'A senha deve ter pelo menos 6 caracteres.', type: 'error', key: Date.now() });
      setLoading(false);
      return;
    }

    try {
      await createFamilyMember(user, { email, password, displayName, familyRole });
      setStatusMessage({ 
        text: `Sucesso! O membro ${displayName} foi cadastrado com o login temporário.`, 
        type: 'success', 
        key: Date.now() 
      });
      setEmail(''); setPassword(''); setDisplayName('');
    } catch (error: any) {
      console.error("Erro técnico no cadastro:", error);
      setStatusMessage({ 
        text: 'Não foi possível cadastrar. Verifique se o e-mail já está em uso ou se as chaves do Firebase SecondaryApp foram configuradas na Vercel. Erro técnico: ' + error.message, 
        type: 'error',
        key: Date.now()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hfd-bg text-hfd-text p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Admin */}
        <header className="flex items-center gap-6 bg-hfd-panel p-6 md:p-8 rounded-2xl shadow-sm border border-hfd-border">
          <button onClick={() => navigate('/')} className="p-3 text-hfd-accent hover:text-hfd-blue hover:bg-blue-50 rounded-full transition">
            <ArrowLeft size={28} />
          </button>
          <div className="flex-1 flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-2xl text-hfd-blue">
              <Users size={36} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-hfd-text">Gestão da Família</h1>
              <p className="text-sm text-hfd-accent">Assinante: {user.displayName} ({user.email})</p>
            </div>
          </div>
        </header>

        {/* Formulário */}
        <div className="bg-hfd-panel p-8 md:p-12 rounded-2xl shadow-lg border border-hfd-border space-y-10">
          <div className="flex items-center gap-3 pb-6 border-b border-hfd-border">
            <UserPlus size={28} className="text-hfd-blue" />
            <h2 className="text-lg font-semibold text-hfd-text">Cadastrar Novo Membro</h2>
          </div>
          
          <form onSubmit={handleCreateMember} className="space-y-10">
            
            {/* Box de Feedback com Animação para UX */}
            {statusMessage.text && (
              <div key={statusMessage.key} className={`p-6 rounded-xl flex items-start gap-4 border animate-fadeIn ${
                statusMessage.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-sky-50 border-sky-100 text-sky-900'
              }`}>
                {statusMessage.type === 'error' ? <AlertCircle size={24} className="mt-0.5 shrink-0 text-red-600" /> : <CheckCircle size={24} className="mt-0.5 shrink-0 text-hfd-blue" />}
                <p className="text-base">{statusMessage.text}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">Nome de Exibição (Como aparecerá no chat)</label>
                <input required type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Ex: João"
                  className="w-full bg-hfd-input border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:ring-2 focus:ring-hfd-blue transition duration-150" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">Papel na Família</label>
                <select value={familyRole} onChange={e => setFamilyRole(e.target.value as FamilyRole)}
                  className="w-full bg-hfd-input border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:ring-2 focus:ring-hfd-blue transition duration-150 appearance-none">
                  <option value="Pai">Pai</option>
                  <option value="Mãe">Mãe</option>
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Avô(ó)">Avô(ó)</option>
                  <option value="Tio(a)">Tio(a)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">E-mail (Login do membro)</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@familia.com"
                  className="w-full bg-hfd-input border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:ring-2 focus:ring-hfd-blue transition duration-150" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">Senha Temporária (Mínimo 6)</label>
                <input required type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="senha123"
                  className="w-full bg-hfd-input border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:ring-2 focus:ring-hfd-blue transition duration-150" />
              </div>
            </div>

            <div className="pt-8 border-t border-hfd-border flex justify-end">
              <button type="submit" disabled={loading}
                className="w-full md:w-auto bg-hfd-blue text-white rounded-xl px-12 py-4 text-base font-semibold hover:bg-hfd-blue-hover transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Processando Cadastro...' : 'Confirmar e Cadastrar Membro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
