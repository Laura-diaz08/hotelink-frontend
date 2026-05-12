import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Usuario, LoginResponse } from '../../interfaces/usuario.interface';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], 
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

        localStorage.setItem('nombre', respuesta.nombre);

        // Evaluamos el rol exacto que nos llega desde Java
        switch (respuesta.rol) {
          case 'ADMIN':
            this.router.navigate(['/admin']);
            break;
          case 'CLIENTE':
            this.router.navigate(['/home']);
            break;
          case 'LIMPIEZA':
          case 'GIMNASIO':
          case 'MASAJES':
          case 'CONDUCTOR':
          case 'COCINA':
            this.router.navigate(['/trabajador']);
            break;
          default:
            this.router.navigate(['/login']);
            break;
        }
      },
      error: (e) => {
        const msg = e.error?.error || 'Error al iniciar sesión';
        if (msg.includes('no verificada')) {
          this.router.navigate(['/verificar']);
        } else {
          this.mensajeError = msg;
        }
      }
    });
  }

  irAlRegistro() {
    this.router.navigate(['/register']);
  }
}
