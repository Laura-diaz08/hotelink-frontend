import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactoService } from '../../services/contacto';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class ContactoComponent {

  nombre: string = '';
  email: string = '';
  mensaje: string = '';
  enviando: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  horarios = [
    { servicio: 'Recepción', horario: '24 horas', icono: 'fas fa-concierge-bell' },
    { servicio: 'Spa y Servicios', horario: '9:00 - 21:00', icono: 'fas fa-spa' },
    { servicio: 'Restaurante', horario: '7:00 - 23:00', icono: 'fas fa-utensils' }
  ];

  infoContacto = [
    { icono: 'fas fa-map-marker-alt', titulo: 'Dirección', valor: 'Calle Ancha, 12, Cádiz, España' },
    { icono: 'fas fa-phone', titulo: 'Teléfono', valor: '+34 956 123 456' },
    { icono: 'fas fa-envelope', titulo: 'Email', valor: 'gestionHotelink@gmail.com' }
  ];

  constructor(private contactoService: ContactoService) {}

  enviarMensaje(): void {
    if (!this.nombre || !this.email || !this.mensaje) {
      this.mensajeError = 'Por favor rellena todos los campos.';
      return;
    }

    this.enviando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.contactoService.enviarMensaje(this.nombre, this.email, this.mensaje).subscribe({
      next: () => {
        this.mensajeExito = '¡Mensaje enviado correctamente! Te responderemos lo antes posible.';
        this.nombre = '';
        this.email = '';
        this.mensaje = '';
        this.enviando = false;
        setTimeout(() => this.mensajeExito = '', 5000);
      },
      error: () => {
        this.mensajeError = 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.';
        this.enviando = false;
      }
    });
  }
}