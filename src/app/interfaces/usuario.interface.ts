export type Rol = 'ADMIN' | 'CLIENTE' | 'RECEPCION' | 'LIMPIEZA' | 'GIMNASIO' | 'MASAJES' | 'CONDUCTOR' | 'COCINA';

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol: Rol;
}

export interface LoginResponse {
  token: string;
  rol: Rol;
  tipo: string;
  expiraEn: string;
  id: number;
  nombre: string;
}