import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  private clientId = 'tbwmf2ibi9w4acueszpb7rqz2fsozb';
  private baseUrl = 'https://api.twitch.tv/helix';

  constructor() {}

  async getUserInfo() {
    const accessToken = localStorage.getItem('twitchAccessToken');
    const url = `${this.baseUrl}/users`;

    const response = await axios.get(url, {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data[0];
  }

  async getActiveStream() {
    const userInfo = await this.getUserInfo();
    const broadcasterId = userInfo.id;
    const url = `${this.baseUrl}/streams?user_id=${broadcasterId}`;

    const response = await axios.get(url, {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${localStorage.getItem('twitchAccessToken')}`,
      },
    });

    return response.data.data.length > 0 ? response.data.data[0] : null;
  }

  async updateStreamInfo(title: string) {
    const userInfo = await this.getUserInfo();
    const broadcasterId = userInfo.id;

    const url = `${this.baseUrl}/channels?broadcaster_id=${broadcasterId}`;

    try {
      const response = await axios.patch(
        url,
        { title: title },
        {
          headers: {
            'Client-ID': this.clientId,
            Authorization: `Bearer ${localStorage.getItem('twitchAccessToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error updating stream info:', error.response?.data || error.message);
      throw error;
    }
  }

  async getAllStreamTags(accessToken: string) {
    const url = `${this.baseUrl}/tags/streams`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Client-ID': this.clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching stream tags:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateStreamTags(broadcasterId: string, tagIds: string[], accessToken: string) {
    const url = `${this.baseUrl}/streams/tags?broadcaster_id=${broadcasterId}`;

    try {
      const response = await axios.put(
        url,
        { tag_ids: tagIds },
        {
          headers: {
            'Client-ID': this.clientId,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error updating stream tags:', error.response?.data || error.message);
      throw error;
    }
  }

  async getUserInfoByUsername(userName: string) {
    const url = `${this.baseUrl}/users?login=${userName}`;
    const accessToken = localStorage.getItem('twitchAccessToken');

    const response = await axios.get(url, {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data.length > 0 ? response.data.data[0] : null;
  
  }

  async getStreamsByUser(userId: string): Promise<any[]> {
    const url = `${this.baseUrl}/streams?user_id=${userId}`;
    const accessToken = localStorage.getItem('twitchAccessToken');
  
    try {
      const response = await axios.get(url, {
        headers: {
          'Client-ID': this.clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      return response.data.data; // Devuelve los streams encontrados
    } catch (error: any) {
      console.error('Error fetching streams by user:', error.response?.data || error.message);
      throw error;
    }
  }
}
