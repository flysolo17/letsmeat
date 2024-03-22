import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { Users } from 'src/app/models/accounts/User';
import { UserType } from 'src/app/models/accounts/UserType';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
})
export class AddDriverComponent {
  activeModal = inject(NgbActiveModal);

  saveDriver(data: string) {
    this.activeModal.close(data);
  }

  drivers$: Users[] = [];

  constructor(private authService: AuthService) {
    authService
      .getAllStaff()
      .pipe(map((users) => users.filter((e) => e.type == UserType.DRIVER)))
      .subscribe((data) => {
        this.drivers$ = data;
      });
  }
}
