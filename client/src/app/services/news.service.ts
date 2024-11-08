import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'https://newsapi.org/v2/top-headlines'; // URL base de la API de NewsAPI

  constructor(private http: HttpClient) { }

  // Obtener noticias deportivas por fuente específica
  getSportsNewsBySource(source: string): Observable<any> {
    const params = new HttpParams()
      .set('category', 'sports')
      .set('sources', source)  // Especificamos las fuentes
      .set('language', 'es')  // Establecer el idioma a español
      .set('apiKey', '4d33004c23044044aa02364d7c44f43e'); // Tu clave de API
    return this.http.get(this.apiUrl, { params });
  }

  // Obtener noticias deportivas por palabra clave (buscar noticias específicas)
  getSportsNewsByQuery(query: string): Observable<any> {
    const params = new HttpParams()
      .set('category', 'sports')
      .set('q', query)  // Palabra clave para la búsqueda
      .set('language', 'es')  // Establecer el idioma a español
      .set('apiKey', '4d33004c23044044aa02364d7c44f43e');
    return this.http.get(this.apiUrl, { params });
  }

  // Obtener noticias deportivas por rango de fechas
  getSportsNewsByDate(fromDate: string, toDate: string): Observable<any> {
    const params = new HttpParams()
      .set('category', 'sports')
      .set('from', fromDate)  // Fecha de inicio (YYYY-MM-DD)
      .set('to', toDate)      // Fecha de fin (YYYY-MM-DD)
      .set('language', 'es')  // Establecer el idioma a español
      .set('apiKey', '4d33004c23044044aa02364d7c44f43e');
    return this.http.get(this.apiUrl, { params });
  }

  // Ordenar noticias por popularidad, relevancia o fecha de publicación
  getSortedSportsNews(sortBy: string): Observable<any> {
    const params = new HttpParams()
      .set('category', 'sports')
      .set('sortBy', sortBy)  // Parámetro de ordenación (publishedAt, relevancy, popularity)
      .set('language', 'es')  // Establecer el idioma a español
      .set('apiKey', '4d33004c23044044aa02364d7c44f43e');
    return this.http.get(this.apiUrl, { params });
  }

  // Obtener noticias deportivas por país
  getSportsNewsByCountry(country: string): Observable<any> {
    const params = new HttpParams()
      .set('category', 'sports')
      .set('country', country)  // Especificamos el país (por ejemplo, 'us' para Estados Unidos)
      .set('language', 'es')  // Establecer el idioma a español
      .set('apiKey', '4d33004c23044044aa02364d7c44f43e');
    return this.http.get(this.apiUrl, { params });
  }

  // Obtener noticias con imágenes
  getSportsNewsWithImages(): Observable<any> {
    const params = new HttpParams()
      .set('category', 'sports')
      .set('apiKey', '4d33004c23044044aa02364d7c44f43e');
    return this.http.get(this.apiUrl, { params });
  }

  // Obtener un número limitado de noticias
  getLimitedSportsNews(limit: number): Observable<any> {
    const params = new HttpParams()
      .set('category', 'sports')
      .set('pageSize', limit.toString())  // Número de artículos a obtener
      .set('apiKey', '4d33004c23044044aa02364d7c44f43e');
    return this.http.get(this.apiUrl, { params });
  }

  // Obtener noticias personalizadas con varios filtros combinados
  getCustomSportsNews(country: string, sortBy: string, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('category', 'sports')
     
      .set('country', country)
      .set('sortBy', sortBy)
      .set('pageSize', limit.toString())
      .set('apiKey', '4d33004c23044044aa02364d7c44f43e');
    return this.http.get(this.apiUrl, { params });
  }
}
