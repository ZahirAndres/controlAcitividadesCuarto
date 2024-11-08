// spotify-auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  private clientId = '5e8346d1c48f4cfca7f42e70a7e6c0f4'; // Tu Client ID
  private redirectUri = 'http://localhost:4200/inicio/inicio'; // URI de redireccionamiento configurada
  private authEndpoint = 'https://accounts.spotify.com/authorize';
  private scope = 'user-read-playback-state user-modify-playback-state streaming'; // Permisos necesarios

  constructor() {}

  authenticate(): void {
    const authUrl = `${this.authEndpoint}?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(this.scope)}&response_type=token`;
    window.location.href = authUrl; // Redirige al usuario a Spotify para iniciar sesión
  }
}
