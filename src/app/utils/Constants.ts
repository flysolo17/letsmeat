import { Timestamp } from '@angular/fire/firestore';
import { Products } from '../models/products/Products';
import { Addresses } from '../models/customers/Addresses';

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