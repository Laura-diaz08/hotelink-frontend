import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpinionService {

  private apiUrl = 'http://localhost:8080/opiniones';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getOpiniones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estadisticas`);
  }

  puedeOpinar(usuarioId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/puede-opinar/${usuarioId}`, { headers: this.getHeaders() });
  }

  crearOpinion(usuarioId: number, estrellas: number, comentario: string): Observable<any> {
    return this.http.post(this.apiUrl, { usuarioId, estrellas, comentario }, { headers: this.getHeaders() });
  }

  eliminarOpinion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}