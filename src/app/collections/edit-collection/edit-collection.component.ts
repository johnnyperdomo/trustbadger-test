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

  //check to see whether it's being edited
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('/edit')) {
      //LATER: add spinner
      this.isEditing = true;
      this.getInfoFromCollectionID();
    } else {
      console.log("doesn't contain edit");
      this.setupForm('', '', '');
    }

    this.changeDetectionSub = this.collectionForm.valueChanges.subscribe(() => {
      this._cdr.detectChanges();
    });
  }

  async setupForm(heading: string, custom_message: string, name: string) {
    this.collectionForm = this.formBuilder.group(
      {
        heading: [heading, Validators.required],
        custom_message: [custom_message, Validators.required],
        name: [name, Validators.required],
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

  editCollection() {
    const collectionID = this.router.url.split('collections/')[1].split('/')[0];

    const custom_message = this.collectionForm.value.custom_message;
    const heading = this.collectionForm.value.heading;
    // const logo_url = this.collectionForm.value.email; //LATER: add ability to add logo
    const name = this.collectionForm.value.name;

    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          await this.db.firestore
            .collection('collections')
            .doc(collectionID)
            .set(
              {
                custom_message,
                heading,
                name,
              },
              { merge: true }
            );

          this.redirectToNewCollection(collectionID);
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

  //get the collection information from the ID
  async getInfoFromCollectionID() {
    const collectionID = this.router.url.split('collections/')[1].split('/')[0];

    //LATER: receiving error messages, cannot read value changes

    try {
      this.db
        .collection('collections')
        .doc(collectionID)
        .valueChanges()
        .subscribe((data: any) => {
          console.log(data);

          if (data) {
            this.setupForm(data.heading, data.custom_message, data.name);
          } else {
            alert('page not found');
            //LATER: update this to just show a 404 if anything
          }
        });
    } catch (error) {
      //LATER: update this to just show a 404 if anything
      alert(error);
    }
  }
  ngOnDestroy() {
    if (this.changeDetectionSub) {
      this.changeDetectionSub.unsubscribe();
    }
  }
}
