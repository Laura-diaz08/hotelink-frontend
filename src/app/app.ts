import { Component, signal, HostListener  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hotelink-front');

  constructor(public router: Router) {}

  navbarSolida: boolean = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.navbarSolida = window.scrollY > 80;
  }

  get esTransparente(): boolean {
    return this.router.url === '/home' && !this.navbarSolida;
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']); 
  }
}
