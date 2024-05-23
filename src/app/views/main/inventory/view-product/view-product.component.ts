import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Options } from 'src/app/models/products/Options';
import { ProductWithStocks } from 'src/app/models/products/ProductWithStocks';
import { Products } from 'src/app/models/products/Products';
import {
  StockManagement,
  StockStatus,
} from 'src/app/models/products/StockManagement';
import { StockManagementService } from 'src/app/services/stock-management.service';
import { toPHP } from 'src/app/utils/Constants';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements OnInit, OnDestroy {
  private paramSub: Subscription | undefined;
  private stockSub: Subscription | undefined;
  productID: string | null = null;
  stockList: ProductWithStocks | null = null;
  stockManagement$: StockManagement[] = [];
  product$: Products | null = null;
  constructor(
    private activatedRoute: ActivatedRoute,
    private stockManagementService: StockManagementService
  ) {}

  ngOnInit(): void {
    this.paramSub = this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          this.productID = params.get('id');
          if (this.productID) {
            return this.stockManagementService.getProductAndStockManagementByProductID(
              this.productID
            );
          } else {
            return [];
          }
        })
      )
      .subscribe((data) => {
        this.stockList = data;
        this.stockManagement$ = this.stockList?.stocks;
        this.product$ = this.stockList.product;
        console.log(this.stockList);
      });
  }

  ngOnDestroy(): void {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }
    if (this.stockSub) {
      this.stockSub.unsubscribe();
    }
  }

  getBackgroundColor(status: StockStatus) {
    switch (status) {
      case StockStatus.DISPOSED:
        return 'red';
      case StockStatus.IN:
        return 'green';
      case StockStatus.OUT:
        return 'yellow';
      default:
        return 'gray';
    }
  }

  price(price: number): string {
    return toPHP(price);
  }

  options(options: Options[]): string {
    let arr: string[] = options.map((e) => e.name);
    return arr.toString();
  }
}
