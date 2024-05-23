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
  where,
  writeBatch,
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
import { STOCK_MANAGEMENT } from './stock-management.service';
import { generateNumberString, getStartTime } from '../utils/Constants';
import {
  StockManagement,
  StockStatus,
} from '../models/products/StockManagement';
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
  addStocks(
    productID: string,
    expiration: Date,
    stocks: number,
    cashier: string,
    name: string,
    image: string
  ) {
    const batch = writeBatch(this.firestore);
    let stockID = generateNumberString();
    let stock: StockManagement = {
      id: stockID,
      productID: productID,
      staffID: cashier,
      quantity: stocks,
      expiration: expiration,
      transactionID: null,
      status: StockStatus.IN,
      createdAt: new Date(),
      productName: name,
      productImg: image,
    };
    batch.set(doc(this.firestore, STOCK_MANAGEMENT, stockID), stock);
    batch.update(doc(this.firestore, PRODUCTS_COLLECTION, productID), {
      stocks: increment(stocks),
      expiration: expiration,
      updatedAt: new Date(),
    });
    return batch.commit();
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

  getExpiredProduct(): Observable<Products[]> {
    let lastWeek = new Date();
    const q = query(
      collection(this.firestore, PRODUCTS_COLLECTION).withConverter(
        productConverter
      ),

      where('expiration', '<=', getStartTime(lastWeek.toDateString())),
      orderBy('expiration', 'desc')
    );
    return collectionData(q) as Observable<Products[]>;
  }
  createProduct(product: Products, cashier: string) {
    const batch = writeBatch(this.firestore);
    let stockID = generateNumberString();
    let stock: StockManagement = {
      id: stockID,
      productID: product.id,
      staffID: cashier,
      quantity: product.stocks,
      expiration: product.expiration,
      transactionID: null,
      status: StockStatus.IN,
      createdAt: new Date(),
      productName: product.name,
      productImg: product.image,
    };
    batch.set(doc(this.firestore, STOCK_MANAGEMENT, stockID), stock);
    batch.set(doc(this.firestore, PRODUCTS_COLLECTION, product.id), product);

    return batch.commit();
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

  disposeProduct(
    productID: string,
    name: string,
    image: string,
    expiration: Date,
    quantity: number,
    cashier: string
  ) {
    const batch = writeBatch(this.firestore);
    let stockID = generateNumberString();
    let stock: StockManagement = {
      id: stockID,
      productID: productID,
      staffID: cashier,
      quantity: quantity,
      expiration: expiration,
      transactionID: null,
      status: StockStatus.DISPOSED,
      createdAt: new Date(),
      productName: name,
      productImg: image,
    };
    batch.set(doc(this.firestore, STOCK_MANAGEMENT, stock.id), stock);
    batch.update(doc(this.firestore, PRODUCTS_COLLECTION, productID), {
      stocks: 0,
    });
    return batch.commit();
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
