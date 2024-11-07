import { Component, OnInit } from '@angular/core';
import { TwitchService } from '../../services/twitch.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChatbotComponent } from "../chatbot/chatbot.component";

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
 
})
export class InicioComponent implements OnInit {
  activeStream: any = null;
  userProfile: any = null;
  activeStreamUrl: string | null = null;
  streamsByUser: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private twitchService: TwitchService) {}

  ngOnInit() {
    this.fetchStreams();
  }

  async fetchStreams() {
    this.isLoading = true;
    this.error = null;
    
    try {
      await this.fetchActiveStream('controlactividades');
      await this.fetchUserStreams('controlactividades');

      if (!this.activeStream) {
        await this.fetchUserProfile('controlactividades');
      } 

      this.setActiveStreamUrl();
    } catch (error) {
      this.error = 'Failed to load Twitch data. Please try again later.';
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async fetchActiveStream(userName: string) {
    try {
      const userInfo = await this.twitchService.getUserInfoByUsername(userName);
      if (userInfo) {
        const streams = await this.twitchService.getStreamsByUser(userInfo.id);
        this.activeStream = streams.length > 0 ? streams[0] : null;
      }
    } catch (error) {
      console.error('Error fetching active stream:', error);
      throw error;
    }
  }

  async fetchUserStreams(userName: string) {
    try {
      
      const userInfo = await this.twitchService.getUserInfoByUsername(userName);
      if (userInfo) {
        this.streamsByUser = await this.twitchService.getStreamsByUser(userInfo.id);
        
        // Enrich stream data with user profile images
        for (let stream of this.streamsByUser) {
          const streamUserInfo = await this.twitchService.getUserInfoByUsername(stream.user_name);
          stream.profile_image_url = streamUserInfo.profile_image_url;
        }
        console.log('User Info:', userInfo);
console.log('User Profile:', this.userProfile);

      }
    } catch (error) {
      console.error('Error fetching user streams:', error);
      throw error;
    }
  }

  async fetchUserProfile(userName: string) {
    try {
      const userInfo = await this.twitchService.getUserInfoByUsername(userName);
      if (userInfo) {
        this.userProfile = userInfo;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  setActiveStreamUrl() {
    if (this.activeStream) {
      this.activeStreamUrl = `https://player.twitch.tv/?channel=${this.activeStream.user_name}&parent=${window.location.hostname}`;
    } else {
      this.activeStreamUrl = null;
    }
  }

  selectStream(stream: any) {
    this.activeStream = stream;
    this.setActiveStreamUrl();
  }
}