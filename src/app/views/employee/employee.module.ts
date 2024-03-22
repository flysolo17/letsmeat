import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeMainComponent } from './employee-main/employee-main.component';
import { PosComponent } from './pos/pos.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { ProductOptionsSelectionComponent } from './product-options-selection/product-options-selection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeTransactionsComponent } from './employee-transactions/employee-transactions.component';
import { CashRegisterComponent } from './cash-register/cash-register.component';

@NgModule({
  declarations: [
    EmployeeMainComponent,
    PosComponent,
    ProductOptionsSelectionComponent,
    EmployeeTransactionsComponent,
    CashRegisterComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  exports: [EmployeeMainComponent],
})
export class EmployeeModule {}
