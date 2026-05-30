import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '../firebase/config';
import { HFDUser, FamilyRole } from '../types'; // Erro corrigido aqui (HFDUser)

const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
const secondaryAuth = getAuth(secondaryApp);

export const createFamilyMember = async (
  adminUser: HFDUser,
  newMember: { email: string; password: string; displayName: string; familyRole: FamilyRole }
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newMember.email, newMember.password);
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: newMember.email,
      displayName: newMember.displayName,
      role: 'member',
      familyRole: newMember.familyRole,
      familyId: adminUser.familyId,
      createdAt: Date.now()
    });

    await signOut(secondaryAuth);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao criar membro:', error);
    throw error;
  }
};
