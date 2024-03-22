import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Contacts {
  name?: string | null;
  phone?: string | null;
}

export const contactsConverter = {
  toFirestore: (data: Contacts) => ({ ...data }),
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Contacts,
};
