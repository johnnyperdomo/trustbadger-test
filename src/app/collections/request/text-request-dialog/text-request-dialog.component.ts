import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';


export interface DialogData {
  testimonial: string,
  name: string, 
  email: string
}

@Component({
  selector: 'app-text-request-dialog',
  templateUrl: './text-request-dialog.component.html',
  styleUrls: ['./text-request-dialog.component.scss']
})
export class TextRequestDialogComponent {
  textForm!: FormGroup

  constructor(public dialogRef: MatDialogRef<TextRequestDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder, private router: Router) {

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

    this.setupLoginForm()
  }

  setupLoginForm() {
    this.textForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      review: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }



//TODO: disable form submit if not valid 


  addTextReview() {
    const email = this.textForm.value.email;
    const name = this.textForm.value.name;
    const review = this.textForm.value.review;

console.log("add text review")
console.log(email, name, review)

//TODO: when submit form submit to firebase
//TODO: if success redirect to thank you page
this.router.navigate(['collections/request/123/success']);

  }



}
