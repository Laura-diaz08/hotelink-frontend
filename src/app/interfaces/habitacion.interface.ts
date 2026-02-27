import { Usuario } from './usuario.interface'; // Asegúrate de que la ruta coincida con tu archivo de usuario

export interface Habitacion {
  id?: number;
  numero: string;
  tipo: string;
  precio: number;
  estado: string;
  cliente?: Usuario | null; // Aquí guardaremos al cliente asignado
}