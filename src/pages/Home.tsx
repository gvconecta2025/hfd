import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, auth } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { Message } from '../types';
import { signOut } from 'firebase/auth';
import { LogOut, Send, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'messages'),
      where('familyId', '==', user.familyId),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    await addDoc(collection(db, 'messages'), {
      text: newMessage, userId: user.uid, familyId: user.familyId, createdAt: Date.now()
    });
    setNewMessage('');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-hfd-bg text-hfd-text font-sans">
      <header className="flex justify-between items-center p-6 bg-hfd-panel shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold">Nossa Casa</h1>
          <p className="text-sm text-hfd-accent">{user.familyRole}</p>
        </div>
        <div className="flex items-center gap-4">
          {user.role === 'admin' && (
            <Link to="/admin" className="hidden md:flex items-center gap-2 p-2 text-hfd-accent hover:text-hfd-blue transition" title="Painel de Controle">
              <Settings size={24} />
              <span className="text-sm font-medium">Gestão</span>
            </Link>
          )}
          <button onClick={() => signOut(auth)} className="p-2 text-hfd-accent hover:text-hfd-red transition">
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.userId === user.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[60%] p-4 rounded-2xl shadow-sm ${
                isMe ? 'bg-hfd-blue text-white rounded-br-none' : 'bg-hfd-panel text-hfd-text rounded-bl-none border border-gray-100'
              }`}>
                <p className="text-base">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="p-4 bg-hfd-panel border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Escreva algo..."
            className="flex-1 bg-hfd-bg border-none rounded-full px-6 py-4 text-base text-hfd-text focus:ring-2 focus:ring-hfd-blue transition" />
          <button type="submit" className="p-4 bg-hfd-blue text-white rounded-full hover:bg-blue-800 transition shadow-md">
            <Send size={20} />
          </button>
        </form>
      </footer>
    </div>
  );
};
