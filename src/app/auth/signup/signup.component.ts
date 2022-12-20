import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  isLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSignupForm();
  }

  setupSignupForm() {
    this.signupForm = this._formBuilder.group({
      fName: ['', Validators.required],
      lName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    //LATER: add form option for user to include how did they hear about us
    const firstName = this.signupForm.value.fName;
    const lastName = this.signupForm.value.lName;
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;

    try {
      //LATER: loading, disable button
      this.isLoading = true;

      await this.auth.createUserWithEmailAndPassword(email, password);

      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          await this.db.firestore.collection('users').doc(user.uid).set(
            {
              userID: user.uid,
              firstName: firstName,
              lastName: lastName,
              created: firebase.default.firestore.Timestamp.now(),
            },
            { merge: true }
          );

          //since it's first time here, route to paywall
          this.router.navigate(['/dashboard']);
          this.isLoading = false;
        }
      });
    } catch (error: any) {
      alert(error.message);
      this.isLoading = false;
    }
  }
}
