import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaServicio } from '../interfaces/reserva-servicio.interface';

@Injectable({
  providedIn: 'root'
})
export class ReservaServicioService {

  // La URL de tu controlador en Spring Boot
  private apiUrl = 'http://localhost:8080/api/reservas-servicios';

  constructor(private http: HttpClient) { }

  // Método para pedirle a Java todas las citas
  getReservas(): Observable<ReservaServicio[]> {
    return this.http.get<ReservaServicio[]>(this.apiUrl);
  }
}
