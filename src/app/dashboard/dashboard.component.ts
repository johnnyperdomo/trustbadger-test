import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  allReviews: number = 0;
  numberOfTextReviews: number = 0;
  numberOfVideoReviews: number = 0;

  collections: any[];

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
    this.collections = [
      {
        id: 1,
        name: 'Coffee Shop',
        numberOfReviews: 4,
        img: 'https://picsum.photos/200',
      },
      {
        id: 2,
        name: 'Bar Store',
        numberOfReviews: 7,
        img: 'https://picsum.photos/200',
      },
      {
        id: 2,
        name: 'Restaurant',
        numberOfReviews: 7,
        img: 'https://picsum.photos/200',
      },
      {
        id: 2,
        name: 'car wash',
        numberOfReviews: 7,
        img: 'https://picsum.photos/200',
      },
    ];
  }

  ngOnInit(): void {
    this.getReviewStats();
    this.getAllCollections();
  }

  async getAllCollections() {
    //TODO: query all collections connected to userID
  }

  async getReviewStats() {
    try {
      this.auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.db
            .collection('users')
            .doc(user.uid)
            .valueChanges()
            .subscribe((data: any) => {
              if (data) {
                let stats = data.stats;
                this.allReviews =
                  stats.no_text_reviews + stats.no_video_reviews;
              } else {
                throw Error;
                //LATER: update this to just show a 404 if anything
              }
            });
        }
      });
    } catch (error) {
      alert(error);
      //LATER: do something here
    }
  }
}
