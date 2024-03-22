import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Contacts } from './Contacts';

export interface Addresses {
  contacts?: Contacts | null;
  addressLine?: string | null;
  postalCode?: number | null;
  street?: string | null;
}

export const addressesConverter = {
  toFirestore: (data: Addresses) => ({ ...data }),
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Addresses,
};
