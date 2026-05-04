import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Habitacion } from '../interfaces/habitacion.interface'; 

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  // Tu ruta de Spring Boot
  private apiUrl = 'http://localhost:8080/habitaciones';

  private reservaCreadaSource = new Subject<void>();

  reservaCreada$ = this.reservaCreadaSource.asObservable();

  constructor(private http: HttpClient) {}

  // Método auxiliar para meter el token en las peticiones
  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  notificarCambioReserva() {
    this.reservaCreadaSource.next();
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
    return this.http.get<Habitacion[]>(`${this.apiUrl}/disponibles?inicio=${inicio}&fin=${fin}`, { headers: headers });
  }

  // Hacer la reserva enviando los datos y el token
  reservarHabitacion(habitacionId: number, reservaData: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    // Preparamos el token otra vez
    const headers = new HttpHeaders().set('Authorization', token ? 'Bearer ' + token : '');

    // Al POST le pasamos: URL, datos que enviamos, y las cabeceras
    return this.http.post<any>(`${this.apiUrl}/${habitacionId}/reservar`, reservaData, { headers });
  }

  obtenerResumen(): Observable<any> {
    const token = localStorage.getItem('token'); 
    console.log('Token recuperado en el servicio:', token);
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Cambia la ruta eliminando el prefijo duplicado
    return this.http.get<any>(`${this.apiUrl}/admin/resumen`, { headers });
  }

  obtenerHabitacionesActualizadas(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    // Llamamos al endpoint que acabamos de crear en el Controller
    return this.http.get<any[]>('http://localhost:8080/habitaciones/actualizadas', { headers });
  }

  getReservas(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    // Asegúrate de que esta URL coincida con tu endpoint en Spring Boot (por ejemplo, /reservas)
    return this.http.get<any[]>('http://localhost:8080/reservas', { headers }); 
  }

  actualizarHabitacion(habitacion: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    
    // Ajusta la URL si tu endpoint de actualización es diferente (por ejemplo, si usa /api/habitaciones)
    const url = `http://localhost:8080/habitaciones/${habitacion.id || habitacion.numero}`;
    
    return this.http.put(url, habitacion, { headers });
  }
}
  
