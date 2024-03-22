import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Expenses {
  id: string;
  cash: number;
  description: string;
  cashier: string;
  createdAt: Date;
}

export const ExpensesConverter = {
  toFirestore: (data: Expenses) => ({ ...data }),
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Expenses;
    data.createdAt = (data.createdAt as any).toDate();
    return data as Expenses;
  },
};
