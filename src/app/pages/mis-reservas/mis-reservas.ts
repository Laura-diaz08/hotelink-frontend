import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva';
import { CitaService } from '../../services/cita';
import { FacturaService } from '../../services/factura';
import { ArticuloService } from '../../services/articulo';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.html',
  imports: [CommonModule, RouterModule], 
  styleUrls: ['./mis-reservas.css']
})
export class MisReservasComponent implements OnInit {

  misReservasHabitaciones: any[] = [];
  misReservasServicios: any[] = [];

  mostrarModalGestion: boolean = false;
  reservaAGestionar: any = null;

  articulos: any[] = [];
  mostrarModalCargos: boolean = false;
  reservaParaCargos: any = null;
  cargosReserva: any[] = [];
  articuloSeleccionadoId: string = '';
  cantidadArticulo: number = 1;
  totalCargos: number = 0;
  mensajeCargo: string = '';
  mensajeErrorCargo: string = '';

  constructor(
    private reservaService: ReservaService,
    private citaService: CitaService,
    private router: Router,
    private facturaService: FacturaService,
    private articuloService: ArticuloService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMisReservas();
    this.cargarArticulos();
  }

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
        // 1. Capturamos el día y la hora de este mismo instante
        const ahora = new Date(); 
        console.log("📦 Datos crudos de Servicios recibidos de Java:", data);

        // 2. Modificamos los datos "al vuelo" antes de mostrarlos
        this.misReservasServicios = data.map((s: any) => {
          const fechaDeLaCita = new Date(s.fechaHoraCita);

          if (fechaDeLaCita < ahora && s.estado !== 'COMPLETADA') {
            s.estado = 'COMPLETADA'; // 1. Lo cambiamos en la pantalla
            
            // 2. Le avisamos a la base de datos de verdad
            this.citaService.actualizarEstado(s.id, 'COMPLETADA').subscribe({
              next: () => console.log(`✅ Cita ${s.id} guardada como COMPLETADA en la BD`),
              error: (err) => console.error(`❌ Error al actualizar la cita ${s.id} en la BD:`, err)
            });
          }
          
          return s;
        });

