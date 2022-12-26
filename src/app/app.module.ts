import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './settings/account/account.component';
import { BillingComponent } from './settings/billing/billing.component';
import { EditCollectionComponent } from './collections/edit-collection/edit-collection.component';
import { CollectionComponent } from './collections/collection/collection.component';
import { RequestComponent } from './collections/request/request.component';
import { RequestSuccessComponent } from './collections/request-success/request-success.component';
import { NavbarBrandingComponent } from './navbar-branding/navbar-branding.component';
import { ReviewsComponent } from './collections/collection/reviews/reviews.component';
import { EmbedComponent } from './collections/collection/embed/embed.component';

import { CollectionNavbarComponent } from './collections/collection-navbar/collection-navbar.component';
import { ShowcaseComponent } from './collections/showcase/showcase.component';
import { ShowcaseAllComponent } from './showcase-all/showcase-all.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { environment } from '../environments/environment';
import { TextRequestDialogComponent } from './collections/request/text-request-dialog/text-request-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    OnboardingComponent,
    LoginComponent,
    SignupComponent,
    SettingsComponent,
    AccountComponent,
    BillingComponent,
    EditCollectionComponent,
    CollectionComponent,
    RequestComponent,
    RequestSuccessComponent,
    NavbarBrandingComponent,
    ReviewsComponent,
    EmbedComponent,
    CollectionNavbarComponent,
    ShowcaseComponent,
    ShowcaseAllComponent,
    TextRequestDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
