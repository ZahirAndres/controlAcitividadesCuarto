import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TwitchService } from '../../services/twitch.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {
  accessToken: string | null = null;
  streamTitle: string = '';

  constructor(private authService: AuthService, private twitchService: TwitchService) {}

  ngOnInit(): void {
    this.handleAuthResponse();
  }

  login() {
    window.location.href = this.authService.getAuthUrl();
  }

  handleAuthResponse() {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');

      if (token) {
        this.accessToken = token;
        localStorage.setItem('twitchAccessToken', this.accessToken);
      }

      window.location.hash = '';
    }
  }
  
  async startStream() {
    if (!this.accessToken) {
      console.error('No access token found. Please log in.');
      return;
    }
    
    try {
      const userInfo = await this.twitchService.getUserInfo();
      console.log('User Info:', userInfo); // Aquí puedes ver los datos del usuario
  
      // Actualiza la información del stream (título, etc.)
      const data = await this.twitchService.updateStreamInfo(this.streamTitle);
      console.log('Stream info updated:', data);
  
      // Aquí puedes mostrar un mensaje al usuario indicando que debe iniciar su transmisión en OBS
      alert('La información de tu stream ha sido actualizada. Por favor, inicia OBS y comienza a transmitir con la clave de transmisión.');
    } catch (error) {
      console.error('Error updating stream info:', error);
    }
  }
  
}
