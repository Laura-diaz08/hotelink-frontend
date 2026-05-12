import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OpinionService } from '../../services/opinion';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.css']
})
export class NosotrosComponent {

  stats = [
    { numero: '15', label: 'Años de experiencia' },
    { numero: '+5.000', label: 'Huéspedes satisfechos' },
    { numero: '4.9★', label: 'Valoración media' }
  ];

  valores = [
    { icono: 'fas fa-leaf', titulo: 'Sostenibilidad', descripcion: 'Comprometidos con el medio ambiente y las prácticas responsables en cada aspecto de nuestra operación.' },
    { icono: 'fas fa-gem', titulo: 'Excelencia', descripcion: 'Cada detalle importa. Buscamos la perfección en el servicio para superar las expectativas de nuestros huéspedes.' },
    { icono: 'fas fa-heart', titulo: 'Calidez humana', descripcion: 'Tratamos a cada huésped como si fuera de la familia, con cercanía, respeto y atención personalizada.' },
    { icono: 'fas fa-shield-alt', titulo: 'Privacidad y confort', descripcion: 'Tu tranquilidad es nuestra prioridad. Garantizamos discreción y un entorno seguro en todo momento.' }
  ];

  equipo = [
    {
      nombre: 'Laura Díaz',
      cargo: 'Directora General',
      descripcion: 'Fundadora y alma de Hotelink. Con más de 20 años en el sector hotelero, Laura lidera el hotel con pasión y visión de futuro.',
      foto: 'assets/laura-diaz.jpg'
    },
    {
      nombre: 'Javier Montes',
      cargo: 'Jefe de Recepción',
      descripcion: 'Experto en hospitalidad y atención al cliente. Javier se asegura de que tu bienvenida a Cádiz sea perfecta y fluida.',
      foto: 'assets/javier-montes.jpg'
    },
    {
      nombre: 'Antonio Ruiz',
      cargo: 'Chef Ejecutivo',
      descripcion: 'Con estrella Michelin en su haber, Antonio transforma cada comida en una experiencia gastronómica única.',
      foto: 'assets/antonio-ruiz.jpg'
    },
    {
      nombre: 'Laura Sánchez',
      cargo: 'Directora de Bienestar',
      descripcion: 'Experta en técnicas de relajación y bienestar, Laura diseña tratamientos exclusivos para el cuerpo y la mente.',
      foto: 'assets/laura_sanchez.jpg'
    },
    {
      nombre: 'Carmen Torres',
      cargo: 'Gobernanta de Pisos',
      descripcion: 'Carmen dirige con precisión y cariño al equipo de limpieza, garantizando que cada habitación esté impecable.',
      foto: 'assets/carmen-torres.jpg'
    }
  ];

  constructor(
    private opinionService: OpinionService,
    private cdr: ChangeDetectorRef
  ) {}

    ngOnInit(): void {
      this.opinionService.getEstadisticas().subscribe({
        next: (data) => {
          this.stats[1].numero = '+' + (data.total + 5000);
          this.stats[2].numero = data.media + '★';
          this.cdr.detectChanges();
        }
      })
    }
}