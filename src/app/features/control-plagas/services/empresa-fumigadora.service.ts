import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpresaFumigadora } from '../models/empresa-fumigadora';
const BASE = '/api/empresa-fumigadora';
@Injectable({
    providedIn: 'root'
})

export class EmpresaFumigadoraService {
    constructor(private http: HttpClient) {}
      // ── Empresa fumigadora ─────────────────────────
      listarEmpresasFumigadoras(): Observable<EmpresaFumigadora[]> {
        return this.http.get<EmpresaFumigadora[]>(`${BASE}/empresas-fumigadoras`);
      }
    
      certificadoVigente(empresa: EmpresaFumigadora): boolean {
        return new Date(empresa.fechaVencCert) > new Date();
      }
    
}
