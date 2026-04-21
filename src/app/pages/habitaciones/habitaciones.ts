import { Component, OnInit } from '@angular/core';
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

  // Variables de los filtros adaptadas a tu BD
  filtroTipo: string = '';
  filtroPrecioMax: number | null = null;
  // Puedes añadir un filtro de estado si quieres, o buscar solo las "LIBRES"

  filtroCapacidad: number | null = null; // Recuperamos esta variable

  constructor(
    private habitacionService: HabitacionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cargarHabitaciones() {
    this.habitacionService.getHabitaciones().subscribe({
      next: (data: Habitacion[]) => {
        this.habitaciones = data;
        this.habitacionesFiltradas = data;
      },
      error: (err) => {
        console.error('Error al obtener las habitaciones', err);
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
  }

  limpiarFiltros() {
    this.filtroTipo = '';
    this.filtroPrecioMax = null;
    this.habitacionesFiltradas = [...this.habitaciones];
  }

  reservar(id: number | undefined) {
    if (!id) return;
    alert(`Redirigiendo a reserva de habitación ID: ${id}`);
  }

  verDetalles(id: number | undefined) {
    if (!id) return;
    alert(`Mostrando detalles de la habitación ID: ${id}`);
  }

  cerrarSesion() {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }
}