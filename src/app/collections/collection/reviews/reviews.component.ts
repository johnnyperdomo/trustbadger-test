import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];

  constructor(private db: AngularFirestore, private router: Router) {}

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

  convertTimestamp(timestamp: any) {
    let date = timestamp.toDate();
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();

    date = mm + '/' + dd + '/' + yyyy;
    return date;
  }
}
