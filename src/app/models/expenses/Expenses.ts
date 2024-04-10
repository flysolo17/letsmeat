import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Users } from '../accounts/User';

export interface Expenses {
  id: string;
  cash: number;
  description: string;
  cashier: string;
  createdAt: Date;
}

export interface PrintableExpenses {
  id: string;
  description: string;
  amount: number;
  cashier: string;
  createdAt: string;
}

export const ExpensesConverter = {
  toFirestore: (data: Expenses) => ({ ...data }),
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Expenses;
    data.createdAt = (data.createdAt as any).toDate();
    return data as Expenses;
  },
};

function formatDateDaily(date: Date): string {
  const monthNames = [
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
  const day = date.getDate();
  const monthIndex = date.getMonth();
  return `${monthNames[monthIndex]} ${day}`;
}

export function formatDateWeekly(startDate: Date, endDate: Date): string {
  const formattedStart = formatDateDaily(startDate);
  const formattedEnd = formatDateDaily(endDate);
  return `${formattedStart} - ${formattedEnd}`;
}

// Function to format date as "mmm"
export function formatDateMonthly(date: Date): string {
  const monthNames = [
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
  const monthIndex = date.getMonth();
  return `${monthNames[monthIndex]}`;
}

export interface ExpensesWithCashier {
  expenses: Expenses;
  user: Users;
}

export function filterExpensesDaily(
  expenses: ExpensesWithCashier[],
  date: Date
): PrintableExpenses[] {
  const formattedDate = formatDateDaily(date);
  return expenses
    .filter(
      ({ expenses }) => formatDateDaily(expenses.createdAt) === formattedDate
    )
    .map(({ expenses, user }) => ({
      id: expenses.id,
      description: expenses.description,
      amount: expenses.cash,
      cashier: user.name,
      createdAt: formattedDate,
    }));
}

export function filterExpensesWeekly(
  expenses: ExpensesWithCashier[],
  date: Date
): PrintableExpenses[] {
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const formattedDate = formatDateWeekly(startOfWeek, endOfWeek);

  return expenses
    .filter(({ expenses }) => {
      const expenseDate = new Date(expenses.createdAt);
      return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
    })
    .map(({ expenses, user }) => ({
      id: expenses.id,
      description: expenses.description,
      amount: expenses.cash,
      cashier: user.name,
      createdAt: formattedDate,
    }));
}

// Function to filter expenses for a specific month
export function filterExpensesMonthly(
  expenses: ExpensesWithCashier[],
  date: Date
): PrintableExpenses[] {
  const formattedDate = formatDateMonthly(date);

  return expenses
    .filter(
      ({ expenses }) => formatDateMonthly(expenses.createdAt) === formattedDate
    )
    .map(({ expenses, user }) => ({
      id: expenses.id,
      description: expenses.description,
      amount: expenses.cash,
      cashier: user.name,
      createdAt: formattedDate,
    }));
}
