import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Users } from 'src/app/models/accounts/User';
import { UserType } from 'src/app/models/accounts/UserType';
import { AuthService } from 'src/app/services/auth.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-create-staff',
  templateUrl: './create-staff.component.html',
  styleUrls: ['./create-staff.component.css'],
})
export class CreateStaffComponent {
  activeModal = inject(NgbActiveModal);
  FOR_UPLOAD: any = null;
  staffForm = new FormGroup({
    profile: new FormControl(''),
    name: new FormControl('', Validators.required),
    type: new FormControl(UserType.STAFF, [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.maxLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  onSelectImage(event: any) {
    this.FOR_UPLOAD = event.target.files[0];
  }
  async submit() {
    if (this.FOR_UPLOAD == null) {
      this.toastr.warning('Please add image');
      return;
    }

    try {
      const result = await this.authService.uploadProfile(this.FOR_UPLOAD);
      this.saveStaff(result);
    } catch (err: any) {
      this.toastr.error(err.toString());
    }
  }
  saveStaff(imageURL: string) {
    let name = this.staffForm.get('name')?.value ?? '';
    let type = this.staffForm.get('type')?.value ?? UserType.STAFF;
    let phone = this.staffForm.get('phone')?.value ?? '';
    let email = this.staffForm.get('email')?.value ?? '';
    let users: Users = {
      id: uuidv4(),
      profile: imageURL,
      name: name,
      email: email.toLocaleLowerCase(),
      phone: phone,
      type: type == 'STAFF' ? UserType.STAFF : UserType.DRIVER,
    };
    this.authService
      .createUser(users)
      .then(() => {
        this.toastr.success('Successfully Created');
        this.activeModal.close('CLOSE CLICK');
      })
      .catch((err) => this.toastr.error(err.toString()));
  }
}
