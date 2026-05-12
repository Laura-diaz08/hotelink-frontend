import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = 'http://localhost:8080/facturas';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getFacturaPorReserva(reservaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reserva/${reservaId}`, { headers: this.getHeaders() });
  }

  descargarFacturaPDF(reservaId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get(`${this.apiUrl}/reserva/${reservaId}/pdf`, {
      headers,
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${reservaId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (e) => console.error('Error descargando factura', e)
    });
  }
}