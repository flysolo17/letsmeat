import { Component, OnInit, ViewChild } from '@angular/core';
import { Users } from 'src/app/models/accounts/User';
import { TransactionDetails } from 'src/app/models/transactions/TransactionDetails';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionService } from 'src/app/services/transaction.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
} from 'ng-apexcharts';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { TransactionStatus } from 'src/app/models/transactions/TransactionStatus';
import { UserType } from 'src/app/models/accounts/UserType';
import { Router } from '@angular/router';
import { ExpensesWithCashier } from 'src/app/models/expenses/ExpensesWithCashier';
import { ExpensesService } from 'src/app/services/expenses.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
export interface DetailsWithTransaction {
  details: TransactionDetails;
  transaction: Transactions;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users$: Users | null = null;
  details$: DetailsWithTransaction[] = [];
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};
  transactions$: Transactions[] = [];
  expenses$: ExpensesWithCashier[] = [];
  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private expensesService: ExpensesService,
    private router: Router
  ) {
    expensesService.expenses$.subscribe((data) => {
      this.expenses$ = data;
    });
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
    transactionService.transactions$.subscribe((data) => {
      this.details$ = [];
      this.transactions$ = data;

      data.forEach((value, index) => {
        value.details.forEach((details, index) => {
          this.details$.push({
            details: details,
            transaction: value,
          });
        });
      });
      this.details$ = this.details$.sort((a, b) => {
        const dateA = new Date(a.details.createdAt);
        const dateB = new Date(b.details.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    });
  }
  ngOnInit(): void {
    this.generateChartData(this.transactions$, this.expenses$);
  }
  get expensesTotal() {
    let count = 0;
    this.expenses$.forEach((e) => {
      count += e.expenses.cash;
    });
    return count;
  }
  getTotalPerMonth(month: number): number {
    let count = 0;
    this.transactions$.map((data) => {
      if (
        data.transactionDate.getDate() === month &&
        data.status === TransactionStatus.COMPLETED
      ) {
        count += data.payment.total;
      }
    });
    return count;
  }

  generateChartData(
    transactions: Transactions[],
    expenses: ExpensesWithCashier[]
  ): void {
    const salesData = Array(12).fill(0);
    const expensesData = Array(12).fill(0);

    transactions.forEach((transaction) => {
      if (transaction.status === TransactionStatus.COMPLETED) {
        const month = transaction.transactionDate.getMonth();
        const amount = transaction.payment.total;
        salesData[month] += amount;
      }
    });

    expenses.forEach((expense) => {
      const month = new Date(expense.expenses.createdAt).getMonth();
      expensesData[month] += expense.expenses.cash;
    });
    console.log(expensesData);

    this.chartOptions = {
      series: [
        {
          name: 'Sales',
          data: salesData,
        },
        {
          name: 'Expenses',
          data: expensesData,
        },
      ],
      chart: {
        height: 500,
        type: 'bar',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },

      title: {
        text: 'Sales And Expenses Per Year',
      },
      xaxis: {
        categories: [
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
        ],
      },
    };
  }
  computeTotalSales(): number {
    let total = 0;
    this.transactions$.forEach((data) => {
      if (data.status === TransactionStatus.COMPLETED) {
        total += data.payment.total;
      }
    });
    return total;
  }

  newTab(transaction: Transactions) {
    const encodedTransaction = encodeURIComponent(JSON.stringify(transaction));
    const data = this.users$?.type === UserType.ADMIN ? 'main' : 'employee';
    this.router.navigate([`${data}/review-transaction`], {
      queryParams: { data: encodedTransaction },
    });
  }
}
