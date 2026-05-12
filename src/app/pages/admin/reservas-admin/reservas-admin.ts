import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario';
import { Usuario } from '../../../interfaces/usuario.interface';
import { HabitacionService } from '../../../services/habitacion';
import { Habitacion } from '../../../interfaces/habitacion.interface';
import { ReservaService } from '../../../services/reserva';
import { TareaLimpiezaService } from '../../../services/tarea-limpieza';
import { Reserva } from '../../../interfaces/reserva.interface';
import { ArticuloService } from '../../../services/articulo';
import { CitaService } from '../../../services/cita';

export interface TareaLimpieza {
  id: number;
  habitacionId: number;
  numeroHabitacion: string;
  fecha: string;
  estado: 'PENDIENTE' | 'COMPLETADA';
}

@Component({
  selector: 'app-reservas-admin-v2',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservas-admin.html',
  styleUrl: './reservas-admin.css',
})
export class ReservasAdminComponent implements OnInit{
  rolesDisponibles: string[] = [
      'ADMIN',
      'CLIENTE',
      'RECEPCION',
      'LIMPIEZA',
      'SERVICIOS'
    ];
  
    usuarios: Usuario[] = [];
    mensajeError: string = '';
    mensajeExito: string = '';
    habitaciones: Habitacion[] = [];
    mostrarFormularioHabitacion = false;
    nuevaHabitacion: Habitacion = { numero: '', tipo: 'Sencilla', precio: 0, estado: 'LIBRE', capacidad: 1, descripcion: '' };
    // Aquí guardaremos todas las reservas que vengan de Java
    reservas: any[] = [];
  
    tareasLimpieza: any[] = [];

    filtroReserva: string = '';
    filtroFechaInicio: string = '';
    filtroFechaFin: string = '';
    filtroCliente: string = '';
    reservasFiltradas: Reserva[] = [];

    mostrarModalCargos: boolean = false;
    reservaSeleccionada: any = null;
    articulos: any[] = [];
    cargosReserva: any[] = [];
    cargoArticuloId: string = '';
    cargoCantidad: number = 1;
    totalCargos: number = 0;

    citasReserva: any[] = [];
    totalServicios: number = 0;
    totalArticulos: number = 0;
  
    // Variables para el formulario
    mostrarFormulario: boolean = false;
    nuevoUsuario = {
      nombre: '',
      email: '',
      password: '',
      rol: 'CLIENTE' // Por defecto crearemos usuarios normales
    };

    mostrarModalReserva: boolean = false;
    nuevaReserva = {
      usuarioId: '',
      habitacionId: '',
      fechaEntrada: '',
      fechaSalida: '',
      numeroHuespedes: 1
    };
    clientes: any[] = [];
  
    constructor(
      private usuarioService: UsuarioService, 
      private habitacionService: HabitacionService,
      private router: Router,
      private cdr: ChangeDetectorRef,
      private reservaService: ReservaService,
      private tareaLimpiezaService: TareaLimpiezaService,
      private articuloService: ArticuloService,
      private citaService: CitaService
    ) {}
  
