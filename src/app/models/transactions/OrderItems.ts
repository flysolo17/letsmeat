import { Options } from '../products/Options';

export interface OrderItems {
  id: string;
  productID: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  options: Options | null;
  weight: number;
  subtotal: number;
}
