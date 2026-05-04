import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HabitacionService } from '../../../services/habitacion';
import { Habitacion } from '../../../interfaces/habitacion.interface';

@Component({
  selector: 'app-admin-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './habitaciones-admin.html',
  styleUrls: ['./habitaciones-admin.css']
})
export class HabitacionesAdmin implements OnInit {

  habitaciones: Habitacion[] = [];
  habitacionesFiltradas: Habitacion[] = [];
  plantas: string[] = [];

  filtroEstado: string = '';
  filtroPlanta: string = '';

  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  habitacionSeleccionada: Habitacion = this.nuevaHabitacionVacia();

  estados: string[] = ['LIBRE', 'OCUPADA', 'LIMPIEZA', 'MANTENIMIENTO'];
  tipos: string[] = ['Sencilla', 'Doble', 'Suite'];

  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private habitacionService: HabitacionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  nuevaHabitacionVacia(): Habitacion {
    return { numero: '', tipo: 'Sencilla', precio: 0, estado: 'LIBRE', capacidad: 1, descripcion: '' };
  }

  cargarHabitaciones(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.habitacionesFiltradas = data;
        this.extraerPlantas();
        this.cdr.detectChanges();
      },
      error: () => this.mensajeError = 'Error al cargar las habitaciones'
    });
  }

  extraerPlantas(): void {
    const plantasSet = new Set(
      this.habitaciones.map(h => h.numero.charAt(0))
    );
    this.plantas = Array.from(plantasSet).sort();
  }

  getHabitacionesPorPlanta(planta: string): Habitacion[] {
    return this.habitacionesFiltradas.filter(h => h.numero.charAt(0) === planta);
  }

  filtrar(): void {
    this.habitacionesFiltradas = this.habitaciones.filter(h => {
      const coincideEstado = this.filtroEstado ? h.estado === this.filtroEstado : true;
      const coincidePlanta = this.filtroPlanta ? h.numero.charAt(0) === this.filtroPlanta : true;
      return coincideEstado && coincidePlanta;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroPlanta = '';
    this.habitacionesFiltradas = this.habitaciones;
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.habitacionSeleccionada = this.nuevaHabitacionVacia();
    this.mostrarModal = true;
  }

  abrirModalEditar(habitacion: Habitacion): void {
    this.modoEdicion = true;
    this.habitacionSeleccionada = { ...habitacion };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.mensajeError = '';
  }

  guardar(): void {
    if (this.modoEdicion && this.habitacionSeleccionada.id) {
      this.habitacionService.editarHabitacion(this.habitacionSeleccionada.id, this.habitacionSeleccionada).subscribe({
        next: () => {
          this.mensajeExito = 'Habitación actualizada correctamente';
          this.cerrarModal();
          this.cargarHabitaciones();
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: () => this.mensajeError = 'Error al actualizar la habitación'
      });
    } else {
      this.habitacionService.crearHabitacion(this.habitacionSeleccionada).subscribe({
        next: () => {
          this.mensajeExito = 'Habitación creada correctamente';
          this.cerrarModal();
          this.cargarHabitaciones();
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: () => this.mensajeError = 'Error al crear la habitación'
      });
    }
  }

  eliminar(habitacion: Habitacion): void {
    if (!confirm(`¿Seguro que quieres eliminar la habitación ${habitacion.numero}?`)) return;

    this.habitacionService.eliminarHabitacion(habitacion.id!).subscribe({
      next: () => {
        this.mensajeExito = `Habitación ${habitacion.numero} eliminada`;
        this.cargarHabitaciones();
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: () => this.mensajeError = 'Error al eliminar la habitación'
    });
  }

  cambiarEstado(habitacion: Habitacion, nuevoEstado: string): void {
    this.habitacionService.cambiarEstado(habitacion.id!, nuevoEstado).subscribe({
      next: () => {
        habitacion.estado = nuevoEstado;
        this.mensajeExito = `Estado de habitación ${habitacion.numero} actualizado`;
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: () => this.mensajeError = 'Error al cambiar el estado'
    });
  }

  getClaseEstado(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'LIBRE': return 'estado-libre';
      case 'OCUPADA': return 'estado-ocupada';
      case 'LIMPIEZA': return 'estado-limpieza';
      case 'MANTENIMIENTO': return 'estado-mantenimiento';
      default: return '';
    }
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}