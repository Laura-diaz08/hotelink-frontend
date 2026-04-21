import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva';
import { CitaService } from '../../services/cita';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.html',
  imports: [CommonModule, RouterModule], 
  styleUrls: ['./mis-reservas.css']
})
export class MisReservasComponent implements OnInit {

  misReservasHabitaciones: any[] = [];
  misReservasServicios: any[] = [];

  constructor(
    private reservaService: ReservaService,
    private citaService: CitaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMisReservas();
  }

  // cargarMisReservas() {
  //   const idCliente = Number(localStorage.getItem('id'));

  //   this.reservaService.obtenerReservasPorCliente(idCliente).subscribe({
  //     next: (data) => this.misReservasHabitaciones = data,
  //     error: (e) => console.error("Error cargando habitaciones", e)
  //   });

  //   this.citaService.obtenerPorCliente(idCliente).subscribe({
  //     next: (data) => this.misReservasServicios = data,
  //     error: (e) => console.error("Error cargando servicios", e)
  //   });
  // }

  cargarMisReservas() {
    const idCliente = Number(localStorage.getItem('id'));
    console.log("🕵️‍♂️ ID del Cliente que busca reservas:", idCliente);

    // Habitaciones
    this.reservaService.obtenerPorCliente(idCliente).subscribe({
      next: (data) => {
        this.misReservasHabitaciones = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error("❌ Error cargando habitaciones:", e)
    });

    // Servicios
    this.citaService.obtenerPorCliente(idCliente).subscribe({
      next: (data) => {
        this.misReservasServicios = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error("❌ Error cargando servicios:", e)
    });
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}