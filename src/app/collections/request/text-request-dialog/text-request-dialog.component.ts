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
  reviewID?: string;

  constructor(
    public dialogRef: MatDialogRef<TextRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private router: Router,
    private db: AngularFirestore
  ) {
    if (data.isEditing) {
      this.reviewID = data.review.reviewID;

      this.setupLoginForm(
        data.review.name,
        data.review.review,
        data.review.email
      );
      console.log(data);
    } else {
      this.setupLoginForm('', '', '');
      console.log(data);
    }
  }

  setupLoginForm(name: string, review: string, email: string) {
    this.textForm = this._formBuilder.group({
      name: [name, [Validators.required]],
      review: [review, [Validators.required]],
      email: [email, [Validators.required, Validators.email]],
    });
  }

  addTextReview() {
    const email = this.textForm.value.email;
    const name = this.textForm.value.name;
    const review = this.textForm.value.review;

    let userID = this.data.collection.userID;
    let collectionsID = this.data.collection.id;

    this.submitReview(
      userID,
      collectionsID,
      name,
      email,
      review,
      this.reviewID
    );
  }

  async submitReview(
    userID: string,
    collectionsID: string,
    client_name: string,
    client_email: string,
    client_review: string,
    reviewID?: string
  ) {
    try {
      let docID = reviewID ? reviewID : nanoid(); //if review id exists -> update, else create a new one

      await this.db.firestore
        .collection('reviews')
        .doc(docID)
        .set(
          {
            userID: userID,
            id: docID,
            type: 'text',
            client_name,
            client_email,
            client_review,
            client_pic_url: '',
            tags: [],
            attachments: [],
            collections: [collectionsID],
            video_url: '',
            created: firebase.default.firestore.Timestamp.now(), //LATER: stop this from being edited when editing review, create a seperate "updated on"
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
