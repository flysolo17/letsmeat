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
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Firestore, getDocs } from '@angular/fire/firestore';
import { ExpensesWithCashier } from '../models/expenses/ExpensesWithCashier';
import { Users, userConverter } from '../models/accounts/User';
import { USER_COLLECTION } from './auth.service';
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

  async getAllExpensesWithCashiers(): Promise<ExpensesWithCashier[]> {
    const q = query(
      collection(this.firestore, EXPENSES_COLLECTION).withConverter(
        ExpensesConverter
      ),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const expensesWithCashiers: ExpensesWithCashier[] = [];

    for (const doc of querySnapshot.docs) {
      const expenses = doc.data() as Expenses;
      const user = await this.getCashier(expenses.cashier);
      expensesWithCashiers.push({ expenses, user });
    }

    return expensesWithCashiers;
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
