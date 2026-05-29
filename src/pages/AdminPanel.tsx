import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createFamilyMember } from '../services/adminService';
import { FamilyRole } from '../types';
import { Users, UserPlus, ArrowLeft, XCircle, AlertCircle } from 'lucide-react';
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
        <div className="bg-hfd-panel p-10 rounded-3xl shadow-lg border border-hfd-border max-w-lg space-y-6">
          <XCircle className="mx-auto text-red-500" size={72} />
          <h1 className="text-xl font-bold text-hfd-text">Acesso Não Autorizado</h1>
          <p className="text-base text-hfd-accent">Apenas o assinante/gestor familiar pode acessar esta área.</p>
          <button onClick={() => navigate('/')} className="bg-hfd-text text-white rounded-xl px-8 py-3 text-base font-semibold hover:bg-black transition">
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

    // Diagnóstico preventivo: Firebase Auth exige senha de no mínimo 6 caracteres
    if (password.length < 6) {
      setStatusMessage({ text: 'A senha temporária deve ter pelo menos 6 caracteres.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      await createFamilyMember(user, { email, password, displayName, familyRole });
      setStatusMessage({ text: 'Membro adicionado com sucesso! Passe as credenciais temporárias para ele.', type: 'success' });
      // Limpar campos
      setEmail(''); setPassword(''); setDisplayName('');
    } catch (error: any) {
      console.error("Erro técnico no cadastro:", error);
      // UX Prioridade: Expondo o erro para o usuário assinante
      setStatusMessage({ 
        text: 'Não foi possível cadastrar. Verifique se o e-mail já está em uso ou se as chaves do Firebase SecondaryApp foram configuradas na Vercel. Erro técnico: ' + error.message, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Componente de Input Padronizado para UX
  const InputField = ({ label, id, ...props }: any) => (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-hfd-accent">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-hfd-panel border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:outline-none focus:ring-2 focus:ring-hfd-primary focus:border-hfd-primary transition duration-150"
        {...props}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-hfd-bg text-hfd-text p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Admin - Visibilidade e Tamanho Aumentados */}
        <header className="flex items-center gap-6 bg-hfd-panel p-6 md:p-8 rounded-2xl shadow-sm border border-hfd-border">
          <button onClick={() => navigate('/')} className="p-3 text-hfd-accent hover:text-hfd-primary hover:bg-sky-50 rounded-full transition">
            <ArrowLeft size={28} />
          </button>
          <div className="flex-1 flex items-center gap-5">
            <div className="p-4 bg-sky-50 rounded-2xl text-hfd-primary">
              <Users size={36} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-hfd-text">Gestão da Família</h1>
              <p className="text-base text-hfd-accent">Assinante ativo: {user.displayName} ({user.email})</p>
            </div>
          </div>
        </header>

        {/* Formulário de Criação - UX Focado em clareza e facilidade de uso */}
        <div className="bg-hfd-panel p-8 md:p-12 rounded-2xl shadow-lg border border-hfd-border space-y-10">
          <div className="flex items-center gap-3 pb-6 border-b border-hfd-border">
            <UserPlus size={28} className="text-hfd-primary" />
            <h2 className="text-lg font-semibold text-hfd-text">Cadastrar Novo Membro</h2>
          </div>
          
          <form onSubmit={handleCreateMember} className="space-y-10">
            
            {/* Status Message Area - Prioridade UX para feedbacks */}
            {statusMessage.text && (
              <div className={`p-6 rounded-xl flex items-start gap-4 border ${statusMessage.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-sky-50 border-sky-100 text-sky-900'}`}>
                {statusMessage.type === 'error' ? <AlertCircle size={24} className="mt-0.5 shrink-0 text-red-600" /> : <AlertCircle size={24} className="mt-0.5 shrink-0 text-hfd-primary" />}
                <p className="text-base">{statusMessage.text}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <InputField required type="text" label="Nome de Exibição (Como aparecerá no chat)" id="displayName" value={displayName} onChange={(e:any) => setDisplayName(e.target.value)} placeholder="Ex: João" />
              
              <div className="space-y-2">
                <label htmlFor="familyRole" className="block text-sm font-medium text-hfd-accent">Papel na Família</label>
                <div className="relative">
                  <select id="familyRole" value={familyRole} onChange={e => setFamilyRole(e.target.value as FamilyRole)}
                    className="w-full bg-hfd-panel border border-hfd-border rounded-xl px-5 py-4 text-base text-hfd-text focus:outline-none focus:ring-2 focus:ring-hfd-primary transition appearance-none">
                    <option value="Pai">Pai</option>
                    <option value="Mãe">Mãe</option>
                    <option value="Filho(a)">Filho(a)</option>
                    <option value="Avô(ó)">Avô(ó)</option>
                    <option value="Tio(a)">Tio(a)</option>
                  </select>
                </div>
              </div>

              <InputField required type="email" label="E-mail (Login único do membro)" id="email" value={email} onChange={(e:any) => setEmail(e.target.value)} placeholder="joao@familia.com" />
              <InputField required type="text" label="Senha Temporária (Mínimo 6 caracteres)" id="password" value={password} onChange={(e:any) => setPassword(e.target.value)} placeholder="senha123" />
            </div>

            <div className="pt-8 border-t border-hfd-border flex justify-end">
              <button type="submit" disabled={loading}
                className="w-full md:w-auto bg-hfd-primary text-white rounded-xl px-12 py-4 text-base font-semibold hover:bg-hfd-primary-hover transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Processando Cadastro...' : 'Confirmar e Cadastrar Membro'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};