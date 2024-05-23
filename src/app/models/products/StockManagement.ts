import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface StockManagement {
  id: string;
  productID: string;
  productName: string;
  productImg: string;
  staffID: string;
  quantity: number;
  expiration: Date | null;
  transactionID: string | null;
  status: StockStatus;
  createdAt: Date;
}

export const stockManagementConverter = {
  toFirestore: (data: StockManagement) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const productData = snap.data() as StockManagement;
    productData.createdAt = (productData.createdAt as any).toDate();
    if (productData.expiration !== null) {
      productData.expiration = (productData.expiration as any).toDate();
    }

    return productData;
  },
};

export enum StockStatus {
  IN = 'IN',
  OUT = 'OUT',
  DISPOSED = 'DISPOSED',
}
