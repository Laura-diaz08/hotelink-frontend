import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OpinionService } from '../../services/opinion';

@Component({
  selector: 'app-opiniones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './opiniones.html',
  styleUrls: ['./opiniones.css']
})
export class OpinionesComponent implements OnInit {

  opiniones: any[] = [];
  estadisticas: any = null;
  puedeOpinar: boolean = false;
  cargando: boolean = true;

  nuevaEstrellas: number = 0;
  nuevoComentario: string = '';
  estrellasHover: number = 0;

  mensajeExito: string = '';
  mensajeError: string = '';
  enviando: boolean = false;

  opinionesInventadas = [];

  constructor(
    private opinionService: OpinionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarOpiniones();
    this.cargarEstadisticas();
    this.verificarSiPuedeOpinar();
  }

  cargarOpiniones(): void {
    this.opinionService.getOpiniones().subscribe({
      next: (data) => {
        this.opiniones = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarEstadisticas(): void {
    this.opinionService.getEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando estadísticas', e)
    });
  }

  verificarSiPuedeOpinar(): void {
    const idCliente = Number(localStorage.getItem('id'));
    if (!idCliente) return;

    this.opinionService.puedeOpinar(idCliente).subscribe({
      next: (data) => {
        this.puedeOpinar = data.puede;
        this.cdr.detectChanges();
      },
      error: () => this.puedeOpinar = false
    });
  }

  setEstrellas(n: number): void {
    this.nuevaEstrellas = n;
  }

  setHover(n: number): void {
    this.estrellasHover = n;
  }

  getTodasLasOpiniones(): any[] {
    return this.opiniones;
  }

  getMediaReal(): number {
    return this.estadisticas?.media || 0;
  }

  getTotalReal(): number {
    return this.estadisticas?.total || 0;
  }

  getPorcentajeEstrellas(num: number): number {
    const total = this.getTotalReal();
    if (total === 0) return 0;
    const count = this.opiniones.filter(o => o.estrellas === num).length;
    return Math.round((count / total) * 100);
  }

  enviarOpinion(): void {
    if (this.nuevaEstrellas === 0) {
      this.mensajeError = 'Por favor selecciona una valoración.';
      return;
    }
    if (!this.nuevoComentario.trim()) {
      this.mensajeError = 'Por favor escribe un comentario.';
      return;
    }

    this.enviando = true;
    this.mensajeError = '';
    const idCliente = Number(localStorage.getItem('id'));

    this.opinionService.crearOpinion(idCliente, this.nuevaEstrellas, this.nuevoComentario).subscribe({
      next: () => {
        this.mensajeExito = '¡Gracias por tu opinión!';
        this.nuevaEstrellas = 0;
        this.nuevoComentario = '';
        this.enviando = false;
        this.cargarOpiniones();
        this.cargarEstadisticas();
        setTimeout(() => this.mensajeExito = '', 4000);
      },
      error: (err) => {
        this.mensajeError = err.error?.error || 'Error al enviar la opinión.';
        this.enviando = false;
      }
    });
  }

  getEstrellas(n: number): string[] {
    return Array(5).fill('').map((_, i) => i < n ? 'fas fa-star' : 'far fa-star');
  }
}