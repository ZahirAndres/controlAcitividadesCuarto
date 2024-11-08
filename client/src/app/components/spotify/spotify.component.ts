import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})
export class SpotifyComponent implements OnInit {
  playlists: any[] = [];
  authUrl: string;
  token: string | undefined;
  userId: string | undefined;
  playlistName: string = '';
  playlistDescription: string = '';
  isPublic: boolean = false;
  trackUris: string[] = [];
  successMessage: string = '';
  errorMessage: string = '';
  trackInfoCache: Map<string, string> = new Map();
  selectedPlaylist: any = null;

  constructor(
    private spotifyService: SpotifyService, 
    private route: ActivatedRoute
  ) { 
    this.authUrl = this.spotifyService.getAuthUrl();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.spotifyService.getAuthToken(code).subscribe({
          next: (data) => {
            this.token = data.access_token;
            this.getUserPlaylists();
            this.getUserId();
            this.successMessage = 'Successfully connected to Spotify!';
          },
          error: (error) => {
            console.error('Error fetching token', error);
            this.errorMessage = 'Failed to authenticate with Spotify';
          }
        });
      }
    });
  }

  selectPlaylist(playlist: any): void {
    this.selectedPlaylist = playlist;
  }

  getUserPlaylists(): void {
    if (this.token) {
      this.spotifyService.getUserPlaylists(this.token).subscribe({
        next: (response) => {
          // Filtrar solo playlists que tienen imágenes
          this.playlists = response.items.filter((playlist: any) => playlist.images && playlist.images.length > 0);
        },
        error: (error) => {
          console.error('Error fetching playlists', error);
          this.errorMessage = 'Failed to fetch your playlists';
        }
      });
    }
  }
  

  getUserId(): void {
    if (this.token) {
      this.spotifyService.getUserInfo(this.token).subscribe({
        next: (user: any) => {
          this.userId = user.id;
        },
        error: (error) => {
          console.error('Error fetching user ID', error);
          this.errorMessage = 'Failed to fetch user information';
        }
      });
    }
  }

  createPlaylist(): void {
    if (this.token && this.userId && this.playlistName) {
      this.spotifyService.createPlaylist(
        this.token, 
        this.userId, 
        this.playlistName, 
        this.playlistDescription, 
        this.isPublic
      ).subscribe({
        next: (response: any) => {
          if (this.trackUris.length > 0) {
            this.addTracksToPlaylist(response.id);
          }
          this.successMessage = 'Playlist created successfully!';
          this.resetForm();
          this.getUserPlaylists();
        },
        error: (error) => {
          console.error('Error creating playlist', error);
          this.errorMessage = 'Failed to create playlist';
        }
      });
    }
  }

  addTracksToPlaylist(playlistId: string): void {
    if (this.token && this.trackUris.length > 0) {
      this.spotifyService.addTracksToPlaylist(this.token, playlistId, this.trackUris)
        .subscribe({
          next: (response) => {
            this.successMessage = 'Tracks added to playlist successfully!';
          },
          error: (error) => {
            console.error('Error adding tracks to playlist', error);
            this.errorMessage = 'Failed to add tracks to playlist';
          }
        });
    }
  }

  extractTrackId(input: string): string | null {
    // Handle Spotify URIs (spotify:track:xxx)
    const uriMatch = input.match(/spotify:track:([a-zA-Z0-9]{22})/);
    if (uriMatch) return uriMatch[1];

    // Handle Spotify URLs (https://open.spotify.com/track/xxx)
    const urlMatch = input.match(/spotify\.com\/(?:intl-[a-z]+\/)?track\/([a-zA-Z0-9]{22})/);
    if (urlMatch) return urlMatch[1];

    return null;
  }

  addTrackUri(input: string): void {
    if (!input) return;
    
    const trackId = this.extractTrackId(input);
    if (!trackId) {
      this.errorMessage = 'Invalid Spotify track format. Please use a Spotify URI or link.';
      return;
    }

    const trackUri = `spotify:track:${trackId}`;
    if (!this.trackUris.includes(trackUri)) {
      this.trackUris.push(trackUri);
      this.getTrackInfo(trackUri); 
    } else {
      this.errorMessage = 'Track already added to the list';
    }
  }

  removeTrack(index: number): void {
    this.trackUris.splice(index, 1);
  }

  getTrackInfo(uri: string): Observable<string> {
    if (this.trackInfoCache.has(uri)) {
      return of(this.trackInfoCache.get(uri)!);
    }

    const trackId = uri.split(':')[2];
    if (!this.token) return of(uri);

    return this.spotifyService.getTrackInfo(this.token, trackId).pipe(
      map(track => {
        const trackInfo = `${track.name} - ${track.artists[0].name}`;
        this.trackInfoCache.set(uri, trackInfo);
        return trackInfo;
      }),
      catchError(() => of(uri))
    );
  }

  private resetForm(): void {
    this.playlistName = '';
    this.playlistDescription = '';
    this.isPublic = false;
    this.trackUris = [];
    this.errorMessage = '';
  }
}