import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})
export class SpotifyComponent implements OnInit {
  playlists: any;
  authUrl: string;
  token: string | undefined;
  userId: string | undefined;
  playlistName: string = '';
  playlistDescription: string = '';
  isPublic: boolean = false;

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute) { 
    this.authUrl = this.spotifyService.getAuthUrl();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.spotifyService.getAuthToken(code).subscribe(
          (data) => {
            this.token = data.access_token;
            this.getUserPlaylists();
            this.getUserId();
          },
          (error) => {
            console.error('Error fetching token', error);
          }
        );
      }
    });
  }

  getUserPlaylists(): void {
    if (this.token) {
      this.spotifyService.getUserPlaylists(this.token).subscribe(
        (playlists) => {
          this.playlists = playlists.items;
        },
        (error) => {
          console.error('Error fetching playlists', error);
        }
      );
    }
  }

  getUserId(): void {
    if (this.token) {
      this.spotifyService.getUserInfo(this.token).subscribe(
        (user: any) => {
          this.userId = user.id;
        },
        (error) => {
          console.error('Error fetching user ID', error);
        }
      );
    }
  }

  createPlaylist(): void {
    if (this.token && this.userId && this.playlistName) {
      this.spotifyService.createPlaylist(this.token, this.userId, this.playlistName, this.playlistDescription, this.isPublic).subscribe(
        (response) => {
          console.log('Playlist created:', response);
          this.getUserPlaylists();
        },
        (error) => {
          console.error('Error creating playlist', error);
        }
      );
    }
  }
}
