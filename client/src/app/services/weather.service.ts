import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  getWeather(lat: number, lng: number) {
    throw new Error('Method not implemented.');
  }
  private weatherDataSubject = new BehaviorSubject<any>(null);
  private coordinatesSubject = new BehaviorSubject<{ lat: number, lng: number } | null>(null);

  weatherData$ = this.weatherDataSubject.asObservable();
  coordinates$ = this.coordinatesSubject.asObservable();

  private API_KEY: string = '6dba42a5e518da89bc6aa9125d9d8b14'; // Reemplaza con tu API key de OpenWeatherMap

  constructor(private http: HttpClient) {}

  updateWeatherData(data: any): void {
    this.weatherDataSubject.next(data);
  }

  updateCoordinates(coords: { lat: number, lng: number }): void {
    this.coordinatesSubject.next(coords);
  }

  getWeatherByCoordinates(latitud: number, longitud: number): Observable<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${this.API_KEY}&units=metric`;
    return this.http.get(url);
  }
}
