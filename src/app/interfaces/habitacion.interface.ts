import { Usuario } from './usuario.interface';

export interface Habitacion {
  id?: number;
  numero: string;
  tipo: string;
  precio: number;
  estado: string;
  cliente?: Usuario | null; 
}