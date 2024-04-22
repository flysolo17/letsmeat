import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Archives } from 'src/app/models/archives/Archives';
import { ArchiveService } from 'src/app/services/archive.service';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css'],
})
export class ArchivesComponent implements OnDestroy {
  archives$: Archives[] = [];
  subs$: Subscription;
  constructor(private archiveService: ArchiveService, private router: Router) {
    this.subs$ = archiveService.getArchivesAllArchives().subscribe((data) => {
      this.archives$ = data;
    });
  }
  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }
}
