export interface PrintableTransactions<T> {
  title: string;
  description: string;
  date: string;
  shippintTotal: number;
  data: T;
}

export interface PrintTransactionData {
  transactionID: string;
  items: number;
  total: number;
}

export const transactionDataTotal = (
  printData: PrintTransactionData[]
): number => {
  let total = 0;
  printData.forEach((data) => {
    total += data.total;
  });
  return total;
};
