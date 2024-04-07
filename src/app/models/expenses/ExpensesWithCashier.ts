import { Users } from '../accounts/User';
import { Expenses } from './Expenses';

export interface ExpensesWithCashier {
  expenses: Expenses;
  user: Users;
}
