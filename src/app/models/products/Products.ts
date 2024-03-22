import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Options } from './Options';
export interface Products {
  id: string;
  image: string;
  name: string;
  brand: string;
  weight: string;
  cost: number;
  price: number;
  stocks: number;
  options: Options[];
  description: string;
  details: string;
  expiration: Date;
  comments: [];
  updatedAt: Date;
  createdAt: Date;
}

export const productConverter = {
  toFirestore: (data: Products) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const productData = snap.data() as Products;
    productData.updatedAt = (productData.updatedAt as any).toDate();
    productData.createdAt = (productData.createdAt as any).toDate();
    productData.expiration = (productData.expiration as any).toDate();
    return productData;
  },
};
