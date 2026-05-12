import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HabitacionService } from '../../../services/habitacion';
import { Habitacion } from '../../../interfaces/habitacion.interface';
import { ReservaService } from '../../../services/reserva';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  
  resumen: any = {
    porcentajeOcupacion: 0,
    ingresosHoy: 0,
    ocupadas: 0,
    total: 0,
    limpieza: 0
  };
  
  tareasLimpieza: Habitacion[] = [];
  
  mesActual: string = '';
  diasDelMes: number[] = [];
  habitacionesMes: any[] = [];

  ultimosMovimientos: any[] = [];

  constructor(
    private habitacionService: HabitacionService,
    private reservaService: ReservaService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
    this.cargarMovimientos();
  }

  cargarDashboard(): void {
    this.cargarDatosLimpieza();
    this.cargarResumenGeneral();
  }

  cargarDatosLimpieza(): void {
    this.habitacionService.obtenerHabitacionesActualizadas().subscribe({
      next: (habs: Habitacion[]) => {
        this.filtrarTareas(habs);
        
        this.habitacionService.getReservas().subscribe({
          next: (reservasReales: any[]) => {
            console.log("Reservas obtenidas de la BD:", reservasReales);

            // Pasamos las habitaciones y las reservas reales al generador
            this.generarCalendarioMes(habs, reservasReales);
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al cargar las reservas de la base de datos', err);
            
            // Si las reservas fallan, inicializamos el calendario sin reservas para que las habitaciones no desaparezcan
            this.generarCalendarioMes(habs, []);
            this.cdr.detectChanges();
          }
        });

      },
      error: (err) => {
        console.error('Error al cargar las habitaciones', err);
      }
    });
  }

  filtrarTareas(habitaciones: any[]): void {
    this.tareasLimpieza = habitaciones.filter(h => 
      h.estado && h.estado.toUpperCase() === 'LIMPIEZA'
    );
    
    console.log("Tareas de limpieza actuales:", this.tareasLimpieza);
  }

  // Función para parsear fechas de forma segura para cualquier formato
  parseDate(fechaStr: any): Date {
    if (!fechaStr) {
      return new Date(0);
    }

    // Si ya es un objeto Date
    if (fechaStr instanceof Date) {
      const d = new Date(fechaStr);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    // Si es un timestamp
    if (typeof fechaStr === 'number') {
      const d = new Date(fechaStr);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    // Si es una cadena de texto (formato YYYY-MM-DD o con horas)
    if (typeof fechaStr === 'string') {
      // Tomamos solo la parte de la fecha antes de la letra T (de la hora)
      const datePart = fechaStr.split('T')[0];
      const partes = datePart.split('-');
      
      if (partes.length === 3) {
        const year = Number(partes[0]);
        const month = Number(partes[1]) - 1; // 0 a 11
        const day = Number(partes[2]);
        return new Date(year, month, day);
      }
    }
    
    // Fallback genérico
    const fallbackDate = new Date(fechaStr);
    fallbackDate.setHours(0, 0, 0, 0);
    return fallbackDate;
  }

  generarCalendarioMes(habs: Habitacion[], reservas: any[]): void {
    const hoy = new Date(); // Mayo 2026
    const year = hoy.getFullYear();
    const month = hoy.getMonth(); 
    
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.mesActual = meses[month];

    const totalDias = new Date(year, month + 1, 0).getDate();
    this.diasDelMes = Array.from({ length: totalDias }, (_, i) => i + 1);

    this.habitacionesMes = habs.map(h => {
      // Nos aseguramos de comparar los números de habitación como cadenas de texto, sin importar el tipo
      const habNum = String(h.numero).trim();

      const dias = this.diasDelMes.map(dia => {
        const fechaActual = new Date(year, month, dia);
        fechaActual.setHours(0, 0, 0, 0); // Limpiamos horas para que la comparación sea estricta

        const reservaDia = reservas.find(r => {
        const resHabNum = String(r.numeroHabitacion || '').trim();
        const habNum = String(h.numero).trim();
        if (resHabNum !== habNum) return false;

        // Comparamos como strings YYYY-MM-DD directamente
        const fechaActualStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const inicioStr = r.fechaEntrada.split('T')[0];
        const finStr = r.fechaSalida.split('T')[0];

        return fechaActualStr >= inicioStr && fechaActualStr <= finStr;
        });

        return {
          numeroDia: dia,
          ocupado: !!reservaDia 
        };
      });

      return {
        numero: h.numero, 
        dias: dias
      };
    });
  }

  cargarResumenGeneral(): void {
    this.habitacionService.obtenerResumen().subscribe({
      next: (data: any) => {
        if (data) {
          this.resumen = data;
          this.cdr.detectChanges(); 
        }
      },
      error: (err) => {
        console.error('Error al cargar el resumen del dashboard', err);
      }
    });
  }

  marcarComoLimpia(habitacion: any): void {
    habitacion.estado = 'DISPONIBLE'; // O el estado que uses para limpio
    
    this.habitacionService.actualizarHabitacion(habitacion).subscribe(() => {
      console.log(`Habitación ${habitacion.numero} actualizada`);
      this.cargarDatosLimpieza(); // Recargamos la lista
    });
  }

  cargarMovimientos(): void {
    this.reservaService.getAllReservas().subscribe({
      next: (data: any[]) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const conCheckin = data
          .filter(r => r.checkIn)
          .map(r => ({
            ...r,
            tipo: 'L',
            fecha: r.fechaEntrada,
            diff: Math.abs(new Date(r.fechaEntrada).getTime() - hoy.getTime())
          }));

        const conCheckout = data
          .filter(r => r.checkOut)
          .map(r => ({
            ...r,
            tipo: 'S',
            fecha: r.fechaSalida,
            diff: Math.abs(new Date(r.fechaSalida).getTime() - hoy.getTime())
          }));

        this.ultimosMovimientos = [...conCheckin, ...conCheckout]
          .sort((a, b) => a.diff - b.diff)
          .slice(0, 4);

        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando movimientos', e)
    });
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/login']); 
  }
}