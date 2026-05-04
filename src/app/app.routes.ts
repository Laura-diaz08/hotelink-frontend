import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ReservasAdminComponent } from './pages/admin/reservas-admin/reservas-admin';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard';
import { ServiciosComponent } from './pages/servicios/servicios';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas';
import { HabitacionesComponent } from './pages/habitaciones/habitaciones'; 
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin/reservas', component: ReservasAdminComponent }, 
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'home', component: UserDashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'servicios-dashboard', component:  ServiciosComponent},   
  { path: 'mis-reservas', component: MisReservasComponent },
  { path: 'habitaciones', component: HabitacionesComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];