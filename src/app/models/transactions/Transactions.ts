import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Addresses } from '../accounts/Addresses';
import { OrderItems } from './OrderItems';
import { Payment } from './Payment';
import { TransactionDetails } from './TransactionDetails';
import { TransactionStatus } from './TransactionStatus';
import { TransactionType } from './TransactionType';
import { Shipping } from './Shipping';

export interface Transactions {
  id: string;
  customerID: string;
  employeeID: string;
  driverID: string;
  type: TransactionType;
  address: Addresses | null;
  items: OrderItems[];
  shipping: Shipping | null;
  payment: Payment;
  status: TransactionStatus;
  details: TransactionDetails[];
  updatedAt: Date;
  transactionDate: Date;
}

export const transactionConverter = {
  toFirestore: (data: Transactions) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const transaction = snap.data() as Transactions;

    transaction.updatedAt = (transaction.updatedAt as any).toDate();
    transaction.transactionDate = (transaction.transactionDate as any).toDate();
    transaction.payment.createdAt = (
      transaction.payment.createdAt as any
    ).toDate();
    transaction.payment.updatedAt = (
      transaction.payment.updatedAt as any
    )?.toDate();

    // Convert details.createdAt to date
    if (transaction.details) {
      transaction.details.forEach((detail) => {
        detail.createdAt = (detail.createdAt as any).toDate();
      });
    }

    return transaction;
  },
};
