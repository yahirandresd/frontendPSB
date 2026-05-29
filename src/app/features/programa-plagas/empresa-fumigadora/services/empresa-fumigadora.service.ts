import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpresaFumigadora } from '../models/empresa-fumigadora';
import { environment } from '@/environments/environment';
const BASE = environment.apiUrl + '/empresa-fumigadora';
@Injectable({
  providedIn: 'root'
})

export class EmpresaFumigadoraService {
  constructor(private http: HttpClient) { }
  listar(): Observable<EmpresaFumigadora[]> { return this.http.get<EmpresaFumigadora[]>(BASE); }
  listarPorPrograma(programaPlagasId: string): Observable<EmpresaFumigadora[]> {
    return this.http.get<EmpresaFumigadora[]>(`${BASE}/programa/${programaPlagasId}`);
  }
  obtener(id: string): Observable<EmpresaFumigadora> { return this.http.get<EmpresaFumigadora>(`${BASE}/${id}`); }
  crear(data: Partial<EmpresaFumigadora>): Observable<EmpresaFumigadora> {
    return this.http.post<EmpresaFumigadora>(BASE, data);
  }
  actualizar(id: string, data: Partial<EmpresaFumigadora>): Observable<EmpresaFumigadora> {
    return this.http.patch<EmpresaFumigadora>(`${BASE}/${id}`, data);
  }
  eliminar(id: string): Observable<void> { return this.http.delete<void>(`${BASE}/${id}`); }
  certificadoVigente(empresa: EmpresaFumigadora): boolean {
    return new Date(empresa.fechaVencCer) > new Date();
  }

}
