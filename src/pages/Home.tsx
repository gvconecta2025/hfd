import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { Send, Settings, Check, CheckCheck, MoreVertical, Edit2, Trash2, Ban } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Message } from '../types';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Estados para Edição e Menu
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingUp = useRef(false);
  const initialLoad = useRef(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    isUserScrollingUp.current = scrollHeight - scrollTop - clientHeight > 100;
  };

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'messages'), where('familyId', '==', user.familyId), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(msgs);
      
      setTimeout(() => {
        if (initialLoad.current) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
          initialLoad.current = false;
        } else if (!isUserScrollingUp.current) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      msgs.forEach(async (msg) => {
        if (msg.userId !== user.uid && (!msg.readBy || !msg.readBy.includes(user.uid))) {
          await updateDoc(doc(db, 'messages', msg.id), { readBy: arrayUnion(user.uid) });
        }
      });
    });
    return () => unsubscribe();
  }, [user]);

  const handleSendOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    if (editingId) {
      // Editar mensagem existente
      await updateDoc(doc(db, 'messages', editingId), { 
        text: newMessage, 
        isEdited: true 
      });
      setEditingId(null);
    } else {
      // Enviar nova mensagem
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName,
        familyId: user.familyId,
        createdAt: Date.now(),
        readBy: []
      });
    }
    
    setNewMessage('');
    setActiveMenuId(null);
    isUserScrollingUp.current = false;
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleDelete = async (id: string) => {
    // Soft Delete: Mantém o balão com o aviso "Mensagem apagada" (Estilo WhatsApp)
    await updateDoc(doc(db, 'messages', id), {
      isDeleted: true,
      text: '🚫 Esta mensagem foi apagada.'
    });
    setActiveMenuId(null);
  };

  const startEditing = (msg: Message) => {
    setEditingId(msg.id);
    setNewMessage(msg.text);
    setActiveMenuId(null);
  };

  if (!user) return null;

  return (
    <div className="h-[100dvh] flex flex-col bg-doodle font-sans" onClick={() => setActiveMenuId(null)}>
      
      {/* Cabeçalho */}
      <header className="shrink-0 flex justify-between items-center px-4 py-3 bg-[#075E54] text-white shadow-md z-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 bg-white text-[#075E54] rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
            {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'US'}
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold leading-tight">Grupo Familiar</h1>
            <p className="text-xs opacity-90">{user.familyRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.role === 'admin' && (
            <Link to="/admin" className="p-2 hover:bg-[#128C7E] rounded-full transition" title="Gestão da Família">
              <Settings size={22} />
            </Link>
          )}
        </div>
      </header>

      {/* Área de Mensagens */}
      <main ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 flex flex-col">
        {messages.map((msg, index) => {
          const isMe = msg.userId === user.uid;
          const showHeader = !isMe && (index === 0 || messages[index - 1].userId !== msg.userId);
          const timeString = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isRead = msg.readBy && msg.readBy.length > 0;

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3 relative`}>
              
              {!isMe && (
                <div className="w-9 shrink-0 mr-2 flex flex-col justify-end">
                  {showHeader && (
                    <div className="w-9 h-9 bg-white border border-[#CBD5E1] text-[#075E54] rounded-full flex items-center justify-center font-bold text-xs shadow-sm mb-1">
                      {msg.userName ? msg.userName.substring(0, 2).toUpperCase() : 'US'}
                    </div>
                  )}
                </div>
              )}
              
              <div className={`relative max-w-[80%] md:max-w-[65%] px-3 pt-2 pb-6 rounded-xl shadow-sm ${
                isMe ? 'bg-[#DCF8C6] text-[#1F2937] rounded-tr-none' : 'bg-white text-[#1F2937] rounded-tl-none'
              } ${msg.isDeleted ? 'italic text-gray-500 bg-opacity-80' : ''}`}>
                
                {/* Botão de Menu (Apenas para as suas mensagens, se não estiverem deletadas) */}
                {isMe && !msg.isDeleted && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === msg.id ? null : msg.id); }}
                    className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <MoreVertical size={16} />
                  </button>
                )}

                {/* Dropdown Menu */}
                {activeMenuId === msg.id && (
                  <div className="absolute top-8 right-2 bg-white shadow-lg rounded-lg py-2 w-36 z-20 border border-gray-100">
                    <button onClick={() => startEditing(msg)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Edit2 size={14} /> Editar
                    </button>
                    <button onClick={() => handleDelete(msg.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 size={14} /> Apagar
                    </button>
                  </div>
                )}

                {showHeader && !msg.isDeleted && (
                  <p className="text-xs font-bold text-[#075E54] mb-1">{msg.userName}</p>
                )}
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-4">{msg.text}</p>
                
                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                  {msg.isEdited && !msg.isDeleted && <span className="text-[10px] text-gray-400 italic mr-1">Editada</span>}
                  <span className="text-[10px] text-gray-500 opacity-80">{timeString}</span>
                  {isMe && !msg.isDeleted && (
                    isRead ? <CheckCheck size={14} className="text-[#34B7F1]" /> : <Check size={14} className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-1 shrink-0" />
      </main>

      {/* Barra de Escrita */}
      <footer className="shrink-0 p-3 bg-[#F0F2F5] border-t border-[#CBD5E1]">
        {editingId && (
          <div className="flex justify-between items-center bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-t-xl -mt-3 mb-1">
            <span>Editando mensagem...</span>
            <button onClick={() => { setEditingId(null); setNewMessage(''); }} className="text-red-500 hover:underline">Cancelar</button>
          </div>
        )}
        <form onSubmit={handleSendOrEdit} className="flex gap-2 max-w-4xl mx-auto items-end">
          <textarea 
            rows={1}
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Mensagem..."
            className="flex-1 bg-white border-none rounded-2xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none resize-none max-h-32 shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendOrEdit(e);
              }
            }}
          />
          <button type="submit" disabled={!newMessage.trim()} className={`w-11 h-11 mb-0.5 shrink-0 text-white rounded-full flex items-center justify-center transition shadow-md ${editingId ? 'bg-[#34B7F1] hover:bg-blue-500' : 'bg-[#128C7E] hover:bg-[#075E54] disabled:opacity-50'}`}>
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </footer>
    </div>
  );
};
