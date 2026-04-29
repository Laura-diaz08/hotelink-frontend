import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:8080/reservas';

  constructor(private http: HttpClient) {}

  // Método auxiliar para el token 
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // --- OBTENER RESERVAS ---

  getAllReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getReservasUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`, { headers: this.getHeaders() });
  }

  obtenerPorCliente(idCliente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cliente/${idCliente}`, { headers: this.getHeaders() });
  }

  // --- GESTIÓN DE LA RESERVA (MÉTODOS NUEVOS/ACTUALIZADOS) ---

  // 1. Hacer Check-In
  hacerCheckIn(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/checkin`, {}, { headers: this.getHeaders() });
  }

  // 2. Hacer Check-Out
  hacerCheckOut(reservaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${reservaId}/checkout`, {}, { headers: this.getHeaders() });
  }

  // 3. Cancelar la reserva
  cancelarReserva(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancelar`, {}, { headers: this.getHeaders() });
  }

  // (Opcional) Borrado físico de la base de datos si lo necesita el ADMIN
  eliminarReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}