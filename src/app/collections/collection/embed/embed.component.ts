import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.scss'],
})
export class EmbedComponent implements OnInit {
  embedCode = `
  <script type="text/javascript" src="https://trustbadger-storage.nyc3.cdn.digitaloceanspaces.com/iframeResizer.min.js"></script>

  <iframe id="trustbadger-wall-of-love" src="http://localhost:4200/collections/cbuXR5jyIVmkcFca6wgM6/embed" frameborder="0" scrolling="no" width="100%"></iframe>
  
  <script type="text/javascript">
    iFrameResize({
      log: true,
      checkOrigin: false,
    }, "#trustbadger-wall-of-love");
 
  </script>
 `;

  collectionID: string = '';

  constructor(
    private router: Router,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const collectionID = this.router.url.split('collections/')[1].split('/')[0];

    this.collectionID = collectionID;

    let host = window.location.host;
    console.log(host);

    this.embedCode = `
    <script type="text/javascript" src="https://trustbadger-storage.nyc3.cdn.digitaloceanspaces.com/iframeResizer.min.js"></script>
  
    <iframe id="trustbadger-wall-of-love" src="http://${host}/collections/${this.collectionID}/embed-page" frameborder="0" scrolling="no" width="100%"></iframe>
    
    <script type="text/javascript">
      iFrameResize({
        log: true,
        checkOrigin: false,
      }, "#trustbadger-wall-of-love");
   
    </script>
   `;
  }

  copyEmbedCode() {
    this.clipboard.copy(this.embedCode);

    this.snackbar.open('Copied to clipboard', 'Ok', {
      duration: 3000,
    });
  }
}
