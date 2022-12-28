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

@Component({
  selector: 'app-text-request-dialog',
  templateUrl: './text-request-dialog.component.html',
  styleUrls: ['./text-request-dialog.component.scss'],
})
export class TextRequestDialogComponent {
  userID: string = '';
  textForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TextRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private router: Router,
    private db: AngularFirestore
  ) {
    this.setupLoginForm();
    console.log(data);
  }

  setupLoginForm() {
    this.textForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      review: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  addTextReview() {
    const email = this.textForm.value.email;
    const name = this.textForm.value.name;
    const review = this.textForm.value.review;

    let userID = this.data.collection.userID;
    let collectionsID = this.data.collection.id;

    this.submitReview(userID, collectionsID, name, email, review);
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

      if (this.data.redirect == true) {
        console.log('redirect true');

        this.redirectToSuccessPage();
      } else {
        console.log('redirect false');
        //LATER: show snackbar notification
      }

      //when review is submitted
    } catch (error) {
      alert(error);
    }
  }

  redirectToSuccessPage() {
    const currentRoute = this.router.url;
    this.router.navigate([`${currentRoute}/success`]);
  }
}
