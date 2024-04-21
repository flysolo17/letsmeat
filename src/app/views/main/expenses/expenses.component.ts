import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { user } from 'rxfire/auth';
import { AddExpensesComponent } from 'src/app/dialogs/add-expenses/add-expenses.component';
import { PrintExpensesComponent } from 'src/app/dialogs/print-expenses/print-expenses.component';
import { Users } from 'src/app/models/accounts/User';
import {
  PrintableExpenses,
  filterExpensesDaily,
  filterExpensesMonthly,
} from 'src/app/models/expenses/Expenses';
import { ExpensesWithCashier } from 'src/app/models/expenses/ExpensesWithCashier';
import { AuthService } from 'src/app/services/auth.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import { PrintingServiceService } from 'src/app/services/printing-service.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent {
  expenses$: ExpensesWithCashier[] = [];
  filteredExpenses$: ExpensesWithCashier[] = [];
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  users$: Users | null = null;
  private modalService$ = inject(NgbModal);
  search() {
    this.currentPage = 1;
    this.filteredExpenses$ = this.expenses$.filter(
      (ex) =>
        ex.expenses.description
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        ex.user.name
          .toLocaleLowerCase()
          .includes(this.searchText.toLocaleLowerCase())
    );
  }

  constructor(
    private expensesService: ExpensesService,
    private authService: AuthService,
    private toastr: ToastrService,
    private printingService: PrintingServiceService
  ) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
    expensesService.getAllExpensesWithCashiers().subscribe((data) => {
      this.expenses$ = data;
      this.filteredExpenses$ = data;
    });
  }

  openPrintExpenseDialog() {
    const modal = this.modalService$.open(PrintExpensesComponent);
    modal.componentInstance.expenses = this.filteredExpenses$;
  }
  addExpenses() {
    const modal = this.modalService$.open(AddExpensesComponent);
    modal.componentInstance.users = this.users$;
    modal.result.then((data) => {
      if (data === false) {
        this.toastr.warning('Add Expenses cancelled');
      }
    });
  }

  printExpenses(title: string) {
    this.printingService.printExpenses(
      title,
      this.users$?.name ?? '',
      filterExpensesMonthly(this.expenses$, new Date('2024-03-01'))
    );
  }

  printData(title: string): PrintableExpenses[] {
    let data: PrintableExpenses[] = [];
    if (title === 'Daily') {
      data = filterExpensesMonthly(this.expenses$, new Date('2024-03-01'));
    }
    return data;
  }
}
