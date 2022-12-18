import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

allReviews: number = 0
numberOfTextReviews: number = 0
numberOfVideoReviews: number = 0

collections: any[]

  constructor() {

    this.allReviews = 7
    this.numberOfTextReviews = 4
this.numberOfVideoReviews = 3
this.collections = [{id: 1, name: "Coffee Shop", numberOfReviews: 4, img: "https://picsum.photos/200" },{id: 2, name: "Bar Store", numberOfReviews: 7, img: "https://picsum.photos/200" }, {id: 2, name: "Restaurant", numberOfReviews: 7, img: "https://picsum.photos/200" }, {id: 2, name: "car wash", numberOfReviews: 7, img: "https://picsum.photos/200" } ]


}
}