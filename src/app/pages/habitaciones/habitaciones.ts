import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitacionService } from '../../services/habitacion';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitaciones.html',
  styleUrl: './habitaciones.css'
})
export class HabitacionesComponent implements OnInit {

  // Carrusel
  slideActivo: { [tipo: string]: number } = { Sencilla: 0, Doble: 0, Suite: 0 };

  imagenesHabitacion: { [tipo: string]: string[] } = {
    Sencilla: [
      'assets/habitacion_sencilla.png',
      'assets/baño_sencilla.png',
      'assets/terraza_sencilla.png'
    ],
    Doble: [
      'assets/habitacion_doble.png',
      'assets/baño_habitacion_doble.png',
      'assets/terraza_habitacion_doble.png'
    ],
    Suite: [
      'assets/habitacion_suite.png',
      'assets/baño_suite.png',
      'assets/terraza_suite.png'
    ]
  };

  precioDesde: { [tipo: string]: number } = { Sencilla: 0, Doble: 0, Suite: 0 };

  // Modal
  mostrarModal: boolean = false;
  tipoSeleccionado: string = '';
  reservaFechaInicio: string = '';
  reservaFechaFin: string = '';
  reservaHuespedes: number = 1;
  disponibilidadInfo: number | null = null;
  errorReserva: string = '';
  exitoReserva: string = '';
  
  get mananaStr(): string {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split('T')[0];
  }

  constructor(
    private habitacionService: HabitacionService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPreciosDesde();
  }

  infoTipos: { [tipo: string]: any } = {};

  cargarPreciosDesde(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: (data: any[]) => {

        ['Sencilla', 'Doble', 'Suite'].forEach(tipo => {
          const habitacionesTipo = data.filter(h => h.tipo === tipo);

          if (habitacionesTipo.length > 0) {
            const primera = habitacionesTipo[0];

            this.precioDesde[tipo] = Math.min(...habitacionesTipo.map(h => h.precio));
            this.infoTipos[tipo] = {
              descripcion: primera.descripcion,
              capacidad: primera.capacidad
            };

          }
        });
        this.cdr.detectChanges();
      }
    });
  }

  prevSlide(tipo: string): void {
    const total = this.imagenesHabitacion[tipo].length;
    this.slideActivo[tipo] = ((this.slideActivo[tipo] || 0) - 1 + total) % total;
  }

  nextSlide(tipo: string): void {
    const total = this.imagenesHabitacion[tipo].length;
    this.slideActivo[tipo] = ((this.slideActivo[tipo] || 0) + 1) % total;
  }

  abrirModalTipo(tipo: string): void {
    this.tipoSeleccionado = tipo;
    this.mostrarModal = true;
    this.disponibilidadInfo = null;
    this.errorReserva = '';
    this.exitoReserva = '';
    this.reservaFechaInicio = '';
    this.reservaFechaFin = '';
    this.reservaHuespedes = 1;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.disponibilidadInfo = null;
  }

  buscarDisponibilidad(): void {
    if (!this.reservaFechaInicio || !this.reservaFechaFin) {
      this.errorReserva = 'Selecciona las fechas de entrada y salida.';
      return;
    }

    this.errorReserva = '';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const fechaEntrada = new Date(this.reservaFechaInicio);
    fechaEntrada.setHours(0, 0, 0, 0);

    if (fechaEntrada < manana) {
      this.errorReserva = 'La fecha de entrada debe ser a partir de mañana.';
      this.cdr.detectChanges();
      return;
    }

    // Validar que la salida sea posterior a la entrada
    const fechaSalida = new Date(this.reservaFechaFin);
    if (fechaSalida <= fechaEntrada) {
      this.errorReserva = 'La fecha de salida debe ser posterior a la de entrada.';
      this.cdr.detectChanges();
      return;
    }

    console.log('Buscando disponibilidad:', this.tipoSeleccionado, this.reservaFechaInicio, this.reservaFechaFin);
    
    this.http.get<any>(
      `http://localhost:8080/habitaciones/disponibles?tipo=${this.tipoSeleccionado}&entrada=${this.reservaFechaInicio}&salida=${this.reservaFechaFin}`
    ).subscribe({
      next: (data) => {
        console.log('Respuesta:', data);
        this.disponibilidadInfo = data.disponibles;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorReserva = 'Error al consultar disponibilidad.';
        this.cdr.detectChanges();
      }
    });
  }

  confirmarReserva(): void {
    const clienteId = Number(localStorage.getItem('id'));
    if (!clienteId) {
      this.errorReserva = 'Debes iniciar sesión para reservar.';
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const body = {
      tipo: this.tipoSeleccionado,
      fechaEntrada: this.reservaFechaInicio,
      fechaSalida: this.reservaFechaFin,
      usuarioId: clienteId,
      numeroHuespedes: this.reservaHuespedes
    };

    this.http.post<any>('http://localhost:8080/reservas/por-tipo', body, { headers }).subscribe({
      next: () => {
        this.exitoReserva = '¡Reserva confirmada! Puedes verla en Mis Reservas.';
        this.disponibilidadInfo = null;
        this.cdr.detectChanges();
        setTimeout(() => this.cerrarModal(), 2500);
      },
      error: (err) => {
        this.errorReserva = err.error?.error || 'Error al realizar la reserva.';
        this.cdr.detectChanges();
      }
    });
  }

}