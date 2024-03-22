import { PaymentStatus } from './PaymentStatus';
import { PaymentTypes } from './PaymentTypes';

export interface Payment {
  id: string;
  total: number;
  status: PaymentStatus;
  type: PaymentTypes;
  receipt: string;
  updatedAt: Date;
  createdAt: Date;
}
