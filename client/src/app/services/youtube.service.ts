import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private apiKey = 'AIzaSyCoDyjzjM-jqabCKz9dnN2Z8ksjyx9Yk-8';
  private apiUrl = 'https://www.googleapis.com/youtube/v3';
  private baseURL: string = 'https://www.googleapis.com/youtube/v3/search';
  constructor(private http: HttpClient) { }

  searchVideos(query: string, nextPageToken: string | null = null): Observable<any> {
    let url = `${this.apiUrl}/search?part=snippet&maxResults=28&q=${query}&type=video&key=${this.apiKey}`;
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }
    return this.http.get(url);
  }
  
  getChannelInfo(channelId: string): Observable<any> {
    const url = `${this.baseURL}/channels?part=snippet&id=${channelId}&key=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  getPlaylist(playlistId: string): Observable<any> {
    const url = `${this.baseURL}/playlists?part=snippet&id=${playlistId}&key=${this.apiKey}`;
    return this.http.get<any>(url);
  }
  // youtube.service.ts (añadir función para obtener videos de una lista de reproducción)
getPlaylistVideos(playlistId: string): Observable<any> {
  const url = `${this.baseURL}/playlistItems?part=snippet&playlistId=${playlistId}&key=${this.apiKey}`;
  return this.http.get<any>(url);
}
getVideoComments(videoId: string): Observable<any> {
  const url = `${this.apiUrl}/commentThreads?part=snippet&videoId=${videoId}&key=${this.apiKey}`;
  return this.http.get<any>(url);
}
}
