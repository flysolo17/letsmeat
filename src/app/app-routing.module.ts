import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { MainComponent } from './views/main/main/main.component';

import { MainRoutingModule } from '././views/main/main.routing.module';
import { MainModule } from './views/main/main.module';
import { EmployeeMainComponent } from './views/employee/employee-main/employee-main.component';
import { EmployeeModule } from './views/employee/employee.module';
import { EmployeeRoutingModule } from './views/employee/employee-routing.module';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  {
    path: 'employee',
    component: EmployeeMainComponent,
    loadChildren: () =>
      import('././views/employee/employee-routing.module').then(
        (m) => m.EmployeeRoutingModule
      ),
  },
  {
    path: 'main',
    component: MainComponent,
    loadChildren: () =>
      import('././views/main/main.routing.module').then(
        (m) => m.MainRoutingModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), MainModule, EmployeeModule],
  exports: [RouterModule, MainRoutingModule, EmployeeRoutingModule],
})
export class AppRoutingModule {}
