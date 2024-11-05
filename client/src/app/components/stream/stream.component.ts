import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TwitchService } from '../../services/twitch.service';
import { AppComponent } from '../../app.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css'] 
})
export class StreamComponent implements OnInit, OnDestroy {
  accessToken: string | null = null;
  streamTitle: string = '';
  activeStream: any = null;
  parentDomain: string = 'localhost';
  sanitizedUrl: SafeResourceUrl | null = null;
  checkStreamInterval: any;
  customTags: string[] = ['controlactividades', 'UTNG']; // Tus tags personalizados
  tagIds: string[] = [];

  constructor(
    private authService: AuthService,
    private twitchService: TwitchService,
    private appComponent: AppComponent,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.handleAuthResponse();
    this.checkActiveStream();

    // Revisar el stream cada 30 segundos
    this.checkStreamInterval = setInterval(() => {
      this.checkActiveStream();
    }, 30000);

    // Obtener los IDs de los tags personalizados
    this.getTagIds();
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo al destruir el componente
    if (this.checkStreamInterval) {
      clearInterval(this.checkStreamInterval);
    }
  }

  login() {
    this.appComponent.preventLogout();
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

    this.appComponent.enableLogout();
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

      this.checkActiveStream();
      this.updateStreamTags(userInfo.id); // Actualiza los tags del stream

      alert('La información de tu stream ha sido actualizada. Por favor, inicia OBS y comienza a transmitir con la clave de transmisión.');
    } catch (error) {
      console.error('Error updating stream info:', error);
    }
  }

  async getTagIds() {
    if (!this.accessToken) {
      console.error('No access token found. Please log in.');
      return;
    }

    try {
      const tagsResponse = await this.twitchService.getAllStreamTags(this.accessToken);
      const allTags = tagsResponse.data;

      this.tagIds = this.customTags
        .map(tagName => {
          const tag = allTags.find((t: any) => t.localization_names['en-us'] === tagName);
          return tag ? tag.tag_id : null;
        })
        .filter((tagId: string | null) => tagId !== null) as string[];

      console.log('Tag IDs:', this.tagIds);
    } catch (error) {
      console.error('Error fetching stream tags:', error);
    }
  }

  async updateStreamTags(broadcasterId: string) {
    try {
      await this.twitchService.updateStreamTags(broadcasterId, this.tagIds, this.accessToken!);
      console.log('Stream tags updated.');
    } catch (error) {
      console.error('Error updating stream tags:', error);
    }
  }

  async checkActiveStream() {
    if (!this.accessToken) {
      console.error('No access token found. Please log in.');
      return;
    }

    try {
      this.activeStream = await this.twitchService.getActiveStream();
      console.log('Active Stream:', this.activeStream);
      if (this.activeStream) {
        this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://player.twitch.tv/?channel=${this.activeStream.user_name}&parent=${this.parentDomain}`
        );
      } else {
        this.sanitizedUrl = null; // Limpia la URL si no hay stream activo
      }
    } catch (error) {
      console.error('Error fetching active stream:', error);
    }
  }
}
