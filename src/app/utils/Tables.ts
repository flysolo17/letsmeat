import { CashRegister } from '../models/cashregister/CashRegister';
import { Expenses, PrintableExpenses } from '../models/expenses/Expenses';
import { Products } from '../models/products/Products';
import { StockManagement } from '../models/products/StockManagement';
import { TransactionStatus } from '../models/transactions/TransactionStatus';
import { TransactionType } from '../models/transactions/TransactionType';
import { Transactions } from '../models/transactions/Transactions';
import { computeWeight, formatDate, toPHP } from './Constants';
export const tableTransaction = (transactions: Transactions[]) => {
  let data: any[][] = [];

  transactions.forEach((e, index) => {
    const formattedItems = `${e.items.length} - ${computeWeight(e.items)}`;
    const formattedPayment = `${toPHP(
      e.payment.total
    )} - ${e.payment.status.toString()}`;
    const formattedDate = formatDate(e.transactionDate);
    data.push([
      index + 1,
      e.id,
      e.type.toString(),
      { text: formattedItems + ' items', alignment: 'right' },
      { text: formattedPayment, alignment: 'right' },

      e.status.toString(),
      formattedDate,
    ]);
  });

  return {
    headerRows: 1,
    widths: ['auto', '*', '*', '*', '*', '*', '*'],
    body: [
      ['#', 'Invoice ID', 'Type', 'Items', 'Payment', 'Status', 'Date'],
      ...data,
    ],
  };
};

export const tableCashierExpenses = (expenses: Expenses[]) => {
  return {
    headerRows: 1,
    widths: ['auto', '*', '*', '*', '*'],
    body: [
      ['#', 'Expenses ID', 'Description', 'Amount', 'Date'],
      ...expenses.map((expense, index) => [
        index + 1,
        expense.id,
        expense.description,
        { text: toPHP(expense.cash), alignment: 'right' },
        expense.createdAt.toLocaleDateString(),
      ]),
    ],
  };
};

export const tableStartingCash = (cash: CashRegister[]) => {
  return {
    headerRows: 1,
    widths: ['auto', '*', '*', '*'],
    body: [
      ['', 'Starting Cash + Cash Added', 'Date'],
      ...cash.map((cash, index) => [
        index + 1,
        { text: toPHP(cash.amount), alignment: 'right' },
        cash.dateIssued.toLocaleDateString(),
      ]),
    ],
  };
};

export const tableExpenses = (expenses: PrintableExpenses[]) => {
  return {
    headerRows: 1,
    widths: ['auto', '*', '*', '*', '*', '*'],
    body: [
      ['#', 'Expenses ID', 'Description', 'Cashier', 'Amount', 'Date'],
      ...expenses.map((expense, index) => [
        index + 1,
        expense.id,
        expense.description,
        expense.cashier,

        { text: toPHP(expense.amount), alignment: 'right' },
        expense.createdAt,
      ]),
    ],
  };
};

export const tableInventory = (products: Products[]) => {
  return {
    headerRows: 1,
    widths: ['auto', '*', '*', '*', '*', '*', '*'],
    body: [
      ['#', ' ID', 'Name', 'Brand', 'Price', 'Stocks', 'Expiration'],
      ...products.map((p, index) => [
        index + 1,
        p.id,
        p.name,
        p.brand,
        { text: toPHP(p.price), alignment: 'right' },

        { text: p.stocks + ' pcs', alignment: 'right' },

        p.expiration.toLocaleDateString(),
      ]),
    ],
  };
};

export const tableStockManagement = (stocks: StockManagement[]) => {
  return {
    headerRows: 1,
    widths: ['auto', '*', '*', '*', '*'],
    body: [
      ['#', ' ID', 'Name', 'Quantity', 'Expiration'],
      ...stocks.map((p, index) => [
        index + 1,
        p.productID,
        p.productName,
        { text: p.quantity + ' pcs', alignment: 'right' },
        {
          text: p.expiration?.toLocaleDateString() || 'NA',
          alignment: 'right',
        },
      ]),
    ],
  };
};
