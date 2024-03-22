import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerWithMessages } from 'src/app/models/CustomerWithMessages';
import { Users } from 'src/app/models/accounts/User';
import { TransactionStatus } from 'src/app/models/transactions/TransactionStatus';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { AuthService } from 'src/app/services/auth.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  users$: Users | null = null;
  transaction$: Transactions[] = [];
  messages$: CustomerWithMessages[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private transactionService: TransactionService,
    private messagingService: MessagingService,
    private toastr: ToastrService
  ) {
    messagingService.getCustomerWithMessages().subscribe((data) => {
      this.messages$ = data;
      messagingService.setMessages(data);
      console.log(this.messages$);
    });
    transactionService.getAllTransactions().subscribe((data) => {
      this.transaction$ = data;

      transactionService.setTransactions(this.transaction$);
      console.log(`pending orders : ${this.getPendingTransactions()}`);
    });
  }
  ngOnInit(): void {
    this.authService.listenToUser().subscribe((user: User | null) => {
      if (user != null) {
        this.getUserProfile(user.email ?? '');
      } else {
        this.authService.logout();
      }
    });
  }
  getUserProfile(email: string) {
    this.authService.getUserByEmail(email).then((user: Users | null) => {
      if (user) {
        this.users$ = user;
        this.authService.setUsers(this.users$);
      } else {
        this.toastr.error('User not found!');
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
  getPendingTransactions(): number {
    return this.transaction$.filter((data) => data.status === 'PENDING').length;
  }
  countNewMessages(messages: CustomerWithMessages[], uid: string): number {
    let total = 0;
    messages.map((data) => {
      if (data.messages.length !== 0) {
        if (data.messages[data.messages.length - 1].senderID !== uid) {
          total += 1;
        }
      }
    });
    return total;
  }
}
