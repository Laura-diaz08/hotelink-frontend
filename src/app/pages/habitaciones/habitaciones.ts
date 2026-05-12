import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HabitacionService } from '../../services/habitacion'; 
import { Habitacion } from '../../interfaces/habitacion.interface'; 

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './habitaciones.html',
  styleUrls: ['./habitaciones.css']
})
export class HabitacionesComponent implements OnInit {
  
  habitaciones: Habitacion[] = [];
  habitacionesFiltradas: Habitacion[] = [];
  habitacionesDisponibles: Habitacion[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';

  // Variables de los filtros adaptadas a tu BD
  filtroTipo: string = '';
  filtroPrecioMax: number | null = null;
  // Puedes añadir un filtro de estado si quieres, o buscar solo las "LIBRES"

  filtroCapacidad: number | null = null; // Recuperamos esta variable

  cargando: boolean = true;

  mostrarModal: boolean = false;
  habitacionSeleccionadaId: number | undefined;
  reservaFechaInicio: string = '';
  reservaFechaFin: string = '';
  reservaHuespedes: number = 1;

  errorReserva: string = '';
  exitoReserva: string = '';

  imagenesHabitaciones: { [key: string]: string } = {
    'Sencilla': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    'Doble': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    'Suite': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'
  };

  constructor(
    private habitacionService: HabitacionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cargarHabitaciones() {
    this.cargando = true;
    console.log("1. Llamando a Spring Boot..."); // Chivato 1

    this.habitacionService.getHabitaciones().subscribe({
      next: (data: Habitacion[]) => {
        console.log("2. ¡Spring Boot respondió! Datos recibidos:", data); // Chivato 2
        
        this.habitaciones = data;
        this.habitacionesFiltradas = data;
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('3. ERROR GRAVE al conectar con Spring Boot:', err); // Chivato 3
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros() {
    this.habitacionesFiltradas = this.habitaciones.filter(h => {
      let cumpleTipo = this.filtroTipo ? h.tipo?.toLowerCase() === this.filtroTipo.toLowerCase() : true;
      let cumplePrecio = this.filtroPrecioMax ? h.precio <= this.filtroPrecioMax : true;
      // Ahora podemos filtrar por capacidad real de la BD
      let cumpleCapacidad = this.filtroCapacidad ? h.capacidad >= this.filtroCapacidad : true;
      
      return cumpleTipo && cumplePrecio && cumpleCapacidad;
    });
    this.cdr.detectChanges();
  }

  limpiarFiltros() {
    this.filtroTipo = '';
    this.filtroPrecioMax = null;
    this.filtroCapacidad = null; 
    this.habitacionesFiltradas = [...this.habitaciones];

    this.cdr.detectChanges();
  }

  abrirModalReserva(id: number | undefined) {
    this.habitacionSeleccionadaId = id;
    this.mostrarModal = true;
    this.reservaFechaInicio = '';
    this.reservaFechaFin = '';
    this.reservaHuespedes = 1;
    this.errorReserva = '';
    this.exitoReserva = '';
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.habitacionSeleccionadaId = undefined;
  }

  confirmarReserva() {
    this.errorReserva = '';
    this.exitoReserva = '';

    if (!this.reservaFechaInicio || !this.reservaFechaFin) {
      this.errorReserva = 'Por favor, selecciona las fechas de entrada y salida.';
      return;
    }

    if (!this.reservaHuespedes || this.reservaHuespedes < 1) {
      this.errorReserva = 'Por favor, indica al menos 1 huésped.';
      return;
    }

    if (!this.habitacionSeleccionadaId) {
      this.errorReserva = 'No hay ninguna habitación seleccionada.';
      return;
    }

    const clienteId = Number(localStorage.getItem('id'));

    const datosReserva = {
      clienteId: clienteId,
      fechaInicio: this.reservaFechaInicio,
      fechaFin: this.reservaFechaFin,
      numeroHuespedes: this.reservaHuespedes
    };

    this.habitacionService.reservarHabitacion(this.habitacionSeleccionadaId, datosReserva).subscribe({
      next: () => {
        this.exitoReserva = '¡Reserva completada con éxito!';
        this.habitacionService.notificarCambioReserva();
        this.cdr.detectChanges();
        setTimeout(() => this.cerrarModal(), 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorReserva = err.error?.error || 'La habitación ya está ocupada en esas fechas.';
        this.cdr.detectChanges();
      }
    });
  }

  hacerReserva(habitacionId: number | undefined) {
    if (!habitacionId) {
      console.error("Error: La habitación no tiene ID");
      return; 
    }

    if (!this.fechaInicio || !this.fechaFin) {
      alert("⚠️ Por favor, selecciona las fechas de entrada y salida antes de reservar.");
      console.error("Error: Las fechas están vacías", { inicio: this.fechaInicio, fin: this.fechaFin });
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
        
        // 2. Notificamos también aquí por si es esta la vía que se utiliza
        this.habitacionService.notificarCambioReserva();

        this.habitacionesDisponibles = []; 
        this.fechaInicio = '';
        this.fechaFin = '';
      },
      error: (err) => {
        console.error(err);
        alert("Hubo un problema al hacer la reserva.");
      }
    });
  }

  verDetalles(id: number | undefined) {
    if (!id) return;
    alert(`Mostrando detalles de la habitación ID: ${id}`);
  }

  getEstadoClase(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'LIBRE': return 'estado-libre';
      case 'OCUPADA': return 'estado-ocupada';
      case 'LIMPIEZA': return 'estado-limpieza';
      default: return 'estado-otro';
    }
  }

  getImagenHabitacion(tipo: string): string {
    return this.imagenesHabitaciones[tipo] || 
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80';
  }

  cerrarSesion() {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }
}