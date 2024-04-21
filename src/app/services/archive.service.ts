import { Injectable, Query } from '@angular/core';
import {
  Firestore,
  WriteBatch,
  doc,
  orderBy,
  collection,
  query,
  writeBatch,
} from '@angular/fire/firestore';
import { Transactions } from '../models/transactions/Transactions';

import { AchivesConverter, Archives } from '../models/archives/Archives';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArchiveService {
  ARCHIVE_COLLECTION: string = 'Archives';
  TRANSACTION_COLLECTION = 'Transactions';

  constructor(private firestore: Firestore) {}

  addToArchives(archive: Archives) {
    const batch = writeBatch(this.firestore);

    let archiveRef = doc(this.firestore, this.ARCHIVE_COLLECTION, archive.id);

    batch.set(archiveRef, archive);
    archive.transactions.forEach((e) => {
      let ref = doc(this.firestore, this.TRANSACTION_COLLECTION, e.id);
      batch.delete(ref);
    });
    return batch.commit();
  }

  deletePermanently(transactions: Transactions[]) {
    const batch = writeBatch(this.firestore);
    transactions.forEach((e) => {
      let ref = doc(this.firestore, this.TRANSACTION_COLLECTION, e.id);
      batch.delete(ref);
    });
    return batch.commit();
  }

  getArchivesAllArchives(): Observable<Archives[]> {
    const q = query(
      collection(this.firestore, this.ARCHIVE_COLLECTION),
      orderBy('createdAt', 'desc')
    ).withConverter(AchivesConverter);
    return collectionData(q) as Observable<Archives[]>;
  }

  restore(archive: Archives) {
    const batch = writeBatch(this.firestore);
    archive.transactions.forEach((e) => {
      let ref = doc(this.firestore, this.TRANSACTION_COLLECTION, e.id);
      batch.set(ref, e);
    });
    return batch.commit();
  }
}
