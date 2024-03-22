import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Addresses } from './Addresses';
import { CustomerType } from './CustomerType';

export interface Customer {
  id?: string | null;
  profile: string;
  phone: string;
  fullname: string;
  type: CustomerType;
  addresses: Addresses[];
  defaultAddress: number;
}

export const customerConverter = {
  toFirestore: (data: Customer) => ({ ...data }),
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as Customer,
};
