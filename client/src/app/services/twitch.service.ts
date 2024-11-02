import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  private clientId = 'tbwmf2ibi9w4acueszpb7rqz2fsozb';
  private baseUrl = 'https://api.twitch.tv/helix';

  constructor() {}

  // Método para obtener información del usuario
  async getUserInfo() {
    const accessToken = localStorage.getItem('twitchAccessToken');
    const url = `${this.baseUrl}/users`;

    const response = await axios.get(url, {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data[0]; // Devuelve el primer usuario (debería ser el autenticado)
  }

  async updateStreamInfo(title: string) {
    const userInfo = await this.getUserInfo(); // Obtener la información del usuario autenticado
    const broadcasterId = userInfo.id; // Obtén el ID del broadcaster
  
    const url = `${this.baseUrl}/channels?broadcaster_id=${broadcasterId}`; // Endpoint para actualizar la información del canal
  
    try {
      const response = await axios.patch(url, {
        title: title, // Título del stream
      }, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${localStorage.getItem('twitchAccessToken')}`,
          'Content-Type': 'application/json' // Asegúrate de que el tipo de contenido sea JSON
        }
      });
  
      return response.data; // Devuelve la respuesta de la API (información actualizada del canal)
    } catch (error: any) {
      console.error('Error updating stream info:', error.response?.data || error.message); // Manejo de errores
      throw error; // Lanza el error para ser manejado en el componente
    }
  }

  // Método para obtener el stream activo del usuario
  async getActiveStream() {
    const userInfo = await this.getUserInfo(); // Obtiene información del usuario autenticado
    const broadcasterId = userInfo.id; // Obtén el ID del broadcaster
    const url = `${this.baseUrl}/streams?user_id=${broadcasterId}`; // Endpoint para obtener el stream activo

    const response = await axios.get(url, {
      headers: {
        'Client-ID': this.clientId,
        'Authorization': `Bearer ${localStorage.getItem('twitchAccessToken')}`
      }
    });

    return response.data.data.length > 0 ? response.data.data[0] : null; // Devuelve el stream activo o null si no hay
  }
}
