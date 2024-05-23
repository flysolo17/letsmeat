import { Component, Input } from '@angular/core';
import { StockManagement } from 'src/app/models/products/StockManagement';

@Component({
  selector: 'app-recent-product',
  templateUrl: './recent-product.component.html',
  styleUrls: ['./recent-product.component.css'],
})
export class RecentProductComponent {
  @Input() products: StockManagement[] = [];
}
