import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Products } from 'src/app/models/products/Products';

@Component({
  selector: 'app-dispose-product',
  templateUrl: './dispose-product.component.html',
  styleUrls: ['./dispose-product.component.css'],
})
export class DisposeProductComponent {
  activeModal = inject(NgbActiveModal);
  @Input() product!: Products;

  confirm() {
    this.activeModal.close('YES');
  }
}
