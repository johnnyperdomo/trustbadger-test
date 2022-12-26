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

  collections: any[] = []

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
  
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        await this.getReviewStats(user.uid);
        await this.getAllCollections(user.uid);
      }
    });
  }

  async getAllCollections(userID: string) {
    //TODO: query all collections connected to userID
    try {
      this.db
        .collection('collections', (ref) => ref.where('userID', '==', userID))
        .valueChanges()
        .subscribe((data) => {
          console.log(data);

          this.collections = data;
        });
    } catch (error) {
      alert(error);
      //LATER: do something here
    }
  }

  async getReviewStats(userID: string) {
    try {
      this.db
        .collection('users')
        .doc(userID)
        .valueChanges()
        .subscribe((data: any) => {
          if (data) {
            let stats = data.stats;
            this.allReviews = stats.no_text_reviews + stats.no_video_reviews;
          } else {
            throw Error;
            //LATER: update this to just show a 404 if anything
          }
        });
    } catch (error) {
      alert(error);
      //LATER: do something here
    }
  }
}
