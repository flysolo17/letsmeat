import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from './views/auth/auth.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { MainModule } from './views/main/main.module';
import { EmployeeModule } from './views/employee/employee.module';
import { AddPaymentComponent } from './views/add-payment/add-payment.component';
import {
  NgbCalendar,
  NgbDate,
  NgbDatepickerModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportChoicesComponent } from './views/reports/report-choices/report-choices.component';
import { OrdersComponent } from './views/main/orders/orders.component';
import { UpdateTransactionStatusComponent } from './views/update-transaction-status/update-transaction-status.component';
import { AddDriverComponent } from './views/add-driver/add-driver.component';
import { ViewTransactionComponent } from './views/view-transaction/view-transaction.component';
import { AddExpensesComponent } from './dialogs/add-expenses/add-expenses.component';
import { AddStartingCashComponent } from './dialogs/add-starting-cash/add-starting-cash.component';
import { DateRangePickerComponent } from './views/custom/date-range-picker/date-range-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    AddPaymentComponent,
    ReportChoicesComponent,
    UpdateTransactionStatusComponent,
    AddDriverComponent,
    ViewTransactionComponent,
    AddExpensesComponent,
    AddStartingCashComponent,
    DateRangePickerComponent,
  ],
  imports: [
    BrowserModule,
    NgbDatepickerModule,
    AppRoutingModule,
    NgbModule,
    AuthModule,
    CommonModule,
    FormsModule,
    NgbNavModule,
    ReactiveFormsModule,
    EmployeeModule,
    NgbDatepickerModule,
    MainModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
