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

  imagenes: { [key: string]: string } = {
    'Gimnasio': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    'Masaje Relajante': 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80',
    'Circuito Spa': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    'Cena Romántica': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    'Traslado Aeropuerto': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    'Alquiler de Bicicletas': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
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
      alert('Solo se permiten reservas a horas en punto o y media.');
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
      }
    });
  }

  confirmarReserva(): void {
    if (!this.fechaCita || !this.horaCita) {
      alert('Por favor selecciona fecha y hora.');
      return;
    }

    const minutos = this.horaCita.split(':')[1];
    if (minutos !== '00' && minutos !== '30') {
      alert('Solo se permiten reservas a horas en punto o y media.');
      return;
    }

    if (this.aforoInfo && this.aforoInfo.aforoDisponible === 0) {
      alert('No hay aforo disponible para esa fecha y hora.');
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
        alert(`¡Reserva confirmada! Te esperamos el ${this.fechaCita} a las ${this.horaCita}.`);
        this.cerrarModal();
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error) {
          alert('❌ ' + err.error.error);
        } else {
          alert('Hubo un problema al hacer la reserva.');
        }
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