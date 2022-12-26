import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TextRequestDialogComponent } from './text-request-dialog/text-request-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent {
  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private db: AngularFirestore
  ) {}

  openTextReviewDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    this.dialog.open(TextRequestDialogComponent, dialogConfig);
  }

  //get the collection information from the ID
  getInfoFromCollectionID() {
    //get id
    //get url
  }

  // openSnackBar() {
  //   console.log("test")
  //   this._snackBar.open("testing", "ok", {
  //     duration: 3000
  //   });
  // }
}
