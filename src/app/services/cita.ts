import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:8080/citas'; 

  constructor(private http: HttpClient) { }

  crearCita(citaData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    return this.http.post(this.apiUrl, citaData, { headers: headers });
  }

  obtenerPorCliente(idCliente: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` }); 
    
    return this.http.get(`${this.apiUrl}/cliente/${idCliente}`, { headers: headers });
  }
}