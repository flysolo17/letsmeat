import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgoutPasswordComponent } from './forgout-password/forgout-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgoutPasswordComponent, ChangePasswordComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
