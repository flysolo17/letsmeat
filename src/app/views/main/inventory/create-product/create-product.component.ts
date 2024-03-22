import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { UploadResult } from '@angular/fire/storage';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/app/models/products/Products';
import { Options } from 'src/app/models/products/Options';
import { ProductService } from 'src/app/services/product.service';
import { generateNumberString } from 'src/app/utils/Constants';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent {
  currentDate: string;
  options$: Options[] = [];
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private location: Location
  ) {
    const now = new Date();
    this.currentDate = now.toISOString().slice(0, 10);
  }
  PRODUCT_IMAGE = '../assets/images/placeholder.jpeg';
  FOR_UPLOAD: any = null;
  productForm = new FormGroup(
    {
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      brand: new FormControl('', Validators.required),
      expiration: new FormControl(Date.now(), Validators.required),
      description: new FormControl('', Validators.required),
      weight: new FormControl(0, Validators.required),
      stocks: new FormControl(0, Validators.required),
      cost: new FormControl(0, Validators.required),
      price: new FormControl(0, Validators.required),
      type: new FormControl('g', Validators.required),
      details: new FormControl('', Validators.required),
    },
    { validators: pricingValidation }
  );
  optionsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    quantity: new FormControl(0, Validators.required),
    discount: new FormControl(0, Validators.required),
  });
  ngOnInit(): void {}

  onSelectImage(event: any) {
    this.FOR_UPLOAD = event.target.files[0];
    if (event.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.PRODUCT_IMAGE = e.target.result;
      };
    }
  }

  async onSubmitProduct() {
    if (this.FOR_UPLOAD == null) {
      this.toastr.warning('Please add image');
      return;
    }

    try {
      const result = await this.productService.uploadProduct(this.FOR_UPLOAD);
      let product = this.createProduct(result);
      this.saveProduct(product);
    } catch (err: any) {
      this.toastr.error(err.toString());
    }
  }

  saveProduct(product: Products) {
    this.productService
      .createProduct(product)
      .then(() => {
        this.toastr.success('new product added');
        this.productForm.reset();
        this.options$ = [];
        this.location.back();
      })
      .catch((err) => {
        this.toastr.error(err.toString());
        console.log(err);
      });
  }

  submitVariation() {
    let name = this.optionsForm.get('name')?.value ?? '';
    let quantity = this.optionsForm.get('quantity')?.value ?? 0;
    let discount = this.optionsForm.get('discount')?.value ?? 0;

    let options: Options = {
      name: name,
      quantity: quantity,
      discount: discount,
    };

    const isDuplicate = this.options$.some(
      (variation) => variation.name === name || variation.name === name
    );
    if (isDuplicate) {
      this.toastr.error('Duplicate Variation');
      return;
    }
    this.options$.push(options);
    this.optionsForm.reset();
  }
  getExpiration(): Date {
    const date = this.productForm.get('expiration')?.value ?? Date.now();
    const dt = new Date(date);
    return dt;
  }

  createProduct(imageURL: string): Products {
    let stocks = this.productForm.get('stocks')?.value ?? 0;
    let cost = this.productForm.get('cost')?.value ?? 0;
    let price = this.productForm.get('price')?.value ?? 0;
    let weight = this.productForm.get('weight')?.value ?? 0;
    let type = this.productForm.get('type')?.value ?? '';
    let products: Products = {
      id:
        this.productForm.get('code')?.value?.toString() ??
        generateNumberString(),
      image: imageURL,
      name: this.productForm.get('name')?.value ?? '',
      brand: this.productForm.get('brand')?.value ?? '',
      weight: `${weight} ${type}`,
      cost: cost,
      price: price,
      stocks: stocks,
      options: this.options$,
      description: this.productForm.get('description')?.value ?? '',
      details: this.productForm.get('details')?.value ?? '',
      expiration: this.getExpiration(),
      comments: [],
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    return products;
  }

  removeOption(index: number) {
    this.options$.splice(index, 1);
  }
  generateProductID() {
    let id = generateNumberString();
    this.productForm.get('code')?.setValue(id);
  }
}

const pricingValidation: ValidatorFn = (
  control: AbstractControl
): { [key: string]: any } | null => {
  const cost = control.get('cost');
  const price = control.get('price');

  if (cost?.value > price?.value) {
    return { 'Cost is Greater than Price': true };
  }

  return null;
};
