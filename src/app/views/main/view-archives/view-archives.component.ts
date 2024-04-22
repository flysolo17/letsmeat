import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { Observable, Subscription, map } from 'rxjs';
import { Users } from 'src/app/models/accounts/User';
import { Archives } from 'src/app/models/archives/Archives';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { ArchiveService } from 'src/app/services/archive.service';

@Component({
  selector: 'app-view-archives',
  templateUrl: './view-archives.component.html',
  styleUrls: ['./view-archives.component.css'],
})
export class ViewArchivesComponent implements OnInit, OnDestroy {
  archive$: Archives | null = null;
  archiveID$: string | null = null;
  transactions$: Transactions[] = [];
  archiveSub$: Subscription;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastr: ToastrService,
    private archiveService: ArchiveService
  ) {
    this.archiveSub$ = new Subscription();
    this.route.params.subscribe((params) => {
      this.archiveID$ = params['id'] || null;
    });
  }
  ngOnInit(): void {
    if (this.archiveID$) {
      this.archiveSub$ = this.archiveService
        .getArchiveByID(this.archiveID$)
        .subscribe((data) => {
          data.transactions.forEach((e) => {
            e.updatedAt = (e.updatedAt as any).toDate();
            e.transactionDate = (e.transactionDate as any).toDate();
            e.payment.createdAt = (e.payment.createdAt as any).toDate();
            e.payment.updatedAt = (e.payment.updatedAt as any)?.toDate();
          });
          this.archive$ = data;
          this.transactions$ = data.transactions;
        });
    }
  }
  ngOnDestroy(): void {
    this.archiveSub$.unsubscribe();
  }

  displayDate(date: Date) {
    let data = new Date(date);
    return data.toLocaleDateString();
  }

  restore() {
    if (this.archive$) {
      this.archiveService
        .restore(this.archive$)
        .then((data) => {
          this.toastr.success('Successfully Restored!');
        })
        .catch((err) => this.toastr.error(err['message']).toString())
        .finally(() => this.location.back());
    }
  }

  delete() {
    this.archiveService
      .deleteArchive(this.archiveID$ ?? '')
      .then((data) => {
        this.toastr.success('Successfully Deleted!');
      })
      .catch((err) => this.toastr.error(err['message']).toString())
      .finally(() => this.location.back());
  }
  exit() {
    this.location.back();
  }
}
