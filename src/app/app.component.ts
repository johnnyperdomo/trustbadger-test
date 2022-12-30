import { Component } from '@angular/core';
import { Crisp } from 'crisp-sdk-web';

Crisp.configure('ff3b5748-9d1a-476e-8931-8dcd518f93ea');
Crisp.load();
Crisp.setZIndex(99999);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-codespace';

  //LATER: in the app you're subscribed to value changes for some things, but also make sure to unsubscribe for firebase things so it doesn't get called too often
}
