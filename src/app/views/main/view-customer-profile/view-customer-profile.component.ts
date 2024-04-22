import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
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
export class ViewCustomerProfileComponent implements OnInit, OnDestroy {
  customer: Customer | null = null;
  transactions$: Transactions[] = [];
  customerID$: string | null = null;
  transactionSub$: Subscription;
  customerSub$: Subscription;

  default$: Transactions[] = [];
  searchText: string = '';
  constructor(
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private location: Location
  ) {
    this.transactionSub$ = new Subscription();
    this.customerSub$ = new Subscription();
    this.route.params.subscribe((params) => {
      this.customerID$ = params['id'] || null;
    });
  }

  ngOnInit(): void {
    this.customerSub$ = this.customerService
      .getCustomerByID(this.customerID$ ?? '')
      .subscribe((data) => {
        this.customer = data;
      });
    this.transactionSub$ = this.transactionService
      .getTransactionByCustomerID(this.customerID$ ?? '')
      .subscribe((data) => {
        this.default$ = data;
        this.transactions$ = data;
      });
  }
  ngOnDestroy(): void {
    this.transactionSub$.unsubscribe();
    this.customerSub$.unsubscribe();
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
      .finally(() => this.location.back());
  }
  toRegular(customerID: string) {
    this.customerService
      .toRegular(customerID)
      .then(() => this.toastr.success('Successfully updated'))
      .catch((err) => this.toastr.error(err.toString()))
      .finally(() => this.location.back());
  }

  onSearch(data: string) {
    if (data === '') {
      this.transactions$ = this.default$;
    } else {
      this.transactions$ = this.default$.filter((e) => e.id.startsWith(data));
    }
  }
}
