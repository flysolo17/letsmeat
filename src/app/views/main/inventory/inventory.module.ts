import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryMainComponent } from './inventory-main/inventory-main.component';
import { InventoryRoutingModule } from './inventory.routing.module';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { AddStocksComponent } from './add-stocks/add-stocks.component';

@NgModule({
  declarations: [
    InventoryMainComponent,
    ProductsComponent,
    CreateProductComponent,
    DeleteProductComponent,
    UpdateProductComponent,

    AddStocksComponent,
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbModule,
  ],
  exports: [InventoryMainComponent, CreateProductComponent],
})
export class InventoryModule {}
