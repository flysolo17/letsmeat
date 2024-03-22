import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Users } from 'src/app/models/accounts/User';
import { UserType } from 'src/app/models/accounts/UserType';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  FOR_UPLOAD: any = null;
  @Input() users!: Users;
  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.registerForm = new FormGroup({});
  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: [this.users.email, Validators.required],
      password: ['', Validators.required],
    });
  }
  register() {
    let email = this.registerForm.controls['email'].value ?? this.users.email;
    let password = this.registerForm.controls['password'].value ?? '12345678';
    this.authService
      .signup(email, password)
      .then(() => {
        this.authService.setUsers(this.users);
      })
      .catch((err) => {
        this.toastr.error(err.toString());
      });
  }
}
