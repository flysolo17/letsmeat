import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customers/Customer';

import { CustomerService } from 'src/app/services/customer.service';
import { ViewCustomerProfileComponent } from '../view-customer-profile/view-customer-profile.component';

import { getDefaultAddress } from 'src/app/utils/Constants';
import { Addresses } from 'src/app/models/customers/Addresses';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent {
  customers$: Customer[] = [];
  users$: any;
  default$: Customer[] = [];

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService
  ) {
    customerService.getAllCustomer().subscribe((data) => {
      this.customers$ = data;
      this.default$ = data;
    });
  }

  toWholesaler(customerID: string) {
    this.customerService
      .toWholesaler(customerID)
      .then(() => this.toastr.success('Successfully updated'))
      .catch((err) => this.toastr.error(err.toString()));
  }
  toRegular(customerID: string) {
    this.customerService
      .toRegular(customerID)
      .then(() => this.toastr.success('Successfully updated'))
      .catch((err) => this.toastr.error(err.toString()));
  }
  displayDefaultAddress(num: number, addresses: Addresses[]) {
    return getDefaultAddress(num, addresses);
  }

  onSearch(data: string) {
    if (data === '') {
      this.customers$ = this.default$;
    } else {
      this.customers$ = this.default$.filter((e) =>
        e.fullname.toLocaleLowerCase().startsWith(data.toLocaleLowerCase())
      );
    }
  }
}
