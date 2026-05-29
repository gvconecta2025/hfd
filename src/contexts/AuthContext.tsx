import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { HFDUser } from '../types';

interface AuthContextType {
  user: HFDUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<HFDUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          // Busca o perfil completo no Firestore (onde estão role e familyId)
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: userData.displayName || firebaseUser.displayName || 'Sem Nome',
              role: userData.role || 'member',
              familyRole: userData.familyRole || 'Membro',
              familyId: userData.familyId || '',
            });
            console.log("Perfil do usuário carregado com sucesso:", userData);
          } else {
            console.error("Usuário autenticado, mas perfil no Firestore não encontrado.");
            setUser(null);
          }
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário no Firestore:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
