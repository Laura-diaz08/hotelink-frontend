import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ServicioService } from '../../services/servicio';
import { CitaService } from '../../services/cita';
import { Servicio } from '../../interfaces/servicio.interface';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css']
})
export class ServiciosComponent implements OnInit {

  servicios: Servicio[] = [];
  cargando: boolean = true;

  mostrarModal: boolean = false;
  servicioSeleccionado: Servicio | null = null;
  fechaCita: string = '';
  horaCita: string = '';
  aforoInfo: any = null;
  cargandoAforo: boolean = false;

  errorReserva: string = '';
  exitoReserva: string = '';

  imagenes: { [key: string]: string } = {
    'Circuito Spa Termal': 'assets/circuito_spa.png',
    'Gimnasio & Fitness': 'assets/gimnasio_hotel.png',
    'Masaje Relajante Esencial': 'assets/masaje_relajante.png',
    'Traslado Aeropuerto': 'assets/traslado_aeropuerto.png',
    'Alquiler de Bicicletas de Alta Gama': 'assets/alquiler_bicicletas.png',
    'Cena Romantica Gourmet': 'assets/cena_romantica.png'
  };

  constructor(
    private servicioService: ServicioService,
    private citaService: CitaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.servicioService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error cargando servicios', e);
        this.cargando = false;
      }
    });
  }

  getImagen(nombre: string): string {
    return this.imagenes[nombre] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80';
  }

  abrirModal(servicio: Servicio): void {
    this.servicioSeleccionado = servicio;
    this.fechaCita = '';
    this.horaCita = '';
    this.aforoInfo = null;
    this.errorReserva = '';
    this.exitoReserva = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.servicioSeleccionado = null;
    this.aforoInfo = null;
  }

  consultarAforo(): void {
    if (!this.fechaCita || !this.horaCita || !this.servicioSeleccionado) return;

    const minutos = this.horaCita.split(':')[1];
    if (minutos !== '00' && minutos !== '30') {
      this.errorReserva = 'Solo se permiten reservas a horas en punto o y media.';
      this.cdr.detectChanges();
      return;
    }

    this.cargandoAforo = true;
    this.servicioService.getAforo(
      this.servicioSeleccionado.id!,
      this.fechaCita,
      this.horaCita + ':00'
    ).subscribe({
      next: (data) => {
        this.aforoInfo = data;
        this.cargandoAforo = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargandoAforo = false;
        this.cdr.detectChanges();
      }
    });
  }

  confirmarReserva(): void {
    this.errorReserva = '';
    this.exitoReserva = '';

    if (!this.fechaCita || !this.horaCita) {
      this.errorReserva = 'Por favor selecciona fecha y hora.';
      this.cdr.detectChanges();
      return;
    }

    const minutos = this.horaCita.split(':')[1];
    if (minutos !== '00' && minutos !== '30') {
      this.errorReserva = 'Solo se permiten reservas a horas en punto o y media.';
      this.cdr.detectChanges();
      return;
    }

    if (this.aforoInfo && this.aforoInfo.aforoDisponible === 0) {
      this.errorReserva = 'No hay aforo disponible para esa fecha y hora.';
      this.cdr.detectChanges();
      return;
    }

    const idCliente = Number(localStorage.getItem('id'));
    const fechaHoraCita = `${this.fechaCita}T${this.horaCita}:00`;

    const nuevaCita = {
      usuario: { id: idCliente },
      servicio: { id: this.servicioSeleccionado?.id },
      fechaHoraCita
    };

    this.citaService.crearCita(nuevaCita).subscribe({
      next: () => {
        this.exitoReserva = `¡Reserva confirmada! Te esperamos el ${this.fechaCita} a las ${this.horaCita}.`;
        this.cdr.detectChanges();
        setTimeout(() => this.cerrarModal(), 2500);
      },
      error: (err) => {
        this.errorReserva = err.status === 400 && err.error?.error
          ? err.error.error
          : 'Hubo un problema al hacer la reserva.';
        this.cdr.detectChanges();
      }
    });
  }

  getAforoClase(): string {
    if (!this.aforoInfo) return '';
    const disponible = this.aforoInfo.aforoDisponible;
    const maximo = this.aforoInfo.aforoMaximo;
    if (disponible === 0) return 'aforo-lleno';
    if (disponible <= maximo * 0.3) return 'aforo-bajo';
    return 'aforo-disponible';
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}