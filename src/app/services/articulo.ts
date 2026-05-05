import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  private apiUrl = 'http://localhost:8080/articulos';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getArticulos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`, { headers: this.getHeaders() });
  }

  añadirCargo(reservaId: number, articuloId: number, cantidad: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cargo`,
      { reservaId, articuloId, cantidad },
      { headers: this.getHeaders() }
    );
  }

  getCargosDeReserva(reservaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cargo/reserva/${reservaId}`, { headers: this.getHeaders() });
  }

  eliminarCargo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cargo/${id}`, { headers: this.getHeaders() });
  }

  getTotalCargos(reservaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cargo/reserva/${reservaId}/total`, { headers: this.getHeaders() });
  }
}