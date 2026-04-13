import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaLimpiezaService {

  // Esta es la ruta de tu Java
  private apiUrl = 'http://localhost:8080/api/tareas-limpieza'; 

  constructor(private http: HttpClient) { }

  getTareasLimpieza(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}