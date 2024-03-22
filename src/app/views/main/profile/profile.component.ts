import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { user } from 'rxfire/auth';
import { Users } from 'src/app/models/accounts/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  users$: Users | null = null;
  constructor(private authService: AuthService, private router: Router) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
