import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Users } from 'src/app/models/accounts/User';
import { CreateStaffComponent } from '../create-staff/create-staff.component';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent {
  users$: Users[] = [];
  private modalService = inject(NgbModal);
  createStaff() {
    this.modalService.open(CreateStaffComponent, {
      size: 'lg',
    });
  }
  constructor(private authService: AuthService, private toastr: ToastrService) {
    authService.getAllStaff().subscribe((data) => {
      this.users$ = data;
    });
  }

  deleteStaff(id: string) {
    this.authService
      .deleteAccount(id)
      .then((data) => this.toastr.success('Successfully Deleted!'))
      .catch((err) => this.toastr.error(err['message']));
  }
}
