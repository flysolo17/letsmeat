import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, combineLatest, map } from 'rxjs';
import {
  StockManagement,
  stockManagementConverter,
} from '../models/products/StockManagement';

import { collectionData, docData } from 'rxfire/firestore';
import { Products, productConverter } from '../models/products/Products';
import { PRODUCTS_COLLECTION } from './product.service';
import { Users } from '../models/accounts/User';
import { USER_COLLECTION } from './auth.service';
import { ProductWithStocks } from '../models/products/ProductWithStocks';
import { getEndTime, getStartTime } from '../utils/Constants';
export const STOCK_MANAGEMENT = 'StockManagement';
@Injectable({
  providedIn: 'root',
})
export class StockManagementService {
  constructor(private firestore: Firestore) {}

  getUserByID(uid: string): Observable<Users | null> {
    return docData(
      doc(this.firestore, USER_COLLECTION, uid)
    ) as Observable<Users | null>;
  }
  getProductByID(productID: string): Observable<Products | null> {
    return docData(
      doc(this.firestore, PRODUCTS_COLLECTION, productID).withConverter(
        productConverter
      )
    ) as Observable<Products | null>;
  }

  getStockManagementByProductID(
    productID: string
  ): Observable<StockManagement[]> {
    const stockManagementRef = collection(
      this.firestore,
      STOCK_MANAGEMENT
    ).withConverter(stockManagementConverter);
    const q = query(
      stockManagementRef,
      where('productID', '==', productID),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q) as Observable<StockManagement[]>;
  }

  getProductAndStockManagementByProductID(
    productID: string
  ): Observable<ProductWithStocks> {
    return combineLatest([
      this.getProductByID(productID),
      this.getStockManagementByProductID(productID),
    ]).pipe(
      map(([product, management]) => ({
        product,
        stocks: management,
      }))
    );
  }

  getStocksToday(): Observable<StockManagement[]> {
    const stockManagementRef = collection(
      this.firestore,
      STOCK_MANAGEMENT
    ).withConverter(stockManagementConverter);
    let today = new Date();
    const q = query(
      stockManagementRef,
      where('status', '==', 'IN'),
      where('createdAt', '>=', getStartTime(today.toDateString())),
      where('createdAt', '<=', getEndTime(today.toDateString())),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q) as Observable<StockManagement[]>;
  }

  getProductLastWeek(): Observable<StockManagement[]> {
    const stockManagementRef = collection(
      this.firestore,
      STOCK_MANAGEMENT
    ).withConverter(stockManagementConverter);
    let today = new Date();

    let lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const q = query(
      stockManagementRef,
      where('status', '==', 'IN'),
      where('createdAt', '>=', getStartTime(lastWeek.toDateString())),
      where('createdAt', '<', getStartTime(today.toDateString())),
      orderBy('createdAt', 'desc')
    );
    return collectionData(q) as Observable<StockManagement[]>;
  }
  getProductNineDaysOld(): Observable<StockManagement[]> {
    const stockManagementRef = collection(
      this.firestore,
      STOCK_MANAGEMENT
    ).withConverter(stockManagementConverter);

    const nineDaysOld = new Date();
    nineDaysOld.setDate(nineDaysOld.getDate() - 9);
    const q = query(
      stockManagementRef,
      where('status', '==', 'IN'),
      where('createdAt', '<=', getStartTime(nineDaysOld.toDateString())),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q) as Observable<StockManagement[]>;
  }
}
