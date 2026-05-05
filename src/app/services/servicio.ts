import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../interfaces/servicio.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private apiUrl = 'http://localhost:8080/servicios';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAforo(id: number, fecha: string, hora: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/aforo?fecha=${fecha}&hora=${hora}`, { headers: this.getHeaders() });
  }
}