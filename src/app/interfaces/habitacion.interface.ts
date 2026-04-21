import { Usuario } from './usuario.interface';

export interface Habitacion {
  id?: number;
  numero: string;
  tipo: string;
  precio: number;
  capacidad: number;    
  descripcion: string; 
  estado: string;
  cliente?: any;
}