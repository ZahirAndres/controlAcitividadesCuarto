import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TwitchService } from '../../services/twitch.service';
import { AppComponent } from '../../app.component'; // Asegúrate de importar el AppComponent

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {
  accessToken: string | null = null;
  streamTitle: string = '';
  activeStream: any = null;

  constructor(
    private authService: AuthService, 
    private twitchService: TwitchService,
    private appComponent: AppComponent // Inyecta el AppComponent
  ) {}

  ngOnInit(): void {
    this.handleAuthResponse();
  }

  login() {
    this.appComponent.preventLogout(); // Previene el logout antes de redirigir
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

    this.appComponent.enableLogout(); // Permite el logout de nuevo después de la redirección
  }
  
  async startStream() {
    if (!this.accessToken) {
      console.error('No access token found. Please log in.');
      return;
    }
    
    try {
      const userInfo = await this.twitchService.getUserInfo();
      console.log('User Info:', userInfo);
 
      await this.twitchService.updateStreamInfo(this.streamTitle);
      console.log('Stream info updated.');

      this.activeStream = await this.twitchService.getActiveStream();
      console.log('Active Stream:', this.activeStream);
 
      alert('La información de tu stream ha sido actualizada. Por favor, inicia OBS y comienza a transmitir con la clave de transmisión.');
    } catch (error) {
      console.error('Error updating stream info:', error);
    }
  }
}
