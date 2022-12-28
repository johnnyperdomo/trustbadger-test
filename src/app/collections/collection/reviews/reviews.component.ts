import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.getAllReviews();
  }

  async getAllReviews() {
    const collectionID = this.router.url.split('collections/')[1].split('/')[0];
    ('collections');

    try {
      this.db
        .collection('reviews', (ref) =>
          ref.where('collections', 'array-contains', collectionID)
        )
        .valueChanges()
        .subscribe((reviews: any) => {
          if (reviews) {
            console.log(reviews);

            console.log(this.convertTimestamp(reviews[0].created));
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

  convertTimestamp(timestamp: any) {
    let date = timestamp.toDate();
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;
    return date;
  }
}
