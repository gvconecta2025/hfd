export type FamilyRole = 'Pai' | 'Mãe' | 'Filho(a)' | 'Avô(ó)' | 'Tio(a)' | 'Membro' | 'Gestor';

export interface HFDUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  familyRole: string;
  familyId: string;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  familyId: string;
  createdAt: number;
  readBy?: string[];
  isEdited?: boolean;
  isDeleted?: boolean;
}
