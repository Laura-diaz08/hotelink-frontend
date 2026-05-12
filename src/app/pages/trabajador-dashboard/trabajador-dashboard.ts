import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TareaLimpiezaService } from '../../services/tarea-limpieza';
import { CitaService } from '../../services/cita';

@Component({
  selector: 'app-trabajador-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trabajador-dashboard.html',
  styleUrls: ['./trabajador-dashboard.css']
})
export class TrabajadorDashboardComponent implements OnInit {

  rol: string = '';
  nombre: string = '';
  usuarioId: number = 0;

  // LIMPIEZA
  tareasAsignadas: any[] = [];
  cargandoTareas: boolean = true;

  // SERVICIOS
  citasHoy: any[] = [];
  citasProximas: any[] = [];
  cargandoCitas: boolean = true;

  hoy: Date = new Date();

  citasDisponibles: any[] = [];
  misCitas: any[] = [];

  tabActiva: string = 'tareas';

  constructor(
    private router: Router,
    private tareaLimpiezaService: TareaLimpiezaService,
    private citaService: CitaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol') || '';
    this.nombre = localStorage.getItem('nombre') || '';
    this.usuarioId = Number(localStorage.getItem('id'));

    console.log('ROL:', this.rol);
    console.log('ID:', this.usuarioId);
    console.log('TOKEN:', localStorage.getItem('token'));

    if (this.rol === 'LIMPIEZA') {
      this.tabActiva = 'tareas';
      this.cargarTareasAsignadas();
    } else {
      this.tabActiva = 'disponibles';
      this.cargarCitas();
    }
  }

  cargarTareasAsignadas(): void {
    this.tareaLimpiezaService.getTareasLimpieza().subscribe({
      next: (data) => {
        this.tareasAsignadas = data.filter((t: any) => 
          t.empleado?.id === this.usuarioId
        );
        this.cargandoTareas = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error cargando tareas', e);
        this.cargandoTareas = false;
      }
    });
  }

  cargarCitas(): void {
    this.citaService.getCitasDisponibles().subscribe({
      next: (data) => {
        this.citasDisponibles = data.sort((a: any, b: any) =>
          new Date(a.fechaHoraCita).getTime() - new Date(b.fechaHoraCita).getTime()
        );
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando citas disponibles', e)
    });

    this.citaService.getCitasEmpleado(this.usuarioId).subscribe({
      next: (data) => {
        this.misCitas = data
          .filter((c: any) => c.estado !== 'COMPLETADA' && c.estado !== 'CANCELADA')
          .sort((a: any, b: any) =>
            new Date(a.fechaHoraCita).getTime() - new Date(b.fechaHoraCita).getTime()
          );
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando mis citas', e)
    });
  }

  completarTarea(tarea: any): void {
    this.tareaLimpiezaService.cambiarEstado(tarea.id, 'COMPLETADA').subscribe({
      next: () => {
        tarea.estado = 'COMPLETADA';
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error completando tarea', e)
    });
  }

  getTareasPendientes(): any[] {
    return this.tareasAsignadas.filter(t => t.estado === 'PENDIENTE');
  }

  getTareasCompletadas(): any[] {
    return this.tareasAsignadas.filter(t => t.estado === 'COMPLETADA');
  }

  iniciarTarea(tarea: any): void {
    this.tareaLimpiezaService.cambiarEstado(tarea.id, 'EN_PROCESO').subscribe({
      next: () => {
        tarea.estado = 'EN_PROCESO';
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error iniciando tarea', e)
    });
  }

  getTareasEnProceso(): any[] {
    return this.tareasAsignadas.filter(t => t.estado === 'EN_PROCESO');
  }

  asignarme(cita: any): void {
    this.citaService.asignarEmpleado(cita.id, this.usuarioId).subscribe({
      next: () => {
        this.citasDisponibles = this.citasDisponibles.filter(c => c.id !== cita.id);
        this.misCitas = [...this.misCitas, { ...cita, empleado: { id: this.usuarioId } }]
          .sort((a: any, b: any) =>
            new Date(a.fechaHoraCita).getTime() - new Date(b.fechaHoraCita).getTime()
          );
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error asignando cita', e)
    });
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}