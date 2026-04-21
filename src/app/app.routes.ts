import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard';
import { ServiciosComponent } from './pages/servicios/servicios';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas';
import { HabitacionesComponent } from './pages/habitaciones/habitaciones'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent }, 
  { path: 'home', component: UserDashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'servicios-dashboard', component:  ServiciosComponent},   
  { path: 'mis-reservas', component: MisReservasComponent },
  { path: 'habitaciones', component: HabitacionesComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];