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

  // Segurança extra na rota
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-hfd-bg flex items-center justify-center font-sans p-6 text-center">
        <div className="bg-hfd-panel p-10 rounded-2xl shadow-lg border border-hfd-border max-w-lg space-y-6">
          <XCircle className="mx-auto text-hfd-red" size={72} />
          <h1 className="text-xl font-bold text-hfd-text">Acesso Não Autorizado</h1>
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
    setStatusMessage({ text: '', type: '' });

    if (password.length < 6) {
      setStatusMessage({ text: 'A senha temporária deve ter pelo menos 6 caracteres.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      // Diagnóstico Preventivo: Logando antes de chamar o serviço
      console.log(`Adicionando membro ${displayName} na família ${user.familyId}...`);
      await createFamilyMember(user, { email, password, displayName, familyRole });
      setStatusMessage({ text: `Sucesso! O membro ${displayName} foi cadastrado.`, type: 'success' });
      // Limpar campos
      setEmail(''); setPassword(''); setDisplayName('');
    } catch (error: any) {
      console.error("Erro técnico no cadastro:", error);
      setStatusMessage({ 
        text: 'Não foi possível cadastrar. Verifique se o e-mail já está em uso ou se as chaves do Firebase foram configuradas corretamente na Vercel. Erro técnico: ' + error.message, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hfd-bg text-hfd-text p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Admin */}
        <header className="flex items-center gap-6 bg-hfd-panel p-6 rounded-2xl shadow-sm border border-hfd-border">
          <button onClick={() => navigate('/')} className="p-3 text-hfd-accent hover:text-hfd-blue hover:bg-blue-50 rounded-full transition">
            <ArrowLeft size={28} />
          </button>
          <div className="flex-1 flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-2xl text-hfd-blue">
              <Users size={36} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-hfd-text">Gestão da Família</h1>
              <p className="text-sm text-hfd-accent">Assinante ativo: {user.displayName} ({user.email})</p>
            </div>
          </div>
        </header>

        {/* Formulário de Criação - UX Focado em clareza */}
        <div className="bg-hfd-panel p-8 md:p-12 rounded-2xl shadow-lg border border-hfd-border space-y-10">
          <div className="flex items-center gap-3 pb-6 border-b border-hfd-border">
            <UserPlus size={28} className="text-hfd-blue" />
            <h2 className="text-lg font-semibold text-hfd-text">Cadastrar Novo Membro</h2>
          </div>
          
          <form onSubmit={handleCreateMember} className="space-y-10">
            
            {/* Box de Feedback (Erro ou Sucesso) */}
            {statusMessage.text && (
              <div className={`p-6 rounded-xl flex items-start gap-4 border ${
                statusMessage.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-hfd-green border-emerald-100 text-emerald-900'
              }`}>
                {statusMessage.type === 'error' ? <AlertCircle size={24} className="mt-0.5 shrink-0 text-red-600" /> : <CheckCircle size={24} className="mt-0.5 shrink-0 text-emerald-700" />}
                <p className="text-base">{statusMessage.text}</p>
              </div>
            )}

            {/* Inputs construídos diretamente para evitar o bug do cursor sumindo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">Nome de Exibição (Como aparecerá no chat)</label>
                <input required type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Ex: João"
                  className="w-full bg-hfd-panel border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:ring-2 focus:ring-hfd-blue transition duration-150" />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">Papel na Família</label>
                <select value={familyRole} onChange={e => setFamilyRole(e.target.value as FamilyRole)}
                  className="w-full bg-hfd-panel border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:ring-2 focus:ring-hfd-blue transition duration-150 appearance-none">
                  <option value="Pai">Pai</option>
                  <option value="Mãe">Mãe</option>
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Avô(ó)">Avô(ó)</option>
                  <option value="Tio(a)">Tio(a)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">E-mail (Login único do membro)</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@familia.com"
                  className="w-full bg-hfd-panel border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:ring-2 focus:ring-hfd-blue transition duration-150" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-hfd-accent">Senha Temporária (Mínimo 6)</label>
                <input required type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="senha123"
                  className="w-full bg-hfd-panel border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:ring-2 focus:ring-hfd-blue transition duration-150" />
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
