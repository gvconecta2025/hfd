import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Send, Settings, Check, CheckCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Message } from '../types';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Referências para o controle do Scroll Inteligente
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingUp = useRef(false);
  const initialLoad = useRef(true);

  // Monitora se o usuário rolou a tela para cima para ler o histórico
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Se a distância até o fim for maior que 100px, significa que ele subiu a tela manualmente
    isUserScrollingUp.current = scrollHeight - scrollTop - clientHeight > 100;
  };

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'messages'), where('familyId', '==', user.familyId), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(msgs);
      
      // Lógica do Smart Scroll
      setTimeout(() => {
        if (initialLoad.current) {
          // No primeiro carregamento, sempre desce para a mais recente sem animação
          messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
          initialLoad.current = false;
        } else if (!isUserScrollingUp.current) {
          // Só rola para baixo automaticamente se o usuário não estiver lendo o histórico acima
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

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
    
    // Força a descida da tela sempre que o próprio usuário envia uma mensagem
    isUserScrollingUp.current = false;
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  if (!user) return null;

  return (
    <div className="h-[100dvh] flex flex-col bg-doodle font-sans">
      
      {/* Cabeçalho Fixo */}
      <header className="shrink-0 flex justify-between items-center px-4 py-3 bg-hfd-panel shadow-md z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 bg-[#1D3ECF] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
            {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'US'}
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-[#1F2937] leading-tight">Nossa Família</h1>
            <p className="text-xs text-[#64748B]">{user.familyRole}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user.role === 'admin' && (
            <Link to="/admin" className="p-2 text-[#64748B] hover:text-[#1D3ECF] transition" title="Gestão da Família">
              <Settings size={22} />
            </Link>
          )}
        </div>
      </header>

      {/* Área de Mensagens com Radar de Rolagem (onScroll) */}
      <main 
        ref={scrollContainerRef} 
        onScroll={handleScroll} 
        className="flex-1 overflow-y-auto p-4 flex flex-col"
      >
        {messages.map((msg, index) => {
          const isMe = msg.userId === user.uid;
          // Identifica se é a primeira mensagem de um bloco da mesma pessoa
          const showHeader = !isMe && (index === 0 || messages[index - 1].userId !== msg.userId);
          const timeString = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isRead = msg.readBy && msg.readBy.length > 0;

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
              
              {/* Avatar da pessoa (aparece apenas quando ela inicia uma sequência de mensagens) */}
              {!isMe && (
                <div className="w-9 shrink-0 mr-2 flex flex-col justify-end">
                  {showHeader && (
                    <div className="w-9 h-9 bg-white border border-[#CBD5E1] text-[#1D3ECF] rounded-full flex items-center justify-center font-bold text-xs shadow-sm mb-1">
                      {msg.userName ? msg.userName.substring(0, 2).toUpperCase() : 'US'}
                    </div>
                  )}
                </div>
              )}
              
              <div className={`relative max-w-[80%] md:max-w-[65%] px-3 pt-2 pb-5 rounded-xl shadow-sm ${
                isMe ? 'bg-[#DCF8C6] border border-[#BDE7A4] text-[#1F2937] rounded-br-none' : 'bg-white border border-[#CBD5E1] text-[#1F2937] rounded-bl-none'
              }`}>
                {/* Nome da pessoa no topo da bolha da mensagem */}
                {showHeader && (
                  <p className="text-xs font-bold text-[#1D3ECF] mb-1">{msg.userName}</p>
                )}
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                
                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                  <span className="text-[10px] text-gray-500 opacity-80">{timeString}</span>
                  {isMe && (
                    isRead ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/* Âncora invisível */}
        <div ref={messagesEndRef} className="h-1 shrink-0" />
      </main>

      {/* Barra de Escrita */}
      <footer className="shrink-0 p-3 bg-[#F0F2F5] border-t border-[#CBD5E1]">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto items-end">
          <textarea 
            rows={1}
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Mensagem..."
            className="flex-1 bg-white border-none rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:ring-1 focus:ring-[#1D3ECF] resize-none max-h-32 shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button type="submit" disabled={!newMessage.trim()} className="w-11 h-11 mb-0.5 shrink-0 bg-[#1D3ECF] text-white rounded-full flex items-center justify-center hover:bg-[#162A9B] transition disabled:opacity-50 shadow-md">
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </footer>
    </div>
  );
};