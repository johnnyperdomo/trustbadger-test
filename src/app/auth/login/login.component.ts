import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  isLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupLoginForm();
  }

  setupLoginForm() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    console.log(email, password);

    try {
      this.isLoading = true;

      await this.auth.signInWithEmailAndPassword(email, password);

      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
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