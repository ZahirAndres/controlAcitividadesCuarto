import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogflowService {
  private apiKey: string = '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'; // Reemplaza con tu API Key válida
  private apiUrl: string = 'https://api.openai.com/v1/chat/completions'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}` // Asegúrate de que el formato sea correcto
    });

    const body = {
      model: 'gpt-3.5-turbo', // Asegúrate de que este modelo esté habilitado en tu cuenta
      messages: [{ role: 'user', content: message }] // Cuerpo de la solicitud
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
