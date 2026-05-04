export interface Reserva {
  id: number;
  fechaEntrada: string;
  fechaSalida: string;
  estado: string;
  checkIn: boolean;
  checkOut: boolean;
  numeroHuespedes: number;
  numeroHabitacion: string;
  tipoHabitacion: string;
  nombreUsuario: string;
  total: number;
}