        this.cdr.detectChanges();
      },
      error: (e) => console.error("❌ Error cargando servicios:", e)
    });
  }

  abrirModalGestion(reserva: any) {
    this.reservaAGestionar = reserva;
    this.mostrarModalGestion = true;
  }


  cerrarModalGestion() {
    this.mostrarModalGestion = false;
    this.reservaAGestionar = null;
  }

  puedeCancelar(): boolean {
    if (!this.reservaAGestionar) return false;

    const hoy = new Date(); // El día de hoy
    const fechaEntrada = new Date(this.reservaAGestionar.fechaEntrada);

    // Calculamos la diferencia en milisegundos y la pasamos a días
    const diferenciaMilisegundos = fechaEntrada.getTime() - hoy.getTime();
    const diasDiferencia = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    // Si faltan 10 días o más, devolvemos true (sí puede cancelar)
    return diasDiferencia >= 10;
  }

  hacerCheckIn() {
    if (!this.reservaAGestionar) return;

    // Aquí llamaremos a tu servicio, pero por ahora lo simulamos:
    this.reservaService.hacerCheckIn(this.reservaAGestionar.id).subscribe({
      next: () => {
        alert("¡Check-in realizado con éxito! Bienvenidos.");
        this.reservaAGestionar.checkIn = true; // Actualizamos la pantalla
        this.cerrarModalGestion();
      },
      error: (err) => {
        console.error("Error en el check-in:", err);
        alert("Hubo un error al hacer el check-in.");
      }
    });
  }

  hacerCheckOut() {
    if (!this.reservaAGestionar) return;

    this.reservaService.hacerCheckOut(this.reservaAGestionar.id).subscribe({
      next: () => {
        alert("¡Check-out realizado! Esperamos que hayan tenido una buena estancia.");
        this.reservaAGestionar.checkOut = true;
        this.reservaAGestionar.estado = 'COMPLETADA'; // O el estado que prefieras
        this.cerrarModalGestion();
      },
      error: (err) => {
        console.error("Error en el check-out:", err);
        alert("Hubo un error al hacer el check-out.");
      }
    });
  }

  cancelarReserva() {
    if (!this.reservaAGestionar) return;

    // 1. Doble check de seguridad visual
    const confirmacion = confirm("¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.");
    if (!confirmacion) {
      return; // Si el usuario le da a "Cancelar" en la alerta, paramos aquí
    }

    // 2. Llamada al servicio
    this.reservaService.cancelarReserva(this.reservaAGestionar.id).subscribe({
      next: () => {
        alert("Reserva cancelada correctamente.");
        this.reservaAGestionar.estado = 'CANCELADA'; // Actualizamos la pantalla visualmente
        this.cerrarModalGestion();
      },
      error: (err) => {
        console.error("Error al cancelar:", err);
        alert("Hubo un problema al cancelar la reserva.");
      }
    });
  }

  anularCita(id: number) {
    const confirmar = confirm("¿Estás seguro de que quieres anular y eliminar esta cita?");
    
    if (confirmar) {
      this.citaService.anularYEliminarCita(id).subscribe({
        next: (res) => {
          alert("Cita anulada y eliminada con éxito");

          this.misReservasServicios = [...this.misReservasServicios.filter(cita => cita.id !== id)];

          this.cdr.detectChanges();
          
          console.log("Cita eliminada. Citas restantes:", this.misReservasServicios.length);
        },
        error: (err) => {
          console.error("Error al borrar la cita:", err);
          alert("No se pudo eliminar la cita.");
        }
      });
    }
  }

  getReservasActivas(): any[] {
    return this.misReservasHabitaciones.filter(r => r.estado !== 'COMPLETADA' && r.estado !== 'CANCELADA');
  }

  getReservasCompletadas(): any[] {
    return this.misReservasHabitaciones.filter(r => r.estado === 'COMPLETADA' || r.estado === 'CANCELADA');
  }

  getServiciosActivos(): any[] {
    return this.misReservasServicios.filter(s => s.estado !== 'COMPLETADA');
  }

  getServiciosCompletados(): any[] {
    return this.misReservasServicios.filter(s => s.estado === 'COMPLETADA');
  }

  calcularNoches(entrada: string, salida: string): number {
    if (!entrada || !salida) return 0;
    const inicio = new Date(entrada);
    const fin = new Date(salida);
    return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
  }

  getEstadoBadge(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'CONFIRMADA': return 'badge-confirmada';
      case 'CHECKIN': return 'badge-checkin';
      case 'COMPLETADA': return 'badge-completed';
      case 'CANCELADA': return 'badge-cancelada';
      default: return 'badge-pending';
    }
  }

  descargarFactura(reservaId: number): void {
    this.facturaService.descargarFacturaPDF(reservaId);
  }

  cargarArticulos(): void {
    this.articuloService.getArticulos().subscribe({
      next: (data) => this.articulos = data,
      error: (e) => console.error('Error cargando artículos', e)
    });
  }

  abrirModalCargosCliente(reserva: any): void {
    this.reservaParaCargos = reserva;
    this.mostrarModalCargos = true;
    this.articuloSeleccionadoId = '';
    this.cantidadArticulo = 1;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.cargarCargosReserva(reserva.id);
    }, 200);
  }

  cerrarModalCargos(): void {
    this.mostrarModalCargos = false;
    this.reservaParaCargos = null;
    this.cargosReserva = [];
    this.totalCargos = 0;
    this.mensajeCargo = '';
    this.mensajeErrorCargo = '';
  }

  cargarCargosReserva(reservaId: number): void {
    this.articuloService.getCargosDeReserva(reservaId).subscribe({
      next: (data) => {
        this.cargosReserva = data;
        this.totalCargos = data.reduce((sum: number, c: any) => 
          sum + (c.cantidad * c.precioUnitario), 0);
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando cargos', e)
    });
  }

  agregarCargo(): void {

    console.log('articuloSeleccionadoId:', this.articuloSeleccionadoId);
    console.log('tipo:', typeof this.articuloSeleccionadoId);
    if (!this.articuloSeleccionadoId || this.articuloSeleccionadoId === '' || 
      this.articuloSeleccionadoId === '0') {
      this.mensajeErrorCargo = 'Selecciona un artículo';
      setTimeout(() => this.mensajeErrorCargo = '', 3000);
      return;
    }

    const idCliente = Number(localStorage.getItem('id'));

    this.articuloService.agregarCargoCliente(
      this.reservaParaCargos.id,
      Number(this.articuloSeleccionadoId),
      this.cantidadArticulo,
      idCliente
    ).subscribe({
      next: () => {
        this.mensajeCargo = '¡Artículo añadido correctamente!';
        this.articuloSeleccionadoId = '';
        this.cantidadArticulo = 1;
        this.cargarCargosReserva(this.reservaParaCargos.id);
        setTimeout(() => this.mensajeCargo = '', 3000);
      },
      error: (err) => {
        this.mensajeErrorCargo = err.error?.error || 'Error al añadir el artículo';
        setTimeout(() => this.mensajeErrorCargo = '', 3000);
      }
    });
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}