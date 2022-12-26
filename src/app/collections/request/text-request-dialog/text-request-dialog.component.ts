import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { nanoid } from 'nanoid';

export interface DialogData {
  testimonial: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-text-request-dialog',
  templateUrl: './text-request-dialog.component.html',
  styleUrls: ['./text-request-dialog.component.scss'],
})
export class TextRequestDialogComponent {
  textForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TextRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _formBuilder: FormBuilder,
    private router: Router,
    private db: AngularFirestore
  ) {
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });

    this.setupLoginForm();
  }

  setupLoginForm() {
    console.log(this.router.url);

    this.textForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      review: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  //TODO: disable form submit if not valid

  addTextReview() {
    const email = this.textForm.value.email;
    const name = this.textForm.value.name;
    const review = this.textForm.value.review;

    this.submitReview(
      'RCraskTUG9U2j252a3yPKfMpsGJ3',
      'WicLU38BZWSGIHA4U5EK',
      name,
      email,
      review
    );
  }

  async submitReview(
    userID: string,
    collectionsID: string,
    client_name: string,
    client_email: string,
    client_review: string
  ) {
    try {
      let newDocID = nanoid();

      await this.db.firestore
        .collection('reviews')
        .doc(newDocID)
        .set(
          {
            userID: userID,
            id: newDocID,
            type: 'text',
            client_name,
            client_email,
            client_review,
            client_pic_url: '',
            tags: [],
            attachments: [],
            collections: [collectionsID],
            video_url: '',
            created: firebase.default.firestore.Timestamp.now(),
          },
          { merge: true }
        );

      //when review is submitted
      this.redirectToSuccessPage();
    } catch (error) {
      alert(error);
    }
  }

  redirectToSuccessPage() {
    const currentRoute = this.router.url;
    this.router.navigate([`${currentRoute}/success`]);
  }
}
