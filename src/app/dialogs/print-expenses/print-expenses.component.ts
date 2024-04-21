import { Component, Input, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Users } from 'src/app/models/accounts/User';
import {
  Expenses,
  ExpensesWithCashier,
  printExpenses,
} from 'src/app/models/expenses/Expenses';
import { AuthService } from 'src/app/services/auth.service';
import { PrintingServiceService } from 'src/app/services/printing-service.service';
import {
  getEndTime,
  getStartTime,
  toFullShortDate,
} from 'src/app/utils/Constants';

@Component({
  selector: 'app-print-expenses',
  templateUrl: './print-expenses.component.html',
  styleUrls: ['./print-expenses.component.css'],
})
export class PrintExpensesComponent {
  activeModal = inject(NgbActiveModal);
  reportForm$: FormGroup;
  user$: Users | null = null;
  @Input('expenses') expenses: ExpensesWithCashier[] = [];
  users$: any;
  constructor(
    private fb: FormBuilder,
    private printingService: PrintingServiceService,
    private authService: AuthService
  ) {
    authService.users$.subscribe((data) => {
      this.user$ = data;
    });
    this.reportForm$ = this.fb.group(
      {
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
      },
      { validators: dateRangeValidator }
    );
  }
  onSubmit() {
    if (this.reportForm$.valid) {
      let start = this.reportForm$.get('startDate')?.value ?? '';
      let end = this.reportForm$.get('endDate')?.value ?? '';

      let formattedDate = `${toFullShortDate(
        getStartTime(start)
      )} to ${toFullShortDate(getEndTime(end))}`;
      this.printingService.printExpenses(
        'Expenses',
        this.users$?.name ?? '',
        printExpenses(this.expenses, getStartTime(start), getEndTime(end))
      );
    }
  }
}

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDateString = control.get('startDate')?.value;
    const endDateString = control.get('endDate')?.value;

    // Parse date strings into Date objects
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      return { dateRange: true };
    }

    return null;
  };
}
