import { Messages } from './Messages';
import { Users } from './accounts/User';
import { Customer } from './customers/Customer';

export interface CustomerWithMessages {
  customer: Customer;
  messages: Messages[];
}
