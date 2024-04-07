import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AddExpensesComponent } from 'src/app/dialogs/add-expenses/add-expenses.component';
import { Users } from 'src/app/models/accounts/User';
import { ExpensesWithCashier } from 'src/app/models/expenses/ExpensesWithCashier';
import { AuthService } from 'src/app/services/auth.service';
import { ExpensesService } from 'src/app/services/expenses.service';

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
    private toastr: ToastrService
  ) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
    expensesService.expenses$.subscribe((data) => {
      this.expenses$ = data;
      this.filteredExpenses$ = data;
    });
  }

  private modalService$ = inject(NgbModal);
  addExpenses() {
    const modal = this.modalService$.open(AddExpensesComponent);
    modal.componentInstance.users = this.users$;
    modal.result.then((data) => {
      if (data === false) {
        this.toastr.warning('Add Expenses cancelled');
      }
    });
  }
}
