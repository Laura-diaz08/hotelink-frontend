
export interface Usuario {
  id?: number;          
  nombre: string;       
  email: string;
  password?: string;    
  rol: 'ADMIN' | 'USER'; 
}

// También vamos a definir qué nos devuelve el Login
export interface LoginResponse {
  token: string;
  rol: 'ADMIN' | 'USER';
  tipo: string;
  expiraEn: string;
  id: number;
}