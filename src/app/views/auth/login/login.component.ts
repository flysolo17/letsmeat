import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Users } from 'src/app/models/accounts/User';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterComponent } from '../register/register.component';
import { FirebaseError } from '@angular/fire/app';
import { ForgoutPasswordComponent } from '../forgout-password/forgout-password.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  private modalService = inject(NgbModal);
  registerUser(user: Users) {
    const modalRef = this.modalService.open(RegisterComponent);
    modalRef.componentInstance.users = user;
  }
  forgot() {
    this.modalService.open(ForgoutPasswordComponent);
  }
  onSubmit() {
    if (this.loginForm.valid) {
      let email = this.loginForm.controls['email'].value;
      let password = this.loginForm.controls['password'].value;
      this.authService
        .getUserByEmail(email)
        .then((data) => {
          if (data !== null) {
            this.authService
              .login(email, password)
              .then((task) => {
                this.toastr.success('Successfully Logged in');
              })
              .catch((err: FirebaseError) => {
                console.log(err);
                if (err.code == 'auth/user-not-found') {
                  this.registerUser(data);
                  return;
                }
                this.toastr.error(err['message']);
              });
          } else {
            this.toastr.error('User not found!');
          }
        })
        .catch((err) => {
          console.log(err);
          this.toastr.error(err.toString());
        });
    } else {
      this.toastr.error('Unknown error!');
    }
  }
}
