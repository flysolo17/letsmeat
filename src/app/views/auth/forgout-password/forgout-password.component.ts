import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toast, ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgout-password',
  templateUrl: './forgout-password.component.html',
  styleUrls: ['./forgout-password.component.css'],
})
export class ForgoutPasswordComponent {
  activeModal = inject(NgbActiveModal);
  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  forgotPassword() {
    if (this.emailForm.valid) {
      let email = this.emailForm.controls['email'].value ?? '';
      this.authService
        .forgotPassword(email)
        .then(() => {
          this.toastr.success(`an email sent to : ${email}`);
          this.activeModal.close('CLOSE CLICKED');
        })
        .catch((err) => {
          this.toastr.error(err.toString());
        });
    }
  }
}
