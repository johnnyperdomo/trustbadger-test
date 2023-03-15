import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CollectionComponent } from './collections/collection/collection.component';
import { EmbedComponent } from './collections/collection/embed/embed.component';
import { ReviewsComponent } from './collections/collection/reviews/reviews.component';
import { EditCollectionComponent } from './collections/edit-collection/edit-collection.component';
import { RequestSuccessComponent } from './collections/request-success/request-success.component';
import { RequestComponent } from './collections/request/request.component';
import { ShowcaseComponent } from './collections/showcase/showcase.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AccountComponent } from './settings/account/account.component';
import { BillingComponent } from './settings/billing/billing.component';
import { SettingsComponent } from './settings/settings.component';
import { ShowcaseAllComponent } from './showcase-all/showcase-all.component';

import {
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

import { canActivate } from '@angular/fire/compat/auth-guard';
import { EmbedPageComponent } from './collections/embed-page/embed-page.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']); //if no logged in, restrict access
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']); //if logged in, block auth

const routes: Routes = [
  //Main
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    title: 'Dashboard - Trustbadger',
  },

  {
    path: 'onboarding',
    component: OnboardingComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    title: 'Getting Started - Trustbadger',
  },

  //auth
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToDashboard),
    title: 'Login - Trustbadger',
  },

  {
    path: 'signup',
    component: SignupComponent,
    ...canActivate(redirectLoggedInToDashboard),
    title: 'Signup - Trustbadger',
  },

  //Settings
  {
    path: 'settings',
    redirectTo: 'settings/billing',
  },

  {
    path: 'settings',
    component: SettingsComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      // { path: 'account', component: AccountComponent },
      {
        path: 'billing',
        component: BillingComponent,
        title: 'Billing - Trustbadger',
      },
    ],
  },

  // { //LATER
  //   path: 'showcase-all',
  //   component: ShowcaseAllComponent,
  //   ...canActivate(redirectUnauthorizedToLogin),
  // },

  //non-auth, public facing
  {
    path: 'collections',
    children: [
      { path: 'request/:id', component: RequestComponent, title: 'Request' },
      {
        path: 'request/:id/success',
        component: RequestSuccessComponent,
        title: 'Request',
      },
    ],
  },

  //Collections
  {
    path: 'collections/:id',
    redirectTo: 'collections/:id/reviews',
  },

  {
    path: 'new/collections',
    ...canActivate(redirectUnauthorizedToLogin),
    component: EditCollectionComponent,
    title: 'Collections - Trustbadger',
  },

  //auth-required
  {
    path: 'collections',
    ...canActivate(redirectUnauthorizedToLogin),
    title: 'Collections - Trustbadger',
    children: [
      { path: ':id', component: CollectionComponent },
      { path: ':id/edit', component: EditCollectionComponent },
    ],
  },

  //non-auth, public facing
  {
    path: 'collections/:id',
    component: CollectionComponent,
    children: [
      {
        path: 'showcase',
        component: ShowcaseComponent,
        title: 'Testimonials',
      },
    ],
  },

  //non-auth, public facing
  {
    path: 'collections/:id',
    component: CollectionComponent,
    children: [
      {
        path: 'embed-page',
        component: EmbedPageComponent,
        title: 'Embed',
      },
    ],
  },

  //auth required
  {
    path: 'collections/:id',
    component: CollectionComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: 'reviews',
        component: ReviewsComponent,
        title: 'Testimonials - Trustbadger',
      },
      {
        path: 'embed',
        component: EmbedComponent,
        title: 'Embed - Trustbadger',
      },
    ],
  },

  // Later make sure to create a real 404 page for this
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
