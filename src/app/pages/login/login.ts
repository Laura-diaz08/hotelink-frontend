import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necesario para los formularios
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Usuario, LoginResponse } from '../../interfaces/usuario.interface';
import { CommonModule } from '@angular/common'; // Para usar directivas básicas como *ngIf


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // Importamos FormsModule aquí
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  // Objeto donde guardaremos lo que el usuario escriba
  loginData: Partial<Usuario> = {
    nombre: '',
    password: ''
  };

  mensajeError: string = '';

  // Inyectamos el servicio de Auth y el Router (para navegar a otra página)
  constructor(private authService: Auth, private router: Router) {}

  onSubmit() {
    // Llamamos al servicio de login
    this.authService.login(this.loginData).subscribe({
      next: (respuesta: LoginResponse) => {
        console.log('Login exitoso:', respuesta);

        // 1. Guardamos el token en el almacenamiento del navegador
        localStorage.setItem('token', respuesta.token);
        
        // 2. Guardamos el rol para saber qué mostrar después
        localStorage.setItem('rol', respuesta.rol);

        // 3. Guardamos el ID del usuario para poder buscar sus habitaciones
        if (respuesta.id) {
            localStorage.setItem('id', respuesta.id.toString());
        } else {
            console.error("¡ALERTA! Java no me está devolviendo el ID en el login");
        }

        // 3. Redirección básica (esto lo mejoraremos en el siguiente paso)
        if (respuesta.rol === 'ADMIN') {
          this.router.navigate(['/admin']); // Nos lleva al Admin Dashboard
        } else {
          this.router.navigate(['/home']);  // Nos lleva al User Dashboard
        }
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.mensajeError = 'Usuario o contraseña incorrectos';
      }
    });
  }

  irAlRegistro() {
    this.router.navigate(['/register']);
  }
}
