import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import MagicGrid from 'magic-grid';
import { Subscription } from 'rxjs';
import { iframeResizer } from 'iframe-resizer';

@Component({
  selector: 'app-embed-page',
  templateUrl: './embed-page.component.html',
  styleUrls: ['./embed-page.component.scss'],
})
export class EmbedPageComponent implements OnInit, OnDestroy {
  collectionData: any = {};
  reviews: any = [];

  reviewsSub!: Subscription;
  collectionsSub!: Subscription;

  constructor(private db: AngularFirestore, private router: Router) {
    // iframeResizer(
    //   { log: true, checkOrigin: true, resizeFrom: 'child' },
    //   '#trustbadger-wall-of-love'
    // );
  }

  ngOnInit(): void {
    this.getInfoFromCollectionID();
    // FIX: Sometimes it's not resizing correctly when content is smaller: IFRAME Resizer
  }

  //get the collection information from the ID
  async getInfoFromCollectionID() {
    const collectionID = this.router.url.split('collections/')[1].split('/')[0];

    console.log(collectionID);

    //LATER: receiving error messages, cannot read value changes

    try {
      this.collectionsSub = this.db
        .collection('collections')
        .doc(collectionID)
        .valueChanges()
        .subscribe((data: any) => {
          console.log(data); //FIX: this gets double called sometimes which makes the magicgrid glitch

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
      this.reviewsSub = this.db
        .collection('reviews', (ref) =>
          ref.where('collections', 'array-contains', collectionID)
        )
        .valueChanges()
        .subscribe((reviews: any[]) => {
          if (reviews && reviews.length !== 0) {
            this.reviews = reviews;
            console.log(reviews);
            console.log('reviews called');

            setTimeout(() => {
              //dynamic grid
              let magicGrid = new MagicGrid({
                container: '.grid-layout',
                gutter: 0,
                items: this.reviews.length,
                animate: true, // Optional.
                maxColumns: 3,
              });

              if (magicGrid.ready() === true) {
                magicGrid.listen();
                magicGrid.positionItems();
              }
            }, 150); //LATER: remove delay? Currently I have the delay to help the magicgrid stop glitching on initialization. Maybe it's waiting for the page to finish rendering, waiting for dom to be ready

            //LATER: fix issue, when it's updated in firebase it loses positioning grid
          } else {
            //LATER: do something
            //return empty,
          }

          // console.log(data);
          // this.collections = data;
        });

      // magicGrid.positionItems();

      // var repositionTimer = setInterval(() => {
      //   magicGrid.positionItems();
      // }, 100);

      // setTimeout(() => {
      //   clearInterval(repositionTimer);
      // }, 3000);
    } catch (error) {
      alert(error);
      //LATER: do something here
    }
  }

  ngOnDestroy() {
    if (this.collectionsSub) {
      this.collectionsSub.unsubscribe();
    }

    if (this.reviewsSub) {
      this.reviewsSub.unsubscribe();
    }
  }
}
