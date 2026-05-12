import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario';
import { Usuario } from '../../../interfaces/usuario.interface';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css',
})
export class UsuariosAdmin implements OnInit {

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  filtroNombre: string = '';
  filtroRol: string = '';

  roles: string[] = ['ADMIN', 'CLIENTE', 'RECEPCION', 'LIMPIEZA', 'MASAJES', 'GIMNASIO', 'CONDUCTOR', 'COCINA'];

  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  usuarioSeleccionado: any = this.nuevoUsuarioVacio();

  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  nuevoUsuarioVacio() {
    return { nombre: '', email: '', password: '', rol: 'CLIENTE' };
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data; 
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error al cargar usuarios', e)
    });
  }

  filtrar(): void {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const coincideNombre = this.filtroNombre
        ? u.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
        : true;
      const coincideRol = this.filtroRol ? u.rol === this.filtroRol : true;
      return coincideNombre && coincideRol;
    });
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroRol = '';
    this.usuariosFiltrados = this.usuarios;
  }

  getClientes(): Usuario[] {
    return this.usuariosFiltrados.filter(u => u.rol === 'CLIENTE');
  }

  getEmpleados(): Usuario[] {
    return this.usuariosFiltrados.filter(u => u.rol !== 'CLIENTE');
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.usuarioSeleccionado = this.nuevoUsuarioVacio();
    this.mostrarModal = true;
  }

  abrirModalEditar(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioSeleccionado = { ...usuario, password: '' };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.mensajeError = '';
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.usuarioService.editarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarUsuarios();
          this.mostrarMensajeExito('Usuario actualizado correctamente');
        },
        error: () => this.mensajeError = 'Error al actualizar el usuario'
      });
    } else {
      this.usuarioService.crearUsuario(this.usuarioSeleccionado).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarUsuarios();
          this.mostrarMensajeExito('Usuario creado correctamente');
        },
        error: () => this.mensajeError = 'Error al crear el usuario'
      });
    }
  }

  mostrarMensajeExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mensajeError = ''; // Limpiamos cualquier error previo
    setTimeout(() => this.mensajeExito = '', 5000);
  }

  eliminar(usuario: Usuario): void {
    if (!confirm(`¿Seguro que quieres eliminar a ${usuario.nombre}?`)) return;

    this.usuarioService.eliminarUsuario(usuario.id!).subscribe({
      next: () => {
        this.mensajeExito = `Usuario ${usuario.nombre} eliminado`;
        this.cargarUsuarios();
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: () => this.mensajeError = 'Error al eliminar el usuario'
    });
  }

  getRolBadgeClass(rol: string): string {
    switch (rol) {
      case 'ADMIN': return 'badge-admin';
      case 'CLIENTE': return 'badge-cliente';
      case 'RECEPCION': return 'badge-recepcion';
      case 'LIMPIEZA': return 'badge-limpieza';
      case 'SERVICIOS': return 'badge-servicios';
      default: return '';
    }
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
