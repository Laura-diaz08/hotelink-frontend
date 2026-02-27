import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../interfaces/usuario.interface';
import { HabitacionService } from '../../services/habitacion';
import { Habitacion } from '../../interfaces/habitacion.interface';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  usuarios: Usuario[] = [];
  mensajeError: string = '';
  mensajeExito: string = '';
  habitaciones: Habitacion[] = [];
  mostrarFormularioHabitacion = false;
  nuevaHabitacion: Habitacion = { numero: '', tipo: 'Sencilla', precio: 0, estado: 'LIBRE' };

  // Variables para el formulario
  mostrarFormulario: boolean = false;
  nuevoUsuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'USER' // Por defecto crearemos usuarios normales
  };

  constructor(
    private usuarioService: UsuarioService, 
    private habitacionService: HabitacionService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarHabitaciones();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        
        this.cdr.detectChanges(); 
      },
      error: (error: any) => {
        console.error('Error al cargar usuarios en la primera carga:', error);
        this.mensajeError = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  // Funciones del formulario
  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  guardarUsuario() {
    this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
      next: (respuesta) => {
        this.mensajeExito = '¡Usuario creado correctamente!';
        this.mostrarFormulario = false;
        this.cargarUsuarios(); // Recargamos la tabla para que salga el nuevo
        
        // Limpiamos el formulario
        this.nuevoUsuario = { nombre: '', email: '', password: '', rol: 'USER' };
      },
      error: (error) => {
        console.error('Error al crear', error);
        this.mensajeError = 'Hubo un error al crear el usuario. Revisa la consola.';
      }
    });
  }

  cargarHabitaciones() {
    this.habitacionService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error al cargar habitaciones', err)
    });
  }

  guardarHabitacion() {
    this.habitacionService.crearHabitacion(this.nuevaHabitacion).subscribe({
      next: () => {
        this.mensajeExito = 'Habitación creada con éxito';
        this.mostrarFormularioHabitacion = false;
        this.nuevaHabitacion = { numero: '', tipo: 'Sencilla', precio: 0, estado: 'LIBRE' };
        this.cargarHabitaciones(); // Recargamos la tabla
      },
      error: () => this.mensajeError = 'Error al crear la habitación'
    });
  }

  asignar(idHabitacion: number, event: any) {
    // Obtenemos el ID del cliente seleccionado en el desplegable del HTML
    const idCliente = event.target.value === 'null' ? null : Number(event.target.value);
    
    this.habitacionService.asignarCliente(idHabitacion, idCliente).subscribe({
      next: () => {
        this.mensajeExito = idCliente ? 'Cliente asignado' : 'Habitación liberada';
        this.cargarHabitaciones(); // Recargamos la tabla para ver el cambio de estado
      },
      error: () => this.mensajeError = 'Error al asignar la habitación'
    });
  }

  cerrarSesion() {
    localStorage.removeItem('token'); // Borramos el token
    localStorage.removeItem('rol');   // Borramos el rol
    this.router.navigate(['/login']); // Volvemos al login
  }
}
