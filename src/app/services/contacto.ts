import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private apiUrl = 'http://localhost:8080/contacto';

  constructor(private http: HttpClient) {}

  enviarMensaje(nombre: string, email: string, mensaje: string): Observable<any> {
    return this.http.post(this.apiUrl, { nombre, email, mensaje });
  }
}
