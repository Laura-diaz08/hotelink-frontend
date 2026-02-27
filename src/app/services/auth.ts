import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, LoginResponse } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // La URL de tu backend Spring Boot
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  // Método para hacer Login
  // Recibe un objeto parcial de Usuario (solo nombre y password)
  login(credenciales: Partial<Usuario>): Observable<LoginResponse> {
    // Hace una petición POST a http://localhost:8080/auth/login
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciales);
  }

  registro(datosRegistro: Usuario) {
    return this.http.post<any>('http://localhost:8080/auth/register', datosRegistro); 
  }
}
