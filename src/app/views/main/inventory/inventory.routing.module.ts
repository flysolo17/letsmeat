import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { ProductsComponent } from './products/products.component';

import { InventoryMainComponent } from './inventory-main/inventory-main.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
const routes: Routes = [
  {
    path: '',
    component: InventoryMainComponent,
    children: [
      { path: '', component: ProductsComponent },
      { path: 'create', component: CreateProductComponent },
      { path: 'update', component: UpdateProductComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
