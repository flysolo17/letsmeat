import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Products } from 'src/app/models/products/Products';
import { ProductService } from 'src/app/services/product.service';
import { countStocks, formatTimestamp } from 'src/app/utils/Constants';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { AddStocksComponent } from '../add-stocks/add-stocks.component';
import { Router } from '@angular/router';
import { InventoryReportComponent } from '../inventory-report/inventory-report.component';
import { PrintingServiceService } from 'src/app/services/printing-service.service';
import { Users } from 'src/app/models/accounts/User';
import { AuthService } from 'src/app/services/auth.service';
import { DisposeProductComponent } from 'src/app/dialogs/dispose-product/dispose-product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  selectedID: string = '';
  users$: Users | null = null;
  private modalService = inject(NgbModal);
  currentDate = new Date();
  products$: Products[] = [];
  filteredProducts$: Products[] = [];
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private productService: ProductService,
    private router: Router,
    private printingService: PrintingServiceService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
    this.productService.listenToProducts().subscribe((products) => {
      this.products$ = products;
      this.filteredProducts$ = products;
    });
  }
  disposeProduct(product: Products) {
    const modal = this.modalService.open(DisposeProductComponent);
    modal.componentInstance.product = product;
    modal.result.then((data) => {
      if (data === 'YES') {
        this.productService
          .disposeProduct(
            product.id,
            product.name,
            product.image,
            product.expiration,
            product.stocks,
            this.users$?.id ?? ''
          )
          .then((data) =>
            this.toastr.success(
              `${product.stocks} pcs ${product.name} successfully disposed`
            )
          );
      }
    });
  }
  deleteProduc(product: Products) {
    const modalRef = this.modalService.open(DeleteProductComponent);
    modalRef.componentInstance.product = product;
  }

  addStocks(product: Products) {
    const modalRef = this.modalService.open(AddStocksComponent);
    modalRef.componentInstance.product = product;
  }

  search(): void {
    this.currentPage = 1;
    this.filteredProducts$ = this.products$.filter(
      (product) =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.brand
          .toLocaleLowerCase()
          .includes(this.searchText.toLocaleLowerCase())
    );
  }

  selectIndex(index: string) {
    if (this.selectedID !== index) {
      this.selectedID = index;
    } else {
      this.selectedID = '';
    }
  }

  countStocks(product: Products) {
    return countStocks(product);
  }
  formatDate(date: Date) {
    return formatTimestamp(date);
  }
  getStatusColor(countStocks: number, expiration: Date): string {
    if (expiration < this.currentDate) {
      return 'red';
    }
    if (countStocks > 50) {
      return 'green';
    } else if (countStocks <= 50) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  getTextColor(countStocks: number, expiration: Date): string {
    if (expiration < this.currentDate) {
      return 'red';
    }
    if (countStocks > 50) {
      return 'green';
    } else if (countStocks <= 50) {
      return 'black';
    } else {
      return 'red';
    }
  }

  getText(countStocks: number, expiration: Date): string {
    if (expiration < this.currentDate) {
      return 'expired';
    }
    if (countStocks > 50) {
      return 'In Stock';
    } else if (countStocks <= 50) {
      return 'Low Stock';
    } else {
      return 'Out of Stock';
    }
  }

  updateProduct(product: Products) {
    const encodedObject = encodeURIComponent(JSON.stringify(product));
    this.router.navigate(['/main/inventory/update'], {
      queryParams: { data: encodedObject },
    });
  }
  generateReport() {
    const modal = this.modalService.open(InventoryReportComponent);
    modal.componentInstance.products = this.products$;
    modal.result.then((products: Products[]) => {
      if (products.length > 0) {
        this.printingService.printInventory(
          `Inventory Report`,
          this.users$?.name ?? 'No name',
          products
        );
      }
    });
  }

  isProductExpired(expiration: Date): boolean {
    return new Date().getTime() < expiration.getTime();
  }
}
