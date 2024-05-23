import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { user } from 'rxfire/auth';
import { Users } from 'src/app/models/accounts/User';
import { Products } from 'src/app/models/products/Products';
import { StockManagement } from 'src/app/models/products/StockManagement';
import { AuthService } from 'src/app/services/auth.service';
import { PrintingServiceService } from 'src/app/services/printing-service.service';
import { ProductService } from 'src/app/services/product.service';
import { StockManagementService } from 'src/app/services/stock-management.service';
import { countStocks, formatTimestamp } from 'src/app/utils/Constants';

@Component({
  selector: 'app-recent-products',
  templateUrl: './recent-products.component.html',
  styleUrls: ['./recent-products.component.css'],
})
export class RecentProductsComponent {
  products$: Products[] = [];
  expiredProducts$: Products[] = [];
  oldProducts$: Products[] = [];
  today$: Products[] = [];
  lastWeek$: Products[] = [];
  users$: Users | null = null;
  searchText: string = '';

  active = 1;
  stocks$: StockManagement[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private printingService: PrintingServiceService,
    private toastr: ToastrService,
    private stockManagementService: StockManagementService
  ) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });
    this.getProductToday();
    productService.getExpiredProduct().subscribe((data) => {
      this.expiredProducts$ = data;
      this.products$ = data;
      console.log(this.expiredProducts$);
    });
  }

  getProductToday() {
    this.stockManagementService.getStocksToday().subscribe((data) => {
      this.stocks$ = data;
      console.log(this.stocks$);
    });
  }
  getProductLastWeek() {
    this.stockManagementService.getProductLastWeek().subscribe((data) => {
      this.stocks$ = data;
    });
  }

  getOldProducts() {
    this.stockManagementService.getProductNineDaysOld().subscribe((data) => {
      this.stocks$ = data;
    });
  }

  countStocks(product: Products) {
    return countStocks(product);
  }
  formatDate(date: Date) {
    return formatTimestamp(date);
  }
  getStatusColor(countStocks: number): string {
    if (countStocks > 50) {
      return 'green';
    } else if (countStocks <= 50) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  getTextColor(countStocks: number): string {
    if (countStocks > 50) {
      return 'white';
    } else if (countStocks <= 50) {
      return 'black';
    } else {
      return 'white';
    }
  }

  generateStocksRepost(title: string) {
    if (this.stocks$.length === 0) {
      this.toastr.error('no ' + title);
      return;
    }
    this.printingService.printStockmanageMent(
      title,
      this.users$?.name ?? 'no name',
      this.stocks$
    );
  }

  getText(countStocks: number): string {
    if (countStocks > 50) {
      return 'In Stock';
    } else if (countStocks <= 50) {
      return 'Low Stock';
    } else {
      return 'Out of Stock';
    }
  }

  convertToPdf(data: 4) {
    this.printingService.printInventory(
      'Expired Products',
      this.users$?.name ?? 'no name',
      this.expiredProducts$
    );
  }
}
