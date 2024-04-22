import { Component, TRANSLATIONS, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Users } from 'src/app/models/accounts/User';

import { Products } from 'src/app/models/products/Products';
import { OrderItems } from 'src/app/models/transactions/OrderItems';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductOptionsSelectionComponent } from '../product-options-selection/product-options-selection.component';
import { Transactions } from 'src/app/models/transactions/Transactions';
import { generateNumberString } from 'src/app/utils/Constants';
import { TransactionStatus } from 'src/app/models/transactions/TransactionStatus';
import { PaymentStatus } from 'src/app/models/transactions/PaymentStatus';
import { PaymentTypes } from 'src/app/models/transactions/PaymentTypes';
import { ToastrService } from 'ngx-toastr';
import { TransactionType } from 'src/app/models/transactions/TransactionType';
import { AddPaymentComponent } from '../../add-payment/add-payment.component';
import { TransactionDetails } from 'src/app/models/transactions/TransactionDetails';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css'],
})
export class PosComponent {
  formatCurrency(arg0: number) {
    return arg0;
  }
  activeTab = 0;
  selectTab(index: number) {
    this.activeTab = index;
  }

  defaultProducts$: Products[] = [];
  products$: Products[] = [];
  categories$: string[] = [];
  users$: Users | null = null;
  orderItems$: OrderItems[] = [];
  orderTotal: number = 0;
  private modalService = inject(NgbModal);
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private toastr: ToastrService,
    private transactionService: TransactionService
  ) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
    productService.listenToProducts().subscribe((data: Products[]) => {
      this.defaultProducts$ = data.filter((e) => e.expiration > new Date());
      this.products$ = data.filter((e) => e.expiration > new Date());
      const uniqueCategoriesSet = new Set(
        this.products$.map((e) => e.brand.toLocaleUpperCase())
      );
      this.categories$ = [];
      this.categories$.push('ALL');
      this.categories$.push(...Array.from(uniqueCategoriesSet));
    });
  }

  addOptions(selectedProduct: Products) {
    if (selectedProduct.options === null) {
      return;
    }
    const modalRef = this.modalService.open(ProductOptionsSelectionComponent);
    modalRef.componentInstance.product = selectedProduct;
    modalRef.componentInstance.orders = this.orderItems$;
    modalRef.result.then((result: OrderItems) => {
      if (result) {
        let prod = this.products$.findIndex((data) => data.id == result.id);
        this.updateStocks(prod, result);
        this.orderItems$.push(result);
        this.computeTotal();
      }
    });
  }
  updateStocks(index: number, order: OrderItems) {
    let option = order?.options?.quantity ?? 1;
    this.products$[index].stocks -= order.quantity * option;
  }
  filterByBrand(category: string) {
    if (category === 'ALL') {
      this.products$ = this.defaultProducts$;
    } else {
      this.products$ = this.defaultProducts$.filter(
        (e) => e.brand.toLocaleUpperCase() === category
      );
    }
  }
  onSearch(data: string) {
    this.products$ = this.products$.filter((e) =>
      e.name.toLocaleLowerCase().startsWith(data.toLocaleLowerCase())
    );
  }
  orderSubmitted(orderItems: OrderItems) {
    this.orderItems$.push(orderItems);
  }
  computeTotal() {
    this.orderItems$.forEach((data) => {
      this.orderTotal += data.subtotal;
    });
  }

  addPayment() {
    if (this.orderItems$.length === 0) {
      this.toastr.warning('Please add items to cart ');
      return;
    }
    const modalRef = this.modalService.open(AddPaymentComponent);
    modalRef.componentInstance.total = this.orderTotal;
    modalRef.componentInstance.cashier = this.users$;
    modalRef.result.then((details: TransactionDetails) => {
      if (!details) {
        this.toastr.error('Invalid Details');
        return;
      }
      this.submitTotal(details);
    });
  }
  cancelOrder(order: OrderItems, index: number) {
    this.products$.forEach((e) => {
      if (order.productID == e.id) {
        let option = order.options?.quantity ?? 1;
        let quan = order.quantity * option;
        e.stocks += quan;
      }
    });
    this.orderItems$.splice(index, 1);
  }

  submitTotal(details: TransactionDetails) {
    let transactions: Transactions = {
      id: generateNumberString(),
      customerID: '',
      employeeID: this.users$?.id ?? '',
      driverID: '',
      type: TransactionType.WALK_IN,
      address: null,
      items: this.orderItems$,
      payment: {
        id: generateNumberString(),
        total: this.orderTotal,
        status: PaymentStatus.PAID,
        type: PaymentTypes.PAY_IN_COUNTER,
        receipt: '',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      status: TransactionStatus.COMPLETED,
      updatedAt: new Date(),
      transactionDate: new Date(),
      details: [details],
      shipping: null,
    };
    this.transactionService
      .createTransaction(transactions)
      .then((data) => {
        this.orderItems$ = [];
        this.toastr.success('Transaction completed');
        this.orderTotal = 0;
      })
      .catch((err) => this.toastr.error('Invalid transaction', err.toString()));
  }
}
