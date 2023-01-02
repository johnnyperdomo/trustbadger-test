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

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth,
    private dialog: MatDialog
  ) {
    this.collectionID = this.router.url.split('collections/')[1].split('/')[0];
    ('collections');
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

  async addReview() {
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
}
