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
import { Observable, map } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
const EXPENSES_COLLECTION = 'Expenses';
@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  constructor(private firestore: Firestore) {}

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
}
