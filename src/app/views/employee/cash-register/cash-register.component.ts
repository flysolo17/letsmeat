import { Component, OnInit, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { user } from 'rxfire/auth';
import { AddExpensesComponent } from 'src/app/dialogs/add-expenses/add-expenses.component';
import { AddStartingCashComponent } from 'src/app/dialogs/add-starting-cash/add-starting-cash.component';
import { Users } from 'src/app/models/accounts/User';
import { CashRegister } from 'src/app/models/cashregister/CashRegister';
import { Expenses } from 'src/app/models/expenses/Expenses';
import { PaymentStatus } from 'src/app/models/transactions/PaymentStatus';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { AuthService } from 'src/app/services/auth.service';
import { CashRegisterService } from 'src/app/services/cash-register.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.css'],
})
export class CashRegisterComponent implements OnInit {
  private modalService$ = inject(NgbModal);

  users$: Users | null = null;
  expenses$: Expenses[] = [];
  transaction$: Transactions[] = [];
  cashRegisters$: CashRegister[] = [];

  today$ = new Date();
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private transactionService: TransactionService,
    private expensesService: ExpensesService,
    private cashRegisterService: CashRegisterService
  ) {
    this.today$.setHours(0, 0, 0, 0);
    authService.users$.subscribe((data) => {
      this.users$ = data;
      this.expensesService
        .getAllExpensesToday(data?.id ?? '')
        .subscribe((data) => {
          this.expenses$ = data;
        });
      this.cashRegisterService
        .getAllCashRegisterByCashierID(data?.id ?? '')
        .subscribe((data) => {
          console.log(data);
          this.cashRegisters$ = data;
        });
      transactionService.transactions$.subscribe((t) => {
        this.transaction$ = t.filter(
          (e) =>
            e.employeeID === data?.id &&
            e.transactionDate >= this.today$ &&
            e.payment.status === PaymentStatus.PAID
        );
      });
    });
  }
  ngOnInit(): void {}

  addExpenses() {
    const modal = this.modalService$.open(AddExpensesComponent);
    modal.componentInstance.users = this.users$;
    modal.result.then((data) => {
      if (data === false) {
        this.toastr.warning('Add Expenses cancelled');
      }
    });
  }

  addStartingCash() {
    const modal = this.modalService$.open(AddStartingCashComponent);
    modal.componentInstance.users = this.users$;
    modal.result.then((data) => {
      if (data === false) {
        this.toastr.warning('Add Starting Cash cancelled');
      }
    });
  }

  get totalExpenses(): number {
    let count = 0;
    this.expenses$.forEach((e) => (count += e.cash));
    return count;
  }

  get totalCashRegisterToday(): number {
    let count = 0;
    this.cashRegisters$.forEach((e) => (count += e.amount));
    return count;
  }

  get totalSales(): number {
    let count = 0;
    this.transaction$.forEach((e) => (count += e.payment.total));
    let total = this.totalCashRegisterToday + count - this.totalExpenses;
    return total;
  }

  get totalCash(): number {
    let count = 0;
    this.transaction$.forEach((e) => (count += e.payment.total));

    return count;
  }
}
