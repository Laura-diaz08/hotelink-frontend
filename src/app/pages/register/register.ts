import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  // Aquí pedimos Nombre, Email y Password
  registroData: Partial<Usuario> = {
    nombre: '',
    email: '',
    password: '',
    rol: 'USER' // Por defecto, el que se registra es un cliente normal
  };

  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    // Aquí llamaremos al servicio para registrar al usuario
    this.authService.registro(this.registroData as Usuario).subscribe({
      next: (respuesta) => {
        this.mensajeExito = '¡Registro completado! Redirigiendo al login...';
        // Esperamos 2 segundos para que lea el mensaje y lo mandamos al login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        this.mensajeError = 'Error al crear la cuenta. Comprueba los datos.';
      }
    });
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}