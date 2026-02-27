import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  // La ruta de tu controlador de usuarios en Spring Boot
  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) { }

  // Método para obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    
    // 1. Recuperamos el token que guardamos en el Login
    const token = localStorage.getItem('token');

    // 2. Creamos las cabeceras (Headers) y le metemos el token con la palabra "Bearer "
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Hacemos la petición GET enviando las cabeceras
    return this.http.get<Usuario[]>(this.apiUrl, { headers: headers });
  }

  crearUsuario(nuevoUsuario: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    // Usamos POST para enviar los datos del nuevo usuario a Spring Boot
    return this.http.post(this.apiUrl, nuevoUsuario, { headers: headers });
  }

}
