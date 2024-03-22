import { QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';

export interface CashRegister {
  id: string;
  cashierID: string;
  amount: number;
  dateIssued: Date;
}
export const cashRegisterConverter = {
  toFirestore: (data: CashRegister) => ({ ...data }),
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as CashRegister;
    data.dateIssued = (data.dateIssued as any).toDate();
    return data;
  },
};
