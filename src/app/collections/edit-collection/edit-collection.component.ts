import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})
export class EditCollectionComponent implements OnInit, OnDestroy {

collectionForm: FormGroup
changeDetectionSub: Subscription;


  constructor(private formBuilder: FormBuilder, private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.setupForm()

    this.changeDetectionSub = this.collectionForm.valueChanges.subscribe(
      () => {
        this._cdr.detectChanges();
      }
    );

  }

  async setupForm() {
    this.collectionForm = this.formBuilder.group(
      {
        linkName: ['', Validators.required],
        description: [''],
        amount: [null, [Validators.required]],
        billingInterval: ['month', [Validators.required]],
      },
      {
    
      }
    );
  }

  ngOnDestroy() {
    if (this.changeDetectionSub) {
      this.changeDetectionSub.unsubscribe();
    }
  }
}