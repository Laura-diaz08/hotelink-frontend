import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- Añadimos ChangeDetectorRef
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HabitacionService } from '../../services/habitacion'; 
import { Habitacion } from '../../interfaces/habitacion.interface'; 

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css' 
})
export class UserDashboardComponent implements OnInit {

  misHabitaciones: Habitacion[] = [];

  // --- NUEVAS VARIABLES PARA RESERVAS ---
  habitacionesDisponibles: Habitacion[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  mensajeReserva: string = '';

  constructor(
    private router: Router,
    private habitacionService: HabitacionService,
    private cdr: ChangeDetectorRef // <-- 1. Inyectamos la herramienta para forzar el repintado
  ) {}

  ngOnInit() {
    const idString = localStorage.getItem('id');
    
    if (!idString) {
      this.cerrarSesion();
      return;
    }

    const clienteId = Number(idString);
    this.cargarMisHabitaciones(clienteId);
  }

  cargarMisHabitaciones(clienteId: number) {
    this.habitacionService.getHabitacionesCliente(clienteId).subscribe({
      next: (data) => {
        this.misHabitaciones = data; 
        
        // 2. ¡EL TOQUE MÁGICO! Le decimos a Angular que pinte la pantalla YA.
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al pedir las habitaciones:', err);
      }
    });
  }

  // --- NUEVA FUNCIÓN: BUSCAR DISPONIBLES ---
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

  // --- NUEVA FUNCIÓN: RESERVAR ---
  // 1. Le decimos que el ID puede ser number o undefined
  hacerReserva(habitacionId: number | undefined) {
    
    // 2. Si por algún motivo no llega el ID, cortamos la ejecución aquí
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

    // 3. Como ya pasamos el 'if' de arriba, aquí TypeScript ya sabe que habitacionId es 100% un número
    this.habitacionService.reservarHabitacion(habitacionId, datosReserva).subscribe({
      next: (respuesta) => {
        alert("¡Reserva completada con éxito!");
        this.habitacionesDisponibles = []; // Limpiamos la búsqueda
        this.fechaInicio = '';
        this.fechaFin = '';
        this.cargarMisHabitaciones(clienteId); 
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