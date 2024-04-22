import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { MainComponent } from './main/main.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { InventoryMainComponent } from './inventory/inventory-main/inventory-main.component';
import { InventoryModule } from './inventory/inventory.module';
import { CustomersComponent } from './customers/customers.component';
import { StaffComponent } from './staff/staff.component';
import { MessagesComponent } from './messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { ReportGenerationComponent } from '../reports/report-generation/report-generation.component';
import { ViewTransactionComponent } from '../view-transaction/view-transaction.component';
import { RecentProductsComponent } from './recent-products/recent-products.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ArchivesComponent } from './archives/archives.component';
import { ViewArchivesComponent } from './view-archives/view-archives.component';
import { ViewCustomerProfileComponent } from './view-customer-profile/view-customer-profile.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },

      { path: 'orders', component: OrdersComponent },
      { path: 'archives', component: ArchivesComponent },
      { path: 'view-archives/:id', component: ViewArchivesComponent },
      {
        path: 'inventory',
        component: InventoryMainComponent,
        loadChildren: () =>
          import('./inventory/inventory.routing.module').then(
            (m) => m.InventoryRoutingModule
          ),
      },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'recent', component: RecentProductsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'review-transaction', component: ViewTransactionComponent },
      { path: 'report-generation', component: ReportGenerationComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'view-customers/:id', component: ViewCustomerProfileComponent },
      { path: 'staff', component: StaffComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), InventoryModule],
  exports: [RouterModule],
})
export class MainRoutingModule {}
