
export interface Usuario {
  id?: number;          
  nombre: string;       
  email: string;
  password?: string;    
  rol: 'ADMIN' | 'CLIENTE' | 'RECEPCION' | 'LIMPIEZA' | 'SERVICIOS'; 
}

// También definimos qué nos devuelve el Login
export interface LoginResponse {
  token: string;
  rol: 'ADMIN' | 'CLIENTE' | 'RECEPCION' | 'LIMPIEZA' | 'SERVICIOS';
  tipo: string;
  expiraEn: string;
  id: number;
}