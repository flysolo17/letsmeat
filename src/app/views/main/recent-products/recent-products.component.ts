import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { user } from 'rxfire/auth';
import { Users } from 'src/app/models/accounts/User';
import { Products } from 'src/app/models/products/Products';
import { AuthService } from 'src/app/services/auth.service';
import { PrintingServiceService } from 'src/app/services/printing-service.service';
import { ProductService } from 'src/app/services/product.service';
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
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private printingService: PrintingServiceService,
    private toastr: ToastrService
  ) {
    authService.users$.subscribe((data) => {
      this.users$ = data;
    });

    productService.listenToProducts().subscribe((data) => {
      this.products$ = data;

      const today = new Date();
      this.today$ = this.products$.filter(
        (product) =>
          new Date(product.createdAt).toDateString() === today.toDateString() ||
          new Date(product.updatedAt).toDateString() === today.toDateString()
      );

      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      this.lastWeek$ = this.products$.filter(
        (product) =>
          product.createdAt >= lastWeek || product.updatedAt >= lastWeek
      );

      this.expiredProducts$ = this.products$.filter(
        (e) => e.expiration < today
      );

      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
      this.oldProducts$ = this.products$.filter(
        (product) =>
          product.createdAt < eightDaysAgo || product.updatedAt < eightDaysAgo
      );
    });
  }

  filterProductsToday() {
    const today = new Date();
    this.today$ = this.products$.filter(
      (product) =>
        (new Date(product.createdAt).toDateString() === today.toDateString() ||
          new Date(product.updatedAt).toDateString() ===
            today.toDateString()) &&
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  filterProductsLastWeek() {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    this.lastWeek$ = this.products$.filter(
      (product) =>
        (product.createdAt >= lastWeek || product.updatedAt >= lastWeek) &&
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  filterExpiredProducts(): void {
    const currentDate = new Date();
    console.log('serching...');
    this.expiredProducts$ = this.products$.filter(
      (e) =>
        e.expiration < currentDate &&
        e.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  filterProductsOld() {
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    this.oldProducts$ = this.products$.filter(
      (product) =>
        (product.createdAt < eightDaysAgo ||
          product.updatedAt < eightDaysAgo) &&
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
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

  getText(countStocks: number): string {
    if (countStocks > 50) {
      return 'In Stock';
    } else if (countStocks <= 50) {
      return 'Low Stock';
    } else {
      return 'Out of Stock';
    }
  }

  convertToPdf(data: 1 | 2 | 3 | 4) {
    if (data === 1) {
      if (this.today$.length > 0) {
        this.printingService.printInventory(
          'Product Added Today',
          this.users$?.name ?? 'no name',
          this.today$
        );
      } else {
        this.toastr.error('No Products Today');
      }
    } else if (data === 2) {
      if (this.lastWeek$.length > 0) {
        this.printingService.printInventory(
          'Product Added Last Week',
          this.users$?.name ?? 'no name',
          this.today$
        );
      } else {
        this.toastr.error('No Products Last Week');
      }
    } else if (data === 3) {
      if (this.oldProducts$.length > 0) {
        this.printingService.printInventory(
          'Old Products',
          this.users$?.name ?? 'no name',
          this.today$
        );
      } else {
        this.toastr.error('No old Products');
      }
    } else {
      if (this.expiredProducts$.length > 0) {
        this.printingService.printInventory(
          'Expired Products',
          this.users$?.name ?? 'no name',
          this.today$
        );
      } else {
        this.toastr.error('No Exp Products');
      }
    }
  }
}
