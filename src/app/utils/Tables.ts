import { CashRegister } from '../models/cashregister/CashRegister';
import { Expenses, PrintableExpenses } from '../models/expenses/Expenses';
import { Products } from '../models/products/Products';
import { TransactionStatus } from '../models/transactions/TransactionStatus';
import { TransactionType } from '../models/transactions/TransactionType';
import { Transactions } from '../models/transactions/Transactions';
import { computeWeight, formatDate, toPHP } from './Constants';
export const tableTransaction = (transactions: Transactions[]) => {
  let data: any[][] = [];

  transactions.forEach((e) => {
    const formattedItems = `${e.items.length} - ${computeWeight(e.items)}`;
    const formattedPayment = `${toPHP(
      e.payment.total
    )} - ${e.payment.status.toString()}`;
    const formattedDate = formatDate(e.transactionDate);

    data.push([
      e.id,
      e.type.toString(),
      formattedItems,
      formattedPayment,
      e.status.toString(),
      formattedDate,
    ]);
  });

  return {
    headerRows: 1,
    widths: ['*', '*', '*', '*', '*', '*'],
    body: [
      ['Invoice ID', 'Type', 'Items', 'Payment', 'Status', 'Date'],
      ...data,
    ],
  };
};

export const tableCashierExpenses = (expenses: Expenses[]) => {
  return {
    headerRows: 1,
    widths: ['*', '*', '*', '*'],
    body: [
      ['Expenses ID', 'Description', 'Amount', 'Date'],
      ...expenses.map((expense) => [
        expense.id,
        expense.description,

        toPHP(expense.cash),
        expense.createdAt.toLocaleDateString(),
      ]),
    ],
  };
};

export const tableStartingCash = (cash: CashRegister[]) => {
  return {
    headerRows: 1,
    widths: ['*', '*'],
    body: [
      ['Starting Cash + Cash Added', 'Date'],
      ...cash.map((cash) => [
        toPHP(cash.amount),
        cash.dateIssued.toLocaleDateString(),
      ]),
    ],
  };
};

export const tableExpenses = (expenses: PrintableExpenses[]) => {
  return {
    headerRows: 1,
    widths: ['*', '*', '*', '*', '*'],
    body: [
      ['Expenses ID', 'Description', 'Cashier', 'Amount', 'Date'],
      ...expenses.map((expense) => [
        expense.id,
        expense.description,
        expense.cashier,
        toPHP(expense.amount),
        expense.createdAt,
      ]),
    ],
  };
};

export const tableInventory = (products: Products[]) => {
  return {
    headerRows: 1,
    widths: ['*', '*', '*', '*', '*', '*'],
    body: [
      [' ID', 'Name', 'Brand', 'Price', 'Stocks', 'Expiration'],
      ...products.map((p) => [
        p.id,
        p.name,
        p.brand,
        toPHP(p.price),
        p.stocks,
        p.expiration.toLocaleDateString(),
      ]),
    ],
  };
};
