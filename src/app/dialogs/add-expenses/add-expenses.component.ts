import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { user } from 'rxfire/auth';
import { Users } from 'src/app/models/accounts/User';
import { Expenses } from 'src/app/models/expenses/Expenses';
import { ExpensesService } from 'src/app/services/expenses.service';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.css'],
})
export class AddExpensesComponent {
  activeModal = inject(NgbActiveModal);
  expensesForm$: FormGroup;
  @Input('users') users!: Users;
  constructor(
    private fb: FormBuilder,
    private expensesService: ExpensesService,
    private toastr: ToastrService
  ) {
    this.expensesForm$ = this.fb.group({
      cash: [0, Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.expensesForm$.valid) {
      let cash: number = this.expensesForm$.get('cash')?.value ?? 0;
      let description: string =
        this.expensesForm$.get('description')?.value ?? '';
      let expenses: Expenses = {
        id: '',
        cash: +cash,
        description: description,
        cashier: this.users.id,
        createdAt: new Date(),
      };
      this.expensesService
        .addExpenses(expenses)
        .then((data) => {
          this.toastr.success('Successfully Added');
          this.activeModal.close(true);
        })
        .catch((err) => {
          this.toastr.error(err['message'].toString());
        });
    }
  }
}
