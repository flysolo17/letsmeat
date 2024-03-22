import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface TransactionDetails {
  title: string;
  description: string;
  createdAt: Date;
}

export const productConverter = {
  toFirestore: (data: TransactionDetails) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const details = snap.data() as TransactionDetails;
    details.createdAt = (details.createdAt as any).toDate();

    return details;
  },
};
