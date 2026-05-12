import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ReservasAdminComponent } from './pages/admin/reservas-admin/reservas-admin';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard';
import { ServiciosComponent } from './pages/servicios/servicios';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas';
import { HabitacionesComponent } from './pages/habitaciones/habitaciones'; 
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';
import { HabitacionesAdmin } from './pages/admin/habitaciones-admin/habitaciones-admin';
import { UsuariosAdmin } from './pages/admin/usuarios-admin/usuarios-admin';
import { LimpiezaAdmin } from './pages/admin/limpieza-admin/limpieza-admin';
import { NosotrosComponent } from './pages/nosotros/nosotros';
import { ContactoComponent } from './pages/contacto/contacto';
import { OpinionesComponent } from './pages/opiniones/opiniones';
import { GaleriaComponent } from './pages/galeria/galeria';
import { TrabajadorDashboardComponent } from './pages/trabajador-dashboard/trabajador-dashboard';
import { VerificarComponent } from './pages/verificar/verificar';
import { RecuperarComponent } from './pages/recuperar/recuperar';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/reservas', component: ReservasAdminComponent }, 
  { path: 'admin/habitaciones', component: HabitacionesAdmin },
  { path: 'admin/usuarios', component: UsuariosAdmin },
  { path: 'admin/limpieza', component: LimpiezaAdmin },
  { path: 'home', component: UserDashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'servicios', component: ServiciosComponent },   
  { path: 'mis-reservas', component: MisReservasComponent },
  { path: 'habitaciones', component: HabitacionesComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'opiniones', component: OpinionesComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'trabajador', component: TrabajadorDashboardComponent },
  { path: 'verificar', component: VerificarComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];