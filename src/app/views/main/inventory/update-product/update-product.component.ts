import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Options } from 'src/app/models/products/Options';
import { Products } from 'src/app/models/products/Products';
import { ProductService } from 'src/app/services/product.service';
import {
  generateNumberString,
  getNumberFromString,
  getStringFromString,
} from 'src/app/utils/Constants';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent {
  currentDate: string;
  options$: Options[] = [];
  PRODUCT_IMAGE = '../assets/images/placeholder.jpeg';
  FOR_UPLOAD: any = null;
  productForm: FormGroup;
  optionsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    quantity: new FormControl(0, Validators.required),
    discount: new FormControl(0, Validators.required),
  });
  product!: Products;
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private location: Location,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    const now = new Date();
    this.currentDate = now.toISOString().slice(0, 10);
    this.productForm = new FormGroup({});
    this.activatedRoute.queryParams.subscribe((params) => {
      const encodedObject = params['data'];
      this.product = JSON.parse(decodeURIComponent(encodedObject));

      const expirationDate = new Date(this.product.expiration);
      const updatedAtDate = new Date(this.product.updatedAt);
      const createdAtDate = new Date(this.product.createdAt);
      this.product.expiration = expirationDate;
      this.product.updatedAt = updatedAtDate;
      this.product.createdAt = createdAtDate;

      const expirationDateString = expirationDate.toISOString().slice(0, 10);

      this.options$ = this.product.options;
      this.PRODUCT_IMAGE = this.product.image;
      this.productForm = fb.group(
        {
          code: new FormControl(this.product.id),
          name: new FormControl(this.product.name, Validators.required),
          brand: new FormControl(this.product.brand, Validators.required),
          expiration: new FormControl(
            expirationDateString,
            Validators.required
          ),
          description: new FormControl(
            this.product.description,
            Validators.required
          ),
          weight: new FormControl(
            getNumberFromString(this.product.weight),
            Validators.required
          ),
          stocks: new FormControl(this.product.stocks, Validators.required),
          cost: new FormControl(this.product.cost, Validators.required),
          price: new FormControl(this.product.price, Validators.required),
          type: new FormControl(
            getStringFromString(this.product.weight),
            Validators.required
          ),
          details: new FormControl(this.product.details, Validators.required),
        },
        { validators: pricingValidation }
      );
    });
  }

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
      let product = this.createProduct(this.product.image);
      this.saveProduct(product);
    } else {
      try {
        const result = await this.productService.uploadProduct(this.FOR_UPLOAD);
        let product = this.createProduct(result);
        this.saveProduct(product);
      } catch (err: any) {
        this.toastr.error(err.toString());
      }
    }
  }

  saveProduct(product: Products) {
    this.productService
      .updateProduct(product)
      .then(() => {
        this.toastr.success('product updated');
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
      updatedAt: this.product.updatedAt,
      createdAt: this.product.createdAt,
    };

    return products;
  }

  removeOption(index: number) {
    this.options$.splice(index, 1);
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
