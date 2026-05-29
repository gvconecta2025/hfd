import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Acesso negado. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hfd-bg flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-hfd-panel p-10 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center mb-8 text-hfd-blue">
          <Home size={48} className="mb-4 text-hfd-blue" />
          <h1 className="text-2xl font-bold text-hfd-text">Ambiente Familiar</h1>
          <p className="text-sm text-hfd-accent mt-2 text-center">
            Sua casa digital, segura e privada.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-hfd-accent mb-2">E-mail de acesso</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full bg-hfd-bg border-none rounded-xl px-4 py-3 text-hfd-text focus:ring-2 focus:ring-hfd-blue transition" />
          </div>

          <div>
            <label className="block text-sm font-medium text-hfd-accent mb-2">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full bg-hfd-bg border-none rounded-xl px-4 py-3 text-hfd-text focus:ring-2 focus:ring-hfd-blue transition" />
          </div>

          {error && <p className="text-hfd-red text-sm text-center font-medium">{error}</p>}

          <button type="submit" disabled={isLoading}
            className="w-full bg-hfd-blue text-white rounded-xl py-4 font-semibold hover:bg-blue-800 transition disabled:opacity-50">
            {isLoading ? 'Entrando...' : 'Entrar na Casa'}
          </button>
        </form>
      </div>
    </div>
  );
};
