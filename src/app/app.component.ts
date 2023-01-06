import { Component, isDevMode, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Crisp } from 'crisp-sdk-web';
import { environment } from 'src/environments/environment';
import * as Swal from 'sweetalert2';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Subscription } from 'rxjs';

Crisp.configure('ff3b5748-9d1a-476e-8931-8dcd518f93ea');
Crisp.load();
Crisp.setZIndex(99999);

//LATER: make usetiful more helpful. With helpguides and tours. Also pay for it. Also maybe add user info into it. Or, maybe just use a different tool altogether, something more mature and professional.

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showSubscriptionAlert: boolean = false;
  daysLeftOnTrial: number = 0;
  stripeCustomerID: string = '';

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
           this.createCheckoutSession();

          this.db
            .collection('users')
            .doc(user.uid)
            .valueChanges()
            .subscribe((data: any) => {
              let creationDate = new Date(data.created.seconds * 1000);
              let stripeID = data.stripeId;

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

    //TODO: check subscription
    // if (subscribed) {
    //   return;
    // }
    //TODO: check if 7 day trial ended
    //if trial ended -> paywall
    //if trial is still active, before the 7 days -> show subscription Alert
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
      // html: pricingTable,
      showCancelButton: false,
      showConfirmButton: false,
      grow: 'fullscreen',
      footer:
        'Upgrade your plan to continue using Trustbadger. You can cancel anytime.',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }

  promptUpgradeBeforeTrial() {
    //manual upgrade before trial ends

    //FIX: configure stripe checkout session to work correctly with existing customers

    Swal.default.fire({
      titleText: 'Upgrade to continue using trustbadger',
      // html: pricingTable,
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
      }).subscribe((data) => {
        const sessionId = data;

        console.log('session id: ', sessionId);

        //unsubscribe after it's completed the first time
        this.firebaseFunctionSub.unsubscribe();
      });

      //LATER: loading spinner
    } catch (error) {
      alert(error);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.firebaseFunctionSub) {
      this.firebaseFunctionSub.unsubscribe();
    }
  }
}

//LATER: in the app you're subscribed to value changes for some things, but also make sure to unsubscribe for firebase things so it doesn't get called too often
