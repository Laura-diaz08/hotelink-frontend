import { Component, OnInit } from '@angular/core';
import { ReservaServicioService } from '../../services/reserva-servicio'; // Ajusta la ruta si es necesario
import { ReservaServicio } from '../../interfaces/reserva-servicio.interface'; // Tu nueva interfaz
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel-servicios',
  templateUrl: './servicios.html',
  imports: [CommonModule],
  styleUrls: ['./servicios.css']
})
export class ServiciosComponent implements OnInit {

  citas: ReservaServicio[] = [];

  constructor(private reservaServicioService: ReservaServicioService) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas() {
    this.reservaServicioService.getReservas().subscribe({
      next: (data) => {
        this.citas = data;
        console.log('Citas cargadas desde Java:', data);
      },
      error: (err) => console.error('Error al cargar las citas:', err)
    });
  }
}