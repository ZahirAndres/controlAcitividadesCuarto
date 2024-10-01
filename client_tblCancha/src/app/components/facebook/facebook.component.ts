import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrl: './facebook.component.scss'
})
export class FacebookComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.loadFacebookSDK();
  }

  loadFacebookSDK() {
    if ((<any>window).FB) {
      // El SDK ya está cargado
      (<any>window).FB.XFBML.parse();
    } else {
      // Cargar el SDK de Facebook
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      script.onload = () => {
        (<any>window).FB.init({
          appId: 'your-app-id', // Reemplaza con tu ID de aplicación
          xfbml: true,
          version: 'v12.0'
        });
      };
    }
  }
}