import { Users } from '../accounts/User';
import { Products } from './Products';
import { StockManagement } from './StockManagement';

export interface ProductWithStocks {
  product: Products | null;
  stocks: StockManagement[];
}
