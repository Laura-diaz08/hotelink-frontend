import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HabitacionService } from '../../services/habitacion'; 
import { Habitacion } from '../../interfaces/habitacion.interface'; 
import { ReservaService } from '../../services/reserva'; 

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css' 
})
export class UserDashboardComponent implements OnInit {

  misReservas: any[] = []; 

  habitacionesDisponibles: Habitacion[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  mensajeReserva: string = '';

  constructor(
    private router: Router,
    private habitacionService: HabitacionService,
    private reservaService: ReservaService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const idString = localStorage.getItem('id');
    
    if (!idString) {
      this.cerrarSesion();
      return;
    }

    const clienteId = Number(idString);
    // Cargamos las reservas nada más entrar al panel
    this.cargarMisReservas(clienteId);
  }

  cargarMisReservas(clienteId: number) {
    this.reservaService.getReservasUsuario(clienteId).subscribe({
      next: (data) => {
        this.misReservas = data; 
        console.log("¡Mis reservas cargadas de Java! ->", data);

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al pedir mis reservas:', err);
      }
    });
  }

  // Buscar habitaciones disponibles
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
        this.habitacionesDisponibles = []; // Limpiamos la búsqueda
        this.fechaInicio = '';
        this.fechaFin = '';

        this.cargarMisReservas(clienteId); 
      },
      error: (err) => {
        console.error(err);
        alert("Hubo un problema al hacer la reserva.");
      }
    });
  }

  cerrarSesion() {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }
}