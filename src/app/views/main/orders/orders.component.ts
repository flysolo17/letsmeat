import { Component, OnInit, PipeTransform, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { TransactionService } from 'src/app/services/transaction.service';
import { AddPaymentComponent } from '../../add-payment/add-payment.component';
import { Users } from 'src/app/models/accounts/User';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionDetails } from 'src/app/models/transactions/TransactionDetails';
import { ToastrService } from 'ngx-toastr';
import { Payment } from 'src/app/models/transactions/Payment';
import { PaymentStatus } from 'src/app/models/transactions/PaymentStatus';
import { UpdateProductComponent } from '../inventory/update-product/update-product.component';
import { UpdateTransactionStatusComponent } from '../../update-transaction-status/update-transaction-status.component';
import { TransactionStatus } from 'src/app/models/transactions/TransactionStatus';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  pipe,
  startWith,
  switchMap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { Transaction } from '@angular/fire/firestore';
import { DecimalPipe } from '@angular/common';
import { AddDriverComponent } from '../../add-driver/add-driver.component';
import { ViewTransactionComponent } from '../../view-transaction/view-transaction.component';
import { Router } from '@angular/router';
import { UserType } from 'src/app/models/accounts/UserType';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  transactions$: Transactions[] = [];
  users$: Users | null = null;
  active = 1;
  currentPage = 1;
  itemsPerPage = 20;

  filteredProducts$: Transactions[] = [];
  searchText: string = '';
  private modalService = inject(NgbModal);
  openTransaction(transaction: Transactions) {
    const encodedTransaction = encodeURIComponent(JSON.stringify(transaction));
    this.router.navigate(['main/review-transaction'], {
      queryParams: { data: encodedTransaction },
    });
  }

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
  }
  ngOnInit(): void {
    this.transactionService.getAllTransactions().subscribe((data) => {
      this.transactions$ = data;
      this.filteredProducts$ = data;
    });
  }

  filterTransactionByStatus(status: string): Transactions[] {
    return this.filteredProducts$.filter((e) => e.status === status);
  }

  search(): void {
    this.filteredProducts$ = this.transactions$.filter((trans) =>
      trans.id.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  addPayment(transaction: Transactions) {
    const modalRef = this.modalService.open(AddPaymentComponent, {});
    modalRef.componentInstance.total = transaction.payment.total;
    modalRef.componentInstance.cashier = this.users$;
    modalRef.result.then((details: TransactionDetails) => {
      if (!details) {
        this.toastr.error('Invalid Details');
        return;
      }
      this.submitPayment(
        transaction.id ?? '',
        this.users$?.id ?? '',
        transaction.payment,
        details
      );
    });
  }

  submitPayment(
    transactionID: string,
    employeeID: string,
    payment: Payment,
    details: TransactionDetails
  ) {
    payment.status = PaymentStatus.PAID;
    payment.updatedAt = new Date();
    this.transactionService
      .markAsPaid(transactionID, employeeID, payment, details)
      .then((data) => {
        this.toastr.success('Payment Updated!');
      })
      .catch((data) => {
        this.toastr.error(data.toString());
      })
      .finally(() => this.modalService.dismissAll());
  }
  openUpdateStatusDialog(transaction: Transactions, status: number) {
    const modalRef = this.modalService.open(
      UpdateTransactionStatusComponent,
      {}
    );
    modalRef.componentInstance.transaction = transaction;
    modalRef.componentInstance.status = this.getStatus(status);
    modalRef.componentInstance.users = this.users$;
  }

  openAddDriverDialog(transaction: Transactions) {
    console.log('Test');
    const modalRef = this.modalService.open(AddDriverComponent);
    modalRef.result.then((data: string) => {
      this.saveDriver(transaction.id, data);
    });
  }
  saveDriver(transactionID: string, driver: string) {
    this.transactionService
      .addDriver(transactionID, driver)
      .then(() => this.toastr.success('Successfully Added'))
      .catch((err) => this.toastr.error(err.toString()));
  }

  getStatus(status: number): TransactionStatus {
    switch (status) {
      case 0:
        return TransactionStatus.PENDING;
      case 1:
        return TransactionStatus.ACCEPTED;
      case 2:
        return TransactionStatus.TO_SHIP;
      case 3:
        return TransactionStatus.TO_PICK_UP;
      case 5:
        return TransactionStatus.TO_RECEIVE;
      case 6:
        return TransactionStatus.COMPLETED;
      case 7:
        return TransactionStatus.DECLINED;
      case 8:
        return TransactionStatus.CANCELED;
      default:
        throw new Error('Invalid status');
    }
  }
  acceptTransaction(transaction: Transactions) {
    transaction.employeeID = this.users$?.id ?? '';
    transaction.status = TransactionStatus.ACCEPTED;
    transaction.details.push({
      title: TransactionStatus.ACCEPTED,
      description: 'Your order is accepted',
      createdAt: new Date(),
    });

    this.transactionService
      .acceptTransaction(transaction)
      .then((data) => {
        this.toastr.success('Transaction Updated');
      })
      .catch((err) => this.toastr.error(err['message']));
  }
}
