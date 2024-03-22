import { Component } from '@angular/core';
import { TransactionStatus } from 'src/app/models/transactions/TransactionStatus';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-employee-main',
  templateUrl: './employee-main.component.html',
  styleUrls: ['./employee-main.component.css'],
})
export class EmployeeMainComponent {
  transactions$: Transactions[] = [];
  constructor(private transactionService: TransactionService) {
    transactionService.getAllTransactions().subscribe((data) => {
      this.transactions$ = data;
      transactionService.setTransactions(data);
    });
  }
  countPendingTransaction() {
    return this.transactions$.filter(
      (e) => e.status === TransactionStatus.PENDING
    ).length;
  }
  getPendingTransactions(): number {
    return this.transactions$.filter((data) => data.status === 'PENDING')
      .length;
  }
}
