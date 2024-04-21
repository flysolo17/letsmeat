import { Injectable } from '@angular/core';

import { Expenses, ExpensesConverter } from '../models/expenses/Expenses';
import {
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  where,
} from '@firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  from,
  map,
  switchMap,
} from 'rxjs';
import { Firestore, getDocs } from '@angular/fire/firestore';
import { ExpensesWithCashier } from '../models/expenses/ExpensesWithCashier';
import { Users, userConverter } from '../models/accounts/User';
import { USER_COLLECTION } from './auth.service';
import {
  DocumentData,
  QueryDocumentSnapshot,
} from 'rxfire/firestore/interfaces';
const EXPENSES_COLLECTION = 'Expenses';
@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private expensesSubject: BehaviorSubject<ExpensesWithCashier[]> =
    new BehaviorSubject<ExpensesWithCashier[]>([]);
  public expenses$: Observable<ExpensesWithCashier[]> =
    this.expensesSubject.asObservable();

  constructor(private firestore: Firestore) {}

  setExpenses(expenses: ExpensesWithCashier[]): void {
    this.expensesSubject.next(expenses);
  }

  addExpenses(expenses: Expenses) {
    const expensesRef = collection(this.firestore, EXPENSES_COLLECTION);
    const newExpensesRef = doc(expensesRef);
    expenses.id = newExpensesRef.id;
    return setDoc(newExpensesRef, expenses);
  }

  getAllExpensesToday(cashierID: string): Observable<Expenses[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(
      collection(this.firestore, EXPENSES_COLLECTION).withConverter(
        ExpensesConverter
      ),
      where('cashier', '==', cashierID),
      where('createdAt', '>=', today),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q) as Observable<Expenses[]>;
  }

  getAllExpensesWithCashiers(): Observable<ExpensesWithCashier[]> {
    const q = query(
      collection(this.firestore, EXPENSES_COLLECTION).withConverter(
        ExpensesConverter
      ),
      orderBy('createdAt', 'desc')
    ).withConverter(ExpensesConverter);

    // Create an observable from the query
    return from(getDocs(q)).pipe(
      // SwitchMap to handle asynchronous operations sequentially
      switchMap((querySnapshot) => {
        const expensesWithCashiers$: Observable<ExpensesWithCashier>[] =
          querySnapshot.docs.map((doc: QueryDocumentSnapshot<Expenses>) => {
            const expenses = doc.data() as Expenses;
            // Create an observable for each cashier
            return from(this.getCashier(expenses.cashier)).pipe(
              // Map the cashier data with the expenses data
              map((user) => ({ expenses, user }))
            );
          });

        // Combine all individual observables into a single observable array
        return combineLatest(expensesWithCashiers$);
      })
    );
  }
  async getCashier(cashierID: string): Promise<Users> {
    const q = query(
      collection(this.firestore, USER_COLLECTION).withConverter(userConverter),
      where('id', '==', cashierID)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error(`No cashier found with ID: ${cashierID}`);
    }
    return querySnapshot.docs[0].data() as Users;
  }
}
