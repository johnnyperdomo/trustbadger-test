import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-collection-navbar',
  templateUrl: './collection-navbar.component.html',
  styleUrls: ['./collection-navbar.component.scss'],
})
export class CollectionNavbarComponent implements OnInit {
  requestLink: string = '';
  editLink: string = '';

  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const collectionID = this.router.url.split('collections/')[1].split('/')[0];
    this.requestLink = '/collections/request/' + collectionID;
    this.editLink = `/collections/${collectionID}/edit`;
  }

  copyRequestLink() {
    const url = window.location.host + this.requestLink;
    this.clipboard.copy(url);

    this.snackbar.open('Copied to clipboard', 'Ok', {
      duration: 3000,
    });
  }

  goToEditPage() {}
}
