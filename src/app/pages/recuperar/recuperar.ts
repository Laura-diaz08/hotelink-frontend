import { Component, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css'
})
export class RecuperarComponent {
  paso: number = 1;
  email: string = '';
  codigo: string = '';
  nuevaPassword: string = '';
  repetirPassword: string = '';
  error: string = '';
  mensaje: string = '';
  enviando: boolean = false;

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  solicitarCodigo(): void {
    if (!this.email) { this.error = 'Introduce tu email.'; return; }
    this.enviando = true;
    this.error = '';
    console.log('Enviando petición...');
    this.http.post<any>('http://localhost:8080/auth/recuperar', { email: this.email })
      .subscribe({
        next: (res) => {
          console.log('Respuesta:', res);
          this.enviando = false;
          this.mensaje = 'Código enviado. Revisa tu correo.';
          this.paso = 2;
          console.log('Paso:', this.paso);
          this.cdr.detectChanges();
        },
        error: (e) => {
          console.error('Error:', e);
          this.error = e.error?.error || 'Error enviando el código.';
          this.enviando = false;
        }
      });
  }

  confirmar(): void {
    if (!this.codigo || !this.nuevaPassword) { this.error = 'Rellena todos los campos.'; return; }
    if (this.nuevaPassword !== this.repetirPassword) { this.error = 'Las contraseñas no coinciden.'; return; }
    this.enviando = true;
    this.error = '';
    this.http.post<any>('http://localhost:8080/auth/recuperar/confirmar', {
      email: this.email,
      codigo: this.codigo,
      nuevaPassword: this.nuevaPassword
    }).subscribe({
      next: () => {
        this.mensaje = '¡Contraseña actualizada! Redirigiendo...';
        this.enviando = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (e) => {
        this.error = e.error?.error || 'Código incorrecto.';
        this.enviando = false;
      }
    });
  }

}