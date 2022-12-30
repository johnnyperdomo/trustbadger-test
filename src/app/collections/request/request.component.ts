import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TextRequestDialogComponent } from './text-request-dialog/text-request-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  collection_heading: string = '';
  collection_logo: string = '';
  collection_custom_message: string = '';

  data: any = {}; //firebase data

  constructor(
    private dialog: MatDialog,
    private db: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log();
    this.getInfoFromCollectionID();
  }

  openTextReviewDialog() {
    const stream = {
      isEditing: false,
      redirect: true,
      collection: this.data,
    };

    this.dialog.open(TextRequestDialogComponent, {
      data: stream,
      autoFocus: true,
    });
  }

  //get the collection information from the ID
  async getInfoFromCollectionID() {
    const collectionID = this.router.url.split('request/')[1];

    try {
      this.db
        .collection('collections')
        .doc(collectionID)
        .valueChanges()
        .subscribe((data: any) => {
          console.log(data);

          if (data) {
            this.collection_custom_message = data.custom_message;
            this.collection_heading = data.heading;
            this.collection_logo = data.logo_url;
            this.data = data;
          } else {
            alert('page not found');
            //LATER: update this to just show a 404 if anything
          }
        });
    } catch (error) {
      //LATER: update this to just show a 404 if anything
      alert(error);
    }

    //get id
    //get url
  }
}
