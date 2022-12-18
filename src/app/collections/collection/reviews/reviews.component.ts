import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {

reviews: any[]

  constructor() { 

this.reviews = [{text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa.", reviewer: "Johnny P", date: "Jun 4, 2022"},
{text: "adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum velit euismod in pellentesque massa.", reviewer: "Charles Len", date: "Mark 7, 2023"},
{text: " dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor magna aliqua. Interdum velit euismod in pellentesque massa.", reviewer: "Stevie Wonder", date: "Sep 17, 2019"},
{text: " dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor magna aliqua. Interdum velit euismod in pellentesque massa.", reviewer: "Stevie Wonder", date: "Sep 17, 2019"},
{text: " dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor magna aliqua. Interdum velit euismod in pellentesque massa.", reviewer: "Stevie Wonder", date: "Sep 17, 2019"},
{text: " dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor magna aliqua. Interdum velit euismod in pellentesque massa.", reviewer: "Stevie Wonder", date: "Sep 17, 2019"}
]

  }

  

}
