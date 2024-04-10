import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
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
import { end } from '@popperjs/core';
import { ToastrService } from 'ngx-toastr';
import { Users } from 'src/app/models/accounts/User';
import { OrderItems } from 'src/app/models/transactions/OrderItems';
import {
  PrintTransactionData,
  PrintableTransactions,
} from 'src/app/models/transactions/PrintableTransactions';
import { TransactionType } from 'src/app/models/transactions/TransactionType';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { AuthService } from 'src/app/services/auth.service';
import { PrintingServiceService } from 'src/app/services/printing-service.service';
import {
  getEndTime,
  getStartTime,
  toFullShortDate,
} from 'src/app/utils/Constants';

@Component({
  selector: 'app-report-choices',
  templateUrl: './report-choices.component.html',
  styleUrls: ['./report-choices.component.css'],
})
export class ReportChoicesComponent {
  activeModal = inject(NgbActiveModal);
  @Input() transactions: Transactions[] = [];
  reportForm: FormGroup;
  users$: Users | null = null;
  @Output() newItemEvent = new EventEmitter<string>();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private printingService: PrintingServiceService
  ) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
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

      let formattedDate = `${toFullShortDate(
        getStartTime(start)
      )} to ${toFullShortDate(getEndTime(end))}`;

      let printData: PrintableTransactions<Transactions[]> = {
        title: this.getTitle(type),
        description: 'Printed by : ' + this.users$?.name,
        date: formattedDate,
        data: this.generateTransactions(),
        shippintTotal: 0,
      };
      this.printingService.printInvoice(printData).finally(() => {
        this.activeModal.close();
      });
    }
  }
  groupTransactionByIDAndGetTotal(
    transactions: Transactions[]
  ): PrintTransactionData[] {
    const groupedTransactions: { [id: string]: PrintTransactionData } = {};

    transactions.forEach((transaction) => {
      const { id, transactionDate, payment, items } = transaction;

      let total = 0;
      let quan = 0;
      items.forEach((item: OrderItems) => {
        total += item.subtotal;
        quan += item.quantity;
      });

      if (!(id in groupedTransactions)) {
        groupedTransactions[id] = {
          transactionID: id,
          items: quan,
          total,
        };
      } else {
        groupedTransactions[id].total += total;
      }
    });
    return Object.values(groupedTransactions);
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
      return 'Walk in Transactions';
    } else if (num === 2) {
      return 'Online Transactions';
    } else if (num === 3) {
      return 'Pick up Transactions';
    } else if (num === 4) {
      return 'Delivery Transactions';
    } else {
      return 'Transactions';
    }
  }
  generateTransactions(): Transactions[] {
    const type: number = +this.reportForm.get('type')?.value ?? 0;
    let start = this.reportForm.get('startDate')?.value ?? '';
    let end = this.reportForm.get('endDate')?.value ?? '';
    let transactions = this.getTransactionsByDate(
      getStartTime(start),
      getEndTime(end)
    );

    transactions = transactions.filter((e) => {
      if (type === 1) {
        return e.type === TransactionType.WALK_IN;
      } else if (type === 2) {
        return e.type !== TransactionType.WALK_IN;
      } else if (type === 3) {
        return e.type === TransactionType.PICK_UP;
      } else if (type === 4) {
        return e.type === TransactionType.DELIVERY;
      }

      return [];
    });
    return transactions;
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
