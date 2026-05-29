import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Send, Settings, User as UserIcon, Check, CheckCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  familyId: string;
  createdAt: number;
  readBy?: string[];
}

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'messages'), where('familyId', '==', user.familyId), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(msgs);
      setTimeout(scrollToBottom, 150);

      // Motor de Confirmação de Leitura
      msgs.forEach(async (msg) => {
        if (msg.userId !== user.uid && (!msg.readBy || !msg.readBy.includes(user.uid))) {
          await updateDoc(doc(db, 'messages', msg.id), {
            readBy: arrayUnion(user.uid)
          });
        }
      });
    });
    return () => unsubscribe();
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      userId: user.uid,
      userName: user.displayName,
      familyId: user.familyId,
      createdAt: Date.now(),
      readBy: []
    });
    setNewMessage('');
  };

  if (!user) return null;

  return (
    /* h-[100dvh] garante que o layout respeite as barras do navegador mobile */
    <div className="h-[100dvh] flex flex-col bg-doodle font-sans">
      
      {/* Cabeçalho Fixo no Topo */}
      <header className="shrink-0 flex justify-between items-center p-4 bg-hfd-panel shadow-md z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 bg-hfd-blue text-white rounded-full flex items-center justify-center font-bold text-sm">
            {user.displayName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-hfd-text leading-tight">Nossa Casa</h1>
            <p className="text-xs text-hfd-accent">{user.familyRole}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user.role === 'admin' && (
            <Link to="/admin" className="hidden md:flex items-center gap-2 p-2 text-hfd-accent hover:text-hfd-blue transition" title="Painel de Controle">
              <Settings size={20} />
            </Link>
          )}
        </div>
      </header>

      {/* Área de Mensagens (Rola independentemente) */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.userId === user.uid;
          const showAvatar = !isMe && (index === 0 || messages[index - 1].userId !== msg.userId);
          const timeString = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isRead = msg.readBy && msg.readBy.length > 0;

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
              {!isMe && (
                <div className="w-8 shrink-0 mr-2">
                  {showAvatar && (
                    <div className="w-8 h-8 bg-white border border-hfd-border text-hfd-text rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                      {msg.userName ? msg.userName.substring(0, 2).toUpperCase() : <UserIcon size={14}/>}
                    </div>
                  )}
                </div>
              )}
              
              <div className={`relative max-w-[80%] md:max-w-[60%] px-4 pt-2 pb-6 rounded-2xl shadow-sm ${
                isMe ? 'bg-hfd-panel border border-hfd-border text-hfd-text rounded-br-none' : 'bg-white border border-hfd-border text-hfd-text rounded-bl-none'
              }`}>
                {!isMe && showAvatar && <p className="text-xs font-bold text-hfd-blue mb-1">{msg.userName}</p>}
                
                <p className="text-base leading-relaxed break-words">{msg.text}</p>
                
                {/* Metadados da mensagem: Hora e Checks */}
                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                  <span className="text-[10px] text-hfd-accent">{timeString}</span>
                  {isMe && (
                    isRead ? <CheckCheck size={14} className="text-hfd-blue" /> : <Check size={14} className="text-hfd-accent" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Barra de Digitação Fixa na Base */}
      <footer className="shrink-0 p-3 bg-hfd-bg border-t border-hfd-border">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Mensagem..."
            className="flex-1 bg-white border border-hfd-border rounded-full px-5 py-3 text-base text-hfd-text focus:outline-none focus:ring-2 focus:ring-hfd-blue transition" 
          />
          <button type="submit" disabled={!newMessage.trim()} className="w-12 h-12 shrink-0 bg-hfd-blue text-white rounded-full flex items-center justify-center hover:bg-hfd-blue-hover transition disabled:opacity-50 shadow-md">
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </footer>
    </div>
  );
};
