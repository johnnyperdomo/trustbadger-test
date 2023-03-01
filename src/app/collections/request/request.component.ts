import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/compat/app';
import { nanoid } from 'nanoid';
import { FilePondOptions } from 'filepond';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  writtenTestimonialForm!: FormGroup;
  videoTestimonialForm!: FormGroup;

  collection_heading: string = '';
  collection_logo: string = '';
  collection_custom_message: string = '';

  data: any = {}; //firebase data

  chosenProfilePictureForTextForm?: File;
  chosenProfilePictureForVideoForm?: File;

  pondOptions: FilePondOptions = {
    allowMultiple: false,
    allowFileEncode: true,
    credits: false,

    acceptedFileTypes: ['image/*'],
    imageCropAspectRatio: '1:1', //image square
    imagePreviewMaxHeight: 150,
    maxFileSize: '3MB', //LATER: compress images to make them smaller; use a library
    //LATER: allow image editing, so they can manually crop the head of their profile pictures
  };

  // LATER: setup error messages on form inputs

  //TODO: send testimonials using api, not front end code, to save image data easier

  constructor(
    private _formBuilder: FormBuilder,
    private db: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log();
    this.getInfoFromCollectionID();
    this.setupWrittenTestimonialForm();
    this.setupVideoTestimonialForm();
  }

  setupWrittenTestimonialForm() {
    //profile picture not added in the form builder list
    this.writtenTestimonialForm = this._formBuilder.group({
      testimonial: ['', Validators.required], //message is required
      full_name: ['', Validators.required], //name is required
      email: [''],
      job_title: [''],
      website: [''],
    });
  }

  submitWrittenTestimonial() {
    const testimonial = this.writtenTestimonialForm.value.testimonial;
    const full_name = this.writtenTestimonialForm.value.full_name;
    const email = this.writtenTestimonialForm.value.email;
    const job_title = this.writtenTestimonialForm.value.job_title;
    const website = this.writtenTestimonialForm.value.website;

    console.log(testimonial, full_name, email, job_title, website);

    this.submitTestimonialToServer(
      full_name,
      email,
      job_title,
      website,
      testimonial,
      'text'
    );
  }

  setupVideoTestimonialForm() {
    //profile picture not added in the form builder list
    //only video testimonial is required here; not added in the form builder list; but validate somehow
    this.videoTestimonialForm = this._formBuilder.group({
      testimonial: [''], //message is not required in video testimonial
      full_name: ['', Validators.required], //name is required
      email: ['', [Validators.email]],
      job_title: [''],
      website: [''],
    });
  }

  submitVideoTestimonial() {
    const testimonial = this.videoTestimonialForm.value.testimonial;
    const full_name = this.videoTestimonialForm.value.full_name;
    const email = this.videoTestimonialForm.value.email;
    const job_title = this.videoTestimonialForm.value.job_title;
    const website = this.videoTestimonialForm.value.website;

    console.log(testimonial, full_name, email, job_title, website);

    this.submitTestimonialToServer(
      full_name,
      email,
      job_title,
      website,
      testimonial,
      'video'
    );
  }

  //TODO: add ability for video; add ability for profile picture
  async submitTestimonialToServer(
    client_name: string,
    client_email: string,
    client_job_title: string,
    client_website: string,
    client_review: string,
    type: string
  ) {
    try {
      const collectionsID = this.data.id; //collection id
      const userID = this.data.userID;

      let docID = nanoid(); //if review id exists -> update, else create a new one

      await this.db.firestore
        .collection('reviews')
        .doc(docID)
        .set(
          {
            userID: userID,
            id: docID,
            type,
            client_name,
            client_email,
            client_review,
            client_job_title,
            client_website,
            client_pic_url: '',
            source: 'trustbadger', //where the review came from
            tags: [],
            attachments: [],
            collections: [collectionsID],
            video_url: '',
            created: firebase.default.firestore.Timestamp.now(), //LATER: stop this from being edited when editing review, create a seperate "updated on"
          },
          { merge: true }
        );

      //TODO: upload to backend, then redirect

      //FIX //LATER: remove grey background from modal when redirecting pages
      this.redirectToSuccessPage();

      //when review is submitted
    } catch (error) {
      alert(error);
    }
  }

  redirectToSuccessPage() {
    const currentRoute = this.router.url;
    this.router.navigate([`${currentRoute}/success`]);
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
  }

  //textforms
  pondHandleAddFileForTextForm(event: any) {
    const chosenFile = event.file;
    this.chosenProfilePictureForTextForm = chosenFile;

    console.log(event);
    let filename = chosenFile.filename;
    let dataURL = chosenFile.getFileEncodeDataURL();

    console.log(dataURL);
    console.log(filename);

    console.log(this.chosenProfilePictureForTextForm);
  }

  pondHandleRemoveFileForTextForm(event: any) {
    this.chosenProfilePictureForTextForm = undefined;
  }

  //videoforms
  pondHandleAddFileForVideoForm(event: any) {
    const chosenFile = event.file;
    this.chosenProfilePictureForVideoForm = chosenFile;

    console.log(this.chosenProfilePictureForVideoForm);
  }

  pondHandleRemoveFileForvideoForm(event: any) {
    this.chosenProfilePictureForVideoForm;
  }

  async uploadToSpaces(body: any, key: string) {
    try {
      let dataToSend = {
        data: {
          key: key, //file name
          body: body,
        },
      };

      let do_spaces_bucket_path = environment.do_spaces.bucket;

      fetch(`${do_spaces_bucket_path}/uploadToSpaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      return;
    } catch (error) {
      console.log(error);
    }
  }
}
