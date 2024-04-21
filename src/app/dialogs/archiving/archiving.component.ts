import { Component, Input, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Users } from 'src/app/models/accounts/User';
import { Archives } from 'src/app/models/archives/Archives';
import {
  ExpensesWithCashier,
  printExpenses,
} from 'src/app/models/expenses/Expenses';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { ArchiveService } from 'src/app/services/archive.service';
import { AuthService } from 'src/app/services/auth.service';
import { PrintingServiceService } from 'src/app/services/printing-service.service';
import {
  toFullShortDate,
  getStartTime,
  getEndTime,
  generateNumberString,
} from 'src/app/utils/Constants';

@Component({
  selector: 'app-archiving',
  templateUrl: './archiving.component.html',
  styleUrls: ['./archiving.component.css'],
})
export class ArchivingComponent {
  activeModal = inject(NgbActiveModal);
  reportForm$: FormGroup;
  @Input('transactions') transactions: Transactions[] = [];

  constructor(
    private fb: FormBuilder,
    private archiveService: ArchiveService,
    private toastr: ToastrService
  ) {
    this.reportForm$ = this.fb.group(
      {
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        title: ['', [Validators.required]],
      },
      { validators: dateRangeValidator }
    );
  }
  onSubmit() {
    if (this.reportForm$.valid) {
      let start = this.reportForm$.get('startDate')?.value ?? '';
      let end = this.reportForm$.get('endDate')?.value ?? '';
      let title = this.reportForm$.get('title')?.value ?? '';
      let data = this.transactions.filter((e) => {
        return (
          e.transactionDate >= getStartTime(start) &&
          e.transactionDate <= getEndTime(end)
        );
      });

      if (data.length > 0) {
        this.saveArchive(title, data);
      } else {
        this.toastr.warning('No Transactions to arcive');
      }
    }
  }
  saveArchive(title: string, transactions: Transactions[]) {
    let id = generateNumberString();
    let archive: Archives = {
      id: id,
      title: title,
      transactions: transactions,
      createdAt: new Date(),
    };
    this.archiveService
      .addToArchives(archive)
      .then((data) => {
        this.toastr.success('Archive saved!');
      })
      .catch((err) => {
        this.toastr.error(err['message'].toString());
      })
      .finally(() => this.activeModal.close(''));
  }

  deletePermanently() {
    let start = this.reportForm$.get('startDate')?.value ?? '';
    let end = this.reportForm$.get('endDate')?.value ?? '';

    let data = this.transactions.filter((e) => {
      e.transactionDate >= getStartTime(start) &&
        e.transactionDate <= getEndTime(end);
    });
    if (this.transactions.length > 0) {
      this.archiveService
        .deletePermanently(data)
        .then(() => {
          this.toastr.success('Deleted successfully!');
        })
        .catch((err) => {
          this.toastr.error(err['message'].toString());
        })
        .finally(() => this.activeModal.close(''));
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
