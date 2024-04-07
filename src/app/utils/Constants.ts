import { Timestamp } from '@angular/fire/firestore';
import { Products } from '../models/products/Products';
import { Addresses } from '../models/customers/Addresses';
import { OrderItems } from '../models/transactions/OrderItems';
import { Transactions } from '../models/transactions/Transactions';

export function generateNumberString(): string {
  let numberString = '';

  for (let i = 0; i < 10; i++) {
    // Generate a random number between 0 and 10
    const randomNumber = Math.floor(Math.random() * 11);

    // Append the random number to the string
    numberString += randomNumber.toString();
  }

  return numberString;
}

export const computeTransactionTotal = (
  transactions: Transactions[]
): string => {
  let total = 0;
  transactions.forEach((e) => {
    total += e.payment.total;
  });

  return toPHP(total);
};

export function countStocks(product: Products): number {
  let count = 0;
  // product.variations.map((data) => {
  //   count += data.stocks;
  // });
  return count;
}
export function formatTimestamp(timestamp: Date): string {
  return timestamp.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function getNumberFromString(input: string): number {
  const match = input.match(/\d+/); // Match one or more digits
  return match ? parseInt(match[0], 10) : 0;
}

export function getStringFromString(input: string): string {
  const match = input.match(/[a-zA-Z]+/); // Match one or more alphabetic characters
  return match ? match[0] : '';
}

export function getStartTime(dateString: string): Date {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getEndTime(dateString: string): Date {
  const date = new Date(dateString);

  date.setHours(23, 59, 59, 999);

  return date;
}

export function getDefaultAddress(
  current: number,
  addresses: Addresses[]
): string {
  if (addresses.length == 0) {
    return 'No Address Yet';
  }
  return addresses[current].addressLine ?? 'No Address Yet';
}

export function formatMessageDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return formatter.format(date);
}

export function generateDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!

  return `${year}-${day}-${month}`;
}

export const toPHP = (num: number): string => {
  // Convert the number to a string and add commas for thousands separator
  const formattedNum = num.toLocaleString('en-US');

  return `₱ ${formattedNum}`;
};

export const toFullShortDate = (date: Date): string => {
  const months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day: number = date.getDate();
  const monthIndex: number = date.getMonth();
  const year: number = date.getFullYear();

  return `${months[monthIndex]} ${day}, ${year}`;
};

export const computeWeight = (items: OrderItems[]) => {
  let count = 0;
  items.forEach((e) => {
    count += e.weight;
  });

  return `${formatDecimal(count)} kg`;
};

function formatDecimal(number: number): string {
  return number.toFixed(2);
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
}
