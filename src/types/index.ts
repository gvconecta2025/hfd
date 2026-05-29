export type Role = 'admin' | 'member';
export type FamilyRole = 'Pai' | 'Mãe' | 'Filho(a)' | 'Avô(ó)' | 'Tio(a)';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  familyId: string;
  role: Role;
  familyRole: FamilyRole;
}

export interface Family {
  id: string;
  name: string;
  createdAt: number;
  adminId: string;
}

export interface Message {
  id?: string;
  text: string;
  userId: string;
  familyId: string;
  createdAt: number;
}
