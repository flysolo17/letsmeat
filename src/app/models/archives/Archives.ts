import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import {
  Transactions,
  transactionConverter,
} from '../transactions/Transactions';
import { list } from '@angular/fire/storage';

export interface Archives {
  id: string;
  title: string;
  transactions: Transactions[];
  createdAt: Date;
}

export const AchivesConverter = {
  toFirestore: (data: Archives) => ({ ...data }),
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Archives;

    data.createdAt = (data.createdAt as any).toDate();
    return data as Archives;
  },
};
