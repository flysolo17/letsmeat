import { Location } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Users } from 'src/app/models/accounts/User';
import { OrderItems } from 'src/app/models/transactions/OrderItems';
import { TransactionDetails } from 'src/app/models/transactions/TransactionDetails';
import { TransactionType } from 'src/app/models/transactions/TransactionType';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.css'],
})
export class ViewTransactionComponent implements OnInit {
  transaction!: Transactions;
  driver$: Users | null = null;
  constructor(
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const encodedTransaction = params['data'];
      if (encodedTransaction) {
        const decodedTransaction = JSON.parse(
          decodeURIComponent(encodedTransaction)
        );

        // Convert ISO string dates to JavaScript Date objects
        decodedTransaction.updatedAt = new Date(decodedTransaction.updatedAt);
        decodedTransaction.details.forEach((detail: TransactionDetails) => {
          detail.createdAt = new Date(detail.createdAt);
        });
        decodedTransaction.payment.updatedAt = new Date(
          decodedTransaction.payment.updatedAt
        );
        decodedTransaction.transactionDate = new Date(
          decodedTransaction.transactionDate
        );

        console.log(decodedTransaction);
        // Now you have your decoded transaction object
        this.transaction = decodedTransaction;
        if (this.transaction.type === TransactionType.DELIVERY) {
          this.getDriver(this.transaction.driverID);
        }
      }
    });
  }
  computeSubtotal(items: OrderItems[]): number {
    let subtotal = 0;
    items.forEach((data) => {
      subtotal += data.subtotal;
    });

    return subtotal;
  }

  async getDriver(driverID: string) {
    if (driverID === '') {
      return;
    }
    this.driver$ = await this.authService.getDriver(driverID);
  }
  openLink(link: string): void {
    window.open(link, '_blank');
  }
}
