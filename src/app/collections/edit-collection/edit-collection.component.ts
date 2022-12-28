import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { Subscription } from 'rxjs';

import * as firebase from 'firebase/compat/app';
import { nanoid } from 'nanoid';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss'],
})
export class EditCollectionComponent implements OnInit, OnDestroy {
  collectionForm!: FormGroup;
  changeDetectionSub!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    //TODO: check if page is create or edit
  }

  ngOnInit(): void {
    this.setupForm();

    this.changeDetectionSub = this.collectionForm.valueChanges.subscribe(() => {
      this._cdr.detectChanges();
    });
  }

  async setupForm() {
    this.collectionForm = this.formBuilder.group(
      {
        heading: ['', Validators.required],
        custom_message: ['', Validators.required],
        name: ['', Validators.required],
      },
      {}
    );
  }

  async createNewCollection() {
    const custom_message = this.collectionForm.value.custom_message;
    const heading = this.collectionForm.value.heading;
    // const logo_url = this.collectionForm.value.email; //LATER: add ability to add logo
    const name = this.collectionForm.value.name;

    console.log(custom_message, heading, name);

    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          let newDocID = nanoid();

          await this.db.firestore
            .collection('collections')
            .doc(newDocID)
            .set(
              {
                userID: user.uid,
                id: newDocID,
                custom_message,
                heading,
                logo_url: '',
                name,
                stats: {
                  no_text_reviews: 0,
                  no_video_reviews: 0,
                },
                created: firebase.default.firestore.Timestamp.now(),
              },
              { merge: true }
            );

          this.redirectToNewCollection(newDocID);

          //when review is submitted
          // this.redirectToSuccessPage();
        } catch (error) {
          alert(error);
        }
      }
      //LATER: catch for errors if user not identified
    });
    //LATER: add spinner
  }

  redirectToNewCollection(id: string) {
    this.router.navigate([`collections/${id}/reviews`]);
  }

  getCollectionInformationToEdit() {}

  ngOnDestroy() {
    if (this.changeDetectionSub) {
      this.changeDetectionSub.unsubscribe();
    }
  }
}
