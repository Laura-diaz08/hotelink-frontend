import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hotelink-front');

  navbarSolida: boolean = false;
  nombreUsuario: string = '';

  currentYear = new Date().getFullYear();

  menuAbierto: boolean = false;

  constructor(public router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.nombreUsuario = localStorage.getItem('nombre') || 'Viajero';
      window.scrollTo(0, 0);
    });
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  ngOnInit() {
    this.nombreUsuario = localStorage.getItem('nombre') || 'Viajero';
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.navbarSolida = window.scrollY > 80;
  }

  get esTransparente(): boolean {
    return this.router.url === '/home' && !this.navbarSolida;
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}