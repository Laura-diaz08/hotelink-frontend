import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  // Apuntamos al controlador de reservas de Spring Boot
  private apiUrl = 'http://localhost:8080/reservas';

  constructor(private http: HttpClient) {}

  // Método auxiliar para el token 
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // 1. Obtener TODAS las reservas (Solo ADMIN)
  getAllReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // 2. Marcar una reserva como Check-In (Solo ADMIN)
  checkInReserva(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/checkin`, {}, { headers: this.getHeaders() });
  }

  // 3. Eliminar / Cancelar una reserva (Solo ADMIN)
  eliminarReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Obtener solo las reservas de un usuario específico
  getReservasUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`, { headers: this.getHeaders() });
  }

  // Hacer el check out de las habitaciones
  hacerCheckOut(reservaId: number) {
    // 1. Rescatamos el token de donde lo tengas guardado (suele ser localStorage o sessionStorage)
    const token = localStorage.getItem('token'); // Cambia 'token' por el nombre exacto que uses al hacer login
    
    // 2. Preparamos la cabecera de seguridad
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Enviamos la petición POST adjuntando la cabecera
    return this.http.post(`${this.apiUrl}/${reservaId}/checkout`, {}, { headers: headers });
  }
}
