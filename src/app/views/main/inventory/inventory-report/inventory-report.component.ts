import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpensesWithCashier } from 'src/app/models/expenses/Expenses';
import { Products } from 'src/app/models/products/Products';
import { getEndTime, getStartTime } from 'src/app/utils/Constants';
import { dateRangeValidator } from 'src/app/views/reports/report-choices/report-choices.component';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.css'],
})
export class InventoryReportComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  reportForm: FormGroup;
  @Input('products') products: Products[] = [];
  brand$: string[] = [];
  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group(
      {
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
        brand: [''],
      },
      { validators: dateRangeValidator }
    );
  }
  ngOnInit(): void {
    this.brand$ = Array.from(new Set(this.products.map((e) => e.brand)));
  }

  sumbit() {
    if (this.reportForm.valid) {
      let start = this.reportForm.get('startDate')?.value ?? '';
      let end = this.reportForm.get('endDate')?.value ?? '';
      let brand = this.reportForm.get('brand')?.value ?? '';
      const startDate = getStartTime(start);
      const endDate = getEndTime(end);

      const filteredArr = this.products.filter((e) => {
        if (brand) {
          return (
            e.createdAt >= startDate &&
            e.createdAt <= endDate &&
            e.brand === brand
          );
        } else {
          return e.createdAt >= startDate && e.createdAt <= endDate;
        }
      });

      this.activeModal.close(filteredArr);
    }
  }
}
