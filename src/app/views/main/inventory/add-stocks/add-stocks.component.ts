import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/app/models/products/Products';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-stocks',
  templateUrl: './add-stocks.component.html',
  styleUrls: ['./add-stocks.component.css'],
})
export class AddStocksComponent implements OnInit {
  currentDate: string;
  activeModal = inject(NgbActiveModal);
  @Input() product!: Products;
  stocksForm: FormGroup;
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    const now = new Date();
    this.currentDate = now.toISOString().slice(0, 10);
    this.stocksForm = new FormGroup({});
  }
  ngOnInit(): void {
    const expirationDate = new Date(this.product.expiration)
      .toISOString()
      .slice(0, 10);
    this.stocksForm = this.fb.group({
      stocks: [0, Validators.required],
      expiration: [expirationDate, Validators.required],
    });
  }
  submit() {
    let stocks = this.stocksForm.get('stocks')?.value ?? 0;

    this.productService
      .addStocks(this.product.id, this.getExpiration(), stocks)
      .then(() => {
        this.toastr.success('New Stocks Added');
        this.activeModal.close('Close click');
      })
      .catch((err) => this.toastr.error(err.toString()));
  }
  getExpiration(): Date {
    const date =
      this.stocksForm.get('expiration')?.value ?? this.product.expiration;
    const dt = new Date(date);
    return dt;
  }
}
