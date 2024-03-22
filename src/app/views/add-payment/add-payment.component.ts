import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toast } from 'ngx-toastr';
import { Users } from 'src/app/models/accounts/User';
import { TransactionDetails } from 'src/app/models/transactions/TransactionDetails';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css'],
})
export class AddPaymentComponent {
  activeModal = inject(NgbActiveModal);
  @Input() total!: number;
  @Input() cashier!: Users;
  change$: number = 0;
  cashReceived$: number = 0;
  isChangeNan(): boolean {
    return isNaN(this.change$);
  }
  onPaymentReceivedChange(event: any) {
    // Access the value of the input
    const cashReceived = event.target.value;
    this.cashReceived$ = cashReceived;
    this.change$ = this.cashReceived$ - this.total;
    // Do something with the cashReceived value, for example, log it
    console.log('Cash Received:', cashReceived);
  }
  confirmPayment() {
    let transactionDetails: TransactionDetails = {
      title: 'Payment Confirmation',
      description: `${this.cashier.name} is confirming a payment of PHP ${this.total}. The amount received is PHP ${this.cashReceived$}.`,
      createdAt: new Date(),
    };
    this.activeModal.close(transactionDetails);
  }
  isCorrect(): boolean {
    return this.total > this.cashReceived$;
  }
}
