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
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80'
    ],
    Doble: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'
    ],
    Suite: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80'
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
  hoyStr: string = new Date().toISOString().split('T')[0];

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