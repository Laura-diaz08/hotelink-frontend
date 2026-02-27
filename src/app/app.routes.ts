import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent }, 
  { path: 'home', component: UserDashboardComponent },
  { path: 'register', component: RegisterComponent },   
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];