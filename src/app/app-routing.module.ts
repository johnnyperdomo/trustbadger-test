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

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']); //if no logged in, restrict access
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']); //if logged in, block auth

const routes: Routes = [
//Main
 { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
{
  path: 'dashboard',
  component: DashboardComponent,
  ...canActivate(redirectUnauthorizedToLogin)
},

{
  path: 'onboarding',
  component: OnboardingComponent,
  ...canActivate(redirectUnauthorizedToLogin)
},

//auth
{
  path: 'login',
  component: LoginComponent,
  ...canActivate(redirectLoggedInToDashboard)
},

{
  path: 'signup',
  component: SignupComponent,
  ...canActivate(redirectLoggedInToDashboard)
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
    { path: 'billing', component: BillingComponent },
  ],
},

{
  path: 'collections',
  ...canActivate(redirectUnauthorizedToLogin),
  children: [
    {  path: ':id', redirectTo: 'collections/:id/reviews', pathMatch: 'full' },
    
    {  path: 'new', component: EditCollectionComponent },

    {  path: ':id', component: CollectionComponent },
    {  path: ':id/edit', component: EditCollectionComponent },
    

    {  path: 'request/:id', component: RequestComponent },
    {  path: 'request/:id/success', component: RequestSuccessComponent },
  
  ],
},

{
  path: "showcase-all",
  component: ShowcaseAllComponent,
  ...canActivate(redirectUnauthorizedToLogin),
},

{
  path: "collections/:id",
  component: CollectionComponent,
  ...canActivate(redirectUnauthorizedToLogin),
  children: [
    {  path: 'reviews', component: ReviewsComponent },
    {  path: 'embed', component: EmbedComponent },
    {  path: 'showcase', component: ShowcaseComponent },
  ]
},

// Later make sure to create a real 404 page for this
{ path: '**', redirectTo: 'dashboard' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
