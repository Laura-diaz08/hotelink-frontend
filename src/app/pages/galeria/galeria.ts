import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './galeria.html',
  styleUrls: ['./galeria.css']
})
export class GaleriaComponent {

  categoriaActiva: string = 'Todas';
  categorias: string[] = ['Todas', 'Habitaciones', 'Spa & Bienestar', 'Restaurante', 'Exteriores'];

  lightboxAbierto: boolean = false;
  imagenActual: number = 0;

  imagenes = [
    { url: 'assets/habitacion_suite.png', categoria: 'Habitaciones', titulo: 'Habitacion Suite' },
    { url: 'assets/habitacion_doble.png', categoria: 'Habitaciones', titulo: 'Habitación Doble' },
    { url: 'assets/habitacion_sencilla.png', categoria: 'Habitaciones', titulo: 'Habitacion Sencilla' },
    { url: 'assets/circuito_spa.png', categoria: 'Spa & Bienestar', titulo: 'Circuito Spa' },
    { url: 'assets/masaje_relajante.png', categoria: 'Spa & Bienestar', titulo: 'Masaje Relajante' },
    { url: 'assets/gimnasio_hotel.png', categoria: 'Spa & Bienestar', titulo: 'Gimnasio' },
    { url: 'assets/restaurante_hotel.png', categoria: 'Restaurante', titulo: 'Salon Principal' },
    { url: 'assets/restaurante2_hotel.png', categoria: 'Restaurante', titulo: 'Salón' },
    { url: 'assets/restaurante3_hotel.png', categoria: 'Restaurante', titulo: 'Terraza Gastronómica' },
    { url: 'assets/hotel.png', categoria: 'Exteriores', titulo: 'Fachada del Hotel' },
    { url: 'assets/exterior_hotel.png', categoria: 'Exteriores', titulo: 'Puerta Hotel' },
    { url: 'assets/piscina2_hotel.png', categoria: 'Exteriores', titulo: 'Piscina Exterior' },
    { url: 'assets/recepcion_hotel.png', categoria: 'Exteriores', titulo: 'Recepcion Hotel' },
    { url: 'assets/exterior2_hotel.png', categoria: 'Exteriores', titulo: 'Jardines' }
  ];

  get imagenesFiltradas() {
    if (this.categoriaActiva === 'Todas') return this.imagenes;
    return this.imagenes.filter(i => i.categoria === this.categoriaActiva);
  }

  filtrar(categoria: string): void {
    this.categoriaActiva = categoria;
  }

  abrirLightbox(index: number): void {
    this.imagenActual = index;
    this.lightboxAbierto = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarLightbox(): void {
    this.lightboxAbierto = false;
    document.body.style.overflow = '';
  }

  siguiente(): void {
    this.imagenActual = (this.imagenActual + 1) % this.imagenesFiltradas.length;
  }

  anterior(): void {
    this.imagenActual = (this.imagenActual - 1 + this.imagenesFiltradas.length) % this.imagenesFiltradas.length;
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.lightboxAbierto) return;
    if (event.key === 'ArrowRight') this.siguiente();
    if (event.key === 'ArrowLeft') this.anterior();
    if (event.key === 'Escape') this.cerrarLightbox();
  }
}