    ngOnInit(): void {
      this.cargarUsuarios();
      this.cargarHabitaciones();
      this.cargarReservas();
      this.cargarTareasLimpieza();
      this.cargarArticulos();
      this.cargarClientes();
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
          this.cargarUsuarios(); 
          
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
          this.nuevaHabitacion = { numero: '', tipo: 'Sencilla', precio: 0, estado: 'LIBRE', capacidad: 1, descripcion: '' };
          this.cargarHabitaciones(); 
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
          this.cargarHabitaciones(); 
        },
        error: () => this.mensajeError = 'Error al asignar la habitación'
      });
    }
  
    cargarReservas(): void {
      this.reservaService.getAllReservas().subscribe({
        next: (data) => {
          this.reservas = data;
          this.reservasFiltradas = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar las reservas', err);
          alert('Hubo un error al cargar las reservas. ¿Eres ADMIN?');
        }
      });
    }
  
    cargarTareasLimpieza() {
      this.tareaLimpiezaService.getTareasLimpieza().subscribe({
        next: (datos) => {
          this.tareasLimpieza = datos;
        },
        error: (err) => {
          console.error('Error al cargar las tareas de limpieza:', err);
        }
      });
    }
  
    hacerCheckIn(id: number): void {
      this.reservaService.hacerCheckIn(id).subscribe({
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
        
        this.reservaService.hacerCheckOut(reservaId).subscribe({
          next: (factura: any) => {
            alert(`¡Check-Out completado con éxito! \nSe ha generado una factura por un total de ${factura.total}€.`);
            
            this.cargarReservas(); 
            this.cargarHabitaciones(); 
            this.cargarTareasLimpieza(); 
          },
          error: (err) => {
            console.error('Error al hacer Check-Out:', err);
            const mensajeError = typeof err.error === 'string' ? err.error : 'Hubo un problema al intentar realizar el Check-Out.';
            alert(mensajeError);
          }
        });
      }
    }
  
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
  
  
    completarLimpieza(tarea: TareaLimpieza) {
      tarea.estado = 'COMPLETADA';
      
      // Mostramos un mensaje de exito en verde en la pantalla
      this.mensajeExito = `¡Habitación ${tarea.numeroHabitacion} reluciente y lista para nuevos clientes!`;
      setTimeout(() => this.mensajeExito = '', 3000);
    }
  
    // Angular usa esto para saber cuántas tareas dibujar en el HTML
    get tareasPendientes() {
      return this.tareasLimpieza.filter(t => t.estado === 'PENDIENTE');
    }
  
    //Filtro para las reservas de hoy 
    get reservasActuales() {
      // Aquí filtramos las que NO están completadas ni canceladas
      return this.reservas.filter(r => r.estado !== 'COMPLETADA' && r.estado !== 'CANCELADA');
    }
  
    // Filtro para el historial (Todas las reservas)
    get historialReservas() {
      return this.reservas; 
    }

    buscarReservas(): void {
    this.reservasFiltradas = this.reservas.filter(r => {

      // Filtro por número de habitación
      if (this.filtroReserva) {
        const numHab = String(r.numeroHabitacion || '').toLowerCase();
        if (!numHab.includes(this.filtroReserva.toLowerCase())) return false;
      }

      // Filtro por nombre de cliente
      if (this.filtroCliente) {
        const nombre = String(r.nombreUsuario || '').toLowerCase();
        if (!nombre.includes(this.filtroCliente.toLowerCase())) return false;
      }

      // Filtro por rango de fechas (solapamiento)
      if (this.filtroFechaInicio && this.filtroFechaFin) {
        const entrada = r.fechaEntrada.split('T')[0];
        const salida = r.fechaSalida.split('T')[0];
        if (entrada > this.filtroFechaFin || salida < this.filtroFechaInicio) return false;
      } else if (this.filtroFechaInicio) {
        const salida = r.fechaSalida.split('T')[0];
        if (salida < this.filtroFechaInicio) return false;
      } else if (this.filtroFechaFin) {
        const entrada = r.fechaEntrada.split('T')[0];
        if (entrada > this.filtroFechaFin) return false;
      }

      return true;
    });
  }

  cargarArticulos(): void {
    this.articuloService.getArticulos().subscribe({
      next: (data) => this.articulos = data,
      error: (e) => console.error('Error cargando artículos', e)
    });
  }

  abrirModalCargos(reserva: any): void {
    this.reservaSeleccionada = reserva;
    this.mostrarModalCargos = true;
    this.cargoArticuloId = '';
    this.cargoCantidad = 1;
    this.citasReserva = [];
    this.cargarCargosReserva(reserva.id);
    this.cargarCitasReserva(reserva);
  }

  cerrarModalCargos(): void {
    this.mostrarModalCargos = false;
    this.reservaSeleccionada = null;
    this.cargosReserva = [];
    this.citasReserva = [];
    this.totalCargos = 0;
    this.totalServicios = 0;
    this.totalArticulos = 0;
  }

  cargarCargosReserva(reservaId: number): void {
    this.articuloService.getCargosDeReserva(reservaId).subscribe({
      next: (data) => {
        this.cargosReserva = data;
        this.calcularTotalCargos();
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando cargos', e)
    });
  }

  calcularTotalCargos(): void {
    this.totalArticulos = this.cargosReserva.reduce((sum, c) => {
      return sum + (c.cantidad * c.precioUnitario);
    }, 0);

    this.totalServicios = this.citasReserva.reduce((sum, c) => {
      return sum + (c.servicio?.precio || 0);
    }, 0);

    this.totalCargos = this.totalArticulos + this.totalServicios;
  }

  agregarCargo(): void {
    if (!this.cargoArticuloId) {
      this.mensajeError = 'Selecciona un artículo';
      return;
    }
    this.articuloService.añadirCargo(
      this.reservaSeleccionada.id,
      Number(this.cargoArticuloId),
      this.cargoCantidad
    ).subscribe({
      next: () => {
        this.mensajeExito = 'Cargo añadido correctamente';
        this.cargoArticuloId = '';
        this.cargoCantidad = 1;
        this.cargarCargosReserva(this.reservaSeleccionada.id);
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: (err) => this.mensajeError = err.error?.error || 'Error al añadir cargo'
    });
  }

  eliminarCargo(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar este cargo?')) return;
    this.articuloService.eliminarCargo(id).subscribe({
      next: () => {
        this.cargarCargosReserva(this.reservaSeleccionada.id);
        this.mensajeExito = 'Cargo eliminado';
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: () => this.mensajeError = 'Error al eliminar cargo'
    });
  }

  calcularNoches(reserva: any): number {
    if (!reserva) return 0;
    const entrada = new Date(reserva.fechaEntrada);
    const salida = new Date(reserva.fechaSalida);
    return Math.ceil((salida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24));
  }

  cargarCitasReserva(reserva: any): void {
    const inicio = reserva.fechaEntrada.split('T')[0];
    const fin = reserva.fechaSalida.split('T')[0];
    
    this.citaService.getCitasEntresFechas(reserva.usuarioId, inicio, fin).subscribe({
      next: (data) => {
        this.citasReserva = data.filter((c: any) => c.estado !== 'CANCELADA');
        this.calcularTotalCargos();
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando citas', e)
    });
  }

  cargarClientes(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.clientes = data.filter((u: any) => u.rol === 'CLIENTE');
      },
      error: (e) => console.error('Error cargando clientes', e)
    });
  }

  abrirModalReserva(): void {
    this.nuevaReserva = {
      usuarioId: '',
      habitacionId: '',
      fechaEntrada: '',
      fechaSalida: '',
      numeroHuespedes: 1
    };
    this.mostrarModalReserva = true;
  }

  cerrarModalReserva(): void {
    this.mostrarModalReserva = false;
  }

  crearReserva(): void {
    if (!this.nuevaReserva.usuarioId || !this.nuevaReserva.habitacionId ||
        !this.nuevaReserva.fechaEntrada || !this.nuevaReserva.fechaSalida) {
      this.mensajeError = 'Rellena todos los campos';
      setTimeout(() => this.mensajeError = '', 3000);
      return;
    }

    const reserva = {
      usuario: { id: Number(this.nuevaReserva.usuarioId) },
      habitacion: { id: Number(this.nuevaReserva.habitacionId) },
      fechaEntrada: this.nuevaReserva.fechaEntrada,
      fechaSalida: this.nuevaReserva.fechaSalida,
      numeroHuespedes: this.nuevaReserva.numeroHuespedes
    };

    this.reservaService.crearReserva(reserva).subscribe({
      next: () => {
        this.mensajeExito = 'Reserva creada correctamente';
        this.cerrarModalReserva();
        this.cargarReservas();
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: (err) => {
        this.mensajeError = err.error?.error || 'Error al crear la reserva';
        setTimeout(() => this.mensajeError = '', 3000);
      }
    });
  }
}
