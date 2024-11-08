import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { SpotifyService } from '../../../services/spotify.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.css']
})
export class PlaylistDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() token: string | undefined;
  @Input() playlist: any;
  tracks: any[] = [];
  currentTrack: any = null;
  isPlaying: boolean = false;
  previewUrl: SafeResourceUrl | null = null;  // Cambiar el tipo de previewUrl a SafeResourceUrl

  constructor(
    private spotifyService: SpotifyService,
    private sanitizer: DomSanitizer  // Inyectar DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadPlaylistTracks();
  }

  ngOnChanges(): void {
    if (this.playlist) {
      this.loadPlaylistTracks();
    }
  }

  loadPlaylistTracks(): void {
    if (!this.token || !this.playlist) return;

    this.spotifyService.getPlaylistTracks(this.token, this.playlist.id)
      .subscribe({
        next: (response) => {
          console.log('Loaded tracks:', response);
          this.tracks = response.items.map((item: any) => item.track).filter((track: any) => track !== null);
        },
        error: (error) => {
          console.error('Error loading tracks:', error);
        }
      });
  }

  playPreview(track: any): void {
    if (this.currentTrack?.id === track.id && this.isPlaying) {
      this.isPlaying = false;
      this.previewUrl = null; // Stop preview if already playing
      this.currentTrack = null;
      return;
    }

    if (track.preview_url) {
      // Sanea la URL de la vista previa
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(track.preview_url); // Usar bypassSecurityTrustResourceUrl
      this.currentTrack = track;
      this.isPlaying = true;
    } else {
      this.previewUrl = null;
      console.log('No preview URL available for this track');
    }
  }

  ngOnDestroy(): void {
    this.isPlaying = false;
    this.previewUrl = null;
  }
}
