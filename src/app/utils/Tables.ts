import { TransactionStatus } from '../models/transactions/TransactionStatus';
import { Transactions } from '../models/transactions/Transactions';
import { computeWeight, formatDate, toPHP } from './Constants';

export const tableTransaction = (transactions: Transactions[]) => {
  let data: {
    id: string;
    items: string;
    payment: string;
    status: TransactionStatus;
    date: string;
  }[] = [];
  transactions.forEach((e) => {
    data.push({
      id: e.id,
      items: `${e.items.length} - ${computeWeight(e.items)}`,
      payment: toPHP(e.payment.total) + ' - ' + e.payment.status.toString(),
      status: e.status,
      date: formatDate(e.transactionDate),
    });
  });
  return {
    headerRows: 1,
    widths: [100, 100, 100, 100, 100],
    body: [
      ['Invoice ID', 'Items', 'Payment', 'Status', 'Date'],
      ...data.map((transaction) => [
        transaction.id,
        transaction.items,
        transaction.payment,
        transaction.status,
        transaction.date,
      ]),
    ],
  };
};
