import { Component, OnInit } from '@angular/core';
import { YoutubeService } from '../../services/youtube.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.css']
})
export class YoutubeComponent implements OnInit {
  videos: any[] = [];
  reels: any[] = [];
  comments: any[] = []; // Variable para almacenar comentarios
  channelInfo: any;
  searchQuery: string = 'deportes';
  selectedVideoId: string | null = null;
  nextPageToken: string | null = null;

  constructor(private youtubeService: YoutubeService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.searchVideos(this.searchQuery);
    this.searchReels(this.searchQuery);
  }

  searchVideos(query: string, loadMore: boolean = false): void {
    if (this.videos.length >= 25) return; // Detener carga adicional si ya hay 25 videos

    this.youtubeService.searchVideos(query, this.nextPageToken).subscribe((response: any) => {
      const newVideos = response.items;

      // Añadir solo los videos necesarios para alcanzar un máximo de 25
      const remainingSlots = 25 - this.videos.length;
      this.videos = loadMore 
        ? [...this.videos, ...newVideos.slice(0, remainingSlots)]
        : newVideos.slice(0, remainingSlots);

      if (this.videos.length > 0) {
        const channelId = this.videos[0].snippet.channelId;
        this.getChannelInfo(channelId);
      }

      this.nextPageToken = response.nextPageToken || null;
    });
  }

  searchReels(query: string): void {
    this.youtubeService.searchVideos(`${query} shorts`).subscribe((response: any) => {
      this.reels = response.items;
    });
  }

  getChannelInfo(channelId: string): void {
    this.youtubeService.getChannelInfo(channelId).subscribe((response: any) => {
      this.channelInfo = response.items[0];
    });
  }

  selectVideo(videoId: string): void {
    this.selectedVideoId = videoId; // Seleccionar el video
    this.loadComments(videoId); // Cargar comentarios al seleccionar un video
  }
  loadComments(videoId: string): void {
    this.youtubeService.getVideoComments(videoId).subscribe((response: any) => {
      this.comments = response.items.slice(0, 10); // Limitar a 12 comentarios
    });
  }
  getVideoUrl(videoId: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`);
  }

  onSearch(): void {
    this.videos = []; // Reiniciar la lista de videos al hacer una nueva búsqueda
    this.nextPageToken = null; // Reiniciar el token al buscar algo nuevo
    this.searchVideos(this.searchQuery);
    this.searchReels(this.searchQuery);
  }
}
