import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiKey: string = 'AIzaSyDKo4ahcgy0eZK3cDJILdcLk2cMHRRbj8M'; // Reemplaza con tu clave
  private searchEngineId: string = '7222798d677b9461a'; // Reemplaza con tu ID de motor

  constructor(private http: HttpClient) { }

  search(query: string): Observable<any> {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${this.apiKey}&cx=${this.searchEngineId}`;
    return this.http.get<any>(url);
  }
}