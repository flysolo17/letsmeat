import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { MainRoutingModule } from './main.routing.module';
import { InventoryModule } from './inventory/inventory.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomersComponent } from './customers/customers.component';
import { StaffComponent } from './staff/staff.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesComponent } from './messages/messages.component';
import { OrdersComponent } from './orders/orders.component';
import { CreateStaffComponent } from './create-staff/create-staff.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportGenerationComponent } from '../reports/report-generation/report-generation.component';
import { ViewCustomerProfileComponent } from './view-customer-profile/view-customer-profile.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RecentProductsComponent } from './recent-products/recent-products.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ExpensesComponent } from './expenses/expenses.component';
@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent,
    TransactionsComponent,
    CustomersComponent,
    RecentProductsComponent,
    StaffComponent,
    ExpensesComponent,
    ViewCustomerProfileComponent,
    ProfileComponent,
    MessagesComponent,
    ReportGenerationComponent,
    OrdersComponent,
    CreateStaffComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbNavModule,
    MainRoutingModule,
    InventoryModule,
    NgbDropdownModule,
    BrowserModule,
    FormsModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgApexchartsModule,
  ],
  exports: [MainComponent, CustomersComponent, OrdersComponent],
})
export class MainModule {}
