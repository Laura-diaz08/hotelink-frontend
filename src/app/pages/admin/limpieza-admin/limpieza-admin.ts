import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TareaLimpiezaService } from '../../../services/tarea-limpieza';
import { HabitacionService } from '../../../services/habitacion';


@Component({
  selector: 'app-admin-limpieza',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './limpieza-admin.html',
  styleUrl: './limpieza-admin.css'
})
export class LimpiezaAdmin implements OnInit {

  tareas: any[] = [];
  tareasFiltradas: any[] = [];
  empleados: any[] = [];
  habitaciones: any[] = [];

  filtroEstado: string = '';
  filtroEmpleado: string = '';
  filtroPlanta: string = '';

  estados: string[] = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADA'];

  mostrarModalCrear: boolean = false;
  nuevaTarea = { habitacionId: '', fecha: '' };

  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private tareaService: TareaLimpiezaService,
    private habitacionService: HabitacionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
    this.cargarEmpleados();
    this.cargarHabitaciones();
  }

  cargarTareas(): void {
    this.tareaService.getTareasLimpieza().subscribe({
      next: (data) => {
        this.tareas = data;
        this.tareasFiltradas = data; 
        this.cdr.detectChanges();
      },
      error: () => this.mensajeError = 'Error al cargar las tareas'
    });
  }

  cargarEmpleados(): void {
    this.tareaService.getEmpleadosLimpieza().subscribe({
      next: (data) =>  {
        this.empleados = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error al cargar empleados', e)
    });
  }

  cargarHabitaciones(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data
        this.cdr.detectChanges();
       },
      error: (e) => console.error('Error al cargar habitaciones', e)
    });
  }

  filtrar(): void {
    this.tareasFiltradas = this.tareas.filter(t => {
      const coincideEstado = this.filtroEstado ? t.estado === this.filtroEstado : true;
      const coincideEmpleado = this.filtroEmpleado
        ? t.empleado?.nombre?.toLowerCase().includes(this.filtroEmpleado.toLowerCase())
        : true;
      const planta = t.habitacion?.numero?.charAt(0) || '';
      const coincidePlanta = this.filtroPlanta ? planta === this.filtroPlanta : true;
      return coincideEstado && coincideEmpleado && coincidePlanta;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroEmpleado = '';
    this.filtroPlanta = '';
    this.filtrar();
  }

  getTareasPorEstado(estado: string): any[] {
    return this.tareasFiltradas.filter(t => t.estado === estado);
  }

  cambiarEstado(tarea: any, nuevoEstado: string): void {
    this.tareaService.cambiarEstado(tarea.id, nuevoEstado).subscribe({
      next: () => {
        tarea.estado = nuevoEstado;
        this.filtrar();
        this.mostrarExito('Estado actualizado correctamente');
      },
      error: () => this.mensajeError = 'Error al cambiar el estado'
    });
  }

  asignarEmpleado(tarea: any, empleadoId: string): void {
    if (!empleadoId) return;
    this.tareaService.asignarEmpleado(tarea.id, Number(empleadoId)).subscribe({
      next: () => {
        const empleado = this.empleados.find(e => e.id === Number(empleadoId));
        tarea.empleado = empleado;
        tarea.empleadoSeleccionado = '';
        this.filtrar();
        this.mostrarExito('Empleado asignado correctamente');
      },
      error: () => this.mensajeError = 'Error al asignar empleado'
    });
  }

  abrirModalCrear(): void {
    this.nuevaTarea = { habitacionId: '', fecha: '' };
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.mensajeError = '';
  }

  crearTarea(): void {
    if (!this.nuevaTarea.habitacionId || !this.nuevaTarea.fecha) {
      this.mensajeError = 'Debes seleccionar habitación y fecha';
      return;
    }
    this.tareaService.crearTarea(Number(this.nuevaTarea.habitacionId), this.nuevaTarea.fecha).subscribe({
      next: () => {
        this.cerrarModalCrear();
        this.cargarTareas();
        this.mostrarExito('Tarea creada correctamente');
      },
      error: () => this.mensajeError = 'Error al crear la tarea'
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return;
    this.tareaService.eliminarTarea(id).subscribe({
      next: () => {
        this.cargarTareas();
        this.mostrarExito('Tarea eliminada correctamente');
      },
      error: () => this.mensajeError = 'Error al eliminar la tarea'
    });
  }

  mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mensajeError = '';
    setTimeout(() => this.mensajeExito = '', 4000);
  }

  getPlantasDisponibles(): string[] {
    const plantas = new Set(this.tareas.map(t => t.habitacion?.numero?.charAt(0)).filter(Boolean));
    return Array.from(plantas).sort();
  }

  getClaseEstado(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE': return 'pendiente';
      case 'EN_PROCESO': return 'en_proceso';
      case 'COMPLETADA': return 'completada';
      default: return '';
    }
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}