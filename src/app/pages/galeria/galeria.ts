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
    { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', categoria: 'Habitaciones', titulo: 'Suite Deluxe' },
    { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', categoria: 'Habitaciones', titulo: 'Habitación Doble' },
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', categoria: 'Habitaciones', titulo: 'Suite Premium' },
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', categoria: 'Spa & Bienestar', titulo: 'Circuito Spa' },
    { url: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80', categoria: 'Spa & Bienestar', titulo: 'Sala de Masajes' },
    { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', categoria: 'Spa & Bienestar', titulo: 'Gimnasio' },
    { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', categoria: 'Restaurante', titulo: 'Cena Romántica' },
    { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', categoria: 'Restaurante', titulo: 'Salón Principal' },
    { url: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80', categoria: 'Restaurante', titulo: 'Terraza Gastronómica' },
    { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', categoria: 'Exteriores', titulo: 'Fachada del Hotel' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', categoria: 'Exteriores', titulo: 'Piscina Exterior' },
    { url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80', categoria: 'Exteriores', titulo: 'Jardines' }
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