import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

import { Customer, customerConverter } from '../models/customers/Customer';
import { collectionData } from 'rxfire/firestore';
import { CustomerWithMessages } from '../models/CustomerWithMessages';
import { Messages, messagesConverter } from '../models/Messages';
const CUSTOMER_COLLECTION = 'Customers';

const MESSAGES_COLLECTION = 'Messages';
@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private messagesSubject: BehaviorSubject<CustomerWithMessages[]> =
    new BehaviorSubject<CustomerWithMessages[]>([]);
  public messages$: Observable<CustomerWithMessages[]> =
    this.messagesSubject.asObservable();
  constructor(private firestore: Firestore) {}

  setMessages(messages: CustomerWithMessages[]) {
    this.messagesSubject.next(messages);
  }
  //use rxjs
  //collection need = Users, Messages

  getCustomerWithMessages(): Observable<CustomerWithMessages[]> {
    return combineLatest([this.getAllCustomer(), this.getAllMessages()]).pipe(
      map(([customers, messages]) => {
        const customersWithMessages = customers.map((customer) => {
          const customerMessages = messages.filter(
            (msg) =>
              msg.senderID === customer.id || msg.receiverID === customer.id
          );
          return {
            customer,
            messages: customerMessages.reverse(),
          };
        });

        customersWithMessages.sort((a, b) => {
          const lastMessageTimestampA =
            a.messages.length > 0
              ? a.messages[a.messages.length - 1].createdAt.getTime()
              : 0;
          const lastMessageTimestampB =
            b.messages.length > 0
              ? b.messages[b.messages.length - 1].createdAt.getTime()
              : 0;
          return lastMessageTimestampB - lastMessageTimestampA;
        });

        return customersWithMessages;
      })
    );
  }

  getAllCustomer(): Observable<Customer[]> {
    let q = query(
      collection(this.firestore, CUSTOMER_COLLECTION).withConverter(
        customerConverter
      )
    ).withConverter(customerConverter);
    return collectionData(q) as Observable<Customer[]>;
  }
  getAllMessages(): Observable<Messages[]> {
    let q = query(
      collection(this.firestore, MESSAGES_COLLECTION),
      orderBy('createdAt', 'desc')
    ).withConverter(messagesConverter);
    return collectionData(q) as Observable<Messages[]>;
  }
  sendMessage(message: Messages) {
    return setDoc(
      doc(collection(this.firestore, MESSAGES_COLLECTION), message.id),
      message
    );
  }
}
