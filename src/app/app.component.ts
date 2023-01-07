import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Crisp } from 'crisp-sdk-web';
import { environment } from 'src/environments/environment';
import * as Swal from 'sweetalert2';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Subscription } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';

//crisp configuration
Crisp.configure('ff3b5748-9d1a-476e-8931-8dcd518f93ea');
Crisp.load();
Crisp.setZIndex(99999);

//LATER: make usetiful more helpful. With helpguides and tours. Also pay for it. Also maybe add user info into it. Or, maybe just use a different tool altogether, something more mature and professional.

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  showSubscriptionAlert: boolean = false;
  daysLeftOnTrial: number = 0;
  stripeCustomerID: string = '';

  stripeConfig = loadStripe(environment.stripe.publishableKey);
  tempCheckoutSessionID: string = '';

  //new: never been subscribed before; active: the subscription is active; canceled: canceled; trial-expired: after 7 days are over of being new
  susbcriptionStatus!: 'new' | 'trial-expired' | 'active' | 'canceled';

  firebaseFunctionSub!: Subscription;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private firebaseFunctions: AngularFireFunctions
  ) {}

  ngOnInit(): void {
    this.checkIfUserLoggedIn();
  }

  checkIfUserLoggedIn() {
    //if user logged in, check for sub,
    //if no user logged in, don't show anything

    try {
      this.auth.onAuthStateChanged(async (user) => {
        if (!user) {
          //user not logged in
          console.log('user not logged in');

          return;
        } else {
          this.db
            .collection('users')
            .doc(user.uid)
            .valueChanges()
            .subscribe((data: any) => {
              let creationDate = new Date(data.created.seconds * 1000);
              let stripeID = data.stripeId;
              let userEmail = user.email;
              let userName = `${data.firstName} ${data.lastName}`;

              //set user email to crisp for
              Crisp.user.setEmail(userEmail!);
              Crisp.user.setNickname(userName);

              this.stripeCustomerID = stripeID;
              console.log(this.stripeCustomerID);

              console.log(new Date(data.created.seconds * 1000));

              this.checkForSubscription(user.uid, String(creationDate));
            });
        }
      });
    } catch (error) {
      alert(error);
    }
  }

  checkForSubscription(userID: string, userCreationDate?: string) {
    try {
      this.db
        .collection('users')
        .doc(userID)
        .collection('subscriptions')
        .valueChanges()
        .subscribe((data: any[]) => {
          console.log('subscriptions: ', data);

          if (data.length === 0) {
            //check if trial ended,
            const trialEnded = this.didTrialEnd(userCreationDate);

            if (trialEnded === true) {
              this.susbcriptionStatus = 'trial-expired';
              console.log('trial ended ', this.susbcriptionStatus);
              this.showSubscriptionAlert = true;
              this.promptPaywallTrialEnded();
              return;
            } else {
              this.susbcriptionStatus = 'new';
              this.showSubscriptionAlert = true;
              return;
            }
          } else {
            let activeSub = data.find((sub) => sub.status === 'active');
            let canceledSub = data.find((sub) => sub.status === 'canceled');

            if (activeSub) {
              this.susbcriptionStatus = 'active';
              console.log('status ', this.susbcriptionStatus);

              return;
            } else if (canceledSub) {
              console.log('is there a canceled sub? ', canceledSub);

              this.susbcriptionStatus = 'canceled';
              console.log('status ', this.susbcriptionStatus);
              this.promptPaywallTrialEnded();

              return;
            }

            //subscriptions exist
          }
        });
    } catch (error) {
      alert(error);
    }
  }

  //check if trial ended
  didTrialEnd(userCreationDate?: any): Boolean {
    const dateUserCreated: any = new Date(userCreationDate);

    const currentDate: any = new Date();
    const dateDifference = currentDate - dateUserCreated;
    let numberOfDays = dateDifference / (1000 * 60 * 60 * 24);
    numberOfDays = Math.ceil(numberOfDays); //round decimal up

    const daysLeft = 7 - numberOfDays;

    if (daysLeft <= 0) {
      this.daysLeftOnTrial = 0;
      console.log('days left ', this.daysLeftOnTrial);
    } else {
      this.daysLeftOnTrial = daysLeft;
      console.log('days left ', this.daysLeftOnTrial);
    }

    console.log('number of days ', numberOfDays);

    return numberOfDays > 7;
  }

  promptPaywallTrialEnded() {
    //after trial ends

    Swal.default.fire({
      titleText: 'Your 7-day trial has ended',
      html: this.paymentBlockHTML,
      showCancelButton: false,
      showConfirmButton: false,
      grow: 'fullscreen',
      footer:
        'Upgrade your plan to continue using Trustbadger. You can cancel anytime.',
      allowOutsideClick: false,
      allowEscapeKey: false,

      didOpen: async () => {
        const upgradeBtn = document.querySelector('#upgradeBtn');
        if (!upgradeBtn) {
          return;
        }

        await this.createCheckoutSession();

        upgradeBtn.addEventListener('click', async () => {
          let stripeLoader = await this.stripeConfig;

          if (stripeLoader) {
            stripeLoader.redirectToCheckout({
              sessionId: this.tempCheckoutSessionID,
            });
          }
        });
      },
      didClose: () => {
        const upgradeBtn = document.querySelector('#upgradeBtn');
        if (!upgradeBtn) {
          return;
        }

        upgradeBtn.removeEventListener('click', () => {
          console.log('removed event listener');
        });
      },
    });
  }

  promptUpgradeBeforeTrial() {
    //manual upgrade before trial ends

    Swal.default.fire({
      titleText: 'Upgrade to continue using Trustbadger',
      html: this.paymentBlockHTML,
      showCancelButton: true,
      cancelButtonText: 'Maybe Later',
      cancelButtonColor: '#dfdfdf',
      showConfirmButton: false,
      showCloseButton: true,
      focusCancel: false,
      grow: 'fullscreen',
      buttonsStyling: false,
      customClass: {
        cancelButton: 'btn btn-outline-secondary',
      },
      footer:
        'Upgrade your plan to continue using Trustbadger. You can cancel anytime.',
      didOpen: async () => {
        const upgradeBtn = document.querySelector('#upgradeBtn');
        if (!upgradeBtn) {
          return;
        }

        await this.createCheckoutSession();

        upgradeBtn.addEventListener('click', async () => {
          let stripeLoader = await this.stripeConfig;

          if (stripeLoader) {
            stripeLoader.redirectToCheckout({
              sessionId: this.tempCheckoutSessionID,
            });
          }
        });
      },
      didClose: () => {
        const upgradeBtn = document.querySelector('#upgradeBtn');
        if (!upgradeBtn) {
          return;
        }

        upgradeBtn.removeEventListener('click', () => {
          console.log('removed event listener');
        });
      },
    });
  }

  async createCheckoutSession() {
    let checkoutSessionCallable = this.firebaseFunctions.httpsCallable(
      'createCheckoutSession'
    );

    try {
      this.firebaseFunctionSub = checkoutSessionCallable({
        priceid: environment.stripe.starterPriceID,
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: `${window.location.origin}/dashboard`,
      }).subscribe(async (data) => {
        const sessionId = data;

        this.tempCheckoutSessionID = sessionId.id;

        //unsubscribe after it's completed the first time
        this.firebaseFunctionSub.unsubscribe();
      });

      //LATER: loading spinner add later
    } catch (error) {
      alert(error);
    }
  }

  ngOnDestroy(): void {
    if (this.firebaseFunctionSub) {
      this.firebaseFunctionSub.unsubscribe();
    }
  }

  paymentBlockHTML = `<div class="container-fluid">
<div class="row justify-content-center">
  <div class="col-12 col-lg-5 col-xl-4 col-sm-9 col-md-6">
    <!-- Card -->
    <div class="card mb-0">
      <div class="card-body">
        <!-- Title -->
        <h6 class="text-uppercase text-center text-muted my-4">
          Starter plan
        </h6>

        <!-- Price -->
        <div class="row g-0 align-items-center justify-content-center">
          <div class="col-auto">
            <div class="h1 mb-0">$29</div>
          </div>
        </div>
        <!-- / .row -->

        <!-- Period -->
        <div class="h6 text-uppercase text-center text-muted mb-5">
          / month
        </div>

        <!-- Features -->
        <div class="mb-3">
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item d-flex align-items-center justify-content-between px-0"
            >
              <small>Unlimited Text Reviews</small>
              <i class="fe fe-check-circle text-success"></i>
            </li>
            <li
              class="list-group-item d-flex align-items-center justify-content-between px-0"
            >
              <small>Public "Wall of Love" Page</small>
              <i class="fe fe-check-circle text-success"></i>
            </li>
            <li
              class="list-group-item d-flex justify-content-between px-0"
            >
              <small class="text-left">Dedicated Landing Page to Collect Reviews</small>
              <i class="fe fe-check-circle text-success"></i>
            </li>
            <li
              class="list-group-item d-flex align-items-center justify-content-between px-0"
            >
              <small>Dashboard to Manage Reviews</small>
              <i class="fe fe-check-circle text-success"></i>
            </li>
            <li
              class="list-group-item d-flex align-items-center justify-content-between px-0"
            >
              <small>Priority Chat & Email Support</small>
              <i class="fe fe-check-circle text-success"></i>
            </li>
          </ul>
        </div>
         <div class="text-center">
           <button class="btn w-100 btn-primary" id="upgradeBtn"> Upgrade </button>
           <small class="text-muted text-center mt-1"> Cancel Anytime </small>
         </div>

      </div>
    </div>
  </div>
</div>
</div>
`;
}

//LATER: in the app you're subscribed to value changes for some things, but also make sure to unsubscribe for firebase things so it doesn't get called too often
