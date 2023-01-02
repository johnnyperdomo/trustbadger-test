import { Component, isDevMode } from '@angular/core';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent {
  customerPortalLink: string = '';

  constructor() {
    if (isDevMode()) {
      //development: test link for customer portal
      this.customerPortalLink =
        'https://billing.stripe.com/p/login/test_5kAdTN9cK3lT0QU144';
    } else {
      //production: live link for customer portal
      this.customerPortalLink =
        'https://billing.stripe.com/p/login/aEUaGO1KlaPlfbWeUU';
      console.log('in production');
    }
  }
}
