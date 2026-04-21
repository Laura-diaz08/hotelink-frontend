import { Servicio } from './servicio.interface';

export interface ReservaServicio {
  id?: number;
  servicio: Servicio;
  cliente: any; 
  empleado?: any;
  fechaHoraCita: string;
  estado: string;
}