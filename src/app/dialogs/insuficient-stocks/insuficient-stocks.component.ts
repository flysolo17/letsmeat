import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/app/models/products/Products';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-insuficient-stocks',
  templateUrl: './insuficient-stocks.component.html',
  styleUrls: ['./insuficient-stocks.component.css'],
})
export class InsuficientStocksComponent {
  activeModal = inject(NgbActiveModal);
  @Input() transaction!: Transactions;

  constructor(
    private transactionService: TransactionService,
    private toastr: ToastrService
  ) {}

  accept() {
    this.transactionService
      .acceptTransaction(this.transaction)
      .then((data) => {
        this.toastr.success('Transaction Accepted');
        this.activeModal.close();
      })
      .catch((err) => this.toastr.error(err['message']));
  }
}
