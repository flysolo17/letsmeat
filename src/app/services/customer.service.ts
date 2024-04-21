import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { collectionData, docData } from 'rxfire/firestore';
import { CustomerType } from '../models/customers/CustomerType';
import { Customer, customerConverter } from '../models/customers/Customer';

const CUSTOMER_COLLECTION = 'Customers';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private firesttore: Firestore) {}

  getAllCustomer(): Observable<Customer[]> {
    let q = query(
      collection(this.firesttore, CUSTOMER_COLLECTION).withConverter(
        customerConverter
      )
    );
    return collectionData(q) as Observable<Customer[]>;
  }

  toWholesaler(customerID: string): Promise<void> {
    return updateDoc(
      doc(collection(this.firesttore, CUSTOMER_COLLECTION), customerID),
      { type: CustomerType.WHOLESALER.toString() }
    ).catch((err) => {
      console.log(err);
    });
  }
  toRegular(customerID: string): Promise<void> {
    return updateDoc(
      doc(collection(this.firesttore, CUSTOMER_COLLECTION), customerID),
      { type: CustomerType.REGULAR.toString() }
    ).catch((err) => {
      console.log(err);
    });
  }

  getCustomerByID(customerID: string): Observable<Customer> {
    return docData(
      doc(
        collection(this.firesttore, CUSTOMER_COLLECTION),
        customerID
      ).withConverter(customerConverter)
    ) as Observable<Customer>;
  }
}
