import { Injectable } from '@angular/core';
import {
  Firestore,
  arrayUnion,
  collection,
  doc,
  increment,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { TransactionDetails } from '../models/transactions/TransactionDetails';
import {
  Transactions,
  transactionConverter,
} from '../models/transactions/Transactions';
import { OrderItems } from '../models/transactions/OrderItems';
import { PRODUCTS_COLLECTION } from './product.service';
import { TransactionStatus } from '../models/transactions/TransactionStatus';
import { BehaviorSubject, Observable } from 'rxjs';
import { collectionData } from 'rxfire/firestore';
import { Payment } from '../models/transactions/Payment';

const TRANSACTION_COLLECTION = 'Transactions';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionSubject: BehaviorSubject<Transactions[]> =
    new BehaviorSubject<Transactions[]>([]);
  public transactions$: Observable<Transactions[]> =
    this.transactionSubject.asObservable();
  constructor(private firestore: Firestore) {}

  createTransaction(transaction: Transactions) {
    return setDoc(
      doc(this.firestore, TRANSACTION_COLLECTION, transaction.id).withConverter(
        transactionConverter
      ),
      transaction
    ).then((data) => {
      if (transaction.status == TransactionStatus.COMPLETED) {
        this.updateProductQuantity(transaction.items);
      }
    });
  }

  updateProductQuantity(order: OrderItems[]) {
    order.map((item) => {
      let optionQuantity = item.options?.quantity ?? 1;
      let quantity = item.quantity * optionQuantity;
      updateDoc(doc(this.firestore, PRODUCTS_COLLECTION, item.productID), {
        stocks: increment(-quantity),
      })
        .then((data) => {
          console.log('success ');
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  }

  setTransactions(transactions: Transactions[]): void {
    this.transactionSubject.next(transactions);
  }
  getAllTransactions(): Observable<Transactions[]> {
    const q = query(
      collection(this.firestore, TRANSACTION_COLLECTION),
      orderBy('transactionDate', 'desc'),
      orderBy('updatedAt', 'desc')
    ).withConverter(transactionConverter);
    return collectionData(q) as Observable<Transactions[]>;
  }

  getTransactionByCustomerID(customerID: string): Observable<Transactions[]> {
    const q = query(
      collection(this.firestore, TRANSACTION_COLLECTION),
      where('customerID', '==', customerID),
      orderBy('transactionDate', 'desc'),
      orderBy('updatedAt', 'desc')
    ).withConverter(transactionConverter);
    return collectionData(q) as Observable<Transactions[]>;
  }

  updateTransactionStatus(
    transactionID: string,
    status: TransactionStatus,
    details: TransactionDetails,
    items: OrderItems[]
  ) {
    return updateDoc(
      doc(
        collection(this.firestore, TRANSACTION_COLLECTION),
        transactionID
      ).withConverter(transactionConverter),
      {
        status: status,
        details: arrayUnion(details),
        updatedAt: new Date(),
      }
    ).then((data) => {
      if (status === TransactionStatus.ACCEPTED) {
        this.updateProductQuantity(items);
      }
    });
  }

  acceptTransaction(transaction: Transactions) {
    return updateDoc(
      doc(
        collection(this.firestore, TRANSACTION_COLLECTION),
        transaction.id
      ).withConverter(transactionConverter),
      transaction
    ).then((data) => {
      this.updateProductQuantity(transaction.items);
    });
  }

  markAsPaid(
    transactionID: string,
    employeeID: string,
    payment: Payment,
    details: TransactionDetails
  ) {
    return updateDoc(
      doc(collection(this.firestore, TRANSACTION_COLLECTION), transactionID),
      {
        employeeID: employeeID,
        payment: payment,
        details: arrayUnion(details),
        updatedAt: new Date(),
      }
    );
  }
  addDriver(transactionID: string, driverID: string) {
    return updateDoc(
      doc(collection(this.firestore, TRANSACTION_COLLECTION), transactionID),
      {
        driverID: driverID,
        updatedAt: new Date(),
      }
    );
  }
}
