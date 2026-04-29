import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../interfaces/servicio.interface'; // Ajusta la ruta a tu interfaz

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  // ¡Atención a la URL que coincide con tu @RequestMapping!
  private apiUrl = 'http://localhost:8080/servicios';

  constructor(private http: HttpClient) { }

  // Obtener todo el catálogo enviando el token
  getServicios(): Observable<Servicio[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    return this.http.get<Servicio[]>(this.apiUrl, { headers: headers });
  }

}
