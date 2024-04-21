import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { TransactionService } from 'src/app/services/transaction.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportChoicesComponent } from '../../reports/report-choices/report-choices.component';
import { ViewTransactionComponent } from '../../view-transaction/view-transaction.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Users } from 'src/app/models/accounts/User';
import { user } from 'rxfire/auth';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UserType } from 'src/app/models/accounts/UserType';
import { FormControl } from '@angular/forms';
import { PrintingServiceService } from 'src/app/services/printing-service.service';
import { ArchivingComponent } from 'src/app/dialogs/archiving/archiving.component';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent {
  transactions$: Transactions[] = [];
  private modalService = inject(NgbModal);
  default$: Transactions[] = [];
  ALL: Transactions[] = [];
  users$: Users | null = null;
  filter = new FormControl('', { nonNullable: true });
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 20;
  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private authService: AuthService,
    private printingService: PrintingServiceService
  ) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
    transactionService.transactions$.subscribe((data) => {
      this.ALL = data;
      if (this.users$?.type === UserType.ADMIN) {
        this.transactions$ = data;
        this.default$ = data;
      } else {
        this.transactions$ = data.filter(
          (e) => e.employeeID === this.users$?.id
        );
        this.default$ = data.filter((e) => e.employeeID === this.users$?.id);
      }
    });
  }

  openArchiving() {
    const modal = this.modalService.open(ArchivingComponent);
    modal.componentInstance.transactions = this.ALL;
  }
  openTransaction(transaction: Transactions) {
    const encodedTransaction = encodeURIComponent(JSON.stringify(transaction));
    const data = this.users$?.type === UserType.ADMIN ? 'main' : 'employee';
    this.router.navigate([`${data}/review-transaction`], {
      queryParams: { data: encodedTransaction },
    });
  }
  convertToPdf() {
    this.printingService.printReport('test', 'da', 'data', 'ADmin Test');
  }
  reportChoice() {
    const modalRef = this.modalService.open(ReportChoicesComponent);
    modalRef.componentInstance.transactions = this.transactions$;
  }
  onSearch(data: string) {
    if (data === '') {
      this.transactions$ = this.default$;
    } else {
      this.transactions$ = this.default$.filter((e) => e.id.startsWith(data));
    }
  }

  // convertToPdf() {
  //   const content = this.pdfContent.nativeElement;
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const options = { scale: 2 };
  //   html2canvas(content, options).then((canvas) => {
  //     const imageData = canvas.toDataURL('image/png');
  //     pdf.addImage(imageData, 'PNG', 0, 0, 210, 297); // A4 size: 210 x 297 mm
  //     pdf.save(`test.pdf`);
  //   });
  // }
}
