import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { User, FamilyRole } from '../types';

// O segredo: criamos uma segunda instância do Firebase app para não afetar a sessão atual
const secondaryApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}, "SecondaryApp");

const secondaryAuth = getAuth(secondaryApp);

interface CreateMemberData {
  email: string;
  password: string;
  displayName: string;
  familyRole: FamilyRole;
}

export const createFamilyMember = async (
  adminUser: User, 
  memberData: CreateMemberData
) => {
  if (adminUser.role !== 'admin') {
    throw new Error('Apenas o administrador pode adicionar membros.');
  }

  // 1. Cria o usuário na instância secundária do Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    secondaryAuth, 
    memberData.email, 
    memberData.password
  );

  const newUserId = userCredential.user.uid;

  // 2. Salva os dados no Firestore vinculando à mesma Família
  await setDoc(doc(db, 'users', newUserId), {
    email: memberData.email,
    displayName: memberData.displayName,
    familyRole: memberData.familyRole,
    familyId: adminUser.familyId,
    role: 'member',
    createdAt: Date.now()
  });

  // 3. Desloga o app secundário para limpar a memória
  await secondaryAuth.signOut();

  return newUserId;
};
