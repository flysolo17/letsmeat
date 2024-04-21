import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  doc,
  orderBy,
  query,
  setDoc,
  where,
  collection,
} from '@angular/fire/firestore';
import {
  CashRegister,
  cashRegisterConverter,
} from '../models/cashregister/CashRegister';
import { generateDate, generateNumberString } from '../utils/Constants';
import { Observable } from 'rxjs';
import { collectionData } from 'rxfire/firestore';
const CASH_REGISTER_COLLECTION = 'CashRegister';
@Injectable({
  providedIn: 'root',
})
export class CashRegisterService {
  constructor(private firestore: Firestore) {}

  addCash(cashRegister: CashRegister) {
    return setDoc(
      doc(
        this.firestore,
        CASH_REGISTER_COLLECTION,
        cashRegister.id
      ).withConverter(cashRegisterConverter),
      cashRegister
    );
  }

  getAllCashRegisterByCashierID(cashierID: string): Observable<CashRegister[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(
      collection(this.firestore, CASH_REGISTER_COLLECTION),
      where('cashierID', '==', cashierID),
      where('dateIssued', '>=', today),
      orderBy('dateIssued', 'desc')
    ).withConverter(cashRegisterConverter);

    return collectionData(q) as Observable<CashRegister[]>;
  }
}
