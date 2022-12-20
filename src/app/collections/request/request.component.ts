import { Component,  } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar() {
    console.log("test")
    this._snackBar.open("testing", "ok", {
      duration: 3000
    });
  }

}
