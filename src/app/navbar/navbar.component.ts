import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private auth: AngularFireAuth, private router: Router) { }

  async onLogout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

}
