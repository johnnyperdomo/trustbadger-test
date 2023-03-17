import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TextRequestDialogComponent } from '../../request/text-request-dialog/text-request-dialog.component';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];

  collectionID: string = '';
  requestLink: string = '';
  editLink: string = '';

  //non-native import testimonial sources
  importSource:
    | 'twitter'
    | 'trustpilot'
    | 'producthunt'
    | 'capterra'
    | undefined;

  //LATER:

  //from import modal
  externalTestimonialsRetrieved: any[] = [];

  //import modal; search bar
  importModalSearchText: string = '';

  //from checkbox
  selectedTestimonialsToImport: any[] = [];

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth,
    private dialog: MatDialog
  ) {
    this.collectionID = this.router.url.split('collections/')[1].split('/')[0];
    ('collections');

    this.requestLink = '/collections/request/' + this.collectionID;
    this.editLink = `/collections/${this.collectionID}/edit`;
  }

  ngOnInit(): void {
    this.getAllReviews();
  }

  async getAllReviews() {
    try {
      this.db
        .collection('reviews', (ref) =>
          ref.where('collections', 'array-contains', this.collectionID)
        )
        .valueChanges()
        .subscribe((reviews: any) => {
          if (reviews) {
            this.reviews = reviews;
            console.log(this.reviews);
          } else {
            //LATER: do something
            //return empty,
          }

          // console.log(data);
          // this.collections = data;
        });
    } catch (error) {
      alert(error);
      //LATER: do something here
    }
  }

  deleteReview(review: any) {
    //LATER: create "types" later on so more organized with typescript
    console.log(review);

    if (confirm('Are you sure you want to delete this review?') == true) {
      //true
      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            await this.db.collection('reviews').doc(review.id).delete();

            console.log('deleted item');
            //LATER: add snackbar
          } catch (error) {
            alert(error);
          }
        }
      });

      console.log('true');
    }
  }

  async importReview() {
    try {
      this.db
        .collection('collections')
        .doc(this.collectionID)
        .valueChanges()
        .subscribe((data: any) => {
          console.log(data);

          if (data) {
            const stream = {
              isEditing: false,
              redirect: false,
              collection: data,
            };

            //FIX: fix this because it keeps getting called multiple times
            this.dialog.open(TextRequestDialogComponent, {
              data: stream,
              autoFocus: true,
            });
          } else {
            alert('page not found');
            //LATER: update this to just show a 404 if anything
          }
        });
    } catch (error) {}
  }

  async editReview(
    name: string,
    review: string,
    email: string,
    reviewID: string
  ) {
    try {
      this.db
        .collection('collections')
        .doc(this.collectionID)
        .valueChanges()
        .subscribe((data: any) => {
          console.log(data);

          if (data) {
            const stream = {
              isEditing: true,
              redirect: false,
              collection: data,
              review: { name, review, email, reviewID },
            };

            this.dialog.open(TextRequestDialogComponent, {
              data: stream,
              autoFocus: true,
            });
          } else {
            alert('page not found');
            //LATER: update this to just show a 404 if anything
          }
        });
    } catch (error) {}
  }

  convertTimestamp(timestamp: any) {
    let date = timestamp.toDate();
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;
    return date;
  }

  importTestimonialFrom(
    source: 'twitter' | 'trustpilot' | 'producthunt' | 'capterra'
  ) {
    console.log('source is chosen: ', source);

    this.importSource = source;
  }

  searchForExternalTestimonials() {
    console.log('pressed');

    console.log(this.importModalSearchText);
    this.externalTestimonialsRetrieved.push({
      id: this.guidGenerator(),
      text: 'hii',
    });
  }

  //from external source
  saveImportedTestimonials() {
    //TODO: show which one selected or not

    console.log('saved the following: ', this.selectedTestimonialsToImport);

    //TODO: save to firebase

    //TODO: close modal

    //TODO: reset selection value once it has been cleared; or when modal is dismissed

    // this.selectedTestimonialsToImport = []; //reset
  }

  toggleImportTestimonialSelection(item: any, isChecked: boolean) {
    if (isChecked) {
      //add to selectiong
      this.selectedTestimonialsToImport.push(item);

      console.log(this.selectedTestimonialsToImport);
    } else {
      let newSelections = this.removeObjectWithId(item.id);

      console.log(newSelections);

      this.selectedTestimonialsToImport = newSelections;
    }
  }

  removeObjectWithId(id: string) {
    let tempArr = this.selectedTestimonialsToImport;

    const objWithIdIndex = tempArr.findIndex((obj) => obj.id === id);

    if (objWithIdIndex > -1) {
      tempArr.splice(objWithIdIndex, 1);
    }

    return tempArr;
  }

  //TODO: remove later, this is temporary
  guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  }
}
