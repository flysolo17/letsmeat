import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { or } from '@angular/fire/firestore';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Options } from 'src/app/models/products/Options';
import { Products } from 'src/app/models/products/Products';
import { OrderItems } from 'src/app/models/transactions/OrderItems';

@Component({
  selector: 'app-product-options-selection',
  templateUrl: './product-options-selection.component.html',
  styleUrls: ['./product-options-selection.component.css'],
})
export class ProductOptionsSelectionComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  quantity$ = 1;
  @Input() product!: Products;
  @Input() orders!: OrderItems[];

  selectedOption: Options | null = null;
  orderTotal: number = 0;
  constructor(private toastr: ToastrService) {}
  ngOnInit(): void {
    console.log(this.orders);
    this.computeTotal();
  }
  isQuantityNaN(): boolean {
    return isNaN(this.quantity$);
  }

  onType(value: number) {
    let option = this.selectedOption?.quantity ?? 1;
    if (this.product.stocks >= this.quantity$ * option) {
      this.quantity$ = value;
      this.computeTotal();
      return;
    }
    //reset the value of input to 1
    this.quantity$ = 1;
    this.computeTotal();
  }

  selectOption(option: Options) {
    // if (this.isAlreadyOrdered(option)) {
    //   this.toastr.success('Item already in cart');
    //   return;
    // }
    if (this.product.stocks < this.quantity$ * option.quantity) {
      this.toastr.warning('Not enough stocks');
      return;
    }
    if (this.selectedOption == option) {
      this.selectedOption = null;
      this.computeTotal();
      return;
    }
    this.selectedOption = option;
    this.computeTotal();
  }
  onSubmitOrder() {
    let orderItems: OrderItems = {
      id: this.product.id,
      name: this.product.name,
      image: this.product.image,
      quantity: this.quantity$,
      price: this.product.price,
      options: this.selectedOption,
      subtotal: this.orderTotal,
      weight: 0,
    };
    this.activeModal.close(orderItems);
  }

  isAlreadyOrdered(option: Options): boolean {
    return this.orders.some((data) => data.options?.name === option.name);
  }
  increment() {
    let option = this.selectedOption?.quantity ?? 1;
    if (this.product.stocks > this.quantity$ * option) {
      this.quantity$ += 1;
      this.computeTotal();
      return;
    }
    this.toastr.warning('You reach the maximum stocks');
  }
  decrement() {
    if (this.quantity$ > 1) {
      this.quantity$ -= 1;
      this.computeTotal();
      return;
    }
    this.toastr.warning('You reach the minimum order');
  }
  computeTotal() {
    let price = this.product.price;
    let discount = this.selectedOption?.discount ?? 0;
    let optionQuantity = this.selectedOption?.quantity ?? 1;
    let quantity = this.quantity$ * optionQuantity;
    let discountedPrice = price - (price * discount) / 100;
    this.orderTotal = discountedPrice * quantity;
  }
}
