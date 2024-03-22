import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Addresses } from 'src/app/models/customers/Addresses';
import { Customer } from 'src/app/models/customers/Customer';
import { TransactionStatus } from 'src/app/models/transactions/TransactionStatus';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { CustomerService } from 'src/app/services/customer.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { getDefaultAddress } from 'src/app/utils/Constants';

@Component({
  selector: 'app-view-customer-profile',
  templateUrl: './view-customer-profile.component.html',
  styleUrls: ['./view-customer-profile.component.css'],
})
export class ViewCustomerProfileComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  @Input() customer!: Customer;
  transactions$: Transactions[] = [];
  constructor(
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.transactionService
      .getTransactionByCustomerID(this.customer.id ?? '')
      .subscribe((data) => {
        this.transactions$ = data;
      });
  }
  displayDefaultAddress(current: number, addresses: Addresses[]) {
    return getDefaultAddress(current, addresses);
  }

  displayStatus(status: number) {
    // PENDING = 'PENDING', 1
    // ACCEPTED = 'ACCEPTED', 1
    // TO_SHIP = 'TO_SHIP', 2
    // TO_PICK_UP = 'TO_PICK_UP', 2
    // TO_PACKED = 'TO_PACKED', 1
    // TO_RECEIVE = 'TO_RECEIVE', 2
    // COMPLETED = 'COMPLETED', 3

    if (status == 1) {
      return this.transactions$.filter(
        (e) =>
          e.status == TransactionStatus.PENDING ||
          e.status == TransactionStatus.ACCEPTED
      ).length;
    } else if (status == 2) {
      return this.transactions$.filter(
        (e) =>
          e.status == TransactionStatus.TO_SHIP ||
          e.status == TransactionStatus.TO_PICK_UP ||
          e.status == TransactionStatus.TO_RECEIVE
      ).length;
    } else if (status == 3) {
      return this.transactions$.filter(
        (e) => e.status == TransactionStatus.COMPLETED
      ).length;
    } else {
      return 0; // Default case if status doesn't match any condition
    }
  }

  toWholesaler(customerID: string) {
    this.customerService
      .toWholesaler(customerID)
      .then(() => this.toastr.success('Successfully updated'))
      .catch((err) => this.toastr.error(err.toString()))
      .finally(() => this.activeModal.close());
  }
  toRegular(customerID: string) {
    this.customerService
      .toRegular(customerID)
      .then(() => this.toastr.success('Successfully updated'))
      .catch((err) => this.toastr.error(err.toString()))
      .finally(() => this.activeModal.close());
  }
}
