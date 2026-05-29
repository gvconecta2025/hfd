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
      setError('Acesso negado. Verifique suas credenciais ou contate o suporte.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-casa-bg flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col items-center mb-8 text-casa-primary">
          <Home size={40} className="mb-4 text-casa-accent" />
          <h1 className="text-2xl font-medium text-casa-text">Ambiente Familiar</h1>
          <p className="text-sm text-casa-accent mt-2 text-center">
            Sua casa digital, segura e privada.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-casa-text mb-1">
              E-mail de acesso
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-casa-bg border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-casa-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-casa-text mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-casa-bg border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-casa-accent"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-casa-primary text-white rounded-lg py-3 font-medium hover:bg-slate-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Entrar na Casa'}
          </button>
        </form>
      </div>
    </div>
  );
};
