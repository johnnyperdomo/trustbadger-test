import { Component,  } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { TextRequestDialogComponent } from './text-request-dialog/text-request-dialog.component';



@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent {

  constructor(private _snackBar: MatSnackBar, private dialog: MatDialog) { }


openTextReviewDialog() {

  const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        this.dialog.open(TextRequestDialogComponent, dialogConfig);
}


openVideoReviewDialog() {

}


  // openSnackBar() {
  //   console.log("test")
  //   this._snackBar.open("testing", "ok", {
  //     duration: 3000
  //   });
  // }

}
