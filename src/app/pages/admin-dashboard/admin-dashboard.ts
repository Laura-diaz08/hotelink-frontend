import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../interfaces/usuario.interface';
import { HabitacionService } from '../../services/habitacion';
import { Habitacion } from '../../interfaces/habitacion.interface';
import { ReservaService } from '../../services/reserva';

export interface TareaLimpieza {
  id: number;
  habitacionId: number;
  numeroHabitacion: string;
  fecha: string;
  estado: 'PENDIENTE' | 'COMPLETADA';
}

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
  // Aquí guardaremos todas las reservas que vengan de Java
  reservas: any[] = [];

  tareasLimpieza: TareaLimpieza[] = [];

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
    private cdr: ChangeDetectorRef,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarHabitaciones();
    this.cargarReservas();
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

  // Pide la lista al backend
  cargarReservas(): void {
    this.reservaService.getAllReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        console.log("¡DATOS RECIBIDOS DE JAVA! ->", data);
        this.reservas = data;
        this.cdr.detectChanges();
        console.log('Reservas cargadas:', this.reservas);
      },
      error: (err) => {
        console.error('Error al cargar las reservas', err);
        alert('Hubo un error al cargar las reservas. ¿Eres ADMIN?');
      }
    });
  }

  // Botón de Check-In
  hacerCheckIn(id: number): void {
    this.reservaService.checkInReserva(id).subscribe({
      next: () => {
        alert('¡Check-In realizado con éxito!');
        this.cargarReservas(); // Recargamos la tabla para que se actualice el estado
      },
      error: (err) => console.error('Error en el Check-In', err)
    });
  }

  // Hacer Check-Out
  realizarCheckOut(reservaId: number) {
    if (confirm('¿Estás seguro de realizar el Check-Out? Esto generará la factura y liberará la habitación.')) {
      
      // 1. Buscamos los datos de la reserva actual ANTES de que el backend la cambie
      const reserva = this.reservas.find(r => r.id === reservaId);

      this.reservaService.hacerCheckOut(reservaId).subscribe({
        next: (factura: any) => {
          alert(`¡Check-Out completado con éxito! \nSe ha generado una factura por un total de ${factura.total}€.`);
          
          // 2. ¡CREAMOS LA TAREA DE LIMPIEZA!
          if (reserva && reserva.habitacion) {
            const nuevaTarea: TareaLimpieza = {
              id: Date.now(),
              habitacionId: reserva.habitacion.id,
              numeroHabitacion: reserva.habitacion.numero,
              fecha: new Date().toLocaleDateString(),
              estado: 'PENDIENTE'
            };
            this.tareasLimpieza.push(nuevaTarea);
          }

          // 3. Recargamos los datos
          this.cargarReservas(); 
          this.cargarHabitaciones(); 
        },
        error: (err) => {
          console.error('Error al hacer Check-Out:', err);
        
          const mensajeError = typeof err.error === 'string' ? err.error : 'Hubo un problema al intentar realizar el Check-Out.';
          
          alert(mensajeError);
        }
      });
    }
  }

  // Botón de Borrar
  eliminar(id: number): void {
    if (confirm('¿Estás totalmente seguro de que quieres borrar esta reserva?')) {
      this.reservaService.eliminarReserva(id).subscribe({
        next: () => {
          alert('Reserva eliminada');
          this.cargarReservas(); // Recargamos la tabla
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  hacerScroll(idSeccion: string) {
    const elemento = document.getElementById(idSeccion);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token'); // Borramos el token
    localStorage.removeItem('rol');   // Borramos el rol
    this.router.navigate(['/login']); // Volvemos al login
  }

  // FUNCIONES DE LIMPIEZA
  completarLimpieza(tarea: TareaLimpieza) {
    tarea.estado = 'COMPLETADA';
    
    // Mostramos un mensaje bonito en verde en la pantalla
    this.mensajeExito = `¡Habitación ${tarea.numeroHabitacion} reluciente y lista para nuevos clientes! ✨`;
    setTimeout(() => this.mensajeExito = '', 3000);
  }

  // Angular usa esto para saber cuántas tareas dibujar en el HTML
  get tareasPendientes() {
    return this.tareasLimpieza.filter(t => t.estado === 'PENDIENTE');
  }

  // 1. Filtro para las reservas de hoy (Las que necesitan atención)
  get reservasActuales() {
    // Aquí filtramos las que NO están completadas ni canceladas
    return this.reservas.filter(r => r.estado !== 'COMPLETADA' && r.estado !== 'CANCELADA');
  }

  // 2. Filtro para el historial (Todas las reservas, o solo las pasadas)
  get historialReservas() {
    // Si quieres que el historial muestre absolutamente TODAS:
    return this.reservas; 
    
    // Si prefieres que el historial SOLO muestre las que ya se han ido:
    // return this.reservas.filter(r => r.estado === 'COMPLETADA');
  }
}
