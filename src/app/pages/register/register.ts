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
    rol: 'CLIENTE' // Por defecto, el que se registra es un cliente normal
  };

  mensajeError: string = '';
  mensajeExito: string = '';

  confirmarPassword: string = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.registroData.email || '')) {
      this.mensajeError = 'Introduce un correo electrónico válido.';
      return;
    }
    
    if (this.passwordNoCoincide() || this.confirmarPassword === '') {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }
    // Aquí llamaremos al servicio para registrar al usuario
    this.authService.registro(this.registroData as Usuario).subscribe({
      next: (respuesta) => {
        this.mensajeExito = '¡Registro completado! Revisa tu correo para verificar la cuenta.';
        setTimeout(() => {
          this.router.navigate(['/verificar']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        this.mensajeError = 'Error al crear la cuenta. Comprueba los datos.';
      }
    });
  }

  passwordNoCoincide(): boolean {
    return this.confirmarPassword !== '' && 
          this.registroData.password !== this.confirmarPassword;
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}