import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../interfaces/habitacion.interface'; 

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  // Tu ruta de Spring Boot
  private apiUrl = 'http://localhost:8080/habitaciones';

  constructor(private http: HttpClient) {}

  // Método auxiliar para meter el token en las peticiones
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // 1. Obtener todas las habitaciones
  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // 2. Crear una nueva habitación
  crearHabitacion(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.apiUrl, habitacion, { headers: this.getHeaders() });
  }

  // 3. Asignar (o liberar) un cliente a una habitación
  asignarCliente(idHabitacion: number, idCliente: number | null): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${idHabitacion}/asignar`, 
      { clienteId: idCliente }, 
      { headers: this.getHeaders() }
    );
  }

  // Obtener las habitaciones asignadas a un cliente concreto
  getHabitacionesCliente(clienteId: number): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.apiUrl}/cliente/${clienteId}`, { headers: this.getHeaders() });
  }

 //  Buscar habitaciones libres por fechas
  buscarDisponibles(inicio: string, fin: string): Observable<Habitacion[]> {
    const token = localStorage.getItem('token'); 
    
    // Preparamos el token para enseñársela a Java
    const headers = new HttpHeaders().set('Authorization', token ? 'Bearer ' + token : '');

    // Fíjate que al final le pasamos { headers }
    return this.http.get<Habitacion[]>(`${this.apiUrl}/disponibles?inicio=${inicio}&fin=${fin}`, { headers });
  }

  // Hacer la reserva enviando los datos y el token
  reservarHabitacion(habitacionId: number, reservaData: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    // Preparamos el token otra vez
    const headers = new HttpHeaders().set('Authorization', token ? 'Bearer ' + token : '');

    // Al POST le pasamos: URL, datos que enviamos, y las cabeceras
    return this.http.post<any>(`${this.apiUrl}/${habitacionId}/reservar`, reservaData, { headers });
  }
}
  
