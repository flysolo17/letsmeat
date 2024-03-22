import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { user } from 'rxfire/auth';
import { CustomerWithMessages } from 'src/app/models/CustomerWithMessages';
import { Messages } from 'src/app/models/Messages';
import { Users } from 'src/app/models/accounts/User';
import { AuthService } from 'src/app/services/auth.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { formatMessageDate } from 'src/app/utils/Constants';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent {
  customerWithMessages$: CustomerWithMessages[] = [];
  users$: Users | null = null;
  selectedConvo$ = -1;
  message$: string = '';
  constructor(
    private messageService: MessagingService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    messageService.messages$.subscribe((data) => {
      this.customerWithMessages$ = data;
      console.log(this.customerWithMessages$.length);
    });
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
  }
  setSelectedConvo(index: number) {
    this.selectedConvo$ = index;
  }
  formatMessageDate(date: Date): string {
    return formatMessageDate(date);
  }

  sendMessage(customerID: string) {
    if (!this.message$.trim()) {
      this.toastr.warning('Please add Message');
      return;
    }
    let message: Messages = {
      id: uuidv4(),
      senderID: this.users$?.id ?? '',
      receiverID: customerID,
      message: this.message$,
      createdAt: new Date(),
    };
    this.saveMessage(message);
  }
  saveMessage(message: Messages) {
    this.messageService
      .sendMessage(message)
      .then((data) => {
        this.toastr.success('Message Sent!');
        this.selectedConvo$ = 0;
        this.message$ = '';
      })
      .catch((err) => this.toastr.error(err.toString()));
  }
}
