import { Injectable } from '@angular/core';
import {
  CollectionReference,
  FieldValue,
  Firestore,
  collection,
  deleteDoc,
  doc,
  endBefore,
  getDocs,
  increment,
  limit,
  limitToLast,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
} from '@angular/fire/firestore';
import { Products, productConverter } from '../models/products/Products';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject, Observable } from 'rxjs';
import { collectionData } from 'rxfire/firestore';
export const PRODUCTS_COLLECTION = 'Products';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsCollection: CollectionReference;
  private pageSize = 10;

  // private transactionSubject: BehaviorSubject<Products[]> =
  //   new BehaviorSubject<Products[]>([]);
  // public transactions$: Observable<Transactions[]> =
  //   this.transactionSubject.asObservable();
  constructor(private firestore: Firestore, private storage: Storage) {
    this.productsCollection = collection(firestore, PRODUCTS_COLLECTION);
  }
  async uploadProduct(file: File) {
    try {
      const fireRef = ref(this.storage, `${PRODUCTS_COLLECTION}/${uuidv4()}`);
      await uploadBytes(fireRef, file);
      const downloadURL = await getDownloadURL(fireRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
  addStocks(productID: string, expiration: Date, stocks: number) {
    return updateDoc(doc(this.firestore, PRODUCTS_COLLECTION, productID), {
      stocks: increment(stocks),
      expiration: expiration,
      updatedAt: new Date(),
    });
  }
  listenToProducts(): Observable<Products[]> {
    const q = query(
      collection(this.firestore, PRODUCTS_COLLECTION),
      limit(1000),
      orderBy('createdAt', 'desc'),
      orderBy('updatedAt', 'desc')
    ).withConverter(productConverter);
    return collectionData(q) as Observable<Products[]>;
  }
  createProduct(product: Products) {
    return setDoc(
      doc(this.firestore, PRODUCTS_COLLECTION, product.id),
      product
    );
  }
  updateProduct(product: Products) {
    product.updatedAt = new Date();
    return setDoc(
      doc(this.firestore, PRODUCTS_COLLECTION, product.id),
      product
    );
  }
  deleteProduct(productID: string) {
    return deleteDoc(doc(this.firestore, PRODUCTS_COLLECTION, productID));
  }

  async getAllProducts() {
    const querySnapshot = await getDocs(
      query(
        this.productsCollection,
        orderBy('createdAt', 'desc'),
        orderBy('updatedAt', 'desc'),
        limit(10)
      ).withConverter(productConverter)
    );
    return querySnapshot;
  }

  // async loadNext(product: Products) {
  //   const querySnapshot = await getDocs(
  //     query(
  //       collection(this.firestore, PRODUCTS_COLLECTION),
  //       orderBy('createdAt', 'desc'),
  //       orderBy('updatedAt', 'desc'),
  //       startAfter(product.createdAt, product.updatedAt),
  //       limit(10)
  //     ).withConverter(productConverter)
  //   );
  //   return querySnapshot;
  // }

  // async loadPrev(product: Products) {
  //   const querySnapshot = await getDocs(
  //     query(
  //       collection(this.firestore, PRODUCTS_COLLECTION),
  //       orderBy('createdAt', 'desc'),
  //       orderBy('updatedAt', 'desc'),
  //       endBefore(product.createdAt, product.updatedAt),
  //       limit(10)
  //     ).withConverter(productConverter)
  //   );
  //   return querySnapshot;
  // }
}
