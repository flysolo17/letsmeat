import { QueryDocumentSnapshot } from 'firebase/firestore';
import { UserType } from './UserType';

export interface Users {
  id: string;
  profile: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
}
export const userConverter = {
  toFirestore: (data: Users) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Users,
};
