import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cancha } from '../models/canchas';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanchaService {
  API_URI = 'http://localhost:3000/canchas'; 
  private refreshSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  getCanchas() {
    return this.http.get<Cancha[]>(`${this.API_URI}`);
  }

  getCancha(idCancha: string | number) {
    return this.http.get<Cancha>(`${this.API_URI}/${idCancha}`);
  }

  saveCancha(cancha: Cancha) {
    return this.http.post(`${this.API_URI}`, cancha).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  deleteCancha(idCancha: string | number) {
    return this.http.delete(`${this.API_URI}/${idCancha}`).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  updateCancha(idCancha: string | number, updateCancha: Cancha) {
    return this.http.put(`${this.API_URI}/${idCancha}`, updateCancha).pipe(
      tap(() => this.refreshSubject.next())
    );
  }

  setTableIndex(index: number): void {
    localStorage.setItem('tableIndex', index.toString());
  }

  getTableIndex(): number {
    const index = localStorage.getItem('tableIndex');
    return index ? parseInt(index, 10) : 0;
  }

  get refresh$() {
    return this.refreshSubject.asObservable();
  }
}
