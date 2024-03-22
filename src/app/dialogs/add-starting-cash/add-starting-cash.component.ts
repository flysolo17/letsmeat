import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Users } from 'src/app/models/accounts/User';
import { CashRegister } from 'src/app/models/cashregister/CashRegister';
import { CashRegisterService } from 'src/app/services/cash-register.service';
import { generateNumberString } from 'src/app/utils/Constants';

@Component({
  selector: 'app-add-starting-cash',
  templateUrl: './add-starting-cash.component.html',
  styleUrls: ['./add-starting-cash.component.css'],
})
export class AddStartingCashComponent {
  cashReceived$: number = 0;
  activeModal = inject(NgbActiveModal);

  @Input('users') users!: Users;
  onPaymentReceivedChange(event: any) {
    const cashReceived = event.target.value;
    this.cashReceived$ = cashReceived;
    console.log('Cash Received:', cashReceived);
  }

  constructor(
    private cashRegisterService: CashRegisterService,
    private toastr: ToastrService
  ) {}
  submit(): void {
    if (this.cashReceived$ === 0 || isNaN(this.cashReceived$)) {
      this.toastr.warning('Invalid Amount');
      return;
    }

    let cashRegister: CashRegister = {
      id: generateNumberString(),
      cashierID: this.users?.id ?? '',
      amount: +this.cashReceived$,
      dateIssued: new Date(),
    };

    this.cashRegisterService
      .addCash(cashRegister)
      .then(() => {
        this.toastr.success('Successfully Added!');
        this.activeModal.close(true);
      })
      .catch((err) => {
        let errorMessage =
          'An error occurred while adding cash. Please try again.';
        if (err.message) {
          errorMessage = err.message.toString();
        }
        this.toastr.error(errorMessage);
      });
  }
}
