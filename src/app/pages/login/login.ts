import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { Usuario, LoginResponse } from '../../interfaces/usuario.interface';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], 
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

        // Evaluamos el rol exacto que nos llega desde Java
        switch (respuesta.rol) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;

          case 'CLIENTE':
            this.router.navigate(['/home']); // La pantalla del huésped
            break;

          case 'SERVICIOS':
            this.router.navigate(['/servicios-dashboard']); // ¡La que acabamos de crear!
            break;

          case 'LIMPIEZA':
            // Cambia '/panel-limpieza' por la ruta que le pusieras a la tabla de limpieza
            this.router.navigate(['/limpieza-dashboard']); 
            break;

          case 'RECEPCION':
            // Cambia esto por la ruta del panel de recepción cuando la crees
            this.router.navigate(['/recepcion']); 
            break;

          default:
            // Por si acaso llega un rol raro o vacío, lo mandamos al login de vuelta
            console.error('Rol no reconocido:', respuesta.rol);
            this.router.navigate(['/login']);
            break;
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
