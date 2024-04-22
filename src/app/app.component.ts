import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserType } from './models/accounts/UserType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'letsmeat';

  constructor(private authService: AuthService, private router: Router) {
    console.log(router.url);
    authService.listenToUser().subscribe((user: User | null) => {
      if (user !== null) {
        authService.getUserByEmail(user.email ?? '').then((data) => {
          if (data) {
            authService.setUsers(data);
            if (data.type === UserType.ADMIN) {
              router.navigate(['main']);
            } else if (data.type === UserType.STAFF) {
              router.navigate(['employee']);
            } else {
              router.navigate(['login']);
            }
          }
        });
      } else {
        router.navigate(['login']);
      }
    });
  }
}
