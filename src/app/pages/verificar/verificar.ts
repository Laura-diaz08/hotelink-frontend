import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verificar.html',
  styleUrl: './verificar.css'
})
export class VerificarComponent {
  nombre = '';
  codigo = '';
  mensaje = '';
  error = '';
  enviando = false;

  constructor(private http: HttpClient, private router: Router) {}

  verificar(): void {
    if (!this.nombre || !this.codigo) {
      this.error = 'Por favor rellena todos los campos.';
      return;
    }
    this.enviando = true;
    this.error = '';
    this.mensaje = '';

    this.http.post<any>('http://localhost:8080/auth/verificar', {
      nombre: this.nombre,
      codigo: this.codigo
    }).subscribe({
      next: () => {
        this.mensaje = '¡Cuenta verificada correctamente! Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (e) => {
        this.error = e.error?.error || 'Código incorrecto.';
        this.enviando = false;
      }
    });
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}