import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss'],
})
export class ShowcaseComponent {
  collectionData: any = {};
  reviews: any = [];

  constructor(private db: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
    this.getInfoFromCollectionID();
  }

  //get the collection information from the ID
  async getInfoFromCollectionID() {
    const collectionID = this.router.url.split('collections/')[1].split('/')[0];

    console.log(collectionID);

    //LATER: receiving error messages, cannot read value changes

    try {
      this.db
        .collection('collections')
        .doc(collectionID)
        .valueChanges()
        .subscribe((data: any) => {
          console.log(data);

          if (data) {
            this.collectionData = data;
            console.log(data);
            this.getAllReviews(collectionID);

            // this.setupForm(data.heading, data.custom_message, data.name);
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

  async getAllReviews(collectionID: string) {
    try {
      this.db
        .collection('reviews', (ref) =>
          ref.where('collections', 'array-contains', collectionID)
        )
        .valueChanges()
        .subscribe((reviews: any) => {
          if (reviews) {
            this.reviews = reviews;
            console.log(reviews);

            // this.reviews = reviews;
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
}
