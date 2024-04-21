import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Users } from 'src/app/models/accounts/User';
import { TransactionDetails } from 'src/app/models/transactions/TransactionDetails';
import { TransactionStatus } from 'src/app/models/transactions/TransactionStatus';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-update-transaction-status',
  templateUrl: './update-transaction-status.component.html',
  styleUrls: ['./update-transaction-status.component.css'],
})
export class UpdateTransactionStatusComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() transaction!: Transactions;
  @Input() status!: TransactionStatus;
  @Input() users!: Users;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private toastr: ToastrService
  ) {
    this.form = fb.group({});
  }
  ngOnInit(): void {
    console.log(`trasaction : ${this.transaction}`);
    console.log(`status : ${this.status}`);
    console.log(`status : ${this.users}`);
    this.form = this.fb.group({
      subject: [this.status, Validators.required],
      description: [
        this.getStatusSampleDescription(this.status),
        Validators.required,
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const subjectValue = formValue.subject;
      const descriptionValue = formValue.description;
      let details: TransactionDetails = {
        title: subjectValue,
        description: descriptionValue,
        createdAt: new Date(),
      };
      console.log(this.transaction);
      this.transactionService
        .updateTransactionStatus(
          this.transaction.id,
          this.status,
          details,
          this.transaction.items
        )
        .then((data) => {
          this.toastr.success(this.status, 'Transaction status updated!');
        })
        .catch((err) => this.toastr.error(err.toString()))
        .finally(() => this.activeModal.close('close'));
    } else {
      this.form.markAllAsTouched();
    }
  }

  getStatusSampleDescription(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.ACCEPTED:
        return 'Your order is accepted';
      case TransactionStatus.TO_SHIP:
        return 'Your order is ready to be shipped';
      case TransactionStatus.TO_PICK_UP:
        return 'Your order is ready for pickup';

      case TransactionStatus.TO_RECEIVE:
        return 'Your order is on the way to you';
      case TransactionStatus.COMPLETED:
        return 'Your order has been completed';
      case TransactionStatus.DECLINED:
        return 'Unfortunately, your order has been declined';
      case TransactionStatus.CANCELED:
        return 'Your order has been canceled';
      default:
        return 'Unknown status';
    }
  }
}
