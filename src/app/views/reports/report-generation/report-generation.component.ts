import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transactions } from 'src/app/models/transactions/Transactions';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PrintingServiceService } from 'src/app/services/printing-service.service';
@Component({
  selector: 'app-report-generation',
  templateUrl: './report-generation.component.html',
  styleUrls: ['./report-generation.component.css'],
})
export class ReportGenerationComponent implements OnInit {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  transactions$: Transactions[] = [];
  title$: string = '';
  date$: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private printingService: PrintingServiceService
  ) {
    this.getQueryParamValues();
  }
  ngOnInit(): void {
    this.getQueryParamValues();
  }

  getQueryParamValues() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const title = params['title'];
      const dateRange = params['date'];
      const data = params['data'];
      if (data) {
        const decodedData = decodeURIComponent(data);
        const transactions = JSON.parse(decodedData);
        const transactionsWithDates = transactions.map((transaction: any) => {
          if (transaction.updatedAt) {
            transaction.updatedAt = new Date(transaction.updatedAt);
          }
          if (transaction.transactionDate) {
            transaction.transactionDate = new Date(transaction.transactionDate);
          }
          return transaction;
        });
        this.transactions$ = transactionsWithDates as Transactions[];
      }
      this.title$ = title;
      this.date$ = dateRange;
    });
  }

  convertToPdf() {
      // const content = this.pdfContent.nativeElement;
      // const pdf = new jsPDF('p', 'mm', 'a4');
      // const options = { scale: 2 };
      // html2canvas(content, options).then((canvas) => {
      //   const imageData = canvas.toDataURL('image/png');
      //   pdf.addImage(imageData, 'PNG', 0, 0, 210, 297); // A4 size: 210 x 297 mm
      //   pdf.save(`${this.title$}.pdf`);
      // });
  }
  getTotal(): number {
    let count = 0;
    this.transactions$.map((data) => {
      count += data.payment.total;
    });

    return count;
  }
}
