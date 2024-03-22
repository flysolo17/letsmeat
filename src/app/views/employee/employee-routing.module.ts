import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosComponent } from './pos/pos.component';
import { EmployeeMainComponent } from './employee-main/employee-main.component';
import { InventoryMainComponent } from '../main/inventory/inventory-main/inventory-main.component';
import { OrdersComponent } from '../main/orders/orders.component';
import { ProfileComponent } from '../main/profile/profile.component';
import { TransactionsComponent } from '../main/transactions/transactions.component';
import { ViewTransactionComponent } from '../view-transaction/view-transaction.component';
import { CashRegisterComponent } from './cash-register/cash-register.component';

const routes: Routes = [
  {
    path: 'employee',
    component: EmployeeMainComponent,
    children: [
      { path: '', component: PosComponent },
      { path: 'pos', component: PosComponent },
      { path: 'cash-register', component: CashRegisterComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'inventory', component: InventoryMainComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'review-transaction', component: ViewTransactionComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
