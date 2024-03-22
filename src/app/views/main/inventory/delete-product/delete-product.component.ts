import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/app/models/products/Products';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css'],
})
export class DeleteProductComponent {
  activeModal = inject(NgbActiveModal);

  @Input() product!: Products;
  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}
  confirm() {
    this.productService
      .deleteProduct(this.product.id)
      .then(() => {
        this.toastr.success('Successfully Deleted');
        this.activeModal.close('Close click');
      })
      .catch((err) => {
        this.toastr.error(err.toString());
      });
  }
}
