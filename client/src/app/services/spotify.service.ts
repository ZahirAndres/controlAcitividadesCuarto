import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  public clientId = '5e8346d1c48f4cfca7f42e70a7e6c0f4';
  public clientSecret = '391523739ba64c9b9a516af3a8fa82e8';
  public redirectUri = 'http://localhost:4200/inicio/inicio';
  private authUrl = 'https://accounts.spotify.com/api/token';
  public apiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getAuthUrl(): string {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-library-read',
      'streaming'
    ].join(' ');

    return `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(this.redirectUri)}`;
  }

  getAuthToken(code: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', this.redirectUri);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
    });

    return this.http.post(this.authUrl, body.toString(), { headers })
      .pipe(catchError(this.handleError));
  }

  getUserPlaylists(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get(`${this.apiUrl}/me/playlists`, { headers })
      .pipe(catchError(this.handleError));
  }

  getPlaylistTracks(token: string, playlistId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get(`${this.apiUrl}/playlists/${playlistId}/tracks`, { headers })
      .pipe(catchError(this.handleError));
  }

  createPlaylist(
    token: string, 
    userId: string, 
    playlistName: string, 
    playlistDescription: string = '', 
    isPublic: boolean = false
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
  
    const body = {
      name: playlistName,
      description: playlistDescription,
      public: isPublic
    };
  
    return this.http.post(`${this.apiUrl}/users/${userId}/playlists`, body, { headers })
      .pipe(catchError(this.handleError));
  }
  
  getUserInfo(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get(`${this.apiUrl}/me`, { headers })
      .pipe(catchError(this.handleError));
  }

  addTracksToPlaylist(token: string, playlistId: string, tracks: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
    
    const body = {
      uris: tracks
    };
    
    return this.http.post(`${this.apiUrl}/playlists/${playlistId}/tracks`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  getTrackInfo(token: string, trackId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.get(`${this.apiUrl}/tracks/${trackId}`, { headers })
      .pipe(catchError(this.handleError));
  }
}