import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, auth } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { Message } from '../types';
import { signOut } from 'firebase/auth';
import { LogOut, Send } from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    
    // Escuta mensagens apenas da família do usuário, em tempo real
    const q = query(
      collection(db, 'messages'),
      where('familyId', '==', user.familyId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      userId: user.uid,
      familyId: user.familyId,
      createdAt: Date.now()
    });
    setNewMessage('');
  };

  const handleLogout = () => signOut(auth);

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-casa-bg text-casa-text font-sans">
      {/* Header Minimalista */}
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div>
          <h1 className="text-xl font-medium">Nossa Casa</h1>
          <p className="text-sm text-casa-accent">{user.familyRole}</p>
        </div>
        <button onClick={handleLogout} className="p-2 text-casa-accent hover:text-casa-primary transition">
          <LogOut size={20} />
        </button>
      </header>

      {/* Área de Mensagens (Silenciosa e Limpa) */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.userId === user.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl ${isMe ? 'bg-casa-primary text-white rounded-br-none' : 'bg-white border border-slate-100 rounded-bl-none shadow-sm'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </main>

      {/* Input de Texto Focado */}
      <footer className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escreva algo..."
            className="flex-1 bg-casa-bg border-none rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-casa-accent"
          />
          <button type="submit" className="p-3 bg-casa-primary text-white rounded-full hover:bg-slate-700 transition">
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
};
