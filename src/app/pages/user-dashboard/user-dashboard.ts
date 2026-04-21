import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { HabitacionService } from '../../services/habitacion'; 
import { Habitacion } from '../../interfaces/habitacion.interface'; 
import { ReservaService } from '../../services/reserva'; 
import { ServicioService } from '../../services/servicio';
import { Servicio } from '../../interfaces/servicio.interface';
import { CitaService } from '../../services/cita';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css' 
})
export class UserDashboardComponent implements OnInit {

  // --- VARIABLES DE HABITACIONES ---
  misReservas: any[] = []; 
  habitacionesDisponibles: Habitacion[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  mensajeReserva: string = '';

  // Variable para guardar el catálogo de Spa, Gimnasio, etc.
  catalogoServicios: Servicio[] = [];

  // Variables para el Modal de Servicios
  mostrarModalServicio: boolean = false;
  servicioSeleccionado: Servicio | null = null;
  fechaCita: string = '';
  horaCita: string = '';

  misReservasServicios: any[] = [];

  constructor(
    private router: Router,
    private habitacionService: HabitacionService,
    private reservaService: ReservaService, 
    private servicioService: ServicioService,
    private citaService: CitaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const idString = localStorage.getItem('id');
    
    if (!idString) {
      this.cerrarSesion();
      return;
    }

    const clienteId = Number(idString);
    // Cargamos las reservas de habitaciones
    // this.cargarMisReservas(clienteId);
    // Cargamos el catálogo de servicios 
    this.cargarServicios();
  }

  // cargarMisReservas(clienteId: number) {
  //   const idCliente = Number(localStorage.getItem('id'));

  //   // 1. Cargar reservas de habitaciones
  //   this.reservaService.obtenerReservasPorCliente(idCliente).subscribe({
  //     next: (data) => this.misReservas = data,
  //     error: (e) => console.error("Error cargando habitaciones", e)
  //   });

  //   // 2. Cargar citas de servicios (Spas, Gym, etc.)
  //   // Nota: Asegúrate de añadir el método 'obtenerPorCliente' en tu CitaService de Java/Angular
  //   this.citaService.obtenerPorCliente(idCliente).subscribe({
  //     next: (data) => this.misReservasServicios = data,
  //     error: (e) => console.error("Error cargando servicios", e)
  //   });
  // }

  buscarHabitaciones() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.mensajeReserva = "Por favor, selecciona ambas fechas.";
      return;
    }

    this.mensajeReserva = "Buscando...";
    this.habitacionService.buscarDisponibles(this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.habitacionesDisponibles = data;
        this.mensajeReserva = data.length > 0 ? "¡Habitaciones encontradas!" : "No hay habitaciones libres en esas fechas.";
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.mensajeReserva = "Error al buscar habitaciones.";
      }
    });
  }

  hacerReserva(habitacionId: number | undefined) {
    if (!habitacionId) {
      console.error("Error: La habitación no tiene ID");
      return; 
    }

    const clienteId = Number(localStorage.getItem('id'));
    
    const datosReserva = {
      clienteId: clienteId,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    };

    this.habitacionService.reservarHabitacion(habitacionId, datosReserva).subscribe({
      next: (respuesta) => {
        alert("¡Reserva completada con éxito!");
        this.habitacionesDisponibles = []; 
        this.fechaInicio = '';
        this.fechaFin = '';
        // this.cargarMisReservas(clienteId); 
      },
      error: (err) => {
        console.error(err);
        alert("Hubo un problema al hacer la reserva.");
      }
    });
  }

  
  cargarServicios() {
    this.servicioService.getServicios().subscribe({
      next: (data) => {
        this.catalogoServicios = data;
        this.cdr.detectChanges(); // Forzamos actualización visual por si acaso
      },
      error: (err) => console.error('Error al cargar el catálogo de servicios', err)
    });
  }

  // --- LÓGICA DEL MODAL DE SERVICIOS ---

  abrirModalReserva(servicio: Servicio) {
    this.servicioSeleccionado = servicio;
    this.mostrarModalServicio = true;
    this.fechaCita = ''; // Limpiamos campos
    this.horaCita = '';
  }

  cerrarModal() {
    this.mostrarModalServicio = false;
    this.servicioSeleccionado = null;
  }

  confirmarReservaServicio() {
    if (!this.fechaCita || !this.horaCita) {
      alert("Por favor, selecciona una fecha y una hora.");
      return;
    }

    const minutos = this.horaCita.split(':')[1];
    if (minutos !== '00' && minutos !== '30') {
      alert("⚠️ Solo se permiten reservas a horas en punto (ej: 10:00) o y media (ej: 10:30).");
      return;
    }

    const idCliente = Number(localStorage.getItem('id'));
    const idServicio = this.servicioSeleccionado?.id;
    
    // Unimos la fecha y la hora 
    const fechaHoraCita = `${this.fechaCita}T${this.horaCita}:00`;

    const nuevaCita = {
      cliente: { id: idCliente },  
      servicio: { id: idServicio }, 
      fechaHoraCita: fechaHoraCita
    };

    // Llamamos al backend para guardarlo
    this.citaService.crearCita(nuevaCita).subscribe({
      next: (respuesta) => {
        alert(`¡Reserva confirmada! Te esperamos el ${this.fechaCita} a las ${this.horaCita}.`);
        this.cerrarModal();
      },
      error: (err) => {
        console.error("Error devuelto por el servidor:", err);
        // Si Java nos mandó nuestro mensaje de error personalizado (Aforo completo)
        if (err.status === 400 && err.error && err.error.error) {
          alert("❌ " + err.error.error);
        } else {
          alert("Hubo un problema al hacer la reserva. Inténtalo de nuevo.");
        }
      }
    });
  }

  cerrarSesion() {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }
}