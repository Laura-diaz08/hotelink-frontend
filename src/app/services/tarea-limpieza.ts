import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaLimpiezaService {

  private apiUrl = 'http://localhost:8080/api/tareas-limpieza';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getTareasLimpieza(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, { estado }, { headers: this.getHeaders() });
  }

  asignarEmpleado(id: number, empleadoId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/asignar`, { empleadoId }, { headers: this.getHeaders() });
  }

  crearTarea(habitacionId: number, fecha: string): Observable<any> {
    return this.http.post(this.apiUrl, { habitacionId, fecha }, { headers: this.getHeaders() });
  }

  eliminarTarea(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getEmpleadosLimpieza(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados`, { headers: this.getHeaders() });
  }
}