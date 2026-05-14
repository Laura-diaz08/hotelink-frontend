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
import { OpinionService } from '../../services/opinion';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css' 
})
export class UserDashboardComponent implements OnInit {

  misReservas: any[] = []; 
  habitacionesDisponibles: Habitacion[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  mensajeReserva: string = '';
  habitaciones: Habitacion[] = [];
  catalogoServicios: Servicio[] = [];
  opiniones: any[] = [];

  mostrarModalServicio: boolean = false;
  servicioSeleccionado: Servicio | null = null;
  fechaCita: string = '';
  horaCita: string = '';
  misReservasServicios: any[] = [];

  slideActual: number = 0;
  totalSlides: number = 3;

  mediaValoracion: string = '4.9★';

  imagenesHabitaciones: { [key: string]: string } = {
    'Sencilla': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    'Doble': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
    'Suite': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'
  };

  imagenesServicios: { [key: string]: string } = {
    'Gimnasio': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    'Masaje Relajante': 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80',
    'Circuito Spa': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    'Cena Romántica': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    'Traslado Aeropuerto': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    'Alquiler de Bicicletas': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
  };

  constructor(
    private router: Router,
    private habitacionService: HabitacionService,
    private reservaService: ReservaService, 
    private servicioService: ServicioService,
    private citaService: CitaService,
    private opinionService: OpinionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const idString = localStorage.getItem('id');
    if (!idString) {
      this.cerrarSesion();
      return;
    }

    this.opinionService.getEstadisticas().subscribe({
      next: (data) => {
        setTimeout(() => {
          if (data.media) {
            this.mediaValoracion = data.media.toFixed(1) + '★';
          }
          this.cdr.detectChanges();
        }, 0);
      }
    });

    this.cargarServicios();
    this.cargarHabitaciones();
    this.cargarOpiniones();
  }

  getImagenHabitacion(tipo: string): string {
    return this.imagenesHabitaciones[tipo] || 
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80';
  }

  getImagenServicio(nombre: string): string {
    return this.imagenesServicios[nombre] || 
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80';
  }

  getEstrellas(n: number): string[] {
    return Array(5).fill('').map((_, i) => i < n ? 'fas fa-star' : 'far fa-star');
  }

  cargarOpiniones(): void {
    this.opinionService.getOpiniones().subscribe({
      next: (data) => {
        this.opiniones = data.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando opiniones', e)
    });
  }

  cargarServicios() {
    this.servicioService.getServicios().subscribe({
      next: (data) => {
        this.catalogoServicios = data.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar servicios', err)
    });
  }

  abrirModalReserva(servicio: Servicio) {
    this.servicioSeleccionado = servicio;
    this.mostrarModalServicio = true;
    this.fechaCita = '';
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
      alert("⚠️ Solo se permiten reservas a horas en punto o y media.");
      return;
    }

    const idCliente = Number(localStorage.getItem('id'));
    const idServicio = this.servicioSeleccionado?.id;
    const fechaHoraCita = `${this.fechaCita}T${this.horaCita}:00`;

    const nuevaCita = {
      usuario: { id: idCliente },  
      servicio: { id: idServicio }, 
      fechaHoraCita
    };

    this.citaService.crearCita(nuevaCita).subscribe({
      next: () => {
        alert(`¡Reserva confirmada! Te esperamos el ${this.fechaCita} a las ${this.horaCita}.`);
        this.cerrarModal();
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error) {
          alert("❌ " + err.error.error);
        } else {
          alert("Hubo un problema al hacer la reserva.");
        }
      }
    });
  }

  cargarHabitaciones() {
    this.habitacionService.getHabitaciones().subscribe({
      next: (data: any[]) => {
        const tipos = ['Sencilla', 'Doble', 'Suite'];
        this.habitaciones = tipos
          .map(tipo => data.find(h => h.tipo === tipo))
          .filter(h => h !== undefined);
      },
      error: (err) => console.error('Error cargando habitaciones', err)
    });
  }

  nextSlide(): void {
    this.slideActual = (this.slideActual + 1) % this.totalSlides;
  }

  prevSlide(): void {
    this.slideActual = (this.slideActual - 1 + this.totalSlides) % this.totalSlides;
  }

  irASlide(index: number): void {
    this.slideActual = index;
  }

  cerrarSesion() {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }
}