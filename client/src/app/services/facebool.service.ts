import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class FaceboolService {
  private profileImageUrlSource = new BehaviorSubject<string>('URL_ICONO_POR_DEFECTO');
  profileImageUrl$ = this.profileImageUrlSource.asObservable();
  constructor() { }

  public initFacebookSdk(): void {
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId      : '885872449836502', 
        cookie     : true,
        xfbml      : true,
        version    : 'v21.0'
      });
      FB.AppEvents.logPageView();   
    };

    // Cargar el SDK de Facebook
    const d = document, s = 'script', id = 'facebook-jssdk';
    let js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode?.insertBefore(js, fjs);
  }

  public login(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          resolve(response);
        } else {
          reject('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'public_profile,email'}); // permisos
    });
  }

  public getProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.api('/me', { fields: 'id,name,email,picture.width(200).height(200)' }, (response: any) => {
        if (response && !response.error) {
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }
  setProfileImageUrl(url: string): void {
    this.profileImageUrlSource.next(url);
  }
  public getUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.login().then(() => {
        this.getProfile().then((profile: any) => {
          const userInfo = {
            username: profile.name,
            email: profile.email,
            firstName: profile.name.split(' ')[0],
            lastName: profile.name.split(' ')[1] || '',
            phone: '' 
          };
          resolve(userInfo);
        }).catch((error: any) => reject(error));
      }).catch((error: any) => reject(error));
    });
  }
}