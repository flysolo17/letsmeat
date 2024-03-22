import { Component, Input, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { getEndTime, getStartTime } from 'src/app/utils/Constants';

@Component({
  selector: 'app-report-choices',

  templateUrl: './report-choices.component.html',
  styleUrls: ['./report-choices.component.css'],
})
export class ReportChoicesComponent {
  activeModal = inject(NgbActiveModal);
  @Input() transactions: Transactions[] = [];
  reportForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.reportForm = this.fb.group(
      {
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        type: ['', [Validators.required]],
      },
      { validators: dateRangeValidator }
    );
  }
  submitReport() {
    if (this.reportForm.valid) {
      let start = this.reportForm.get('startDate')?.value ?? '';
      let end = this.reportForm.get('endDate')?.value ?? '';
      let type = +this.reportForm.get('type')?.value ?? 0;
      let transactions = this.getTransactionsByDate(
        getStartTime(start),
        getEndTime(end)
      );
      const encodedObject = encodeURIComponent(JSON.stringify(transactions));
      console.log(encodedObject);
      if (transactions.length === 0) {
        this.toastr.warning('No Transactions to download');
        return;
      }
      this.activeModal.close();
      this.router.navigate(['main/report-generation'], {
        queryParams: {
          title: this.getTitle(type),
          date: `${getStartTime(start).toDateString()} - ${getStartTime(
            end
          ).toDateString()}`,

          data: encodedObject,
        },
      });
    }
  }

  getTransactionsByDate(start: Date, end: Date): Transactions[] {
    console.log(this.transactions);
    return this.transactions.filter(
      (data) =>
        data.transactionDate.getTime() >= start.getTime() &&
        data.transactionDate.getTime() <= end.getTime()
    );
  }

  getTitle(num: number): string {
    if (num === 1) {
      return 'WALK IN TRANSACTIONS';
    }
    return '';
  }
}

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDateString = control.get('startDate')?.value;
    const endDateString = control.get('endDate')?.value;

    // Parse date strings into Date objects
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    // Set hours, minutes, seconds, and milliseconds to zero
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      return { dateRange: true }; // Return error if startDate is later than endDate
    }

    return null;
  };
}
